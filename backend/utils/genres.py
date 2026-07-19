from schemas.genres import GenreSchema

# Canonical genre list. Slugs match the values Kodik returns in
# material_data.anime_genres (lowercase russian titles) and mirror
# web/components/catalog/genres.ts so both sides agree on routing.
GENRES: list[GenreSchema] = [
    GenreSchema(slug="экшен", title="Экшен"),
    GenreSchema(slug="приключения", title="Приключения"),
    GenreSchema(slug="комедия", title="Комедия"),
    GenreSchema(slug="детектив", title="Детектив"),
    GenreSchema(slug="драма", title="Драма"),
    GenreSchema(slug="повседневность", title="Повседневность"),
    GenreSchema(slug="фантастика", title="Фантастика"),
    GenreSchema(slug="фэнтези", title="Фэнтези"),
    GenreSchema(slug="гарем", title="Гарем"),
    GenreSchema(slug="исторический", title="Историческое"),
    GenreSchema(slug="ужасы", title="Ужасы"),
    GenreSchema(slug="исекай", title="Исекай"),
    GenreSchema(slug="боевые искусства", title="Боевые искусства"),
    GenreSchema(slug="меха", title="Меха"),
    GenreSchema(slug="военное", title="Военное"),
    GenreSchema(slug="музыка", title="Музыка"),
    GenreSchema(slug="психологическое", title="Психологическое"),
    GenreSchema(slug="реинкарнация", title="Реинкарнация"),
    GenreSchema(slug="романтика", title="Романтика"),
    GenreSchema(slug="школа", title="Школа"),
    GenreSchema(slug="тайна", title="Тайна"),
    GenreSchema(slug="сёдзё", title="Сёдзё"),
    GenreSchema(slug="сёнэн", title="Сёнэн"),
    GenreSchema(slug="спорт", title="Спорт"),
    GenreSchema(slug="сверхъестественное", title="Сверхъестественное"),
    GenreSchema(slug="триллер", title="Триллер"),
    GenreSchema(slug="вампиры", title="Вампиры"),
]


def get_genre_by_slug(slug: str) -> GenreSchema | None:
    normalized = slug.strip().lower()
    for genre in GENRES:
        if genre.slug == normalized:
            return genre
    return None
