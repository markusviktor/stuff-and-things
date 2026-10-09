import type React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, CLAMP, DISPLAY, EASE, MONO, SANS, SIDE } from "./theme";

export const Scene: React.FC<{ readonly children: React.ReactNode }> = ({
  children,
}) => (
  <AbsoluteFill
    style={{
      backgroundColor: C.paper,
      color: C.ink,
      fontFamily: SANS,
    }}
  >
    {children}
  </AbsoluteFill>
);

// Fades and lifts its children in, starting at frame `at` of the scene.
export const Reveal: React.FC<{
  readonly at: number;
  readonly dy?: number;
  readonly style?: React.CSSProperties;
  readonly children: React.ReactNode;
}> = ({ at, dy = 36, style, children }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        opacity: interpolate(frame, [at, at + 12], [0, 1], CLAMP),
        translate: interpolate(frame, [at, at + 20], [`0px ${dy}px`, "0px 0px"], {
          ...CLAMP,
          easing: EASE,
        }),
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const SceneHeader: React.FC<{
  readonly eyebrow: string;
  readonly title: React.ReactNode;
  readonly size?: number;
}> = ({ eyebrow, title, size = 104 }) => (
  <div style={{ position: "absolute", top: 210, left: SIDE, right: SIDE }}>
    <Reveal at={0} dy={20}>
      <div
        style={{
          fontFamily: MONO,
          fontSize: 30,
          fontWeight: 500,
          letterSpacing: "0.09em",
          textTransform: "uppercase",
          color: C.accent,
        }}
      >
        {eyebrow}
      </div>
    </Reveal>
    <Reveal at={5}>
      <div
        style={{
          marginTop: 18,
          fontFamily: DISPLAY,
          fontSize: size,
          fontWeight: 800,
          lineHeight: 1.0,
          letterSpacing: "-0.025em",
          textWrap: "balance",
        }}
      >
        {title}
      </div>
    </Reveal>
  </div>
);

export const Mono: React.FC<{
  readonly size?: number;
  readonly color?: string;
  readonly children: React.ReactNode;
  readonly style?: React.CSSProperties;
}> = ({ size = 28, color = C.muted, children, style }) => (
  <span
    style={{
      fontFamily: MONO,
      fontSize: size,
      color,
      fontWeight: 500,
      ...style,
    }}
  >
    {children}
  </span>
);
