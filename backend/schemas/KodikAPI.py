from typing import Optional, List, Dict, Any, Union
from pydantic import BaseModel, Field
from datetime import datetime


class Translation(BaseModel):
    """Информация об озвучке"""
    id: int
    title: str
    type: str = Field(..., description="voice или subtitles")


class MaterialData(BaseModel):
    """Дополнительная информация о материале с внешних источников"""
    # Основные поля
    title: Optional[str] = None
    anime_title: Optional[str] = None
    title_en: Optional[str] = None
    other_titles: Optional[List[str]] = None
    other_titles_en: Optional[List[str]] = None
    other_titles_jp: Optional[List[str]] = None
    anime_license_name: Optional[str] = None

    # Лицензии и тип
    anime_licensed_by: Optional[List[str]] = None
    anime_kind: Optional[str] = None
    mydramalist_tags: Optional[List[str]] = None

    # Статус
    all_status: Optional[str] = None
    anime_status: Optional[str] = None
    drama_status: Optional[str] = None

    # Основная информация
    year: Optional[int] = None
    tagline: Optional[str] = None
    description: Optional[str] = None
    anime_description: Optional[str] = None

    # Постеры
    poster_url: Optional[str] = None
    anime_poster_url: Optional[str] = None
    drama_poster_url: Optional[str] = None
    screenshots: Optional[List[str]] = None

    # Продолжительность и страны
    duration: Optional[int] = Field(None, description="Продолжительность в минутах")
    countries: Optional[List[str]] = None

    # Жанры
    all_genres: Optional[List[str]] = None
    genres: Optional[List[str]] = None
    anime_genres: Optional[List[str]] = None
    drama_genres: Optional[List[str]] = None
    anime_studios: Optional[List[str]] = None

    # Рейтинги
    kinopoisk_rating: Optional[float] = None
    kinopoisk_votes: Optional[int] = None
    imdb_rating: Optional[float] = None
    imdb_votes: Optional[int] = None
    shikimori_rating: Optional[float] = None
    shikimori_votes: Optional[int] = None
    mydramalist_rating: Optional[float] = None
    mydramalist_votes: Optional[int] = None

    # Даты
    premiere_ru: Optional[str] = Field(None, description="Дата в формате YYYY-MM-DD")
    premiere_world: Optional[str] = Field(None, description="Дата в формате YYYY-MM-DD")
    aired_at: Optional[str] = Field(None, description="Дата в формате YYYY-MM-DD")
    released_at: Optional[str] = Field(None, description="Дата в формате YYYY-MM-DD")
    next_episode_at: Optional[datetime] = Field(None, description="ISO 8601 формат")

    # Возрастные рейтинги
    rating_mpaa: Optional[str] = None
    minimal_age: Optional[int] = None

    # Эпизоды
    episodes_total: Optional[int] = None
    episodes_aired: Optional[int] = None

    # Персонал
    actors: Optional[List[str]] = None
    directors: Optional[List[str]] = None
    producers: Optional[List[str]] = None
    writers: Optional[List[str]] = None
    composers: Optional[List[str]] = None
    editors: Optional[List[str]] = None
    designers: Optional[List[str]] = None
    operators: Optional[List[str]] = None


class Episode(BaseModel):
    """Информация об эпизоде (расширенная версия)"""
    link: str
    title: Optional[str] = None
    screenshots: Optional[List[str]] = None


class Season(BaseModel):
    """Информация о сезоне"""
    link: str
    episodes: Dict[str, Union[str, Episode]] = Field(
        ...,
        description="Словарь где ключ - номер серии, значение - ссылка или объект Episode"
    )


class Material(BaseModel):
    """Основная модель материала (фильм/сериал)"""
    id: str = Field(..., description="Уникальный ID материала")
    title: str = Field(..., description="Название")
    title_orig: Optional[str] = Field(None, description="Оригинальное название")
    other_title: Optional[str] = Field(None, description="Другое название")
    link: str = Field(..., description="Ссылка на плеер")
    year: Optional[int] = Field(None, description="Год")

    # Внешние ID
    kinopoisk_id: Optional[str] = None
    imdb_id: Optional[str] = None
    mdl_id: Optional[str] = None
    worldart_link: Optional[str] = None
    shikimori_id: Optional[str] = None

    # Основные характеристики
    type: str = Field(..., description="Тип материала")
    quality: Optional[str] = Field(None, description="Качество видео")
    camrip: Optional[bool] = Field(None, description="Является ли камрипом")
    lgbt: Optional[bool] = Field(None, description="Содержит ли LGBT сцены")

    # Озвучка
    translation: Translation = Field(..., description="Информация об озвучке")

    # Даты
    created_at: datetime = Field(..., description="Дата создания в ISO 8601")
    updated_at: datetime = Field(..., description="Дата обновления в ISO 8601")

    # Блокировки
    blocked_countries: List[str] = Field(default_factory=list, description="Заблокированные страны")
    blocked_seasons: Optional[Union[str, Dict[str, Union[str, List[str]]]]] = Field(
        None,
        description="Информация о заблокированных сезонах"
    )

    # Информация о сериалах
    last_season: Optional[int] = Field(None, description="Номер последнего сезона")
    last_episode: Optional[int] = Field(None, description="Номер последней серии")
    episodes_count: Optional[int] = Field(None, description="Общее количество эпизодов")
    seasons: Optional[Dict[str, Season]] = Field(
        None,
        description="Словарь сезонов, где ключ - номер сезона"
    )

    # Дополнительная информация
    material_data: Optional[MaterialData] = Field(
        None,
        description="Информация с КиноПоиска, Shikimori, MyDramaList"
    )
    screenshots: Optional[List[str]] = Field(None, description="Ссылки на кадры")


class SearchResponse(BaseModel):
    """Ответ от API поиска"""
    time: str = Field(..., description="Время выполнения запроса")
    total: int = Field(..., description="Общее количество найденных материалов")
    results: List[Material] = Field(..., description="Список найденных материалов")


class ErrorResponse(BaseModel):
    """Ответ с ошибкой"""
    error: str = Field(..., description="Описание ошибки")
    message: Optional[str] = Field(None, description="Дополнительное сообщение")


# Модели для запросов
class SearchRequest(BaseModel):
    """Параметры поискового запроса"""
    # Обязательные
    token: str = Field(..., description="API-токен")

    # Поисковые параметры (хотя бы один обязателен)
    title: Optional[str] = None
    title_orig: Optional[str] = None
    id: Optional[str] = None
    player_link: Optional[str] = None
    kinopoisk_id: Optional[int] = None
    imdb_id: Optional[str] = None
    mdl_id: Optional[str] = None
    worldart_animation_id: Optional[int] = None
    worldart_cinema_id: Optional[int] = None
    worldart_link: Optional[str] = None
    shikimori_id: Optional[int] = None

    # Модификаторы поиска
    strict: Optional[bool] = False
    full_match: Optional[bool] = False

    # Фильтрация
    limit: Optional[int] = Field(None, ge=1, le=100, description="Максимальное количество результатов")
    types: Optional[str] = Field(None, description="Типы материалов через запятую")
    year: Optional[str] = Field(None, description="Год или диапазон лет")
    translation_id: Optional[str] = Field(None, description="ID озвучек через запятую")
    translation_type: Optional[str] = Field(None, description="voice или subtitles")
    has_field: Optional[str] = Field(None, description="Обязательные поля")

    # Приоритизация озвучек
    prioritize_translations: Optional[str] = Field(
        "704,734",
        description="ID приоритетных озвучек"
    )
    unprioritize_translations: Optional[str] = Field(
        "800,882,subtitles",
        description="ID низкоприоритетных озвучек"
    )
    prioritize_translation_type: Optional[str] = Field("voice", description="voice или subtitles")
    block_translations: Optional[str] = Field(None, description="Заблокированные озвучки")

    # Дополнительные фильтры
    camrip: Optional[bool] = None
    lgbt: Optional[bool] = None

    # Параметры вывода
    with_seasons: Optional[bool] = False
    season: Optional[int] = None
    with_episodes: Optional[bool] = False
    with_episodes_data: Optional[bool] = False
    episode: Optional[int] = None
    with_page_links: Optional[bool] = False
    with_material_data: Optional[bool] = False

    # Геоблокировка
    not_blocked_in: Optional[str] = Field(None, description="Коды стран через запятую")
    not_blocked_for_me: Optional[bool] = None

    # Фильтрация по внешним данным
    countries: Optional[str] = Field(None, description="Страны через запятую")
    countries_and: Optional[str] = Field(None, description="Все указанные страны")
    genres: Optional[str] = Field(None, description="Жанры через запятую")
    genres_and: Optional[str] = Field(None, description="Все указанные жанры")
    anime_genres: Optional[str] = None
    anime_genres_and: Optional[str] = None
    drama_genres: Optional[str] = None
    drama_genres_and: Optional[str] = None
    all_genres: Optional[str] = None
    all_genres_and: Optional[str] = None

    duration: Optional[str] = Field(None, description="Продолжительность или диапазон")

    # Рейтинги
    kinopoisk_rating: Optional[str] = Field(None, description="Рейтинг или диапазон")
    imdb_rating: Optional[str] = None
    shikimori_rating: Optional[str] = None
    mydramalist_rating: Optional[str] = None

    # Персонал
    actors: Optional[str] = Field(None, description="Актеры через запятую")
    actors_and: Optional[str] = None
    directors: Optional[str] = None
    directors_and: Optional[str] = None
    producers: Optional[str] = None
    producers_and: Optional[str] = None
    writers: Optional[str] = None
    writers_and: Optional[str] = None
    composers: Optional[str] = None
    composers_and: Optional[str] = None
    editors: Optional[str] = None
    editors_and: Optional[str] = None
    designers: Optional[str] = None
    designers_and: Optional[str] = None
    operators: Optional[str] = None
    operators_and: Optional[str] = None

    # Возрастные ограничения
    rating_mpaa: Optional[str] = None
    minimal_age: Optional[str] = Field(None, description="Возраст или диапазон")

    # Специфичные для аниме/дорам
    anime_kind: Optional[str] = None
    mydramalist_tags: Optional[str] = None
    mydramalist_tags_and: Optional[str] = None
    anime_status: Optional[str] = None
    drama_status: Optional[str] = None
    all_status: Optional[str] = None
    anime_studios: Optional[str] = None
    anime_studios_and: Optional[str] = None
    anime_licensed_by: Optional[str] = None
    anime_licensed_by_and: Optional[str] = None