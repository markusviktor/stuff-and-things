import type React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C, CLAMP, DISPLAY, EASE, MONO, SIDE, huNum } from "../theme";
import { Mono, Reveal, Scene, SceneHeader } from "../ui";

const MAX = 15000;

const Bar: React.FC<{
  readonly top: number;
  readonly name: string;
  readonly value: number;
  readonly color: string;
  readonly at: number;
  readonly inside?: boolean;
}> = ({ top, name, value, color, at, inside }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 30], [0, 1], { ...CLAMP, easing: EASE });
  const w = Math.max((value / MAX) * 920 * p, 4);
  return (
    <div style={{ position: "absolute", top, left: SIDE, width: 920 }}>
      <Reveal at={at - 6} dy={12}>
        <span style={{ fontSize: 38, fontWeight: 600 }}>{name}</span>
      </Reveal>
      <div style={{ position: "relative", height: 56, marginTop: 10, opacity: interpolate(frame, [at - 4, at], [0, 1], CLAMP) }}>
        <div style={{ position: "absolute", left: 0, top: 0, height: 56, width: w, backgroundColor: color, borderRadius: "0 8px 8px 0" }} />
        <div
          style={{
            position: "absolute",
            top: 8,
            fontFamily: MONO,
            fontSize: 36,
            fontWeight: 500,
            ...(inside ? { right: 920 - w + 20 } : { left: w + 18 }),
          }}
        >
          ~{huNum(value * p)} Ft
        </div>
      </div>
    </div>
  );
};

export const Cost: React.FC = () => {
  const frame = useCurrentFrame();
  const eq: React.CSSProperties = { fontFamily: MONO, fontSize: 46, fontWeight: 500, lineHeight: 1.5, color: C.ink2 };
  return (
    <Scene>
      <SceneHeader eyebrow="Költség" title={<>Kevesebb, mint egy kávé. Naponta.</>} />

      <div style={{ position: "absolute", top: 600, left: SIDE, right: SIDE }}>
        <Reveal at={20} dy={14}><div style={eq}>&nbsp;&nbsp;169 980 Ft</div></Reveal>
        <Reveal at={32} dy={14}><div style={eq}>÷ 5 év garancia</div></Reveal>
        <Reveal at={44} dy={14}><div style={eq}>÷ 230 munkanap</div></Reveal>
        <div style={{ height: 3, width: interpolate(frame, [56, 70], [0, 560], { ...CLAMP, easing: EASE }), backgroundColor: C.ink, margin: "14px 0 6px" }} />
        <div style={{ display: "flex", alignItems: "baseline", gap: 22, opacity: interpolate(frame, [64, 72], [0, 1], CLAMP) }}>
          <span style={{ fontFamily: DISPLAY, fontSize: 190, fontWeight: 800, letterSpacing: "-0.035em", color: C.accent, lineHeight: 1 }}>
            ≈{Math.round(interpolate(frame, [66, 100], [0, 148], { ...CLAMP, easing: EASE }))}
          </span>
          <span style={{ fontSize: 48, fontWeight: 600 }}>Ft / munkanap</span>
        </div>
      </div>

      <Bar top={1100} name="Új asztal" value={148} color={C.walnut} at={120} />
      <Bar top={1222} name="Egy kávé a sarkon" value={1000} color={C.ref} at={134} />
      <Bar top={1344} name="Egy magán gyógytorna" value={15000} color={C.ref} at={148} inside />

      <div style={{ position: "absolute", top: 1500, left: SIDE, right: SIDE }}>
        <Reveal at={184}>
          <div style={{ fontFamily: DISPLAY, fontSize: 64, fontWeight: 800, letterSpacing: "-0.02em" }}>
            Az asztal csíkja nem hiba. Ennyi.
          </div>
        </Reveal>
        <Reveal at={200} dy={10} style={{ marginTop: 18 }}>
          <Mono size={24}>Liftor Rock 149 990 Ft-tól + szélezetlen él 19 990 Ft · kávé és gyógytorna: becslés</Mono>
        </Reveal>
      </div>
    </Scene>
  );
};
