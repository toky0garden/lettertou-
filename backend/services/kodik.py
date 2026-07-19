import random
import time
from urllib.parse import parse_qs, urlparse

from fastapi import HTTPException, status
from httpx import AsyncClient

from core.settings import settings
from mappers.anime import (
    material_shikimori_id,
    material_to_anime,
    material_to_banner,
    material_to_short,
)
from schemas.anime import (
    EpisodeSchema,
    GenreAnimeListSchema,
    PlayerSchema,
    PlayerTranslationSchema,
)
from schemas.genres import GenreSchema
from utils.anime import remove_duplicate_titles
from utils.genres import GENRES, get_genre_by_slug

from schemas.KodikAPI import GenresResponse, SearchResponse

# A single shared client: KodikService is instantiated per request via Depends(),
# so creating an AsyncClient in __init__ would leak a connection pool every call.
_client = AsyncClient(timeout=15)

# Genres rarely change, but Kodik has no cheap aggregate endpoint, so we cache
# the mapped list in memory for an hour (same process-wide style as _client).
_GENRES_TTL = 3600
_genres_cache: tuple[float, list[GenreSchema]] | None = None

class KodikService:

    BASE_URL = "https://kodik-api.com/"

    def __init__(self):
        self.client = _client

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

        if not data.results:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Аниме не найдено")

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

    async def get_genres(self) -> list[GenreSchema]:
        """Return the canonical genre list with anime counts from Kodik.

        Counts come from Kodik's /genres aggregation (genres_type=anime)
        and are cached in memory for an hour.
        """
        global _genres_cache

        if _genres_cache and time.monotonic() - _genres_cache[0] < _GENRES_TTL:
            return _genres_cache[1]

        counts: dict[str, int] = {}
        try:
            response = await self.client.get(
                self.BASE_URL + "genres",
                params={
                    "token": settings.KODIK_TOKEN,
                    "genres_type": "anime",
                    "types": "anime-serial,anime",
                },
            )
            response.raise_for_status()
            data = GenresResponse.model_validate(response.json())
            counts = {item.title.lower(): item.count for item in data.results}
        except Exception:
            # Counts are decorative: fall back to the plain list on any
            # Kodik hiccup instead of failing the whole endpoint.
            counts = {}

        genres = [
            GenreSchema(slug=genre.slug, title=genre.title, count=counts.get(genre.slug))
            for genre in GENRES
        ]

        if counts:
            _genres_cache = (time.monotonic(), genres)

        return genres

    async def get_anime_by_genre(self, slug: str, next_page: str | None = None) -> GenreAnimeListSchema:
        normalized = slug.strip().lower()
        if not normalized:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Жанр не найден")

        # Anime tags may reference Kodik genres outside the curated list;
        # pass the slug through so those pages still work (empty list at worst).
        genre = get_genre_by_slug(normalized)

        params = {
            "token": settings.KODIK_TOKEN,
            "types": "anime-serial,anime",
            "limit": 50,
            "anime_genres": genre.slug if genre else normalized,
            "sort": "shikimori_rating",
            "order": "desc",
            "with_material_data": True,
        }
        if next_page:
            # Kodik's /list pagination hands back an opaque token via the
            # next_page url; passing it as `next` continues the listing.
            params["next"] = next_page

        response = await self.client.get(
            self.BASE_URL + "list",
            params=params,
        )
        response.raise_for_status()

        data = SearchResponse.model_validate(response.json())
        unique_results = remove_duplicate_titles(data.results)

        return GenreAnimeListSchema(
            results=[material_to_short(item) for item in unique_results],
            next_page=self._extract_next_token(data.next_page),
        )

    async def get_updates(self, limit: int = 10):
        """Recently updated titles for the 'Новинки' section."""
        params = {
            "token": settings.KODIK_TOKEN,
            "types": "anime-serial,anime",
            "limit": 50,
            "sort": "updated_at",
            "order": "desc",
            "with_material_data": True,
        }

        response = await self.client.get(
            self.BASE_URL + "list",
            params=params,
        )
        response.raise_for_status()

        data = SearchResponse.model_validate(response.json())
        unique_results = remove_duplicate_titles(data.results)

        return [material_to_short(item) for item in unique_results[:limit]]

    async def get_banner(self, limit: int = 5):
        """Hero banner candidates: popular titles with a poster and description."""
        params = {
            "token": settings.KODIK_TOKEN,
            "types": "anime-serial,anime",
            "limit": 50,
            "shikimori_rating": "8-10",
            "years": "2017-2026",
            "with_material_data": True,
        }

        response = await self.client.get(
            self.BASE_URL + "list",
            params=params,
        )
        response.raise_for_status()

        data = SearchResponse.model_validate(response.json())
        unique_results = remove_duplicate_titles(data.results)
        random.shuffle(unique_results)

        banners = []
        for item in unique_results:
            banner = material_to_banner(item)
            if banner:
                banners.append(banner)
            if len(banners) >= limit:
                break

        return banners

    async def get_player(self, slug: str) -> PlayerSchema:
        """Everything the player needs: iframe url + all translations."""
        params = {
            "token": settings.KODIK_TOKEN,
            "id": slug,
            "with_material_data": True,
        }

        response = await self.client.get(
            self.BASE_URL + "search",
            params=params,
        )
        response.raise_for_status()

        data = SearchResponse.model_validate(response.json())
        if not data.results:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Аниме не найдено")

        material = data.results[0]
        shikimori_id = material_shikimori_id(material)

        # One Kodik record = one translation. To list every available
        # translation we re-search by shikimori_id, which returns a record
        # per translation of the same title.
        materials = [material]
        if shikimori_id:
            all_response = await self.client.get(
                self.BASE_URL + "search",
                params={
                    "token": settings.KODIK_TOKEN,
                    "shikimori_id": shikimori_id,
                    "types": "anime-serial,anime",
                    "limit": 100,
                },
            )
            all_response.raise_for_status()
            all_data = SearchResponse.model_validate(all_response.json())
            if all_data.results:
                materials = all_data.results

        translations: list[PlayerTranslationSchema] = []
        seen_ids: set[int] = set()
        for item in materials:
            if item.translation.id in seen_ids:
                continue
            seen_ids.add(item.translation.id)
            translations.append(
                PlayerTranslationSchema(
                    id=item.translation.id,
                    title=item.translation.title,
                    type=item.translation.type,
                    quality=item.quality,
                    episodes_count=item.episodes_count,
                )
            )

        # Voice translations first, subtitles after, alphabetical inside groups.
        translations.sort(key=lambda t: (t.type != "voice", t.title.lower()))

        return PlayerSchema(
            shikimori_id=shikimori_id,
            iframe_url=self._absolute_link(material.link),
            translations=translations,
        )

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
                    if not episode_number.isdigit():
                        continue
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

    @staticmethod
    def _extract_next_token(next_page: str | None) -> str | None:
        """Kodik returns next_page as a full url; keep only the `next` token."""
        if not next_page:
            return None
        token = parse_qs(urlparse(next_page).query).get("next")
        return token[0] if token else None
