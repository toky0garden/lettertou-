import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from core.database import init_database
from routers.populars import router as populars_anime_router
from routers.searchSlug import router as search_anime_router
from routers.kodik import router as kodik_router
from routers.auth import router as auth_router
from routers.profile import router as profile_router

app = FastAPI(root_path="/api");

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

init_database()
uploads_dir = Path(__file__).resolve().parent / "uploads"
uploads_dir.mkdir(exist_ok=True)
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

app.include_router(populars_anime_router);
app.include_router(search_anime_router);
app.include_router(kodik_router);
app.include_router(auth_router);
app.include_router(profile_router);


@app.get("/")
async def root():
    return {"message": "Hello World"}

if __name__ == "__main__":
    uvicorn.run("main:app", reload=True, log_level="info", use_colors=True, host="localhost", port=8000)
