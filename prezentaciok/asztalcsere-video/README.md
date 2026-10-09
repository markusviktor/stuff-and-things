# Asztalcsere – videó

Az [egyoldalas asztalcsere-kérelem](../asztalcsere.html) videós változata, [Remotion](https://www.remotion.dev)-nel.
Álló, 1080 × 1920, 30 fps, kb. 64 másodperc, zenével és hangeffektekkel.

## Jelenetek

| # | Fájl | Mit mutat |
|---|------|-----------|
| 1 | `src/scenes/Intro.tsx` | CR-fejléc, „Az asztalom papírból van.” |
| 2 | `src/scenes/Honeycomb.tsx` | Méhsejtes lap metszete, a szorító benyomja, 50 / 15 kg |
| 3 | `src/scenes/Surface.tsx` | Felülnézet: 2 × 27″ nem fér el 120 cm-en, 160 × 80-on igen |
| 4 | `src/scenes/Load.tsx` | Teherbírás: 15 / 50 / ~179 + 21 kg |
| 5 | `src/scenes/Height.tsx` | Oldalnézet: 72 → 120 → 113 cm, memóriagombok |
| 6 | `src/scenes/Style.tsx` | Tölgyhatás kontra szélezetlen dijoni dió |
| 7 | `src/scenes/Cost.tsx` | ≈148 Ft / munkanap, kávé és gyógytorna mellett |
| 8 | `src/scenes/FinePrint.tsx` | Apró betű |
| 9 | `src/scenes/Finale.tsx` | Jóváhagyás gombok, „JÓVÁHAGYVA?” pecsét |

A fő idővonal: `src/AsztalcsereVideo.tsx` (`TransitionSeries`, 15 frame-es átmenetekkel).
Minden jelenet külön kompozícióként is szerepel a Studio „Jelenetek” mappájában.

## Hang

- **Zene** (`public/audio/music.mp3`): saját, kódból szintetizált lo-fi alap (D-dúr, I–vi–ii–V, 90 BPM), így nincs vele jogdíj-kérdés. Újragenerálás: `python3 scripts/synth-audio.py` (numpy és ffmpeg kell hozzá).
- **Saját effektek** (`public/audio/`): asztalmotor-zúgás, hibajelző sípolás, puffanás, „womp womp”. Ugyanaz a script készíti őket.
- **Remotion effektek** (`public/sfx/`): whoosh, whip, kattintás, ding, lapozás, reccsenés, lemezkarc, a [remotion.media](https://remotion.media) gyűjteményből, helyben tárolva.

Az effektek a jelenetfájlokban, a hozzájuk tartozó animáció mellett vannak (`<Audio from={…}>`), a zene és az átmenetek hangja az `AsztalcsereVideo.tsx`-ben.

A betűk (`public/fonts`) és a diótextúra (`public/wood`, ugyanazzal a rajzolóval, mint az HTML oldal) helyben vannak, így a render nem igényel hálózatot.

## Parancsok

```console
npm i
npm run dev                                   # Remotion Studio
npx remotion render Asztalcsere out/asztalcsere.mp4 --codec=h264 --crf=20 --audio-codec=aac --audio-bitrate=192k
```

Remotion licenc: magánszemélynek és legfeljebb 3 fős csapatnak ingyenes, a részletek [itt](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).
