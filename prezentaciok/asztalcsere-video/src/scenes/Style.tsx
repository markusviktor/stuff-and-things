import type React from "react";
import { CanvasImage, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, CLAMP, DISPLAY, EASE, SIDE } from "../theme";
import { Mono, Reveal, Scene, SceneHeader } from "../ui";

export const Style: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <Scene>
      <SceneHeader eyebrow="UX / stílus" title={<>És végre lenne<br />stílusa</>} />

      <div style={{ position: "absolute", top: 540, left: SIDE, width: 920, opacity: interpolate(frame, [86, 104], [1, 0.45], CLAMP) }}>
        <Reveal at={14} dy={20}>
          <Mono size={28}>MOST · FEHÉRRE PÁCOLT TÖLGYHATÁS</Mono>
          <div
            style={{
              marginTop: 16,
              height: 260,
              borderRadius: 4,
              border: `2px solid ${C.matIkeaEdge}`,
              background: `repeating-linear-gradient(1deg, ${C.grainIkea} 0 2px, transparent 2px 14px), repeating-linear-gradient(179.4deg, ${C.grainIkea} 0 1px, transparent 1px 34px), ${C.matIkea}`,
            }}
          />
        </Reveal>
        <div style={{ marginTop: 22, fontSize: 44, lineHeight: 1.3, display: "flex", flexWrap: "wrap", gap: "0 16px" }}>
          <Reveal at={34} dy={14}>A tölgy hatására készült.</Reveal>
          <Reveal at={56} dy={14}>
            <span style={{ color: C.bad, fontWeight: 600 }}>A hatás elmaradt.</span>
          </Reveal>
        </div>
      </div>

      <div style={{ position: "absolute", top: 1060, left: SIDE, width: 920 }}>
        <Reveal at={82} dy={20}>
          <Mono size={28}>ÚJ · TERMÉSZETES DIJONI DIÓ, SZÉLEZETLEN</Mono>
        </Reveal>
        <div
          style={{
            marginTop: 16,
            width: 920,
            height: 343,
            clipPath: `inset(0 ${interpolate(frame, [88, 124], [100, 0], { ...CLAMP, easing: EASE })}% 0 0)`,
          }}
        >
          <CanvasImage src={staticFile("wood/swatch.png")} width={920} height={343} premountFor={fps} />
        </div>
      </div>

      <div style={{ position: "absolute", top: 1500, left: SIDE, right: SIDE }}>
        <Reveal at={140}>
          <div style={{ fontFamily: DISPLAY, fontSize: 84, fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 1 }}>
            Bútor. Nem irodaszer.
          </div>
        </Reveal>
        <Reveal at={166} style={{ marginTop: 26 }}>
          <div style={{ fontSize: 40, lineHeight: 1.3, color: C.ink2 }}>
            A Liftor ingyen küld dekormintát. Előbb kézbe vesszük, utána döntünk.
          </div>
        </Reveal>
      </div>
    </Scene>
  );
};
