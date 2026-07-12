from schemas.KodikAPI import Material
from schemas.anime import (
    ShortAnimeSchema,
    AnimeSchema,
    TagsScheme,
    AnimeTranslationSchema,
)


def material_to_short(material: Material) -> ShortAnimeSchema:
    md = material.material_data

    return ShortAnimeSchema(
        id=material.id,
        slug=material.id,
        poster=(
            md.anime_poster_url
            if md and md.anime_poster_url
            else None
        ),
        title=(
            md.anime_title
            if md and md.anime_title
            else material.title
        ),
        type=material.type,
        year=material.year,
        anime_status=md.anime_status if md else None,
    )

def material_to_anime(material: Material) -> AnimeSchema:
    md = material.material_data

    genres = None
    if md:
        genres = md.anime_genres or md.genres or md.all_genres

    return AnimeSchema(
        id=material.id,
        slug=material.id,

        age_rating=md.minimal_age if md else None,

        title=material.title,
        description=md.anime_description if md else md.description if md else None,

        poster=(
            md.anime_poster_url
            or md.poster_url
            if md
            else None
        ),

        tags=[TagsScheme(id=index + 1, genre=genre) for index, genre in enumerate(genres)] if genres else None,

        blocked_countries=material.blocked_countries,

        year=material.year,

        duration=md.duration if md else None,

        episodes_count=material.episodes_count,

        kinopoisk_rating=md.kinopoisk_rating if md else None,

        created_at=material.created_at.isoformat(),
        updated_at=material.updated_at.isoformat(),

        screenshots=material.screenshots,

        countries=md.countries if md else None,

        iframe_url=material.link,

        type=material.type,

        anime_status=md.anime_status if md else None,

        anime_studios=md.anime_studios if md else None,

        translations=[
            AnimeTranslationSchema(
                id=material.translation.id,
                title=material.translation.title,
                episodes_count=material.episodes_count,
            )
        ],

        shikimori_rating=md.shikimori_rating if md else None,
    )
