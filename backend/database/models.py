from sqlalchemy import Column, Integer, String, ForeignKey 
from database.db import Base 

class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)


    