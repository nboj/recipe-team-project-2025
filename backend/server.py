from contextlib import asynccontextmanager
from fastapi import FastAPI
from lib.db import pool
from routers import recipes 

@asynccontextmanager
async def lifespan(_app: FastAPI):
    await pool.open()
    try:
        yield
    finally:
        await pool.close()

app = FastAPI(title="Recipe_DB API", lifespan=lifespan)
app.include_router(recipes.router)

@app.get("/")
def root():
    return {"message": "Welcome to the Recipe_DB API"}


