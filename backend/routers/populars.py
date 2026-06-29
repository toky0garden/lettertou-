from fastapi import APIRouter, Depends

from schemas.anime import ShortAnimeSchema
from services.kodik import KodikService

router = APIRouter(prefix="/populars", tags=["Popular"])

@router.get(
    "",
    response_model=list[ShortAnimeSchema],
    summary="Популярное аниме"
)
async def get_populars(
    service: KodikService = Depends()
):
    return await service.get_popular()