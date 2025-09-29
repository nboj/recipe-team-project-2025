# Database Project

# Schema
### Core Tables
- Recipes
	- Recipe ID: Unique identifier for the recipe <font color="#ff0000">(PK)</font> 
	- Title: Name of the Recipe 
	- Description: description of the recipe 
	- Instructions: Link to RecipeSteps 
	- PrepTime: How long it takes to prep the recipe
	- CookTime: How long it takes to cook the recipe
	- Servings: Number of servings the recipe provides
	- Image: image of the finished recipe
	- Cooking method: (slow cooker, grill, oven, stove top, refrigerated) <font color="#00b0f0">(FK -> CookingMethods)</font>
	- MyRating: 1-5 (score i give recipe)
	- Comments: Notes i have about recipe
	- Rated Date: date i rated recipe 
	- Created Date: date recipe was added to database 
	- Updated Date: date recipe was updated 
- Ingredients
	- Ingredient ID: unique identifier for the ingredient <font color="#ff0000">(PK)</font>
	- Name: the name of the ingredient(flour, sugar, carrot)
- Units
	- Unit ID: unique identifier for the unit <font color="#ff0000">(PK)</font>
	- Name: The name of units (cup, gram, kilogram, pound, ounce)
	- Abbreviation: c, g, kg, lb, oz 
- Categories: Stores different categories for the recipes
	- Category  ID: unique identifier for the category <font color="#ff0000">(PK)</font>
	- Name: name of each category (breakfast, appetizers,  soups/salads, main dish, sides, desserts)
- Equipment
	- Equipment ID: <font color="#ff0000">(PK)</font>
	- Name: (example: baking pan, crock pot, mixer)
- Cooking Methods
	- Method ID: <font color="#ff0000">(PK)</font>
	- Name: (example: oven, grill, slow cooker)
- RecipeSteps: List of steps for each recipe (Ordered Instructions)
	- Recipe ID <font color="#00b0f0">(FK -> Recipes)</font>
	- Step Number
	- Instruction text
	- Recipe ID and Step Number: <font color="#ff0000">(PK)</font>

### Junction tables
- Recipe Ingredients: Links recipes, ingredients, and their quantities
	- Recipe ID: Links to the recipes table <font color="#00b0f0">(FK -> Recipes)</font>
	- Ingredient ID: Links to the ingredients table <font color="#00b0f0">(FK -> Ingredients)</font>
	- Quantity: The amount of the ingredient needed for the recipe.
	- Unit ID: Links to the Units table <font color="#00b0f0">(FK -> Units)</font>
	- Prep Notes: Chopped, sliced, diced, cubed 
	- Recipe ID and Ingredient ID: <font color="#ff0000">(PK)</font>
- RecipeCategories
	- Recipe ID <font color="#00b0f0">(FK -> Recipes)</font>
	- Category ID <font color="#00b0f0">(FK -> Categories)</font>
	- Recipe ID and Category ID: <font color="#ff0000">(PK)</font>
- RecipeEquipment
	- Recipe ID <font color="#00b0f0">(FK -> Recipes)</font>
	- Equipment ID <font color="#00b0f0">(FK -> Equipment)</font>
	- Recipe ID and Equipment ID: <font color="#ff0000">(PK)</font>
