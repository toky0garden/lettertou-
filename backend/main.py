import uvicorn
from fastapi import FastAPI
from routers.populars import router as populars_anime_router
from routers.searchSlug import router as search_anime_router

app = FastAPI(root_path="/api");

app.include_router(populars_anime_router);
app.include_router(search_anime_router);


@app.get("/")
async def root():
    return {"message": "Hello World"}

if __name__ == "__main__":
    uvicorn.run("main:app", reload=True, log_level="info", use_colors=True, host="localhost", port=8000)