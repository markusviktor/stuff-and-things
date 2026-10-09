import { Audio } from "@remotion/media";
import type React from "react";
import { staticFile, useVideoConfig } from "remotion";
import { C, SIDE } from "../theme";
import { Mono, Reveal, Scene, SceneHeader } from "../ui";

const Item: React.FC<{
  readonly at: number;
  readonly children: React.ReactNode;
}> = ({ at, children }) => (
  <Reveal at={at} style={{ display: "flex", gap: 30, alignItems: "baseline" }}>
    <span
      style={{
        width: 22,
        height: 22,
        flex: "none",
        backgroundColor: C.walnut,
        borderRadius: 3,
        translate: "0px -6px",
      }}
    />
    <span style={{ fontSize: 50, lineHeight: 1.25 }}>{children}</span>
  </Reveal>
);

export const FinePrint: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <Scene>
      <Audio
        name="page-turn"
        src={staticFile("sfx/page-turn.wav")}
        from={24}
        volume={0.8}
        premountFor={fps}
      />
      <Audio
        name="page-turn"
        src={staticFile("sfx/page-turn.wav")}
        from={52}
        volume={0.8}
        premountFor={fps}
      />
      <Audio
        name="page-turn"
        src={staticFile("sfx/page-turn.wav")}
        from={80}
        volume={0.8}
        premountFor={fps}
      />
      <Audio
        name="page-turn"
        src={staticFile("sfx/page-turn.wav")}
        from={108}
        volume={0.8}
        premountFor={fps}
      />
      <SceneHeader
        eyebrow="Apró betű"
        title={
          <>
            Amit nem
            <br />
            hallgatok el
          </>
        }
      />
      <div
        style={{
          position: "absolute",
          top: 640,
          left: SIDE,
          right: SIDE,
          display: "flex",
          flexDirection: "column",
          gap: 56,
        }}
      >
        <Item at={24}>Faforgácslap dió dekorral, nem tömör dió.</Item>
        <Item at={52}>A 200 kg-ból kb. 21 kg maga a lap.</Item>
        <Item at={80}>Legalacsonyabban 72 cm. A mostani is 73.</Item>
        <Item at={108}>A szorító alá alátétlemez kerül. Pár ezer forint.</Item>
      </div>
      <div style={{ position: "absolute", top: 1560, left: SIDE, right: SIDE }}>
        <Reveal at={146}>
          <Mono size={34} color={C.accent}>
            Visszaállítási terv nincs. Ez egyirányú migráció.
          </Mono>
        </Reveal>
      </div>
    </Scene>
  );
};
