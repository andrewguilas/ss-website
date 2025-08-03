from fastapi import FastAPI
from app.database import Base, engine
import app.models
from app.routers import upload

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(upload.router, prefix="/api")