"use client";

import { WizMessage } from "../hooks/useWizWS";

export default function LogPanel({ messages }: { messages: WizMessage[] }) {
  return (
    <div
      style={{
        border: "1px solid #222",
        borderRadius: 8,
        padding: 12,
        maxHeight: 320,
        overflow: "auto",
        background: "#050a18",
        fontSize: 12,
      }}
    >
      {messages.map((m, i) => (
        <pre
          key={i}
          style={{
            margin: 0,
            marginBottom: 8,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {JSON.stringify(m, null, 2)}
        </pre>
      ))}
      {messages.length === 0 && (
        <div style={{ opacity: 0.6 }}>まだ Wiz からの応答はありません。</div>
      )}
    </div>
  );
}
