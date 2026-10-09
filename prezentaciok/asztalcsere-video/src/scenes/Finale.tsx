import { Audio } from "@remotion/media";
import type React from "react";
import { CanvasImage, interpolate, staticFile, useVideoConfig } from "remotion";
import { C, CLAMP, EASE, MONO, SIDE } from "../theme";
import {
  Mono,
  Reveal,
  Scene,
  SceneHeader,
  SceneClock,
  useSceneAt,
  useSceneFrame,
} from "../ui";

const BTN_TOP = [1100, 1224, 1348] as const;

const FinaleBody: React.FC = () => {
  const at = useSceneAt();
  const frame = useSceneFrame();
  const { fps } = useVideoConfig();
  const hover = interpolate(frame, [150, 158], [0, 1], CLAMP);
  const press = interpolate(frame, [170, 174, 180], [1, 0.96, 1], CLAMP);
  const cx = interpolate(frame, [112, 150], [1020, 600], {
    ...CLAMP,
    easing: EASE,
  });
  const cy = interpolate(frame, [112, 150], [1800, BTN_TOP[0] + 56], {
    ...CLAMP,
    easing: EASE,
  });

  const btn = (top: number, at: number, text: string, primary: boolean) => (
    <div
      style={{
        position: "absolute",
        top,
        left: SIDE,
        width: 920,
        height: 104,
        borderRadius: 52,
        display: "grid",
        placeItems: "center",
        fontSize: 44,
        fontWeight: 600,
        border: `3px solid ${primary ? C.walnut : C.ink}`,
        backgroundColor: primary ? C.walnut : "transparent",
        color: primary ? "#fff" : C.ink,
        opacity: interpolate(frame, [at, at + 10], [0, 1], CLAMP),
        translate: interpolate(frame, [at, at + 18], ["0px 30px", "0px 0px"], {
          ...CLAMP,
          easing: EASE,
        }),
        scale: primary ? (1 + 0.03 * hover) * press : 1,
        boxShadow: primary
          ? `0 0 0 ${10 * hover}px rgba(165, 98, 44, 0.22)`
          : "none",
      }}
    >
      {text}
    </div>
  );

  return (
    <Scene>
      <Audio
        name="mouse-click"
        src={staticFile("sfx/mouse-click.wav")}
        from={at(170)}
        volume={0.85}
        premountFor={fps}
      />
      <Audio
        name="thud"
        src={staticFile("audio/thud.wav")}
        from={at(176)}
        volume={0.8}
        premountFor={fps}
      />
      <Audio
        name="ding"
        src={staticFile("sfx/ding.wav")}
        from={at(196)}
        volume={0.7}
        premountFor={fps}
      />
      <SceneHeader eyebrow="Jóváhagyás" title="A döntés a tiéd." />

      <div
        style={{
          position: "absolute",
          top: 400,
          left: SIDE,
          width: 920,
          height: 494,
          opacity: interpolate(frame, [14, 30], [0, 1], CLAMP),
          translate: interpolate(frame, [14, 40], ["0px 40px", "0px 0px"], {
            ...CLAMP,
            easing: EASE,
          }),
        }}
      >
        <CanvasImage
          src={staticFile("wood/slab.png")}
          width={920}
          height={494}
          premountFor={fps}
        />
      </div>
      <div style={{ position: "absolute", top: 930, left: SIDE, right: SIDE }}>
        <Reveal at={44} dy={14}>
          <Mono size={26}>
            160 × 80 × 2,5 cm · Természetes dijoni dió (H3734) · szélezetlen
          </Mono>
        </Reveal>
      </div>

      {btn(BTN_TOP[0], 64, "Jóváhagyom", true)}
      {btn(BTN_TOP[1], 72, "Jóváhagyom, feltételekkel", false)}
      {btn(BTN_TOP[2], 80, "Visszadobom", false)}

      <div
        style={{
          position: "absolute",
          top: 560,
          left: 260,
          padding: "14px 34px",
          border: `7px solid ${C.bad}`,
          borderRadius: 14,
          color: C.bad,
          fontFamily: MONO,
          fontSize: 72,
          fontWeight: 500,
          letterSpacing: "0.04em",
          backgroundColor: "rgba(241, 242, 238, 0.82)",
          rotate: "-9deg",
          opacity: interpolate(frame, [176, 180], [0, 1], CLAMP),
          scale: interpolate(frame, [176, 186], [1.7, 1], {
            ...CLAMP,
            easing: EASE,
            output: "perceptual-scale",
          }),
        }}
      >
        JÓVÁHAGYVA?
      </div>

      <svg
        viewBox="0 0 24 24"
        style={{
          position: "absolute",
          left: cx,
          top: cy,
          width: 64,
          height: 64,
          opacity: interpolate(frame, [110, 116], [0, 1], CLAMP),
          scale: press,
        }}
      >
        <path
          d="M4 2 L4 19 L8.5 15 L11.5 21.5 L14.5 20 L11.5 13.8 L17.5 13.8 Z"
          fill={C.ink}
          stroke="#fff"
          strokeWidth={1.4}
          strokeLinejoin="round"
        />
      </svg>

      <div style={{ position: "absolute", top: 1500, left: SIDE, right: SIDE }}>
        <Reveal at={206} dy={10}>
          <span style={{ fontFamily: MONO, fontSize: 26, color: C.muted }}>
            CR-2026-0042 · a részletek az egyoldalas kérelemben
          </span>
        </Reveal>
      </div>
    </Scene>
  );
};

export const Finale: React.FC = () => (
  <SceneClock scene="finale">
    <FinaleBody />
  </SceneClock>
);
