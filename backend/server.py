from typing import List, Optional

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Field, Session, SQLModel, create_engine, select

# ---------- FastAPI app + CORS setup ----------

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- Database setup (SQLite) ----------

# This will create a file named recipes.db in the backend folder
sqlite_url = "sqlite:///./recipes.db"
engine = create_engine(sqlite_url, echo=False)


class Recipe(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    description: str
    image_url: Optional[str] = None  # we'll use this from the frontend later


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session


@app.on_event("startup")
def on_startup():
    # create tables if they don't exist yet
    create_db_and_tables()

    # seed some sample recipes only if table is empty
    with Session(engine) as session:
        first_recipe = session.exec(select(Recipe)).first()
        if first_recipe is None:
            seed_recipes = [
                Recipe(
                    title="Spaghetti Bolognese",
                    description="Rich tomato and beef sauce over pasta.",
                    image_url="/images/spaghetti-bolognese.jpg",
                ),
                Recipe(
                    title="Chicken Alfredo",
                    description="Creamy parmesan sauce with grilled chicken.",
                    image_url="/images/chicken-alfredo.jpg",
                ),
                Recipe(
                    title=" Classic Apple Pie",
                    description="Classic dessert with cinnamon apples.",
                    image_url="/images/apple-pie.jpg",
                ),
                Recipe(
                    title="Caesar Salad",
                    description="Crisp romaine with creamy Caesar dressing.",
                    image_url="/images/caesar-salad.jpg",
                ),
                Recipe(
                    title="Garlic Butter Shrimp",
                    description="Seared shrimp in a garlic butter sauce with lemon butter and parsley.",
                    image_url="/images/garlic-butter-shrimp.jpg",
                )
            ]
            session.add_all(seed_recipes)
            session.commit()


@app.get("/")
def root():
    return {"message": "Recipe API is running with SQLite"}


# ---------- Recipes endpoints ----------

@app.get("/recipes", response_model=List[Recipe])
def list_recipes(
    q: Optional[str] = None,
    sort_by: str = "title",
    session: Session = Depends(get_session),
):
    """
    List recipes from the database.
    Optional:
      - q: search term (matches title or description)
      - sort_by: 'title' or 'id'
    """
    query = select(Recipe)

    recipes = session.exec(query).all()

    # filter in Python for simple case-insensitive search
    if q:
        q_lower = q.lower()
        recipes = [
            r
            for r in recipes
            if q_lower in r.title.lower() or q_lower in r.description.lower()
        ]

    # sort in Python
    if sort_by == "title":
        recipes = sorted(recipes, key=lambda r: r.title.lower())
    elif sort_by == "id":
        recipes = sorted(recipes, key=lambda r: (r.id or 0))

    return recipes

@app.post("/recipes", response_model=Recipe)
def create_recipe(recipe: Recipe, session: Session = Depends(get_session)):
    recipe.id = None  # let DB assign the id
    session.add(recipe)
    session.commit()
    session.refresh(recipe)
    return recipe
