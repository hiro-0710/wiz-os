import os
from functools import lru_cache


class Settings:
    def __init__(self) -> None:
        # env: "dev" / "prod" など任意
        self.env = os.getenv("WIZ_ENV", "dev")

        # Home Assistant 用（未設定なら IoT はスキップ動作）
        self.home_assistant_url = os.getenv("HOME_ASSISTANT_URL", "")
        self.home_assistant_token = os.getenv("HOME_ASSISTANT_TOKEN", "")

        # CORS
        self.cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")


@lru_cache
def get_settings() -> Settings:
    return Settings()
