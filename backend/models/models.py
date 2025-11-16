from sqlalchemy import (
    Column, Integer, String, ForeignKey, Date, Text, Float
)
from sqlalchemy.orm import relationship
from backend.database.db import Base


# ============================
# Main Recipe Table
# ============================
class Recipe(Base):
    __tablename__ = "recipes"

    recipe_id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    instructions = Column(Text)
    prep_time = Column(String)
    cook_time = Column(String)
    servings = Column(String)
    image = Column(String)
    cooking_method = Column(Integer, ForeignKey("cooking_methods.method_id"))
    my_rating = Column(Integer)
    comments = Column(Text)
    rated_date = Column(String)
    created_date = Column(String)
    updated_date = Column(String)
    created_by = Column(String, index=True)

    # Relationships
    steps = relationship("RecipeStep", back_populates="recipe", cascade="all, delete")
    ingredients = relationship("RecipeIngredient", back_populates="recipe", cascade="all, delete")
    categories = relationship("RecipeCategory", back_populates="recipe", cascade="all, delete")
    equipment = relationship("RecipeEquipment", back_populates="recipe", cascade="all, delete")


# ============================
# Ingredients
# ============================
class Ingredient(Base):
    __tablename__ = "ingredients"

    ingredient_id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)


# ============================
# Units
# ============================
class Unit(Base):
    __tablename__ = "units"

    unit_id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    abbreviation = Column(String)


# ============================
# Categories
# ============================
class Category(Base):
    __tablename__ = "categories"

    category_id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)


# ============================
# Equipment
# ============================
class Equipment(Base):
    __tablename__ = "equipment"

    equipment_id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)


# ============================
# Cooking Methods
# ============================
class CookingMethod(Base):
    __tablename__ = "cooking_methods"

    method_id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)


# ============================
# Recipe Steps
# ============================
class RecipeStep(Base):
    __tablename__ = "recipe_steps"

    recipe_id = Column(Integer, ForeignKey("recipes.recipe_id"), primary_key=True)
    step_number = Column(Integer, primary_key=True)
    instruction_text = Column(Text)

    recipe = relationship("Recipe", back_populates="steps")


# ============================
# Recipe Ingredients (junction)
# ============================
class RecipeIngredient(Base):
    __tablename__ = "recipe_ingredients"

    recipe_id = Column(Integer, ForeignKey("recipes.recipe_id"), primary_key=True)
    ingredient_id = Column(Integer, ForeignKey("ingredients.ingredient_id"), primary_key=True)
    quantity = Column(String)
    unit_id = Column(Integer, ForeignKey("units.unit_id"))
    prep_notes = Column(String)

    recipe = relationship("Recipe", back_populates="ingredients")
    ingredient = relationship("Ingredient")
    unit = relationship("Unit")


# ============================
# Recipe Categories (junction)
# ============================
class RecipeCategory(Base):
    __tablename__ = "recipe_categories"

    recipe_id = Column(Integer, ForeignKey("recipes.recipe_id"), primary_key=True)
    category_id = Column(Integer, ForeignKey("categories.category_id"), primary_key=True)

    recipe = relationship("Recipe", back_populates="categories")
    category = relationship("Category")


# ============================
# Recipe Equipment (junction)
# ============================
class RecipeEquipment(Base):
    __tablename__ = "recipe_equipment"

    recipe_id = Column(Integer, ForeignKey("recipes.recipe_id"), primary_key=True)
    equipment_id = Column(Integer, ForeignKey("equipment.equipment_id"), primary_key=True)

    recipe = relationship("Recipe", back_populates="equipment")
    equipment = relationship("Equipment")
