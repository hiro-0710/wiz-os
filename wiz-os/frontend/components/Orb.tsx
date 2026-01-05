"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";
import { useRef } from "react";
import OrbHUD from "./OrbHUD";

type Mode = "owner" | "trusted" | "guest";

interface VisionState {
  x: number | null;
  y: number | null;
  gaze: { x: number | null; y: number | null };
}

interface Props {
  mode: Mode;
  vision: VisionState;
  status: "idle" | "thinking" | "acting";
  depth: number;
  latestIntent: string | null;
}

function OrbMesh({ mode, vision, status, depth }: Props) {
  const ref = useRef<any>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    const base = 1;
    const amp = mode === "owner" ? 0.07 : mode === "trusted" ? 0.05 : 0.03;
    const speed = mode === "owner" ? 2.4 : mode === "trusted" ? 1.8 : 1.2;
    let scale = base + Math.sin(t * speed) * amp;

    if (status === "thinking") {
      scale += Math.sin(t * 20) * 0.01;
    }

    let fingertipBoost = 0;
    if (vision.x !== null && vision.y !== null) {
      const dx = vision.x - 0.5;
      const dy = vision.y - 0.5;
      const dist = Math.sqrt(dx * dx + dy * dy);
      fingertipBoost = Math.max(0, 0.4 - dist);
    }

    let gazeBoost = 0;
    if (vision.gaze.x !== null && vision.gaze.y !== null) {
      const dx = vision.gaze.x - 0.5;
      const dy = vision.gaze.y - 0.5;
      gazeBoost = Math.max(0, 0.5 - Math.sqrt(dx * dx + dy * dy));
    }

    const depthBoost = depth * 0.1;

    // owner のときだけ、指先方向に少し寄る
    let offsetX = 0;
    if (mode === "owner" && vision.x !== null) {
      offsetX = (vision.x - 0.5) * 0.4;
    }

    if (ref.current) {
      ref.current.scale.set(scale, scale, scale);
      ref.current.position.x = offsetX;

      let intensity = 0.6 + fingertipBoost + gazeBoost + depthBoost;

      if (status === "acting") {
        const pulse = Math.sin(t * 20) * 0.08;
        scale += pulse;
        intensity = 1.2 + pulse * (mode === "owner" ? 1.2 : 0.6);
        ref.current.scale.set(scale, scale, scale);
      }

      ref.current.material.emissiveIntensity = intensity;
    }
  });

  const color =
    mode === "owner" ? "#a9d4ff" : mode === "trusted" ? "#9bb8ff" : "#8888ff";
  const emissive =
    mode === "owner" ? "#2f5dff" : mode === "trusted" ? "#233fcc" : "#222266";

  return (
    <Sphere ref={ref} args={[1, 64, 64]}>
      <meshStandardMaterial color={color} emissive={emissive} />
    </Sphere>
  );
}

function Ring({ mode }: { mode: Mode }) {
  const ref = useRef<any>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const speed = mode === "owner" ? 0.6 : mode === "trusted" ? 0.4 : 0.2;
    if (ref.current) {
      ref.current.rotation.z = t * speed;
    }
  });

  const radius = mode === "owner" ? 1.6 : mode === "trusted" ? 1.8 : 2.0;

  return (
    <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius * 0.96, radius, 64]} />
      <meshBasicMaterial
        color="#dbe7ff"
        transparent
        opacity={mode === "guest" ? 0.3 : 0.6}
      />
    </mesh>
  );
}

export default function Orb(props: Props) {
  const { mode, latestIntent, depth, status, vision } = props;

  return (
    <div style={{ position: "relative", height: 260 }}>
      <Canvas style={{ height: "100%" }}>
        <ambientLight intensity={0.4} />
        <directionalLight intensity={0.7} position={[2, 3, 4]} />
        <OrbMesh {...props} />
        <Ring mode={mode} />
      </Canvas>

      <OrbHUD
        mode={mode}
        latestIntent={latestIntent}
        depth={depth}
        status={status}
        gaze={vision.gaze}
      />
    </div>
  );
}
