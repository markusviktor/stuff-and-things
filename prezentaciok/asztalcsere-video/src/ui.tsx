import { Audio } from "@remotion/media";
import type React from "react";
import { createContext, useContext, useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { NARRATION, type NarrationClip, type SceneKey } from "./narration";
import { C, CLAMP, DISPLAY, EASE, MONO, SANS, SIDE } from "./theme";

// ---------------------------------------------------------------- scene clock
// Scenes were animated against fixed "design" frames. The narration may need
// more time, so each scene's clock is warped piecewise-linearly: the design
// frame a line is anchored to lands exactly when that line starts speaking.

type Clock = {
  readonly scene: SceneKey;
  readonly toDesign: (frame: number) => number;
  readonly toActual: (designFrame: number) => number;
};

const ClockContext = createContext<Clock | null>(null);

const makeClock = (scene: SceneKey): Clock => {
  const n = NARRATION[scene];
  const design = [0, ...n.clips.map((c) => c.anchor), n.baseDuration];
  const actual = [0, ...n.clips.map((c) => c.from), n.durationInFrames];
  return {
    scene,
    toDesign: (frame) => interpolate(frame, actual, design),
    toActual: (designFrame) =>
      Math.round(interpolate(designFrame, design, actual)),
  };
};

// The scene's current frame on its design timeline.
export const useSceneFrame = () => {
  const frame = useCurrentFrame();
  const clock = useContext(ClockContext);
  return clock ? clock.toDesign(frame) : frame;
};

// Converts a design frame to the real frame, for timing props such as `from`.
export const useSceneAt = () => {
  const clock = useContext(ClockContext);
  return (designFrame: number) =>
    clock ? clock.toActual(designFrame) : designFrame;
};

// The narration line with the given index in the current scene.
export const useNarrationLine = (index: number): NarrationClip => {
  const clock = useContext(ClockContext);
  if (!clock) throw new Error("useNarrationLine() needs a <SceneClock>");
  return NARRATION[clock.scene].clips[index];
};

const Caption: React.FC<{ readonly clip: NarrationClip }> = ({ clip }) => {
  const frame = useCurrentFrame();
  const end = clip.from + clip.durationInFrames;
  return (
    <div
      style={{
        position: "absolute",
        left: SIDE,
        right: SIDE,
        bottom: 128,
        display: "flex",
        opacity: interpolate(
          frame,
          [clip.from - 4, clip.from + 2, end + 2, end + 8],
          [0, 1, 1, 0],
          CLAMP,
        ),
        translate: interpolate(
          frame,
          [clip.from - 4, clip.from + 6],
          ["0px 16px", "0px 0px"],
          {
            ...CLAMP,
            easing: EASE,
          },
        ),
      }}
    >
      <div
        style={{
          maxWidth: 920,
          backgroundColor: "rgba(28, 26, 24, 0.92)",
          color: C.paper,
          fontFamily: SANS,
          fontSize: 40,
          fontWeight: 500,
          lineHeight: 1.3,
          padding: "18px 28px",
          borderRadius: 18,
        }}
      >
        {clip.text}
      </div>
    </div>
  );
};

const Narration: React.FC<{ readonly scene: SceneKey }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { clips } = NARRATION[scene];
  const active = clips.find(
    (c) => frame >= c.from - 4 && frame < c.from + c.durationInFrames + 8,
  );
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {clips.map((c) => (
        <Audio
          key={c.file}
          name={`Narráció: ${c.text}`}
          src={staticFile(c.file)}
          from={c.from}
          durationInFrames={c.durationInFrames}
          volume={1}
          premountFor={fps}
        />
      ))}
      {active ? <Caption clip={active} /> : null}
    </AbsoluteFill>
  );
};

// Wraps a scene: provides the warped clock, plays the voice-over, shows captions.
export const SceneClock: React.FC<{
  readonly scene: SceneKey;
  readonly children: React.ReactNode;
}> = ({ scene, children }) => {
  const clock = useMemo(() => makeClock(scene), [scene]);
  return (
    <ClockContext.Provider value={clock}>
      {children}
      <Narration scene={scene} />
    </ClockContext.Provider>
  );
};

// ---------------------------------------------------------------- layout

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
  const frame = useSceneFrame();
  return (
    <div
      style={{
        opacity: interpolate(frame, [at, at + 12], [0, 1], CLAMP),
        translate: interpolate(
          frame,
          [at, at + 20],
          [`0px ${dy}px`, "0px 0px"],
          {
            ...CLAMP,
            easing: EASE,
          },
        ),
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
