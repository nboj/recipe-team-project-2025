from fastapi import FastAPI
from database.db import Base, engine 
from routers import recipes 

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Recipe_DB API")

app.include_router(recipes.router)

@app.get("/")
def root():
    return {"message": "Welcome to the Recipe_DB API"}

