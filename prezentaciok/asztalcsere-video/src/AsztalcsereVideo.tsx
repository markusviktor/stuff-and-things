import { Audio } from "@remotion/media";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import type React from "react";
import { AbsoluteFill, staticFile, useVideoConfig } from "remotion";
import { Chrome } from "./Chrome";
import { Cost } from "./scenes/Cost";
import { Finale } from "./scenes/Finale";
import { FinePrint } from "./scenes/FinePrint";
import { Height } from "./scenes/Height";
import { Honeycomb } from "./scenes/Honeycomb";
import { Intro } from "./scenes/Intro";
import { Load } from "./scenes/Load";
import { Style } from "./scenes/Style";
import { Surface } from "./scenes/Surface";
import { C, DUR, EASE, TRANSITION } from "./theme";

// Frame at which each scene-to-scene transition starts on the main timeline.
const TRANSITION_STARTS = Object.values(DUR)
  .slice(0, -1)
  .map(
    (_, i, arr) =>
      arr.slice(0, i + 1).reduce((a, b) => a + b, 0) - (i + 1) * TRANSITION,
  );

export const AsztalcsereVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.paper }}>
      <Audio
        name="Zene"
        src={staticFile("audio/music.mp3")}
        volume={0.3}
        premountFor={fps}
      />
      {TRANSITION_STARTS.map((f) => (
        <Audio
          key={f}
          name="Átmenet"
          src={staticFile("sfx/whoosh.wav")}
          from={f}
          volume={0.22}
          premountFor={fps}
        />
      ))}
      <TransitionSeries>
        <TransitionSeries.Sequence
          name="Intro"
          durationInFrames={150}
          premountFor={fps}
        >
          <Intro />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: TRANSITION, easing: EASE })}
        />
        <TransitionSeries.Sequence
          name="Méhsejt"
          durationInFrames={240}
          premountFor={fps}
        >
          <Honeycomb />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: TRANSITION, easing: EASE })}
        />
        <TransitionSeries.Sequence
          name="Felület"
          durationInFrames={270}
          premountFor={fps}
        >
          <Surface />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: TRANSITION, easing: EASE })}
        />
        <TransitionSeries.Sequence
          name="Teherbírás"
          durationInFrames={210}
          premountFor={fps}
        >
          <Load />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: TRANSITION, easing: EASE })}
        />
        <TransitionSeries.Sequence
          name="Magasság"
          durationInFrames={240}
          premountFor={fps}
        >
          <Height />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: TRANSITION, easing: EASE })}
        />
        <TransitionSeries.Sequence
          name="Stílus"
          durationInFrames={240}
          premountFor={fps}
        >
          <Style />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: TRANSITION, easing: EASE })}
        />
        <TransitionSeries.Sequence
          name="Költség"
          durationInFrames={240}
          premountFor={fps}
        >
          <Cost />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: TRANSITION, easing: EASE })}
        />
        <TransitionSeries.Sequence
          name="Apró betű"
          durationInFrames={210}
          premountFor={fps}
        >
          <FinePrint />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />
        <TransitionSeries.Sequence
          name="Jóváhagyás"
          durationInFrames={240}
          premountFor={fps}
        >
          <Finale />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      <Chrome />
    </AbsoluteFill>
  );
};
