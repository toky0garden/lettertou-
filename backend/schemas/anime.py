from pydantic import BaseModel

from schemas.tags import TagsScheme

class AnimeTranslationSchema(BaseModel):
    id: int
    title: str
    episodes_count: int | None

class AnimeBannerSchema(BaseModel):
    id: int
    slug: str
    age_rating: int
    title: str
    description: str | None
    poster: str
    tags: list[TagsScheme] | None
    created_at: str | None
    updated_at: str | None
    anime_status: str | None
    shikimori_rating: float | None

class AnimeSchema(BaseModel):
    id: str
    slug: str
    age_rating: int | None
    title: str
    description: str | None
    poster: str | None
    tags: list[TagsScheme] | None
    blocked_countries: list[str] | None
    year: int | None
    duration: int | None
    episodes_count: int | None
    kinopoisk_rating: float | None
    created_at: str | None
    updated_at: str | None
    screenshots: list[str] | None
    countries: list[str] | None
    iframe_url: str | None = None
    type: str | None
    anime_status: str | None = None
    anime_studios: list[str] | None = None
    translations: list[AnimeTranslationSchema] | None
    shikimori_rating: float | None = None

class EpisodeSchema(BaseModel):
    episode: int
    link: str

class ShortAnimeSchema(BaseModel):
    id: str
    slug: str
    poster: str | None
    title: str
    type: str | None = None
    year: int | None = None
    anime_status: str | None = None
