from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI()

# Frontend origins that are allowed to call this API.
# While developing, your Next.js app runs on http://localhost:3000
origins = [
    "http://localhost:3000",
    "http://localhost:3002",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Recipe(BaseModel):
    id: int
    title: str
    description: str


# For now this is our "database".
# Later you can replace this with real DB queries, but the endpoint
# shapes can stay the same so the frontend does not have to change.
RECIPES: List[Recipe] = [
    Recipe(
        id=1,
        title="Spaghetti Bolognese",
        description="Rich tomato and beef sauce over pasta.",
    ),
    Recipe(
        id=2,
        title="Chicken Alfredo",
        description="Creamy parmesan sauce with grilled chicken.",
    ),
    Recipe(
        id=3,
        title="Apple Pie",
        description="Classic dessert with cinnamon apples.",
    ),
    Recipe(
        id=4,
        title="Veggie Stir Fry",
        description="Mixed vegetables in a garlicky soy glaze.",
    ),
]


@app.get("/")
def root():
    return {"message": "Recipe API is running"}


@app.get("/recipes", response_model=List[Recipe])
def list_recipes(q: Optional[str] = None, sort_by: str = "title"):
    """
    List recipes, optionally filtered by a search query `q`
    and sorted by `title` or `id`.

    Examples:
      - GET /recipes
      - GET /recipes?q=apple
      - GET /recipes?q=pie&sort_by=id
    """
    results = RECIPES

    # Filter by search query (case-insensitive)
    if q:
        q_lower = q.lower()
        results = [
            r
            for r in results
            if q_lower in r.title.lower() or q_lower in r.description.lower()
        ]

    # Sort results
    if sort_by == "title":
        results = sorted(results, key=lambda r: r.title.lower())
    elif sort_by == "id":
        results = sorted(results, key=lambda r: r.id)

    return results
