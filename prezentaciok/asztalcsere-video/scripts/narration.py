"""Generate the Hungarian voice-over and its timing for the desk video.

Each scene's narration is a list of lines. Every line is anchored to the frame
where its visual appears in the original animation; a line starts at its
anchor or right after the previous line, whichever is later. Scenes grow when
the voice needs more time, and the scene's animation is time-warped (see
SceneClock in src/ui.tsx) so each anchor lands exactly when its line starts.

Uses Piper TTS with the CC0 hu_HU "imre" voice:

    pip install piper-tts
    curl -LO https://huggingface.co/rhasspy/piper-voices/resolve/main/hu/hu_HU/imre/medium/hu_HU-imre-medium.onnx
    curl -LO https://huggingface.co/rhasspy/piper-voices/resolve/main/hu/hu_HU/imre/medium/hu_HU-imre-medium.onnx.json
    PIPER_MODEL=hu_HU-imre-medium.onnx python3 scripts/narration.py

Writes public/voice/*.wav and src/narration.json.
"""

import json
import math
import os
import subprocess
import wave

ROOT = os.path.join(os.path.dirname(__file__), "..")
VOICE_DIR = os.path.join(ROOT, "public", "voice")
FPS = 30
GAP = 6  # frames between two lines
TAIL = 30  # frames after the last line (covers the 15-frame transition)

# scene key: (original duration, [(anchor frame, spoken text, caption)])
# Spoken text spells numbers out and is spelled for the TTS where it mispronounces
# a word (dizsoni, változás-kérelem); captions keep the normal spelling.
SCENES = {
    "intro": (150, [
        (12, "Szia! Ez egy változás-kérelem.", "Szia! Ez egy változáskérelem."),
        (40, "Az asztalom papírból van.", None),
        (86, "Még a linter is szólt.", None),
    ]),
    "honeycomb": (240, [
        (10, "Ez a mostani Ikea lap. Belül papír méhsejt.", "Ez a mostani IKEA-lap. Belül papír méhsejt."),
        (95, "A szorító simán benyomja.", None),
        (165, "Ötven kilót bír, kis felületen csak tizenötöt.", "50 kilót bír, kis felületen csak 15-öt."),
    ]),
    "surface": (270, [
        (14, "Két huszonhét colos monitor: majdnem százhuszonhárom centi.",
         "Két 27 colos monitor: majdnem 123 centi."),
        (66, "Az asztal százhúsz. Nem fér el.", "Az asztal 120. Nem fér el."),
        (132, "Az új százhatvanszor nyolcvanas.", "Az új 160 × 80-as."),
        (182, "Hetvennyolc százalékkal nagyobb.", "78%-kal nagyobb."),
    ]),
    "load": (210, [
        (12, "Három és félszer többet bír.", None),
        (54, "Kétszáz kiló, ebből huszonegy maga a lap.", "200 kiló, ebből 21 maga a lap."),
        (140, "Ma kábé huszonöt kiló van rajta.", "Ma kábé 25 kiló van rajta."),
    ]),
    "height": (240, [
        (12, "Egy gombnyomásra hetvenkettő és százhúsz centi között.", "Egy gombnyomásra 72 és 120 centi között."),
        (96, "A mostanin állni nem lehet.", None),
        (150, "A hármas memóriagomb a tiéd.", None),
    ]),
    "style": (240, [
        (12, "A mostani tölgy-hatású.", "A mostani tölgyhatású."),
        (50, "A hatás elmaradt.", None),
        (88, "Az új: szélezetlen, dizsoni dió.", "Az új: szélezetlen dijoni dió."),
        (140, "Ez bútor, nem irodaszer. Előtte ingyen kérünk mintát.", None),
    ]),
    "cost": (240, [
        (12, "Nagyjából százhetvenezer forint.", "Nagyjából 170 ezer forint."),
        (60, "Öt évre osztva napi száznegyvennyolc forint.", "Öt évre osztva napi 148 forint."),
        (150, "Kevesebb, mint egy kávé.", None),
    ]),
    "finePrint": (210, [
        (12, "És az apró betű.", None),
        (24, "Forgácslap, dió dekorral, nem tömör fa.", None),
        (108, "Alátét kerül a szorító alá.", None),
        (146, "Visszaállítási terv nincs.", None),
    ]),
    "finale": (240, [
        (12, "A döntés a tiéd.", None),
        (112, "Szerintem az első gomb a nyerő.", None),
        (196, "Ha igen, a pizza az összeszerelés napján az enyém.", None),
    ]),
}


def synth(text, path):
    model = os.environ.get("PIPER_MODEL", "hu_HU-imre-medium.onnx")
    piper = os.environ.get("PIPER", "piper")
    raw = path + ".raw.wav"
    subprocess.run([piper, "-m", model, "-f", raw, "--length-scale", "1.1", "--sentence-silence", "0.25"],
                   input=text.encode("utf-8"), check=True, capture_output=True)
    # even loudness, 44.1 kHz stereo, a short fade so clips never click
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", raw,
                    "-af", "loudnorm=I=-17:TP=-2:LRA=7,afade=t=in:d=0.02,areverse,afade=t=in:d=0.04,areverse",
                    "-ar", "44100", "-ac", "2", path], check=True)
    os.remove(raw)
    with wave.open(path) as w:
        return w.getnframes() / w.getframerate()


def main():
    os.makedirs(VOICE_DIR, exist_ok=True)
    out = {"fps": FPS, "scenes": {}}
    for key, (base, lines) in SCENES.items():
        clips, cursor = [], 0
        for i, (anchor, say, caption) in enumerate(lines):
            name = f"{key}-{i + 1}.wav"
            seconds = synth(say, os.path.join(VOICE_DIR, name))
            frames = math.ceil(seconds * FPS)
            start = max(anchor, cursor)
            clips.append({"file": f"voice/{name}", "anchor": anchor, "from": start,
                          "durationInFrames": frames, "text": caption or say})
            cursor = start + frames + GAP
            print(f"{key:10s} line {i + 1}: {seconds:5.2f}s  frames {start}-{start + frames}")
        duration = max(base, clips[-1]["from"] + clips[-1]["durationInFrames"] + TAIL)
        out["scenes"][key] = {"baseDuration": base, "durationInFrames": duration, "clips": clips}
    with open(os.path.join(ROOT, "src", "narration.json"), "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)
        f.write("\n")
    total = sum(s["durationInFrames"] for s in out["scenes"].values()) - 15 * (len(SCENES) - 1)
    print(f"total {total} frames = {total / FPS:.1f}s")


if __name__ == "__main__":
    main()
