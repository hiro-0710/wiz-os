# Wiz Monorepo

静か・精密・ミニマル・高級・神秘・適応型知性  
この世界観を持つ AI アシスタント「Wiz」の **Web + Backend + Vision** 実装。

- Backend: FastAPI (port 8000)
- Frontend: Next.js + React + Three.js (port 3000)
- Vision: Python + MediaPipe (ローカルカメラ)

## 1. 必要環境

- Python 3.10 〜 3.12
- Node.js 18 〜 22
- npm または pnpm / yarn
- カメラ付きマシン（Vision を使う場合）

パス構成:

```text
wiz/
  backend/
  frontend/
  vision/
