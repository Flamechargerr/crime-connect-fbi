from pydantic_settings import BaseSettings
from functools import lru_cache
import secrets

class Settings(BaseSettings):
    APP_NAME: str = "Crime Connect FBI API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    
    SECRET_KEY: str = secrets.token_urlsafe(32)
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    DATABASE_URL: str = "sqlite+aiosqlite:///./data/app.db"
    
    CHICAGO_DATA_URL: str = "https://data.cityofchicago.org/resource/ijzp-q8t2.json"
    CHICAGO_DATA_LIMIT: int = 10000
    
    class Config:
        env_file = ".env"

@lru_cache
def get_settings() -> Settings:
    return Settings()
