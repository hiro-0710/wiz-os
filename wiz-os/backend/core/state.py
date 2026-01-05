from typing import List, Literal, Dict, Any


Mode = Literal["owner", "trusted", "guest"]
Status = Literal["idle", "thinking", "acting"]


class WizState:
    """
    Wiz 全体の状態。
    """
    def __init__(self) -> None:
        self.mode: Mode = "owner"
        self.status: Status = "idle"
        self.context: List[str] = []
        self.vision: Dict[str, Any] = {
            "x": None,
            "y": None,
            "gaze": {"x": None, "y": None},
        }

    def set_mode(self, mode: Mode) -> None:
        if mode not in ("owner", "trusted", "guest"):
            raise ValueError("invalid mode")
        self.mode = mode

    def add_context(self, message: str) -> None:
        self.context.append(message)
        if len(self.context) > 50:
            self.context.pop(0)

    def set_status(self, status: Status) -> None:
        if status not in ("idle", "thinking", "acting"):
            raise ValueError("invalid status")
        self.status = status

    def update_fingertip(self, x: float | None, y: float | None) -> None:
        self.vision["x"] = x
        self.vision["y"] = y

    def update_gaze(self, x: float | None, y: float | None) -> None:
        self.vision["gaze"]["x"] = x
        self.vision["gaze"]["y"] = y

    def snapshot(self) -> dict:
        return {
            "mode": self.mode,
            "status": self.status,
            "context": self.context[-10:],
            "vision": self.vision,
        }


wiz_state = WizState()
