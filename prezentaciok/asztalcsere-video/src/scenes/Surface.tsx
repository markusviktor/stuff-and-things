import type React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C, CLAMP, DISPLAY, EASE, EASE_IN_OUT, MONO, SIDE } from "../theme";
import { Mono, Reveal, Scene, SceneHeader } from "../ui";

// Top-down plan in centimetres. 27" monitor with bezel ≈ 61.4 cm wide.
const MON = 61.4;

const liveEdge = (x0: number, W: number, D: number) => {
  let d = `M${x0} ${(0.5 * Math.sin(1)).toFixed(2)}`;
  for (let x = 2; x <= W; x += 2) d += ` L${x0 + x} ${(0.5 * Math.sin(x * 0.13 + 1) + 0.3 * Math.sin(x * 0.37 + 2)).toFixed(2)}`;
  for (let x = W; x >= 0; x -= 2) d += ` L${x0 + x} ${(D + 0.45 * Math.sin(x * 0.11 + 4) + 0.27 * Math.sin(x * 0.29 + 8)).toFixed(2)}`;
  return d + " Z";
};

const Station: React.FC<{ readonly c: number; readonly D: number; readonly opacity: number }> = ({ c, D, opacity }) => (
  <g opacity={opacity}>
    <rect x={c - 15.6} y={D - 41.5} width={31.2} height={21.5} rx={1.2} fill={C.objLight} stroke={C.objLine} strokeWidth={0.35} />
    <line x1={c - 14.6} y1={D - 41.2} x2={c + 14.6} y2={D - 41.2} stroke={C.objDark} strokeWidth={1.2} strokeLinecap="round" />
    <rect x={c - 12} y={D - 37} width={24} height={9} rx={0.6} fill={C.objLight} stroke={C.objLine} strokeWidth={0.35} />
    <rect x={c - 18} y={D - 18} width={36} height={12} rx={1} fill={C.objLight} stroke={C.objLine} strokeWidth={0.35} />
    <line x1={c - 16} y1={D - 15} x2={c + 16} y2={D - 15} stroke="#9d9a93" strokeWidth={0.3} />
    <line x1={c - 16} y1={D - 12} x2={c + 16} y2={D - 12} stroke="#9d9a93" strokeWidth={0.3} />
    <line x1={c - 16} y1={D - 9} x2={c + 16} y2={D - 9} stroke="#9d9a93" strokeWidth={0.3} />
    <rect x={c + 21} y={D - 17} width={6} height={10.5} rx={3} fill={C.objLight} stroke={C.objLine} strokeWidth={0.35} />
  </g>
);

const Monitor: React.FC<{ readonly c: number }> = ({ c }) => (
  <g>
    <rect x={c - 3} y={-1} width={6} height={5.5} rx={0.8} fill="#6b6760" />
    <line x1={c} y1={3} x2={c} y2={9} stroke="#6b6760" strokeWidth={1.3} strokeLinecap="round" />
    <rect x={c - MON / 2} y={9} width={MON} height={2.6} rx={0.6} fill={C.objDark} />
  </g>
);

export const Surface: React.FC = () => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [132, 176], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });
  const W = 120 + 40 * t;
  const D = 60 + 20 * t;
  const x0 = 20 - 20 * t;
  const slide = interpolate(frame, [18, 46], [0, 1], { ...CLAMP, easing: EASE });
  const bump = frame >= 46 && frame < 58 ? Math.sin(frame * 2.6) * 0.9 * (1 - (frame - 46) / 12) : 0;
  const c1 = interpolate(slide, [0, 1], [-50, x0 + W / 4]) + bump;
  const c2 = interpolate(slide, [0, 1], [210, x0 + (3 * W) / 4]) - bump;
  const a1 = c1 - MON / 2;
  const b1 = c1 + MON / 2;
  const a2 = c2 - MON / 2;
  const b2 = c2 + MON / 2;
  const clash: Array<[number, number]> = [];
  if (a1 < x0) clash.push([a1, x0]);
  if (b1 > a2) clash.push([a2, b1]);
  if (b2 > x0 + W) clash.push([x0 + W, b2]);
  const flash = interpolate(frame, [44, 48, 60], [0, 1, 0.85], CLAMP);
  const objects = interpolate(frame, [76, 94], [0, 1], CLAMP);
  const freeH = D - 43.5 - 14;
  const text = { fontSize: 44, lineHeight: 1.3 } as const;

  return (
    <Scene>
      <SceneHeader eyebrow="Kapacitástervezés" title={<>Két konfig,<br />egy asztal</>} />

      <svg viewBox="-10 -18 180 116" style={{ position: "absolute", top: 560, left: SIDE, width: 920, height: 593, overflow: "visible" }}>
        <defs>
          <pattern id="hatch" width="2.4" height="2.4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="2.4" height="2.4" fill={C.badWash} />
            <line x1="0" y1="0" x2="0" y2="2.4" stroke={C.bad} strokeWidth={0.9} />
          </pattern>
        </defs>
        <g opacity={interpolate(frame, [6, 16], [0, 1], CLAMP)}>
          <rect x={x0} y={0} width={W} height={D} rx={0.8} fill={C.matIkea} stroke={C.matIkeaEdge} strokeWidth={0.4} opacity={1 - t} />
          <path d={liveEdge(x0, W, D)} fill={C.matWalnut} stroke={C.matWalnutEdge} strokeWidth={0.5} opacity={t} />
        </g>
        {freeH >= 12 ? (
          <rect
            x={x0 + 5}
            y={14}
            width={W - 10}
            height={freeH}
            rx={1}
            fill="rgba(255,255,255,0.10)"
            stroke="rgba(255,240,220,0.85)"
            strokeWidth={0.45}
            strokeDasharray="1.6 1.2"
            opacity={interpolate(frame, [178, 192], [0, 1], CLAMP)}
          />
        ) : null}
        <Station c={x0 + W / 4} D={D} opacity={objects} />
        <Station c={x0 + (3 * W) / 4} D={D} opacity={objects} />
        <g opacity={objects}>
          <circle cx={x0 + W / 2} cy={D - 12} r={4.25} fill={C.objLight} stroke={C.objLine} strokeWidth={0.35} />
          <circle cx={x0 + W / 2} cy={D - 12} r={3.2} fill={C.coffee} />
        </g>
        <Monitor c={c1} />
        <Monitor c={c2} />
        {clash.map(([a, b]) => (
          <rect key={a} x={a} y={6.6} width={Math.max(b - a, 0.6)} height={7.4} fill="url(#hatch)" stroke={C.bad} strokeWidth={0.5} opacity={flash} />
        ))}
        <circle
          cx={(b1 + a2) / 2}
          cy={10}
          r={interpolate(frame, [46, 60], [1, 9], CLAMP)}
          fill="none"
          stroke={C.bad}
          strokeWidth={0.7}
          opacity={b1 > a2 ? interpolate(frame, [46, 60], [1, 0], CLAMP) : 0}
        />

        <g opacity={interpolate(frame, [58, 68, 122, 130], [0, 1, 1, 0], CLAMP)}>
          <path d={`M${a1} -3 L${a1} -6 L${b2} -6 L${b2} -3`} fill="none" stroke={C.bad} strokeWidth={0.5} />
          <text x={(a1 + b2) / 2} y={-9} textAnchor="middle" fontFamily={MONO} fontSize={5.2} fontWeight={500} fill={C.bad}>
            2 × 61,4 = 122,8 cm
          </text>
        </g>
        <g opacity={interpolate(frame, [62, 72], [0, 1], CLAMP)}>
          <path d={`M${x0} ${D + 3} L${x0} ${D + 6} L${x0 + W} ${D + 6} L${x0 + W} ${D + 3}`} fill="none" stroke={C.ink2} strokeWidth={0.5} />
          <text x={x0 + W / 2} y={D + 13} textAnchor="middle" fontFamily={MONO} fontSize={5.2} fontWeight={500} fill={C.ink2}>
            {Math.round(W)} × {Math.round(D)} cm
          </text>
        </g>
      </svg>

      <div style={{ position: "absolute", top: 1200, left: SIDE, right: SIDE, opacity: interpolate(frame, [70, 80, 122, 130], [0, 1, 1, 0], CLAMP) }}>
        <div style={text}>Két 27″-os monitor: 122,8 cm.</div>
        <div style={text}>Az asztal: 120 cm.</div>
        <div style={{ fontFamily: DISPLAY, fontSize: 92, fontWeight: 800, color: C.bad, marginTop: 10, letterSpacing: "-0.02em" }}>Nem fér el.</div>
      </div>

      <div style={{ position: "absolute", top: 1200, left: SIDE, right: SIDE }}>
        <Reveal at={182}>
          <div style={text}>Az új asztalon marad 37,2 cm,</div>
          <div style={text}>és egy szabad sáv a jegyzetfüzetnek.</div>
        </Reveal>
        <Reveal at={198} style={{ marginTop: 40, display: "flex", alignItems: "baseline", gap: 30 }}>
          <span style={{ fontFamily: DISPLAY, fontSize: 150, fontWeight: 800, letterSpacing: "-0.03em", color: C.accent }}>+78%</span>
          <Mono size={34} color={C.ink2}>0,72 m² → 1,28 m²</Mono>
        </Reveal>
      </div>

      <div style={{ position: "absolute", top: 1720, left: SIDE, right: SIDE }}>
        <Reveal at={70} dy={0}>
          <Mono size={24}>Felülnézet, méretarányosan · 27″-os monitorokkal számolva</Mono>
        </Reveal>
      </div>
    </Scene>
  );
};
