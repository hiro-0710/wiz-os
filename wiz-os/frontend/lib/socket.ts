"use client";

export function createWizSocket() {
  const url = process.env.NEXT_PUBLIC_WIZ_BACKEND_URL;

  if (!url) {
    console.error("❌ NEXT_PUBLIC_WIZ_BACKEND_URL が設定されていません");
    return null;
  }

  const ws = new WebSocket(url);

  ws.onopen = () => {
    console.log("✅ WebSocket connected:", url);
  };

  ws.onclose = () => {
    console.log("❌ WebSocket disconnected");
  };

  ws.onerror = (err) => {
    console.error("⚠️ WebSocket error:", err);
  };

  return ws;
}
