import random
from httpx import AsyncClient

from core.settings import settings
from mappers.anime import material_to_short, material_to_anime
from schemas.anime import EpisodeSchema
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
            "shikimori_rating": "8-10",
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

    async def search_anime(self, search: str, limit: int = 5):
        params = {
            "token": settings.KODIK_TOKEN,
            "title": search,
            "types": "anime-serial,anime",
            "limit": limit,
            "with_material_data": True,
        }

        response = await self.client.get(
            self.BASE_URL + "search",
            params=params,
        )
        response.raise_for_status()

        data = SearchResponse.model_validate(response.json())
        unique_results = remove_duplicate_titles(data.results)

        return [material_to_short(item) for item in unique_results[:limit]]

    async def get_translation(self, shiki_id: int, translation_id: int):
        params = {
            "token": settings.KODIK_TOKEN,
            "shikimori_id": shiki_id,
            "translation_id": translation_id,
            "types": "anime-serial,anime",
            "with_seasons": True,
            "with_episodes": True,
        }

        response = await self.client.get(
            self.BASE_URL + "search",
            params=params,
        )
        response.raise_for_status()

        data = SearchResponse.model_validate(response.json())
        if not data.results:
            return []

        material = data.results[0]
        episodes: list[EpisodeSchema] = []

        if material.seasons:
            def numeric_key(value: str):
                return (0, int(value)) if value.isdigit() else (1, value)

            for season_number in sorted(material.seasons, key=numeric_key):
                season = material.seasons[season_number]
                for episode_number in sorted(season.episodes, key=numeric_key):
                    episode = season.episodes[episode_number]
                    link = episode if isinstance(episode, str) else episode.link
                    episodes.append(
                        EpisodeSchema(episode=int(episode_number), link=self._absolute_link(link))
                    )

        if not episodes:
            episodes.append(EpisodeSchema(episode=1, link=self._absolute_link(material.link)))

        return episodes

    @staticmethod
    def _absolute_link(link: str) -> str:
        return f"https:{link}" if link.startswith("//") else link
