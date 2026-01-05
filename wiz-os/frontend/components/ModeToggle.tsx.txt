"use client";

type Mode = "owner" | "trusted" | "guest";

interface Props {
  mode: Mode;
  onChange: (mode: Mode) => void;
}

const modes: Mode[] = ["owner", "trusted", "guest"];

export default function ModeToggle({ mode, onChange }: Props) {
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
      {modes.map((m) => (
        <button
          key={m}
          onClick={() => onChange(m)}
          style={{
            padding: "6px 12px",
            borderRadius: 999,
            border: "1px solid #333",
            background: m === mode ? "#1f4fff" : "#050816",
            color: "#f5f5f5",
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          {m}
        </button>
      ))}
    </div>
  );
}
