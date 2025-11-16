from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# SQLAlchemy Base + Engine + Models
from backend.database.db import Base, engine
from backend.models import models

# Routers
from backend.routers import recipes
from backend.routers import ingredients
from backend.routers import units
from backend.routers import categories
from backend.routers import equipment
from backend.routers import cooking_methods
from backend.routers import recipe_steps
from backend.routers import recipe_ingredients
from backend.routers import recipe_categories
from backend.routers import recipe_equipment


# ============================================
# FastAPI app initialization
# ============================================
app = FastAPI(title="Recipe API", version="1.0")


# ============================================
# CORS (allow frontend to talk to backend)
# ============================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================
# Create all database tables automatically
# ============================================
Base.metadata.create_all(bind=engine)


# ============================================
# Register Routers
# ============================================
app.include_router(recipes.router)
app.include_router(ingredients.router)
app.include_router(units.router)
app.include_router(categories.router)
app.include_router(equipment.router)
app.include_router(cooking_methods.router)
app.include_router(recipe_steps.router)
app.include_router(recipe_ingredients.router)
app.include_router(recipe_categories.router)
app.include_router(recipe_equipment.router)


# ============================================
# Root welcome route (optional)
# ============================================
@app.get("/")
def root():
    return {"message": "Recipe API is running!"}
