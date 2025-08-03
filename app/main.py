from fastapi import FastAPI
from app.database import Base, engine
from app.models import order, route, truck
from app.routers import upload
import logging

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(upload.router, prefix="/api")

logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
logger = logging.getLogger(__name__)
