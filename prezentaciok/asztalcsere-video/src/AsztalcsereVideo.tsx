import { Audio } from "@remotion/media";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import type React from "react";
import {
  AbsoluteFill,
  interpolate,
  staticFile,
  useVideoConfig,
} from "remotion";
import { NARRATION, SCENE_ORDER } from "./narration";
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
import { C, CLAMP, DUR, EASE, TRANSITION } from "./theme";

// Frame at which each scene starts on the main timeline.
const SCENE_STARTS = SCENE_ORDER.map(
  (_, i) =>
    SCENE_ORDER.slice(0, i).reduce((sum, k) => sum + DUR[k], 0) -
    i * TRANSITION,
);
const TRANSITION_STARTS = SCENE_STARTS.slice(1);

// Main-timeline frames where the voice-over speaks; the music ducks under them.
const VOICE = SCENE_ORDER.flatMap((k, i) =>
  NARRATION[k].clips.map(
    (c) =>
      [
        SCENE_STARTS[i] + c.from,
        SCENE_STARTS[i] + c.from + c.durationInFrames,
      ] as const,
  ),
);
const musicVolume = (f: number) => {
  const distance = Math.min(
    ...VOICE.map(([a, b]) => (f < a ? a - f : f > b ? f - b : 0)),
  );
  return interpolate(distance, [0, 10], [0.07, 0.17], CLAMP);
};

export const AsztalcsereVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.paper }}>
      <Audio
        name="Zene"
        src={staticFile("audio/music.mp3")}
        volume={musicVolume}
        premountFor={fps}
      />
      {TRANSITION_STARTS.map((f) => (
        <Audio
          key={f}
          name="Átmenet"
          src={staticFile("sfx/whoosh.wav")}
          from={f}
          volume={0.5}
          premountFor={fps}
        />
      ))}
      <TransitionSeries>
        <TransitionSeries.Sequence
          name="Intro"
          durationInFrames={DUR.intro}
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
          durationInFrames={DUR.honeycomb}
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
          durationInFrames={DUR.surface}
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
          durationInFrames={DUR.load}
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
          durationInFrames={DUR.height}
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
          durationInFrames={DUR.style}
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
          durationInFrames={DUR.cost}
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
          durationInFrames={DUR.finePrint}
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
          durationInFrames={DUR.finale}
          premountFor={fps}
        >
          <Finale />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      <Chrome />
    </AbsoluteFill>
  );
};
