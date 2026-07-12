from fastapi import APIRouter, Depends, Query

from schemas.anime import EpisodeSchema, ShortAnimeSchema
from services.kodik import KodikService

router = APIRouter(tags=["Kodik"])


@router.get(
    "/short-search/",
    response_model=list[ShortAnimeSchema],
    summary="Search anime",
)
async def search_anime(
    search: str = Query(..., min_length=1),
    limit: int = Query(5, ge=1, le=100),
    service: KodikService = Depends(),
):
    return await service.search_anime(search, limit)


@router.get(
    "/translation",
    response_model=list[EpisodeSchema],
    summary="Get player links for a translation",
)
async def get_translation(
    shiki_id: int = Query(..., gt=0),
    translation_id: int = Query(..., gt=0),
    service: KodikService = Depends(),
):
    return await service.get_translation(shiki_id, translation_id)
