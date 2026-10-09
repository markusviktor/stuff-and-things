import narration from "./narration.json";

// Timing data written by scripts/narration.py.
export type SceneKey = keyof typeof narration.scenes;

export type NarrationClip = {
  readonly file: string;
  readonly anchor: number;
  readonly from: number;
  readonly durationInFrames: number;
  readonly text: string;
};

export type SceneNarration = {
  readonly baseDuration: number;
  readonly durationInFrames: number;
  readonly clips: readonly NarrationClip[];
};

export const NARRATION: Record<SceneKey, SceneNarration> = narration.scenes;

// Scene order on the main timeline.
export const SCENE_ORDER: readonly SceneKey[] = [
  "intro",
  "honeycomb",
  "surface",
  "load",
  "height",
  "style",
  "cost",
  "finePrint",
  "finale",
];
