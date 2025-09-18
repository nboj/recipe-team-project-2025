# Database Project

# Schema
### Core Tables
- Recipes
    - Recipe ID: Unique identifier for the recipe
    - Title: Name of the Recipe
    - Instructions: step-by-step guide on how to cook it
    - PrepTime: How long it takes to prep the recipe
    - CookTime: How long it takes to cook the recipe
    - Servings: Number of servings the recipe provides
    - Description: Explain the recipe
    - Image: image of the finished recipe
    - Cooking method: (slow cooker, grill, oven, stove top, refrigerated)
    - Equipment: List of cookware needed to make the dish(food processor, baking pan, crok pot)
- Ingredients
    - Ingredient ID: unique identifier for the ingredient
    - Name: the name of the ingredient(flour, sugar, carrot)
- Units
    - Unit ID: unique identifier for the unit
    - Name: The name of units (cup, tablespoon, grams)
- Categories: Stores different categories for the recipes
    - Category  ID: unique identifier for the category
    - Name: name of each catigory (breakfast, appetizers,  soups/salads, main dish, sides, desserts)
- UserRatings: Stores user ratings and comments on recipes.
    - Rating ID
    - Recipe ID
    - Rating: (1-5)
    - Comments

### Junction tables
- Recipe Ingredients: Links recipes, ingredients, and their quantities
    - Recipe ID: Links to the recipes table
    - Ingredient ID: Links to the ingredients table
    - Quantity: The amount of the ingredient needed for the recipe.
    - Unit ID: Links to the Units table
- RecipeCategories
    - Recipe ID
    - Category ID
