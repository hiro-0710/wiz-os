from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware

from core.config import get_settings
from core.state import wiz_state
from services.vision_gateway import update_fingertip, update_gaze
from ws.router import register_ws_routes

settings = get_settings()

app = FastAPI(title="Wiz Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

register_ws_routes(app)


@app.get("/state")
def get_state():
    return wiz_state.snapshot()


@app.post("/mode/{mode}")
def set_mode(mode: str):
    wiz_state.set_mode(mode)  # エラーは FastAPI が 500 として返す
    return {"ok": True, "mode": wiz_state.mode}


@app.post("/vision/fingertip")
def vision_fingertip(payload: dict = Body(...)):
    update_fingertip(payload)
    return {"ok": True}


@app.post("/vision/gaze")
def vision_gaze(payload: dict = Body(...)):
    update_gaze(payload)
    return {"ok": True}
