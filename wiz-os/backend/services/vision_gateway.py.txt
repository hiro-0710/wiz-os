from typing import Dict, Any

from core.state import wiz_state


def update_fingertip(payload: Dict[str, Any]) -> None:
    """
    Vision 側から送られてくる指先座標を受け取り、内部状態に反映。
    """
    x = payload.get("x")
    y = payload.get("y")
    if x is None or y is None:
        return
    wiz_state.update_fingertip(float(x), float(y))


def update_gaze(payload: Dict[str, Any]) -> None:
    """
    視線座標を受け取り、内部状態に反映。
    """
    x = payload.get("x")
    y = payload.get("y")
    if x is None or y is None:
        return
    wiz_state.update_gaze(float(x), float(y))
