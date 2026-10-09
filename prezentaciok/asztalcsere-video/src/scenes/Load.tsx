import { Audio } from "@remotion/media";
import type React from "react";
import {
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, CLAMP, EASE, MONO, SIDE } from "../theme";
import { Mono, Reveal, Scene, SceneHeader } from "../ui";

const K = 920 / 230; // px per kg
const TICKS = [0, 50, 100, 150, 200];

const Row: React.FC<{
  readonly top: number;
  readonly name: string;
  readonly sub: string;
  readonly value: number;
  readonly color: string;
  readonly grow: readonly [number, number];
  readonly extra?: number;
  readonly extraGrow?: readonly [number, number];
}> = ({
  top,
  name,
  sub,
  value,
  color,
  grow,
  extra = 0,
  extraGrow = [0, 1],
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, grow, [0, 1], { ...CLAMP, easing: EASE });
  const q = extra
    ? interpolate(frame, extraGrow, [0, 1], { ...CLAMP, easing: EASE })
    : 0;
  const w = value * K * p;
  const ew = extra * K * q;
  return (
    <div style={{ position: "absolute", top, left: SIDE, width: 920 }}>
      <Reveal
        at={grow[0] - 6}
        dy={14}
        style={{ position: "relative", zIndex: 3 }}
      >
        <span style={{ backgroundColor: C.paper, paddingRight: 12 }}>
          <span style={{ fontSize: 40, fontWeight: 600 }}>{name}</span>
          <span style={{ fontSize: 34, color: C.ink2, marginLeft: 16 }}>
            {sub}
          </span>
        </span>
      </Reveal>
      <div style={{ position: "relative", height: 64, marginTop: 14 }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: 64,
            width: Math.max(w, 2),
            backgroundColor: color,
            borderRadius: "0 8px 8px 0",
            zIndex: 1,
          }}
        />
        {extra ? (
          <div
            style={{
              position: "absolute",
              left: w + 4,
              top: 0,
              height: 64,
              width: Math.max(ew - 4, 0),
              borderRadius: "0 8px 8px 0",
              background: `repeating-linear-gradient(135deg, ${C.walnut} 0 4px, transparent 4px 12px)`,
              boxShadow: `inset 0 0 0 2px ${C.walnut}`,
              zIndex: 1,
            }}
          />
        ) : null}
        <div
          style={{
            position: "absolute",
            left: 25 * K - 2,
            top: -12,
            height: 88,
            width: 4,
            backgroundColor: C.ink,
            zIndex: 2,
            opacity: interpolate(frame, [124, 134], [0, 1], CLAMP),
          }}
        />
        <div
          style={{
            position: "absolute",
            left: w + ew + 18,
            top: 10,
            fontFamily: MONO,
            fontSize: 40,
            fontWeight: 500,
            opacity: p > 0.02 ? 1 : 0,
            zIndex: 3,
            backgroundColor: C.paper,
            padding: "0 6px",
          }}
        >
          {Math.round(value * p + extra * q)}
        </div>
      </div>
    </div>
  );
};

export const Load: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <Scene>
      <Audio
        name="switch"
        src={staticFile("sfx/switch.wav")}
        from={20}
        volume={0.75}
        premountFor={fps}
      />
      <Audio
        name="switch"
        src={staticFile("sfx/switch.wav")}
        from={34}
        volume={0.75}
        premountFor={fps}
      />
      <Audio
        name="switch"
        src={staticFile("sfx/switch.wav")}
        from={54}
        volume={0.75}
        premountFor={fps}
      />
      <Audio
        name="mouse-click"
        src={staticFile("sfx/mouse-click.wav")}
        from={124}
        volume={0.85}
        premountFor={fps}
      />
      <SceneHeader eyebrow="Hatáselemzés" title="3,5× teherbírás" />

      {TICKS.map((t) => (
        <div
          key={t}
          style={{
            position: "absolute",
            left: SIDE + t * K,
            top: 600,
            height: 580,
            width: 2,
            backgroundColor: t === 0 ? C.line2 : C.line,
          }}
        />
      ))}
      {TICKS.map((t) => (
        <div
          key={`l${t}`}
          style={{
            position: "absolute",
            left: SIDE + t * K,
            top: 1196,
            translate: t === 0 ? "0px 0px" : "-50% 0px",
          }}
        >
          <Mono size={26}>{t}</Mono>
        </div>
      ))}
      <div style={{ position: "absolute", left: SIDE + 920 - 40, top: 1196 }}>
        <Mono size={26}>kg</Mono>
      </div>

      <Row
        top={620}
        name="Most"
        sub="kisebb felületre"
        value={15}
        color={C.ikea}
        grow={[20, 44]}
      />
      <Row
        top={840}
        name="Most"
        sub="egyenletesen"
        value={50}
        color={C.ikea}
        grow={[34, 60]}
      />
      <Row
        top={1060}
        name="Liftor Rock"
        sub="~179 + 21 kg a lap"
        value={179}
        color={C.walnut}
        grow={[54, 100]}
        extra={21}
        extraGrow={[100, 116]}
      />

      <div
        style={{
          position: "absolute",
          left: SIDE + 25 * K - 2,
          top: 556,
          opacity: interpolate(frame, [124, 134], [0, 1], CLAMP),
        }}
      >
        <Mono size={28} color={C.ink}>
          ami ma rajta van: ~25 kg
        </Mono>
      </div>

      <div
        style={{
          position: "absolute",
          top: 1320,
          left: SIDE,
          right: SIDE,
          display: "flex",
          flexDirection: "column",
          gap: 34,
          fontSize: 42,
          lineHeight: 1.3,
        }}
      >
        <Reveal at={142}>
          <span style={{ color: C.ink2 }}>
            Ma rajta: 2 monitor, 2 kar, 2 laptop és a perifériák. Kb. 25 kg,
            becslés.
          </span>
        </Reveal>
        <Reveal at={164}>A mérleg a fürdőszobában van, és ott is marad.</Reveal>
      </div>
    </Scene>
  );
};
