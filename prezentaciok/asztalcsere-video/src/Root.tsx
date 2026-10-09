import "./fonts";
import { Composition, Folder } from "remotion";
import { AsztalcsereVideo } from "./AsztalcsereVideo";
import { Cost } from "./scenes/Cost";
import { Finale } from "./scenes/Finale";
import { FinePrint } from "./scenes/FinePrint";
import { Height } from "./scenes/Height";
import { Honeycomb } from "./scenes/Honeycomb";
import { Intro } from "./scenes/Intro";
import { Load } from "./scenes/Load";
import { Style } from "./scenes/Style";
import { Surface } from "./scenes/Surface";
import { DUR, TOTAL } from "./theme";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Jelenetek">
        <Composition
          id="Intro"
          component={Intro}
          width={1080}
          height={1920}
          fps={30}
          durationInFrames={DUR.intro}
        />
        <Composition
          id="Mehsejt"
          component={Honeycomb}
          width={1080}
          height={1920}
          fps={30}
          durationInFrames={DUR.honeycomb}
        />
        <Composition
          id="Felulet"
          component={Surface}
          width={1080}
          height={1920}
          fps={30}
          durationInFrames={DUR.surface}
        />
        <Composition
          id="Teherbiras"
          component={Load}
          width={1080}
          height={1920}
          fps={30}
          durationInFrames={DUR.load}
        />
        <Composition
          id="Magassag"
          component={Height}
          width={1080}
          height={1920}
          fps={30}
          durationInFrames={DUR.height}
        />
        <Composition
          id="Stilus"
          component={Style}
          width={1080}
          height={1920}
          fps={30}
          durationInFrames={DUR.style}
        />
        <Composition
          id="Koltseg"
          component={Cost}
          width={1080}
          height={1920}
          fps={30}
          durationInFrames={DUR.cost}
        />
        <Composition
          id="AproBetu"
          component={FinePrint}
          width={1080}
          height={1920}
          fps={30}
          durationInFrames={DUR.finePrint}
        />
        <Composition
          id="Jovahagyas"
          component={Finale}
          width={1080}
          height={1920}
          fps={30}
          durationInFrames={DUR.finale}
        />
      </Folder>
      <Composition
        id="Asztalcsere"
        component={AsztalcsereVideo}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={TOTAL}
      />
    </>
  );
};
