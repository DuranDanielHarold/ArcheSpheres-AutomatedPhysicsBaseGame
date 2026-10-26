# ArcheSpheres audio

All files in this folder are **original, procedurally synthesized** by
`tools/audio/generate_audio.py` (no samples, no third-party material) and are
released under the repository's MIT license.

**Format:** PCM 16-bit, 44.1 kHz, mono WAV. Every file is DC-blocked, trimmed,
loudness-matched per slot, soft-limited to a **-1 dBFS** peak ceiling and
TPDF-dithered. See `manifest.json` for per-file duration/peak/loudness.

## Layout

```text
audio/
  manifest.json
  arena/bgm.wav                 seamless 16-bar chiptune loop (27.4 s)
  <class-key>/weaponCollision.wav   weapon-vs-weapon clash (material per weapon)
  <class-key>/damage.wav            this sphere taking damage ("hurt" voice)
  <class-key>/ability.wav           signature ability activation
  <ranged-key>/projectileThrow.wav  ranged classes only (12 classes)
  <ranged-key>/projectileHit.wav
```

## Regenerating / tuning

```powershell
pip install numpy scipy
python tools/audio/generate_audio.py --root .                    # everything
python tools/audio/generate_audio.py --root . --only knight,arena
python tools/audio/generate_audio.py --root . --verify           # format + peak check
```

Output is deterministic (seeded per file). To retune a class, edit its row in
`CLASSES` in `tools/audio/generate_audio.py` (material / pitch / theme), or add
a recipe in `tools/audio/recipes.py`, then regenerate only that class.
Loudness targets per slot live in `LOUD_TARGET`.

Replace any file with your own recording at any time: keep the same filename
and 16-bit WAV format; no code change is needed.
