from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DEBUG: bool
    DATABASE_URL: str
    REDIS_HOST: str
    REDIS_PORT: int
    REDIS_PASSWORD: str
    
    # for translate words
    YANDEX_API_KEY: str
    YANDEX_FOLDER_ID: str
    TTL_FOR_WORDS: int = 2592000

    class Config:
        env_file = ".env"

settings = Settings()