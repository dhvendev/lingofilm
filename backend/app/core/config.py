from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    SSL_CERTFILE: str = None
    SSL_KEYFILE: str = None

    class Config:
        env_file = ".env"

settings = Settings()