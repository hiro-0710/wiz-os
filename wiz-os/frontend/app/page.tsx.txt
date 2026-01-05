"use client";

import { useEffect, useState } from "react";
import Orb from "../components/Orb";
import ModeToggle from "../components/ModeToggle";
import LogPanel from "../components/LogPanel";
import { useWizWS, WizMessage } from "../hooks/useWizWS";

type Mode = "owner" | "trusted" | "guest";

export default function Home() {
  const { messages, send, connected } = useWizWS();
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<Mode>("owner");

  const [latestIntent, setLatestIntent] = useState<string | null>(null);
  const [latestDepth, setLatestDepth] = useState(0);
  const [latestStatus, setLatestStatus] =
    useState<"idle" | "thinking" | "acting">("idle");
  const [latestVision, setLatestVision] = useState({
    x: null as number | null,
    y: null as number | null,
    gaze: { x: null as number | null, y: null as number | null },
  });

  useEffect(() => {
    fetch(`http://localhost:8000/mode/${mode}`, { method: "POST" }).catch(
      console.error
    );
  }, [mode]);

  useEffect(() => {
    if (messages.length === 0) return;

    const last = [...messages].reverse().find((m) => m.type === "reasoning");
    if (!last) return;

    const result = (last as any).result;
    const state = (last as any).state;

    const delay = mode === "owner" ? 0 : mode === "trusted" ? 120 : 300;

    const timer = setTimeout(() => {
      if (result) {
        setLatestIntent(result.intent ?? null);
        setLatestDepth(result.depth ?? 0);
      }
      if (state) {
        setLatestStatus(state.status ?? "idle");
        if (state.mode && state.mode !== mode) {
          setMode(state.mode as Mode);
        }
        if (state.vision) {
          setLatestVision((prev) => ({
            ...prev,
            x: state.vision.x ?? prev.x,
            y: state.vision.y ?? prev.y,
            gaze: state.vision.gaze ?? prev.gaze,
          }));
        }
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [messages, mode]);

  const handleSend = () => {
    if (!input) return;
    send(input);
    setInput("");
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "40px",
        background: "#050816",
        color: "#f5f5f5",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, marginBottom: 6 }}>Wiz Interface</h1>
        <div style={{ fontSize: 12, opacity: 0.7 }}>
          status: {connected ? "connected" : "disconnected"} / mode: {mode}
        </div>
      </div>

      <div style={{ display: "flex", gap: 40 }}>
        <div style={{ flex: "0 0 320px" }}>
          <Orb
            mode={mode}
            vision={latestVision}
            status={latestStatus}
            depth={latestDepth}
            latestIntent={latestIntent}
          />
        </div>

        <div style={{ flex: 1 }}>
          <ModeToggle mode={mode} onChange={setMode} />

          <div style={{ marginBottom: 12 }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Wiz に話しかける…"
              style={{
                padding: "8px 10px",
                width: "260px",
                borderRadius: 6,
                border: "1px solid #444",
                background: "#0b1020",
                color: "#f5f5f5",
                fontSize: 13,
              }}
            />
            <button
              onClick={handleSend}
              style={{
                marginLeft: 10,
                padding: "8px 16px",
                borderRadius: 6,
                border: "none",
                background: "#1f4fff",
                color: "#fff",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Send
            </button>
          </div>

          <LogPanel messages={messages as WizMessage[]} />
        </div>
      </div>
    </main>
  );
}
