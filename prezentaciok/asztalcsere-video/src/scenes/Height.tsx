import { Audio } from "@remotion/media";
import type React from "react";
import {
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, CLAMP, DISPLAY, EASE, EASE_IN_OUT, MONO, SIDE } from "../theme";
import { Mono, Reveal, Scene, SceneHeader } from "../ui";

const G = 1480; // floor line, px
const K = 6; // px per cm
const y = (cm: number) => G - cm * K;
// Ideal heights for a 180 cm person: seated ≈ 40.5 %, standing ≈ 62.5 % of body height.
const SIT = 73;
const STAND = 113;

const Band: React.FC<{
  readonly cm: number;
  readonly text: string;
  readonly at: number;
  readonly tick?: React.ReactNode;
}> = ({ cm, text, at, tick }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ opacity: interpolate(frame, [at, at + 10], [0, 1], CLAMP) }}>
      <div
        style={{
          position: "absolute",
          left: 150,
          right: SIDE,
          top: y(cm + 2),
          height: 4 * K,
          backgroundColor: C.zone,
          borderTop: `2px solid ${C.walnut}`,
          borderBottom: `2px solid ${C.walnut}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 182,
          top: y(cm + 2) - 40,
          display: "flex",
          gap: 16,
          alignItems: "baseline",
        }}
      >
        <Mono size={26} color={C.ink2}>
          {text}
        </Mono>
        {tick}
      </div>
    </div>
  );
};

export const Height: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const h =
    frame < 156
      ? interpolate(frame, [50, 150], [72, 120], {
          ...CLAMP,
          easing: EASE_IN_OUT,
        })
      : interpolate(frame, [158, 182], [120, STAND], {
          ...CLAMP,
          easing: EASE,
        });
  const top = y(h);
  const key2 = interpolate(frame, [154, 160], [0, 1], CLAMP);

  return (
    <Scene>
      <Audio
        name="motor"
        src={staticFile("audio/motor.wav")}
        from={50}
        durationInFrames={100}
        volume={0.45}
        premountFor={fps}
      />
      <Audio
        name="error"
        src={staticFile("audio/error.wav")}
        from={96}
        volume={0.3}
        premountFor={fps}
      />
      <Audio
        name="mouse-click"
        src={staticFile("sfx/mouse-click.wav")}
        from={154}
        volume={0.6}
        premountFor={fps}
      />
      <Audio
        name="motor"
        src={staticFile("audio/motor.wav")}
        from={158}
        durationInFrames={24}
        volume={0.45}
        premountFor={fps}
      />
      <Audio
        name="ding"
        src={staticFile("sfx/ding.wav")}
        from={182}
        volume={0.4}
        premountFor={fps}
      />
      <SceneHeader
        eyebrow="Hatáselemzés"
        title={
          <>
            72–120 cm,
            <br />
            gombnyomásra
          </>
        }
      />

      <div style={{ position: "absolute", left: SIDE, top: 520 }}>
        <Reveal at={20} dy={20}>
          <div
            style={{
              fontFamily: DISPLAY,
              fontSize: 140,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1,
            }}
          >
            {h.toFixed(0)}{" "}
            <span style={{ fontSize: 64, color: C.ink2 }}>cm</span>
          </div>
        </Reveal>
      </div>

      {/* Ruler */}
      <div style={{ opacity: interpolate(frame, [10, 20], [0, 1], CLAMP) }}>
        <div
          style={{
            position: "absolute",
            left: 150,
            top: y(125),
            height: 125 * K,
            width: 3,
            backgroundColor: C.line2,
          }}
        />
        {Array.from({ length: 13 }, (_, i) => i * 10).map((cm) => (
          <div
            key={cm}
            style={{
              position: "absolute",
              left: 150,
              top: y(cm) - 1,
              width: cm % 20 === 0 ? 22 : 12,
              height: 2,
              backgroundColor: C.line2,
            }}
          />
        ))}
        {[0, 20, 40, 60, 80, 100, 120].map((cm) => (
          <div
            key={`l${cm}`}
            style={{ position: "absolute", right: 1080 - 136, top: y(cm) - 17 }}
          >
            <Mono size={26}>{cm}</Mono>
          </div>
        ))}
      </div>

      <Band cm={SIT} text="ülve ~73 cm" at={26} />
      <Band
        cm={STAND}
        text="állva ~113 cm"
        at={34}
        tick={
          <span
            style={{
              fontFamily: MONO,
              fontSize: 30,
              fontWeight: 500,
              color: C.good,
              opacity: interpolate(frame, [182, 190], [0, 1], CLAMP),
            }}
          >
            ✓ Rock
          </span>
        }
      />

      {/* Floor */}
      <div
        style={{
          position: "absolute",
          left: 150,
          right: SIDE,
          top: G,
          height: 3,
          backgroundColor: C.ink,
        }}
      />

      {/* Current IKEA desk, fixed at 73 cm */}
      <div style={{ opacity: interpolate(frame, [12, 24], [0, 1], CLAMP) }}>
        <div
          style={{
            position: "absolute",
            left: 200,
            width: 260,
            top: y(73),
            height: 22,
            backgroundColor: C.matIkea,
            border: `2px solid ${C.matIkeaEdge}`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 214,
            width: 16,
            top: y(73) + 22,
            height: 73 * K - 22,
            backgroundColor: C.matIkea,
            border: `2px solid ${C.matIkeaEdge}`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 368,
            width: 92,
            top: y(73) + 22,
            height: 73 * K - 22,
            backgroundColor: C.matIkea,
            border: `2px solid ${C.matIkeaEdge}`,
          }}
        />
        {[0.25, 0.5, 0.75].map((f) => (
          <div
            key={f}
            style={{
              position: "absolute",
              left: 368,
              width: 92,
              top: y(73) + 22 + (73 * K - 22) * f,
              height: 2,
              backgroundColor: C.matIkeaEdge,
            }}
          />
        ))}
      </div>

      {/* Liftor Rock */}
      <div style={{ opacity: interpolate(frame, [18, 30], [0, 1], CLAMP) }}>
        {[610, 930].map((cx) => (
          <div key={cx}>
            <div
              style={{
                position: "absolute",
                left: cx - 65,
                width: 130,
                top: G - 14,
                height: 14,
                borderRadius: 4,
                backgroundColor: C.objDark,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: cx - 15,
                width: 30,
                top: top + 33,
                height: G - 330 - (top + 33) + 20,
                backgroundColor: "#34312d",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: cx - 20,
                width: 40,
                top: G - 344,
                height: 330,
                borderRadius: 3,
                backgroundColor: C.objDark,
              }}
            />
          </div>
        ))}
        <div
          style={{
            position: "absolute",
            left: 590,
            width: 360,
            top: top + 15,
            height: 18,
            backgroundColor: C.objDark,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 540,
            width: 460,
            top,
            height: 15,
            backgroundColor: C.matWalnut,
            borderBottom: `3px solid ${C.matWalnutEdge}`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 600,
            width: 140,
            top: top - 8,
            height: 8,
            borderRadius: 2,
            backgroundColor: C.objLight,
            border: `2px solid ${C.objLine}`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 734,
            width: 6,
            top: top - 112,
            height: 108,
            backgroundColor: C.objLine,
            rotate: "16deg",
            transformOrigin: "bottom center",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 924,
            width: 12,
            top: top - 150,
            height: 150,
            backgroundColor: C.metal,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 850,
            width: 86,
            top: top - 150,
            height: 10,
            backgroundColor: C.metal,
            rotate: "-6deg",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 836,
            width: 16,
            top: top - 260,
            height: 180,
            borderRadius: 3,
            backgroundColor: C.objDark,
          }}
        />
      </div>

      {/* Labels under the floor */}
      <div style={{ position: "absolute", left: 200, top: G + 22, width: 300 }}>
        <Reveal at={24} dy={10}>
          <div style={{ fontSize: 34, fontWeight: 600 }}>Most</div>
          <Mono size={26}>fix 73 cm</Mono>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 26,
              fontWeight: 500,
              color: C.bad,
              marginTop: 4,
              opacity: interpolate(frame, [96, 104], [0, 1], CLAMP),
            }}
          >
            ✕ állva nem megy
          </div>
        </Reveal>
      </div>
      <div style={{ position: "absolute", left: 540, top: G + 22, width: 460 }}>
        <Reveal at={30} dy={10}>
          <div style={{ fontSize: 34, fontWeight: 600 }}>Liftor Rock</div>
          <Mono size={26}>72–120 cm · 20 mm/s · 49 dB</Mono>
        </Reveal>
      </div>

      {/* Memory keypad */}
      <div
        style={{
          position: "absolute",
          left: SIDE,
          right: SIDE,
          top: 1660,
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <Reveal at={140} dy={16} style={{ display: "flex", gap: 14 }}>
          {["▲", "▼", "1", "2", "3"].map((k) => (
            <div
              key={k}
              style={{
                width: 84,
                height: 84,
                borderRadius: 14,
                border: `2px solid ${C.ink}`,
                display: "grid",
                placeItems: "center",
                fontFamily: MONO,
                fontSize: 38,
                fontWeight: 500,
                backgroundColor:
                  k === "2" ? `rgba(165, 98, 44, ${key2})` : "transparent",
                color: k === "2" && key2 > 0.5 ? "#fff" : C.ink,
              }}
            >
              {k}
            </div>
          ))}
        </Reveal>
        <Reveal
          at={176}
          dy={10}
          style={{ marginLeft: 18, fontSize: 34, lineHeight: 1.25 }}
        >
          2 = én állva
          <br />
          <span style={{ color: C.accent, fontWeight: 600 }}>3 = a tiéd</span>
        </Reveal>
      </div>
    </Scene>
  );
};
