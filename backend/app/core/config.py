import os

class Settings:
    PROJECT_NAME: str = "CareerSense AI"
    PROJECT_VERSION: str = "1.0.0"
    
    # Use absolute path for SQLite to avoid CWD issues
    _BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    DATABASE_URL: str = f"sqlite:///{os.path.join(_BASE_DIR, 'careersense.db')}"

settings = Settings()
