from pydantic_settings import BaseSettings # type: ignore
from dotenv import load_dotenv
from pathlib import Path

# Automatically load .env from backend root if present
env_path = Path(__file__).resolve().parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str

    class Config:
        env_file = env_path
        env_file_encoding = 'utf-8'

settings = Settings()
