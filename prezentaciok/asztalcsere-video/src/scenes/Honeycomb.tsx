import type React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C, CLAMP, DISPLAY, EASE, MONO, SIDE } from "../theme";
import { Mono, Reveal, Scene, SceneHeader } from "../ui";

const label: React.SVGProps<SVGTextElement> = {
  fontFamily: MONO,
  fontSize: 11.5,
  fontWeight: 500,
  fill: C.ink2,
};

export const Honeycomb: React.FC = () => {
  const frame = useCurrentFrame();
  const clampX = interpolate(frame, [26, 50], [-120, 0], { ...CLAMP, easing: EASE });
  const armX = interpolate(frame, [58, 78], [45, 232], { ...CLAMP, easing: EASE });
  const dent = interpolate(frame, [92, 116], [0, 6], { ...CLAMP, easing: EASE });
  const shake =
    frame >= 112 && frame < 134 ? Math.sin(frame * 2.3) * 3 * (1 - (frame - 112) / 22) : 0;
  const fade = (a: number) => interpolate(frame, [a, a + 8], [0, 1], CLAMP);

  return (
    <Scene>
      <SceneHeader eyebrow="Jelenlegi állapot" title={<>Tölgyhatású.<br />A hatás elmaradt.</>} />

      <svg
        viewBox="0 0 360 250"
        style={{ position: "absolute", top: 560, left: SIDE, width: 920, height: 639, overflow: "visible" }}
      >
        <defs>
          <pattern id="honey" width="12" height="15" y="135" patternUnits="userSpaceOnUse">
            <path d="M0 0 L6 7.5 L0 15 M12 0 L6 7.5 L12 15" fill="none" stroke={C.honey} strokeWidth={1} />
          </pattern>
          <pattern id="chip" width="9" height="9" patternUnits="userSpaceOnUse">
            <rect width="9" height="9" fill={C.chip} />
            <rect x="1" y="2" width="2" height="1.4" fill={C.chipDark} />
            <rect x="5" y="6" width="2.4" height="1.2" fill={C.chipDark} />
            <rect x="6" y="1" width="1.4" height="1.4" fill={C.chipLight} />
            <rect x="2" y="6.5" width="1.2" height="1.6" fill={C.chipLight} />
          </pattern>
        </defs>

        <g transform={`translate(${shake} 0)`} opacity={fade(14)}>
          <rect x="24" y="135" width="320" height="30" fill={C.paperCore} />
          <rect x="24" y="135" width="320" height="30" fill="url(#honey)" />
          <rect x="24" y="135" width="24" height="30" fill="url(#chip)" />
          <rect x="320" y="135" width="24" height="30" fill="url(#chip)" />
          <rect x="24" y="130" width="320" height="5" fill={C.matIkea} stroke={C.matIkeaEdge} strokeWidth={1} />
          <path
            d={`M24 165 L48 165 C56 165 60 ${165 - dent} 66 ${165 - dent} C72 ${165 - dent} 76 165 84 165 L344 165 L344 170 L84 170 C76 170 72 ${170 - dent} 66 ${170 - dent} C60 ${170 - dent} 56 170 48 170 L24 170 Z`}
            fill={C.matIkea}
            stroke={C.matIkeaEdge}
            strokeWidth={1}
          />
          <path
            d="M60 156 l3 -5 l-2 -3 l3 -4 M71 155 l-2 -4 l3 -3 l-1 -4"
            fill="none"
            stroke={C.bad}
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={fade(112)}
          />
        </g>

        <g transform={`translate(${clampX + shake} 0)`} opacity={fade(24)}>
          <rect x="6" y="116" width="90" height="14" rx="2" fill={C.metal} />
          <rect x="6" y="116" width="10" height="86" rx="2" fill={C.metal} />
          <rect x="6" y="192" width="90" height="10" rx="2" fill={C.metal} />
          <rect x="63" y={173 - dent} width="6" height={19 + dent} fill={C.metal} />
          <rect x="52" y={169 - dent} width="28" height="4" rx="1" fill={C.metalDark} />
          <rect x="40" y="40" width="10" height="76" rx="2" fill={C.metal} opacity={fade(52)} />
          <line
            x1="45"
            y1="50"
            x2={armX}
            y2={50 + ((armX - 45) / 187) * 10}
            stroke={C.metal}
            strokeWidth={7}
            strokeLinecap="round"
            opacity={fade(56)}
          />
          <circle cx="140" cy="55" r="5" fill={C.metalDark} opacity={armX > 140 ? 1 : 0} />
          <rect
            x="232"
            y={interpolate(frame, [74, 92], [-40, 18], { ...CLAMP, easing: EASE })}
            width="10"
            height="86"
            rx="2"
            fill={C.ink}
            opacity={fade(74)}
          />
        </g>

        <g opacity={fade(122)}>
          <path
            d="M27 36 A19 19 0 0 1 63 36"
            fill="none"
            stroke={C.ink2}
            strokeWidth={1.8}
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={interpolate(frame, [122, 138], [1, 0], { ...CLAMP, easing: EASE })}
          />
          <path d="M58.5 32 L67.5 32 L63 40 Z" fill={C.ink2} opacity={fade(136)} />
          <text x="72" y="26" {...label}>nyomaték ≈ 24 Nm</text>
          <text x="252" y="58" {...label}>monitor</text>
          <text x="252" y="73" {...label}>~6 kg</text>
        </g>

        <g opacity={fade(116)}>
          <line x1="101" y1="181" x2="81" y2="168" stroke={C.bad} strokeWidth={1} />
          <text x="104" y="186" {...label} fill={C.bad}>csavar → papír</text>
        </g>
        <g opacity={fade(144)}>
          <line x1="322" y1="121" x2="322" y2="131" stroke={C.muted} strokeWidth={1} />
          <text x="352" y="116" textAnchor="end" {...label}>vékony héj</text>
        </g>
        <g opacity={fade(150)}>
          <line x1="250" y1="204" x2="250" y2="152" stroke={C.muted} strokeWidth={1} />
          <text x="250" y="217" textAnchor="middle" {...label}>papír méhsejt</text>
        </g>
        <g opacity={fade(156)}>
          <line x1="332" y1="228" x2="332" y2="171" stroke={C.muted} strokeWidth={1} />
          <text x="352" y="242" textAnchor="end" {...label}>forgácslap keret (csak a szélén)</text>
        </g>
      </svg>

      <div style={{ position: "absolute", top: 1290, left: SIDE, right: SIDE, display: "flex", flexDirection: "column", gap: 26 }}>
        <Reveal at={168}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 28 }}>
            <span style={{ fontFamily: DISPLAY, fontSize: 120, fontWeight: 800, letterSpacing: "-0.02em", width: 340, flex: "none", whiteSpace: "nowrap" }}>50 kg</span>
            <span style={{ fontSize: 42, color: C.ink2, lineHeight: 1.25 }}>egyenletesen elosztva</span>
          </div>
        </Reveal>
        <Reveal at={182}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 28 }}>
            <span style={{ fontFamily: DISPLAY, fontSize: 120, fontWeight: 800, letterSpacing: "-0.02em", width: 340, flex: "none", whiteSpace: "nowrap", color: C.bad }}>15 kg</span>
            <span style={{ fontSize: 42, color: C.ink2, lineHeight: 1.25 }}>kisebb felületre. Egy szorító pont ilyen.</span>
          </div>
        </Reveal>
        <Reveal at={198}>
          <Mono size={26}>Forrás: IKEA LAGKAPTEN/ALEX adatlap</Mono>
        </Reveal>
      </div>
    </Scene>
  );
};
