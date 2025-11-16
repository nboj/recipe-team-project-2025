from datetime import datetime, timedelta
from uuid import UUID
from typing import Optional
from pydantic import BaseModel, Field


class RecipeBase(BaseModel):
    title: str = Field(max_length=100)
    description: str
    cook_time: timedelta

class RecipeRead(RecipeBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    created_by: str


class ReviewBase(BaseModel):
    comment: str
    rating: float

class ReviewRead(ReviewBase):
    recipe_id: UUID
    user_id: str
    comment: str
    rating: float

class RecipeCreate(BaseModel):
    title: Optional[str] = None 
    description: Optional[str] = None
    instructions: Optional[str] = None
    prep_time: Optional[str] = None
    cook_time: Optional[str] = None
    servings: Optional[int] = None
    image: Optional[str] = None
    cooking_method: Optional[str] = None
    my_rating: Optional[int] = None
    comments: Optional[str] = None
    rated_date: Optional[datetime] = None
    created_date: Optional[datetime] = None
    updated_date: Optional[datetime] = None