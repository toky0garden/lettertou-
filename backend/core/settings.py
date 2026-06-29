from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    KODIK_TOKEN: str

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )


settings = Settings()