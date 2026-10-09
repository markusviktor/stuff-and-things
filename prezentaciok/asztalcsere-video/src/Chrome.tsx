import type React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, CLAMP, DUR, MONO, SIDE } from "./theme";

// Persistent ticket strip and progress bar, drawn above the scenes.
export const Chrome: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: 96,
          left: SIDE,
          right: SIDE,
          paddingBottom: 18,
          borderBottom: `2px solid ${C.line2}`,
          display: "flex",
          justifyContent: "space-between",
          fontFamily: MONO,
          fontSize: 26,
          fontWeight: 500,
          opacity: interpolate(frame, [DUR.intro - 20, DUR.intro], [0, 1], CLAMP),
        }}
      >
        <span style={{ color: C.ink }}>CR-2026-0042</span>
        <span style={{ color: C.muted, letterSpacing: "0.08em" }}>ASZTALCSERE · JÓVÁHAGYÓ: TE</span>
      </div>
      <div style={{ position: "absolute", left: SIDE, right: SIDE, bottom: 90, height: 6, borderRadius: 3, backgroundColor: C.line }}>
        <div
          style={{
            height: 6,
            borderRadius: 3,
            backgroundColor: C.walnut,
            width: `${interpolate(frame, [0, durationInFrames - 1], [0, 100], CLAMP)}%`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
