import type React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C, CLAMP, DISPLAY, EASE, MONO, SIDE } from "../theme";
import { Reveal, Scene } from "../ui";

const FIELDS: ReadonlyArray<readonly [string, string]> = [
  ["Változáskérelem", "CR-2026-0042"],
  ["Tárgy", "asztalcsere"],
  ["Kérelmező", "a férjed"],
  ["Jóváhagyó", "te, vétójoggal"],
  ["Prioritás", "magas (a hátam szerint)"],
  ["Nézési idő", "kb. 1 perc"],
];

const WAVE =
  "M0 10 " +
  Array.from({ length: 16 }, (_, i) => `Q ${i * 12.5 + 6.25} ${i % 2 ? 18 : 2} ${(i + 1) * 12.5} 10`).join(" ");

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const headline: React.CSSProperties = {
    fontFamily: DISPLAY,
    fontSize: 150,
    fontWeight: 800,
    lineHeight: 0.98,
    letterSpacing: "-0.03em",
  };

  return (
    <Scene>
      <div
        style={{
          position: "absolute",
          top: 110,
          left: SIDE,
          right: SIDE,
          borderTop: `2px solid ${C.line2}`,
          borderBottom: `2px solid ${C.line2}`,
          padding: "30px 0",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "28px 40px",
        }}
      >
        {FIELDS.map(([k, v], i) => (
          <Reveal key={k} at={4 + i * 5} dy={16}>
            <div
              style={{
                fontFamily: MONO,
                fontSize: 23,
                letterSpacing: "0.09em",
                textTransform: "uppercase",
                color: C.muted,
              }}
            >
              {k}
            </div>
            <div style={{ fontFamily: MONO, fontSize: 34, fontWeight: 500, marginTop: 4 }}>
              {v}
            </div>
          </Reveal>
        ))}
      </div>

      <div style={{ position: "absolute", top: 640, left: SIDE, right: SIDE }}>
        <Reveal at={36} dy={60}>
          <div style={headline}>Az asztalom</div>
        </Reveal>
        <Reveal at={42} dy={60}>
          <div style={headline}>
            <span style={{ position: "relative", display: "inline-block" }}>
              papírból
              <svg
                viewBox="0 0 200 20"
                preserveAspectRatio="none"
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: -34,
                  width: "100%",
                  height: 30,
                  clipPath: `inset(0 ${interpolate(frame, [56, 80], [100, 0], { ...CLAMP, easing: EASE })}% 0 0)`,
                }}
              >
                <path d={WAVE} fill="none" stroke={C.bad} strokeWidth={7} vectorEffect="non-scaling-stroke" />
              </svg>
            </span>
          </div>
        </Reveal>
        <Reveal at={48} dy={60}>
          <div style={headline}>van.</div>
        </Reveal>
        <div
          style={{
            marginTop: 40,
            display: "inline-flex",
            alignItems: "center",
            gap: 18,
            backgroundColor: C.ink,
            color: C.paper,
            fontFamily: MONO,
            fontSize: 29,
            padding: "18px 26px",
            borderRadius: 10,
            opacity: interpolate(frame, [84, 92], [0, 1], CLAMP),
            scale: interpolate(frame, [84, 96], [0.9, 1], { ...CLAMP, easing: EASE, output: "perceptual-scale" }),
            transformOrigin: "left center",
          }}
        >
          <span style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: C.bad, flex: "none" }} />
          lint: a papír nem teherhordó anyag
        </div>
      </div>

      <div style={{ position: "absolute", top: 1440, left: SIDE, right: SIDE, fontSize: 46, lineHeight: 1.35, color: C.ink2 }}>
        <Reveal at={104}>
          Változáskérelem a mostani asztal cseréjére. Számokkal, ábrákkal, kb. egy percben.
        </Reveal>
      </div>
    </Scene>
  );
};
