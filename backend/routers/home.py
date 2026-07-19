from fastapi import APIRouter, Depends

from schemas.anime import ShortAnimeSchema, SwiperBannerSchema
from services.kodik import KodikService

router = APIRouter(tags=["Home"])

@router.get(
    "/banner",
    response_model=list[SwiperBannerSchema],
    summary="Баннеры для главной страницы"
)
async def get_banner(
    service: KodikService = Depends()
):
    return await service.get_banner()

@router.get(
    "/updates",
    response_model=list[ShortAnimeSchema],
    summary="Последние обновления"
)
async def get_updates(
    service: KodikService = Depends()
):
    return await service.get_updates()
