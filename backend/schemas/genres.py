from pydantic import BaseModel


class GenreSchema(BaseModel):
    slug: str
    title: str
    count: int | None = None
