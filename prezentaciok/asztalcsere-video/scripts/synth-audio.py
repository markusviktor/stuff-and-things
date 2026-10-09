"""Generate the soundtrack and the custom sound effects for the desk video.

Everything is synthesised from scratch with numpy, so there is nothing to
license. Output goes to public/audio/: effects as 16-bit 44.1 kHz WAV, the soundtrack as MP3
(needs ffmpeg).

    python3 scripts/synth-audio.py
"""

import os
import subprocess
import wave

import numpy as np

SR = 44100
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "audio")
rng = np.random.default_rng(42)


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def write(name, stereo):
    stereo = np.asarray(stereo, dtype=np.float64)
    if stereo.ndim == 1:
        stereo = np.stack([stereo, stereo], axis=1)
    peak = np.max(np.abs(stereo))
    if peak > 0.98:
        stereo = stereo * (0.98 / peak)
    data = (stereo * 32767).astype("<i2")
    with wave.open(os.path.join(OUT, name), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data.tobytes())


def lowpass(x, cutoff):
    a = np.exp(-2 * np.pi * cutoff / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i, v in enumerate(x):
        acc = (1 - a) * v + a * acc
        y[i] = acc
    return y


def env(n, attack=0.005, decay=2.0, release=0.04):
    t = np.arange(n) / SR
    e = np.exp(-t * decay) * np.minimum(1.0, t / attack)
    r = int(release * SR)
    if r and n > r:
        e[-r:] *= np.linspace(1, 0, r)
    return e


# ---------------------------------------------------------------- music
BPM = 90
BEAT = 60 / BPM
BAR = 4 * BEAT
LENGTH = 64.0  # seconds, same as the video
N = int(LENGTH * SR)

keys = np.zeros(N)
bass = np.zeros(N)
lead = np.zeros(N)
drums = np.zeros(N)

# I – vi – ii – V in D major, lo-fi voicings
CHORDS = [
    (50, [54, 57, 61, 64]),  # Dmaj9
    (47, [54, 57, 62, 66]),  # Bm7
    (52, [55, 59, 62, 66]),  # Em9
    (45, [55, 61, 64, 66]),  # A13
]
MOTIF = [
    (0, 0.0, 78, 1.0), (0, 1.5, 81, 0.5), (0, 2.5, 76, 1.5),
    (1, 0.0, 74, 1.0), (1, 1.5, 78, 0.5), (1, 2.5, 73, 1.5),
    (2, 0.0, 71, 1.0), (2, 1.0, 74, 0.5), (2, 1.5, 76, 1.0), (2, 2.5, 79, 1.5),
    (3, 0.0, 76, 2.0), (3, 2.5, 73, 1.5),
]


def add(buf, start, sig):
    i = int(start * SR)
    if i >= len(buf):
        return
    j = min(len(buf), i + len(sig))
    buf[i:j] += sig[: j - i]


def ep_note(f, dur, vel):
    n = int(dur * SR)
    t = np.arange(n) / SR
    tone = (np.sin(2 * np.pi * f * t) + 0.45 * np.sin(4 * np.pi * f * t)
            + 0.15 * np.sin(6 * np.pi * f * t) + 0.06 * np.sin(8 * np.pi * f * t))
    trem = 1 + 0.12 * np.sin(2 * np.pi * 4.2 * t)
    return vel * tone * trem * env(n, 0.006, 1.6, 0.08)


def bass_note(f, dur, vel):
    n = int(dur * SR)
    t = np.arange(n) / SR
    tone = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(4 * np.pi * f * t) + 0.1 * np.sin(6 * np.pi * f * t)
    return vel * tone * env(n, 0.01, 1.1, 0.06)


def lead_note(f, dur, vel):
    n = int(dur * SR)
    t = np.arange(n) / SR
    vib = 1 + 0.004 * np.sin(2 * np.pi * 5.5 * t) * np.minimum(1, t / 0.25)
    ph = 2 * np.pi * f * np.cumsum(vib) / SR
    tone = np.sin(ph) + 0.18 * np.sin(3 * ph) + 0.06 * np.sin(5 * ph)
    return vel * tone * env(n, 0.012, 2.4, 0.1)


def kick():
    n = int(0.42 * SR)
    t = np.arange(n) / SR
    f = 46 + 90 * np.exp(-t * 32)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t * 7.5) * np.minimum(1, t / 0.002)


def snare():
    n = int(0.28 * SR)
    t = np.arange(n) / SR
    noise = rng.standard_normal(n)
    noise = np.diff(noise, prepend=0) * 0.5
    body = np.sin(2 * np.pi * 185 * t) * np.exp(-t * 28)
    return (noise * np.exp(-t * 17) * 0.55 + body * 0.45)


def hat():
    n = int(0.06 * SR)
    t = np.arange(n) / SR
    noise = np.diff(rng.standard_normal(n), prepend=0)
    noise = np.diff(noise, prepend=0)
    return noise * np.exp(-t * 70) * 0.25


K, S, H = kick(), snare(), hat()
bars = int(LENGTH / BAR)  # 24
for b in range(bars):
    root, chord = CHORDS[b % 4]
    t0 = b * BAR
    last = b == bars - 1
    # keys
    hits = [(0.0, 1.0, 2.2)] if last else [(0.0, 1.0, 1.6), (1.5, 0.55, 1.1), (3.0, 0.7, 1.2)]
    for beat, vel, ln in hits:
        for k, note in enumerate(chord):
            strum = k * 0.012
            add(keys, t0 + beat * BEAT + strum, ep_note(midi(note), ln * BEAT * (3 if last else 1), vel * 0.16))
    # bass
    if 2 <= b:
        add(bass, t0, bass_note(midi(root - 12), (6 if last else 1.8) * BEAT, 0.42))
        if not last:
            add(bass, t0 + 2.5 * BEAT, bass_note(midi(root - 12 + (7 if b % 2 else 12)), 1.2 * BEAT, 0.3))
    # drums: in from bar 2, out for the last bar
    if 2 <= b < bars - 1:
        add(drums, t0, K * 0.9)
        add(drums, t0 + 2 * BEAT, K * 0.8)
        if b % 2:
            add(drums, t0 + 2.5 * BEAT, K * 0.45)
        add(drums, t0 + BEAT, S * 0.42)
        add(drums, t0 + 3 * BEAT, S * 0.42)
        for e in range(8):
            swing = 0.06 * BEAT if e % 2 else 0.0
            add(drums, t0 + e * 0.5 * BEAT + swing, H * (0.6 if e % 2 else 0.9))
    # lead motif in the middle section
    if 8 <= b < 20:
        for bi, beat, note, dur in MOTIF:
            if bi == b % 4:
                add(lead, t0 + beat * BEAT, lead_note(midi(note), dur * BEAT * 1.6, 0.12))

keys = lowpass(keys, 3800)
lead = lowpass(lead, 5200)
bass = lowpass(bass, 900)
drums = lowpass(drums, 7000)


def delayed(x, sec, gain):
    d = int(sec * SR)
    y = np.zeros_like(x)
    y[d:] = x[:-d] * gain
    return y


left = keys + 0.6 * lead + bass + drums + delayed(keys, 0.137, 0.22) + delayed(lead, 0.31, 0.25)
right = keys + 0.6 * lead + bass + drums + delayed(keys, 0.173, 0.22) + delayed(lead, 0.37, 0.25)
# a little vinyl: hiss and sparse crackle
hiss = lowpass(rng.standard_normal(N) * 0.004, 6000)
crackle = np.zeros(N)
idx = rng.integers(0, N, size=420)
crackle[idx] = rng.uniform(-0.05, 0.05, size=420)
left += hiss + crackle
right += hiss + np.roll(crackle, 37)

fade_in = np.minimum(1, np.arange(N) / (1.2 * SR))
fade_out = np.clip((LENGTH - np.arange(N) / SR) / 3.0, 0, 1)
mix = np.stack([left, right], axis=1) * (fade_in * fade_out)[:, None]
mix = np.tanh(mix * 1.4) / np.tanh(1.4)
mix *= 0.8 / np.max(np.abs(mix))


# ---------------------------------------------------------------- sfx
def motor():
    dur = 3.5
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = 98 + 10 * t / dur
    ph = 2 * np.pi * np.cumsum(f) / SR
    saw = sum(np.sin(k * ph) / k for k in range(1, 9))
    whine = 0.12 * np.sin(2 * np.pi * np.cumsum(820 + 60 * t / dur) / SR)
    sig = lowpass(saw * 0.5 + whine, 1400)
    e = np.minimum(1, t / 0.12) * np.minimum(1, (dur - t) / 0.15)
    return sig * e * (1 + 0.05 * np.sin(2 * np.pi * 7 * t))


def error_beep():
    out = []
    for f in (523.25, 392.0):
        n = int(0.11 * SR)
        t = np.arange(n) / SR
        sq = sum(np.sin(2 * np.pi * f * k * t) / k for k in (1, 3, 5, 7))
        out.append(sq * env(n, 0.003, 6, 0.02) * 0.5)
        out.append(np.zeros(int(0.035 * SR)))
    return lowpass(np.concatenate(out), 4000)


def thud():
    n = int(0.35 * SR)
    t = np.arange(n) / SR
    f = 38 + 70 * np.exp(-t * 25)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 11)
    click = lowpass(rng.standard_normal(n), 2500) * np.exp(-t * 90) * 0.6
    return body + click


def womp():
    out = []
    for f0, f1, dur in ((233.1, 220.0, 0.42), (207.7, 174.6, 0.95)):
        n = int(dur * SR)
        t = np.arange(n) / SR
        f = f0 + (f1 - f0) * np.minimum(1, t / (dur * 0.8))
        f = f * (1 + (0.012 * np.sin(2 * np.pi * 6 * t) if dur > 0.5 else 0))
        ph = 2 * np.pi * np.cumsum(f) / SR
        saw = sum(np.sin(k * ph) / k for k in range(1, 12))
        wah = lowpass(saw, 1100)
        out.append(wah * env(n, 0.03, 1.2, 0.12) * 0.7)
        out.append(np.zeros(int(0.06 * SR)))
    return np.concatenate(out)


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    write("music.wav", mix)
    # keep the repo small: the soundtrack ships as MP3
    wav = os.path.join(OUT, "music.wav")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", wav, "-codec:a", "libmp3lame", "-b:a", "192k",
                    os.path.join(OUT, "music.mp3")], check=True)
    os.remove(wav)
    write("motor.wav", motor() * 0.8)
    write("error.wav", error_beep())
    write("thud.wav", thud() * 0.9)
    write("womp.wav", womp())
    print("written to", os.path.abspath(OUT))
