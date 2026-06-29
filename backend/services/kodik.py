import random
from httpx import AsyncClient

from core.settings import settings
from mappers.anime import material_to_short, material_to_anime
from utils.anime import remove_duplicate_titles

from schemas.KodikAPI import SearchResponse

class KodikService:

    BASE_URL = "https://kodik-api.com/"

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
            self.BASE_URL + "list",
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

    async def get_anime(self, slug):
        params = {
            "token": settings.KODIK_TOKEN,
            "id": slug,
            "with_material_data": True
        }

        response = await self.client.get(
            self.BASE_URL + "search",
            params=params,
        )

        response.raise_for_status()

        data = SearchResponse.model_validate(response.json())

        return material_to_anime(data.results[0])