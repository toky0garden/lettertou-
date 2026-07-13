import uvicorn
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from core.database import init_database
from core.storage import UPLOAD_DIR
from routers.populars import router as populars_anime_router
from routers.searchSlug import router as search_anime_router
from routers.kodik import router as kodik_router
from routers.auth import router as auth_router
from routers.profile import router as profile_router

app = FastAPI()

frontend_url = os.getenv("FRONTEND_URL")
allowed_origins = ["http://localhost:3000", "http://127.0.0.1:3000"]
if frontend_url:
    allowed_origins.append(frontend_url.rstrip("/"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

init_database()
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

app.include_router(populars_anime_router);
app.include_router(search_anime_router);
app.include_router(kodik_router);
app.include_router(auth_router);
app.include_router(profile_router);


@app.get("/")
async def root():
    return {"status": "ok"}

if __name__ == "__main__":
    uvicorn.run("main:app", reload=True, log_level="info", use_colors=True, host="localhost", port=8000)
