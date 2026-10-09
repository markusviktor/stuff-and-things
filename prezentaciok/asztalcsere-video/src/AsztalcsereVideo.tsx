import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import type React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
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
import { C, EASE, TRANSITION } from "./theme";

export const AsztalcsereVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.paper }}>
      <TransitionSeries>
        <TransitionSeries.Sequence name="Intro" durationInFrames={150} premountFor={fps}>
          <Intro />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={linearTiming({ durationInFrames: TRANSITION, easing: EASE })} />
        <TransitionSeries.Sequence name="Méhsejt" durationInFrames={240} premountFor={fps}>
          <Honeycomb />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={linearTiming({ durationInFrames: TRANSITION, easing: EASE })} />
        <TransitionSeries.Sequence name="Felület" durationInFrames={270} premountFor={fps}>
          <Surface />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={linearTiming({ durationInFrames: TRANSITION, easing: EASE })} />
        <TransitionSeries.Sequence name="Teherbírás" durationInFrames={210} premountFor={fps}>
          <Load />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={linearTiming({ durationInFrames: TRANSITION, easing: EASE })} />
        <TransitionSeries.Sequence name="Magasság" durationInFrames={240} premountFor={fps}>
          <Height />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={linearTiming({ durationInFrames: TRANSITION, easing: EASE })} />
        <TransitionSeries.Sequence name="Stílus" durationInFrames={240} premountFor={fps}>
          <Style />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={linearTiming({ durationInFrames: TRANSITION, easing: EASE })} />
        <TransitionSeries.Sequence name="Költség" durationInFrames={240} premountFor={fps}>
          <Cost />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={linearTiming({ durationInFrames: TRANSITION, easing: EASE })} />
        <TransitionSeries.Sequence name="Apró betű" durationInFrames={210} premountFor={fps}>
          <FinePrint />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: TRANSITION })} />
        <TransitionSeries.Sequence name="Jóváhagyás" durationInFrames={240} premountFor={fps}>
          <Finale />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      <Chrome />
    </AbsoluteFill>
  );
};
