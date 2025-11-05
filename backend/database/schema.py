from datetime import datetime, timedelta
from typing import Annotated
from uuid import UUID

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
