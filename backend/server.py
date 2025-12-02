from contextlib import asynccontextmanager
from dotenv import load_dotenv
from fastapi import FastAPI
from lib.db import pool
from routers import recipes, reviews, requests, users
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://recipe-team-project-2025.vercel.app",
    "https://recipe-team-project-2025-git-christian-nbojs-projects.vercel.app",
    "https://recipe-team-project-2025-git-karl-nbojs-projects.vercel.app",
    "https://vercel.com/nbojs-projects/recipe-team-project-2025/CJu42zeEiptquyqRAm39nsRW1s4H",
    "https://recipe-team-project-2025-ousq-git-christian-nbojs-projects.vercel.app",
    "https://recipe-team-project-2025-backend.vercel.app",
    "https://recipe-team-project-2025-ousq-git-karl-nbojs-projects.vercel.app",
    "https://recipe-team-project-2025-ousq-git-shaemon-nbojs-projects.vercel.app",
    # add any other front-end origins you use
]

@asynccontextmanager
async def lifespan(app: FastAPI):
    await pool.open()
    async with pool:   # opens pool at startup, closes on shutdown
        yield

app = FastAPI(title="Recipe_DB API", lifespan=lifespan)
app.include_router(recipes.router)
app.include_router(reviews.router)
app.include_router(requests.router)
app.include_router(users.router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # important: includes OPTIONS
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "Welcome to the Recipe_DB API"}
