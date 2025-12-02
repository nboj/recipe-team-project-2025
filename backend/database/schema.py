from datetime import datetime, timedelta
from uuid import UUID

from fastapi import UploadFile
from pydantic import BaseModel, Field


class RecipeBase(BaseModel):
    title: str = Field(max_length=100)
    description: str
    cook_time: timedelta

class StepBase(BaseModel):
    step_no: int
    instruction_text: str
    est_minutes: timedelta

class RecipeWrite(RecipeBase):
    steps: list[StepBase]
    image: UploadFile

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

class RequestBase(BaseModel):
    message: str
    type: str

class RequestRead(RequestBase):
    id: str
    user_id: str
    status: str
    created_at: datetime
