from fastapi import FastAPI
from pydantic import BaseModel
from typing import Union

app = FastAPI()


@app.get("/")
def root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}


class Item(BaseModel):
    item: int


@app.post("/test/create-row")
def create_row(item: Item):
    return {"test": item}
