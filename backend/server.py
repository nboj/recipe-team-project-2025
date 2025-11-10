from fastapi import FastAPI
from routers import recipes 

app = FastAPI(title="Recipe_DB API")
app.include_router(recipes.router)

@app.get("/")
def root():
    return {"message": "Welcome to the Recipe_DB API"}


