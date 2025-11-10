import os
from functools import lru_cache
from typing import Optional

import httpx
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt
from jose.exceptions import JWTError, ExpiredSignatureError
from dotenv import load_dotenv

load_dotenv()

STACK_PROJECT_ID = os.getenv("STACK_PROJECT_ID")
STACK_JWKS_URL = os.getenv("STACK_JWKS_URL")
STACK_AUDIENCE = os.getenv("STACK_AUDIENCE")

security = HTTPBearer()


@lru_cache(maxsize=1)
def get_jwks() -> dict:
    """
    Fetch JWKS from Stack once and cache it.
    You can add refresh logic later if needed.
    """
    if not STACK_JWKS_URL:
        raise RuntimeError("STACK_JWKS_URL is not configured")

    resp = httpx.get(STACK_JWKS_URL, timeout=5.0)
    resp.raise_for_status()
    return resp.json()


def get_key_for_kid(kid: str) -> Optional[dict]:
    jwks = get_jwks()
    for key in jwks.get("keys", []):
        if key.get("kid") == kid:
            return key
    return None


def verify_stack_token(token: str) -> dict:
    """
    Verify a JWT issued by Stack Auth and return its claims.
    """
    try:
        header = jwt.get_unverified_header(token)
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token header",
        )

    kid = header.get("kid")
    if not kid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing 'kid' in token header",
        )

    key = get_key_for_kid(kid)
    if not key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unknown key id",
        )

    try:
        # NOTE: algorithms likely ["RS256"], but we pull from key["alg"] as a default.
        algorithms = [key.get("alg", "RS256")]

        claims = jwt.decode(
            token,
            key,
            algorithms=algorithms,
            #issuer=STACK_ISSUER,
            audience=STACK_AUDIENCE,
        )
        return claims

    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expired",
        )
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}",
        )


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    """
    FastAPI dependency:
    - Reads Authorization: Bearer <token>
    - Verifies via Stack JWKS
    - Returns decoded claims
    """
    if credentials.scheme.lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid auth scheme",
        )

    token = credentials.credentials
    claims = verify_stack_token(token)
    return claims
