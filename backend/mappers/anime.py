from schemas.KodikAPI import Material
from schemas.anime import (
    ShortAnimeSchema,
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
        translations=AnimeTranslationSchema(
            id=material.translation.id,
            title=material.translation.title,
            episodes_count=material.episodes_count,
        ),
    )