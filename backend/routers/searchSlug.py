from fastapi import APIRouter, Depends

from schemas.anime import AnimeSchema
from services.kodik import KodikService

router = APIRouter(prefix="/title", tags=["Search anime"])

@router.get(
    "",
    response_model=AnimeSchema,
    summary="Поиск аниме по названию"
)
async def get_anime(
    slug: str,
    service: KodikService = Depends()
):
    return await service.get_anime(slug);