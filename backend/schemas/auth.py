from pydantic import BaseModel, Field


class RegisterSchema(BaseModel):
    username: str = Field(min_length=3, max_length=24)
    email: str = Field(min_length=3, max_length=254)
    password: str = Field(min_length=6, max_length=24)


class LoginSchema(BaseModel):
    email: str = Field(min_length=3, max_length=254)
    password: str = Field(min_length=6, max_length=24)


class UserSchema(BaseModel):
    id: int
    username: str
    email: str
    avatar: str = ""
    banner: str = ""


class UpdateProfileSchema(BaseModel):
    email: str | None = Field(default=None, min_length=3, max_length=254)
    current_password: str | None = Field(default=None, min_length=6, max_length=24)
    new_password: str | None = Field(default=None, min_length=6, max_length=24)
