"use client";

import { useEffect, useRef, useState } from "react";

export function useWizWS() {
  const [messages, setMessages] = useState<any[]>([]);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_WIZ_BACKEND_URL!;
    const ws = new WebSocket(url);

    socketRef.current = ws;

    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setMessages((prev) => [...prev, data]);
      } catch (e) {
        console.error("WS parse error:", e);
      }
    };

    return () => ws.close();
  }, []);

  const send = (text: string) => {
    socketRef.current?.send(JSON.stringify({ text }));
  };

  return { messages, send, connected };
}

