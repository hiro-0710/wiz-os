from typing import Dict, Any

from .state import wiz_state


class WizReasoner:
    """
    Wiz 推論エンジン。
    mode による推論深度と簡易 intent 推定を持つ。
    """

    def _depth(self) -> int:
        return {
            "owner": 5,
            "trusted": 3,
            "guest": 1,
        }[wiz_state.mode]

    def _infer_intent(self, message: str) -> str:
        text = message
        if any(k in text for k in ["電気", "ライト", "照明"]):
            return "light_control"
        if any(k in text for k in ["エアコン", "温度", "暖房", "冷房"]):
            return "climate_control"
        if any(k in text for k in ["状態", "今", "どう"]):
            return "status_query"
        return "general"

    def think(self, message: str) -> Dict[str, Any]:
        wiz_state.set_status("thinking")
        wiz_state.add_context(message)

        depth = self._depth()
        intent = self._infer_intent(message)

        response = f"[mode={wiz_state.mode} depth={depth}] intent={intent} message={message}"

        wiz_state.set_status("idle")

        return {
            "intent": intent,
            "depth": depth,
            "response": response,
            "mode": wiz_state.mode,
            "context": wiz_state.context[-10:],
            "vision": wiz_state.vision,
        }


wiz_reasoner = WizReasoner()
