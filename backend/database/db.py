from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Define the database 
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

# Create engine for SQLite 
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# Create configured "Session" class 
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for ORM model 
Base = declarative_base()