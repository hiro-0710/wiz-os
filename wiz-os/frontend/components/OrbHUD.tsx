"use client";

type Mode = "owner" | "trusted" | "guest";

interface Props {
  mode: Mode;
  latestIntent: string | null;
  depth: number;
  status: "idle" | "thinking" | "acting";
  gaze: { x: number | null; y: number | null };
}

export default function OrbHUD({
  mode,
  latestIntent,
  depth,
  status,
  gaze,
}: Props) {
  if (mode === "guest") return null;

  const items =
    mode === "owner"
      ? [
          { label: "RNG", value: `${(depth * 100).toFixed(0)}M` },
          { label: "ELV", value: status },
          { label: "INTENT", value: latestIntent ?? "-" },
          {
            label: "GAZE",
            value:
              gaze.x !== null && gaze.y !== null
                ? `${gaze.x.toFixed(2)}, ${gaze.y.toFixed(2)}`
                : "-",
          },
          { label: "MODE", value: mode },
          { label: "VSO", value: "1846" },
        ]
      : [
          { label: "INTENT", value: latestIntent ?? "-" },
          { label: "RNG", value: `${(depth * 100).toFixed(0)}M` },
        ];

  const actingShake =
    status === "acting"
      ? {
          transform: "translateY(-1px)",
          opacity: 0.7,
        }
      : {};

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: mode === "owner" ? 12 : 20,
      }}
    >
      <div
        style={{
          background: "rgba(5, 8, 22, 0.55)",
          padding: "8px 16px",
          borderRadius: 10,
          fontSize: 11,
          color: "#a9d4ff",
          letterSpacing: "0.6px",
          opacity: mode === "owner" ? 0.9 : 0.6,
          backdropFilter: "blur(6px)",
          border: "1px solid rgba(255,255,255,0.08)",
          display: "grid",
          gridTemplateColumns: "repeat(3, auto)",
          gap: "6px 16px",
          transition: "0.12s ease",
          ...actingShake,
        }}
      >
        {items.map((item, i) => (
          <div key={i} style={{ display: "flex", gap: 6 }}>
            <span style={{ opacity: 0.6 }}>{item.label}:</span>
            <span>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
