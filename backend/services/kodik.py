import random
from httpx import AsyncClient

from core.settings import settings
from mappers.anime import material_to_short
from utils.anime import remove_duplicate_titles

from schemas.KodikAPI import SearchResponse
from schemas.anime import (
    ShortAnimeSchema,
    AnimeTranslationSchema,
)

class KodikService:

    BASE_URL = "https://kodik-api.com/list"

    def __init__(self):
        self.client = AsyncClient(timeout=15)

    async def get_popular(self):

        params = {
            "token": settings.KODIK_TOKEN,
            "types": "anime-serial,anime",
            "limit": 50,
            "shikimori_rating": "7-10",
            "years": "2017-2026",
            "with_material_data": True
        }

        response = await self.client.get(
            self.BASE_URL,
            params=params,
        )

        response.raise_for_status()

        data = SearchResponse.model_validate(response.json())

        unique_results = remove_duplicate_titles(data.results)
        random.shuffle(unique_results)

        return [
            material_to_short(item)
            for item in unique_results[:10]
        ]