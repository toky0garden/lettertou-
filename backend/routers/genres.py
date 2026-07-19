from fastapi import APIRouter, Depends, Query

from schemas.anime import GenreAnimeListSchema
from schemas.genres import GenreSchema
from services.kodik import KodikService

router = APIRouter(prefix="/genres", tags=["Genres"])

@router.get(
    "",
    response_model=list[GenreSchema],
    summary="Список всех жанров"
)
async def get_genres(
    service: KodikService = Depends()
):
    return await service.get_genres()

@router.get(
    "/{slug}/anime",
    response_model=GenreAnimeListSchema,
    summary="Аниме по жанру"
)
async def get_anime_by_genre(
    slug: str,
    next_page: str | None = Query(None, alias="next"),
    service: KodikService = Depends()
):
    return await service.get_anime_by_genre(slug, next_page)
