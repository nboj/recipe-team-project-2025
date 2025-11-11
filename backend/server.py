from fastapi import FastAPI
from routers import recipes, reviews
from fastapi.middleware.cors import CORSMiddleware

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

app = FastAPI(title="Recipe_DB API")
app.include_router(recipes.router)
app.include_router(reviews.router)
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
