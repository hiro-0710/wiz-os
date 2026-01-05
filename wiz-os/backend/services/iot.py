from __future__ import annotations

import json
from typing import Any, Dict

import requests

from core.config import get_settings


class IoTClient:
    """
    Home Assistant を前提にした IoT クライアント。
    未設定なら何もしない（安全側）。
    """

    def __init__(self) -> None:
        self.settings = get_settings()
        self.base_url = self.settings.home_assistant_url.rstrip("/")
        self.token = self.settings.home_assistant_token

    def _headers(self) -> Dict[str, str]:
        return {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json",
        }

    def _post(self, path: str, payload: Dict[str, Any]) -> None:
        if not self.base_url or not self.token:
            # 本番運用では logging に切り替える
            print("[IoT] not configured, skip")
            return

        url = f"{self.base_url}{path}"
        try:
            resp = requests.post(
                url, headers=self._headers(), data=json.dumps(payload), timeout=3
            )
            if resp.status_code >= 400:
                print("[IoT] error:", resp.status_code, resp.text)
        except Exception as e:
            print("[IoT] exception:", e)

    def light_on(self, entity_id: str) -> None:
        self._post("/api/services/light/turn_on", {"entity_id": entity_id})

    def light_off(self, entity_id: str) -> None:
        self._post("/api/services/light/turn_off", {"entity_id": entity_id})


iot_client = IoTClient()
