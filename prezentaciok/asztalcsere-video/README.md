# Asztalcsere – videó

Az [egyoldalas asztalcsere-kérelem](../asztalcsere.html) videós változata, [Remotion](https://www.remotion.dev)-nel.
Álló, 1080 × 1920, 30 fps, kb. 87 másodperc, magyar narrációval és felirattal, zenével, hangeffektekkel.

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

## Narráció

- A szöveg a `scripts/narration.py`-ban van, jelenetenként mondatokra bontva. Minden mondat ahhoz a képkockához van kötve, ahol a hozzá tartozó animáció indul.
- A hang a [Piper](https://github.com/rhasspy/piper) helyben futó felolvasója, a CC0 licencű magyar „imre” hanggal. A felolvasott szöveg a számokat betűvel írja, és ahol a gép félreejtene, kiejtés szerint (pl. „dizsoni”). A felirat a rendes helyesírást mutatja.
- A script legyártja a `public/voice/*.wav` klipeket és az `src/narration.json` időzítést. A jelenetek hossza ebből jön (`DUR` a `theme.ts`-ben).
- A `SceneClock` (`src/ui.tsx`) jelenetenként szakaszonként lineárisan nyújtja az animáció idejét, így minden mondat pontosan akkor szólal meg, amikor a hozzá tartozó kép megjelenik. Ugyanez a komponens játssza le a klipeket és rajzolja a feliratot.
- A zene beszéd alatt lehalkul (ducking, `AsztalcsereVideo.tsx`).

Újragenerálás:

```console
pip install piper-tts
curl -LO https://huggingface.co/rhasspy/piper-voices/resolve/main/hu/hu_HU/imre/medium/hu_HU-imre-medium.onnx
curl -LO https://huggingface.co/rhasspy/piper-voices/resolve/main/hu/hu_HU/imre/medium/hu_HU-imre-medium.onnx.json
PIPER_MODEL=hu_HU-imre-medium.onnx python3 scripts/narration.py
```

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
# hangerő telefonra (kb. -16 LUFS), limiterrel; a videósáv érintetlen
ffmpeg -i out/asztalcsere.mp4 -c:v copy -af "volume=5dB,alimiter=limit=0.84:attack=5:release=60:level=disabled" \
  -c:a aac -b:a 192k -movflags +faststart ../asztalcsere.mp4
```

Remotion licenc: magánszemélynek és legfeljebb 3 fős csapatnak ingyenes, a részletek [itt](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).
