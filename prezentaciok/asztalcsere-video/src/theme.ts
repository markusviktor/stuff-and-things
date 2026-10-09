import { Easing } from "remotion";
import { NARRATION } from "./narration";

// Same palette as the one-pager (prezentaciok/asztalcsere.html), light theme only.
export const C = {
  paper: "#f1f2ee",
  card: "#fbfbf9",
  ink: "#1c1a18",
  ink2: "#56524c",
  muted: "#6f6a62",
  line: "#dcdcd5",
  line2: "#c4c3ba",
  accent: "#6e4527",
  walnut: "#a5622c",
  ikea: "#4f7fb8",
  ref: "#b3b0a7",
  bad: "#b8352c",
  badWash: "rgba(184, 53, 44, 0.16)",
  good: "#2d7a33",
  zone: "rgba(165, 98, 44, 0.18)",
  matIkea: "#e8e3da",
  matIkeaEdge: "#b8b1a3",
  matWalnut: "#8b5e3c",
  matWalnutEdge: "#4a2e1a",
  paperCore: "#eadcc0",
  honey: "#b49c74",
  chip: "#c9a77e",
  chipDark: "#9c7a52",
  chipLight: "#e2c8a2",
  metal: "#5f5c57",
  metalDark: "#3e3b37",
  objDark: "#1f1d1a",
  objLight: "#ecebe7",
  objLine: "#2a2723",
  coffee: "#4a2c17",
  grainIkea: "rgba(140, 118, 84, 0.22)",
} as const;

export const DISPLAY = '"Bricolage Grotesque", "Avenir Next", sans-serif';
export const SANS = '"IBM Plex Sans", "Segoe UI", sans-serif';
export const MONO = '"IBM Plex Mono", "DejaVu Sans Mono", monospace';

export const SIDE = 80;
export const CONTENT_W = 1080 - 2 * SIDE;

export const EASE = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);
export const CLAMP = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

// Scene lengths in frames at 30 fps, sized to the narration (scripts/narration.py).
// Transitions overlap 15 frames each.
export const DUR = {
  intro: NARRATION.intro.durationInFrames,
  honeycomb: NARRATION.honeycomb.durationInFrames,
  surface: NARRATION.surface.durationInFrames,
  load: NARRATION.load.durationInFrames,
  height: NARRATION.height.durationInFrames,
  style: NARRATION.style.durationInFrames,
  cost: NARRATION.cost.durationInFrames,
  finePrint: NARRATION.finePrint.durationInFrames,
  finale: NARRATION.finale.durationInFrames,
} as const;
export const TRANSITION = 15;
export const TOTAL =
  Object.values(DUR).reduce((a, b) => a + b, 0) -
  (Object.keys(DUR).length - 1) * TRANSITION;

export const huNum = (n: number) =>
  Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
