from fastapi import FastAPI
import logging
from fastapi.middleware.cors import CORSMiddleware

from backend.database import Base, engine
from backend.models import order, route, truck
from backend.routers import upload, read

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(upload.router)
app.include_router(read.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.WARNING,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
logger = logging.getLogger(__name__)

