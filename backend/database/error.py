from fastapi.exceptions import HTTPException
from pydantic import BaseModel
from typing import Any, Optional, Dict

class ErrorBody(BaseModel):
    code: str
    message: str
    details: Optional[Dict[str, Any]] = None

class ErrorResponse(BaseModel):
    error: ErrorBody

def raise_error(
    status_code: int,
    code: str,
    message: str,
    details: dict[Any, Any] | None = None,
) -> None:
    body = ErrorResponse(
        error=ErrorBody(
            code=code,
            message=message,
            details=details,
        )
    )
    # FastAPI will serialize this `detail` field as JSON
    raise HTTPException(
        status_code=status_code,
        detail=body.model_dump(),
    )
