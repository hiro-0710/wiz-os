"use client";

import { useEffect, useRef, useState } from "react";

export interface WizMessage {
  type: string;
  [key: string]: any;
}

export function useWizWS() {
  const [messages, setMessages] = useState<WizMessage[]>([]);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_WIZ_BACKEND_URL;

    if (!url) {
      console.error("❌ NEXT_PUBLIC_WIZ_BACKEND_URL が設定されていません");
      return;
    }

    // WebSocket 接続開始
    const ws = new WebSocket(url);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WebSocket connected:", url);
      setConnected(true);
    };

    ws.onclose = () => {
      console.log("❌ WebSocket disconnected");
      setConnected(false);
    };

    ws.onerror = (err) => {
      console.error("⚠️ WebSocket error:", err);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setMessages((prev) => [...prev, data]);
      } catch (e) {
        console.error("⚠️ JSON parse error:", e);
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  // テキスト送信
  const send = (text: string) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      console.warn("⚠️ WebSocket is not connected. Cannot send:", text);
      return;
    }

    socketRef.current.send(JSON.stringify({ text }));
  };

  return { messages, send, connected };
}
