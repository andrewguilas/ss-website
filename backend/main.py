from fastapi import FastAPI
import logging
from fastapi.middleware.cors import CORSMiddleware

from backend.database import Base, engine
from backend.models import order, route, truck
from backend.routers import upload, read, edit, create, delete

logging.basicConfig(
    level=logging.WARNING,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
logger = logging.getLogger(__name__)

if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    logger.info("Database created")

app = FastAPI()
app.include_router(upload.router)
app.include_router(read.router)
app.include_router(edit.router)
app.include_router(create.router)
app.include_router(delete.router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
