from pydantic import BaseModel

class TagsScheme(BaseModel):
    id: int
    genre: str