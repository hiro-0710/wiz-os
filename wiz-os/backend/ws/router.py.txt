from fastapi import WebSocket, WebSocketDisconnect, FastAPI

from core.reasoning import wiz_reasoner
from core.state import wiz_state


async def wiz_ws_handler(ws: WebSocket) -> None:
    await ws.accept()
    await ws.send_json({"type": "system", "message": "Wiz connected"})

    try:
        while True:
            text = await ws.receive_text()

            # acting 状態のシミュレーション：
            # ここで何か IoT 実行などを入れる想定なら status=acting にしてもいい
            result = wiz_reasoner.think(text)

            await ws.send_json(
                {
                    "type": "reasoning",
                    "state": wiz_state.snapshot(),
                    "result": result,
                }
            )

    except WebSocketDisconnect:
        return


def register_ws_routes(app: FastAPI) -> None:
    @app.websocket("/ws")
    async def websocket_endpoint(ws: WebSocket):
        await wiz_ws_handler(ws)
