#!/usr/bin/env python3
"""ArcheSpheres procedural audio generator.

Renders 16-bit / 44.1 kHz / mono PCM WAV files for every sphere class plus the
arena BGM loop. 100% original synthesis (no samples), deterministic: the same
script always produces byte-identical files.

    pip install numpy scipy
    python tools/audio/generate_audio.py --root .
    python tools/audio/generate_audio.py --root . --only knight,wizard
    python tools/audio/generate_audio.py --root . --verify

Slots per class: weaponCollision, damage, ability (+ projectileThrow /
projectileHit for ranged classes). Arena: audio/arena/bgm.wav (seamless loop).

Mastering chain (every file): DC-block -> trim lead/tail silence -> fades ->
loudness target per slot -> soft limiter (-1 dBFS ceiling) -> TPDF dither ->
16-bit PCM.
"""
import argparse, json, os, sys, wave, zlib
import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import dsp
import recipes as R
import bgm
from dsp import SR

PEAK_CEIL_DB = -1.0
# loudest-250ms RMS target per slot (dBFS); BGM uses whole-file RMS
LOUD_TARGET = {'weaponCollision': -15, 'damage': -17, 'ability': -14,
               'projectileThrow': -21, 'projectileHit': -17, 'bgm': -17}

# key: (clash(material,f0,size), hurt(style,f0), ability(fn,kwargs), proj(throw,hit) or None)
CLASSES = {
 'alchemist':   (('glass', 1800, 1), ('light', 520), (R.t_bubbles, dict(f=600)), ('flask', 'shatter')),
 'arcanist':    (('crystal', 880, 1), ('magic', 700), (R.t_overload, dict(f=90)), ('cannon', 'explosion')),
 'barbarian':   (('chain', 3000, 1), ('flesh', 150), (R.t_charge, dict(f=110)), None),
 'bard':        (('wood', 330, 1), ('light', 650), (R.t_strum, dict(f=220)), ('note', 'clang_note')),
 'beastmaster': (('leather', 400, 1), ('beast', 260), (R.t_beast, dict(f=330)), None),
 'berserker':   (('heavy', 110, 1.1), ('flesh', 120), (R.t_rage, dict(f=70)), None),
 'crusader':    (('shield', 220, 1.1), ('armor', 100), (R.t_charge, dict(f=95, holy=True)), None),
 'dragoon':     (('blade', 1500, 1.2), ('armor', 140), (R.t_leap, dict(f=140)), None),
 'druid':       (('leather', 520, 1), ('wood', 300), (R.t_creak, dict(f=200)), None),
 'fairy':       (('crystal', 2400, .7), ('light', 1100), (R.t_wish, dict(f=880)), ('sparkle', 'pop')),
 'flagellant':  (('leather', 600, 1), ('flesh', 190), (R.t_penitence, dict(f=98)), None),
 'gladiator':   (('steel', 1000, 1), ('flesh', 170), (R.t_net, dict(f=200)), None),
 'glassblower': (('glass', 2200, 1), ('glass', 300), (R.t_shatter, dict(f=3000)), None),
 'golem':       (('stone', 80, 1.1), ('stone', 70), (R.t_shield, dict(f=110, wave='saw')), None),
 'gravedigger': (('shovel', 450, 1), ('flesh', 140), (R.t_exhume, dict(f=90)), None),
 'guardian':    (('shield', 180, 1.2), ('armor', 120), (R.t_shield, dict(f=300)), None),
 'inquisitor':  (('heavy', 150, 1), ('flesh', 130), (R.t_pyre, dict(f=80)), None),
 'jester':      (('jingle', 1200, 1), ('light', 800), (R.t_jingle, dict(f=1200)), None),
 'king':        (('heavy', 120, 1.2), ('armor', 90), (R.t_royal, dict(f=110, wave='saw', deep=True)), None),
 'knight':      (('steel', 700, 1), ('armor', 130), (R.t_shield, dict(f=440)), None),
 'locksmith':   (('chain', 3500, 1), ('light', 600), (R.t_lock, dict(f=900)), None),
 'mimic':       (('blade', 1200, 1), ('magic', 500), (R.t_copy, dict(f=440)), None),
 'monk':        (('wood', 520, 1), ('light', 500), (R.t_gong, dict(f=196)), None),
 'necromancer': (('blade', 900, 1), ('ghost', 400), (R.t_curse, dict(f=110)), ('skull', 'skull')),
 'ninja':       (('chain', 2500, 1), ('light', 800), (R.t_blink, dict(f=600)), None),
 'paladin':     (('heavy', 160, 1), ('armor', 120), (R.t_holy, dict(f=330)), None),
 'phoenix':     (('claw', 1800, 1), ('beast', 600), (R.t_ember, dict(f=700)), None),
 'pirate':      (('steel', 800, 1), ('flesh', 160), (R.t_hook, dict(f=300)), None),
 'plague':      (('dagger', 2000, 1), ('flesh', 230), (R.t_infect, dict(f=300)), None),
 'priest':      (('crystal', 700, 1), ('light', 450), (R.t_holy, dict(f=440)), ('chime', 'holy')),
 'prince':      (('regal', 1600, 1), ('light', 600), (R.t_royal, dict(f=330, wave='square')), None),
 'queen':       (('regal', 2000, 1), ('light', 900), (R.t_royal, dict(f=440, queen=True)), None),
 'ranger':      (('wood', 300, 1), ('light', 500), (R.t_volley, dict(f=400)), ('arrow', 'arrow')),
 'ratcatcher':  (('wood', 600, 1), ('light', 700), (R.t_squeaks, dict(f=3000)), None),
 'rogue':       (('dagger', 2400, 1), ('light', 650), (R.t_stab, dict(f=900)), None),
 'sage':        (('wood', 250, 1), ('light', 400), (R.t_foresight, dict(f=528)), ('rune', 'rune')),
 'samurai':     (('blade', 1300, 1.2), ('light', 450), (R.t_slash, dict(f=1800)), None),
 'sheriff':     (('gun', 1500, 1), ('flesh', 160), (R.t_sheriff, dict(f=180)), ('gunshot', 'ricochet')),
 'spartan':     (('shield', 260, 1), ('armor', 150), (R.t_phalanx, dict(f=110)), None),
 'stormbringer':(('zap', 1000, 1), ('magic', 800), (R.t_thunder, dict(f=60)), None),
 'templar':     (('heavy', 140, 1), ('armor', 100), (R.t_slowfield, dict(f=200)), None),
 'tidecaller':  (('leather', 450, 1), ('light', 400), (R.t_water, dict(f=330)), ('splash', 'splash')),
 'trickster':   (('crystal', 1100, 1), ('ghost', 700), (R.t_phase, dict(f=500)), None),
 'vampire':     (('claw', 2000, 1), ('ghost', 350), (R.t_swarm, dict(f=2500)), None),
 'viking':      (('heavy', 170, 1), ('flesh', 120), (R.t_rage, dict(f=90)), None),
 'voidwalker':  (('crystal', 300, 1), ('ghost', 250), (R.t_void, dict(f=55)), None),
 'warlord':     (('heavy', 100, 1.2), ('armor', 90), (R.t_quake, dict(f=55)), None),
 'whelpling':   (('organic', 350, 1), ('beast', 350), (R.t_fire, dict(f=150)), None),
 'witch':       (('crystal', 500, 1), ('ghost', 600), (R.t_hex, dict(f=300)), ('hex', 'hex')),
 'wizard':      (('crystal', 1000, 1), ('magic', 600), (R.t_rods, dict(f=440)), ('zip', 'elemental')),
}


# ── mastering ───────────────────────────────────────────────────────────────
def master(x, slot):
    x = np.nan_to_num(np.asarray(x, float))
    x = dsp.hp(x, 20, 1)                                    # DC block
    if slot != 'bgm':
        pk = float(np.max(np.abs(x))) or 1.0
        x = x / pk
        idx = np.where(np.abs(x) > 10 ** (-52 / 20))[0]     # trim silence (-52 dB)
        if len(idx):
            a = max(0, idx[0] - int(.001 * SR))
            b = min(len(x), idx[-1] + int(.012 * SR))
            x = x[a:b]
        f_in, f_out = int(.0007 * SR), min(len(x) // 3, max(int(.02 * SR), int(len(x) * .06)))
        x[:f_in] *= np.linspace(0, 1, f_in)
        x[-f_out:] *= np.linspace(1, 0, f_out) ** 1.5
        cur = dsp.loudest_rms(x, .25)
    else:
        cur = dsp.loudest_rms(x, len(x) / SR)
    x = x * 10 ** ((LOUD_TARGET[slot] - dsp.db(cur)) / 20)
    return dsp.soft_limit(x, PEAK_CEIL_DB)


def to_pcm16(x, seed):
    rng = np.random.default_rng(seed)
    tpdf = (rng.random(len(x)) - rng.random(len(x))) / 32768.0
    return np.clip(np.round((x + tpdf) * 32767), -32768, 32767).astype('<i2')


def write_wav(path, pcm):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with wave.open(path, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes(pcm.tobytes())


def render(key, slot, fn):
    seed = zlib.crc32(f'{key}/{slot}'.encode())
    dsp.set_seed(seed)
    return to_pcm16(master(fn(), slot), seed ^ 0x5EED)


def jobs():
    for key, (cl, hu, ab, pr) in CLASSES.items():
        yield key, 'weaponCollision', (lambda cl=cl: R.clash(*cl))
        yield key, 'damage', (lambda hu=hu: R.hurt(*hu))
        yield key, 'ability', (lambda ab=ab: ab[0](**ab[1]))
        if pr:
            yield key, 'projectileThrow', (lambda pr=pr: R.proj_throw(pr[0]))
            yield key, 'projectileHit', (lambda pr=pr: R.proj_hit(pr[1]))


def verify(root):
    bad = 0
    for dp, _, fs in os.walk(root):
        for f in fs:
            if not f.endswith('.wav'):
                continue
            p = os.path.join(dp, f)
            with wave.open(p) as w:
                ok = (w.getnchannels(), w.getsampwidth(), w.getframerate()) == (1, 2, SR)
                a = np.frombuffer(w.readframes(w.getnframes()), '<i2').astype(float) / 32768
            pk = dsp.db(np.max(np.abs(a)))
            if not ok or pk > PEAK_CEIL_DB + .1 or len(a) < 1000:
                bad += 1; print('FAIL', p, ok, round(pk, 2))
    print('verify:', 'OK' if not bad else f'{bad} problem file(s)')
    return bad == 0


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--root', default='.', help='repo root; files are written to <root>/audio/...')
    ap.add_argument('--only', default='', help='comma list of class keys (or "arena")')
    ap.add_argument('--verify', action='store_true')
    a = ap.parse_args()
    if a.verify:
        sys.exit(0 if verify(os.path.join(a.root, 'audio')) else 1)
    only = {s for s in a.only.split(',') if s}
    manifest, sphere_audio = [], {}
    def record(key, slot, rel, pcm):
        x = pcm.astype(float) / 32768
        manifest.append(dict(key=key, slot=slot, path=rel, ms=round(len(x) / SR * 1000),
                             peakDbfs=round(dsp.db(np.max(np.abs(x))), 2),
                             loudDbfs=round(dsp.db(dsp.loudest_rms(x, .25)), 2), bytes=44 + len(pcm) * 2))
    for key, slot, fn in jobs():
        if only and key not in only:
            continue
        rel = f'audio/{key}/{slot}.wav'
        pcm = render(key, slot, fn)
        write_wav(os.path.join(a.root, rel), pcm)
        record(key, slot, rel, pcm)
        sphere_audio.setdefault(key, {})[slot] = rel
        print(f'{rel:46s} {len(pcm)/SR*1000:6.0f} ms')
    if not only or 'arena' in only:
        rel = 'audio/arena/bgm.wav'
        dsp.set_seed(1)
        pcm = to_pcm16(master(bgm.build(), 'bgm'), 7)
        write_wav(os.path.join(a.root, rel), pcm)
        record('arena', 'bgm', rel, pcm)
        print(f'{rel:46s} {len(pcm)/SR:6.1f} s  (loop)')
    if not only:
        mp = os.path.join(a.root, 'audio', 'manifest.json')
        os.makedirs(os.path.dirname(mp), exist_ok=True)
        json.dump(dict(format='PCM 16-bit mono 44100 Hz', generator='tools/audio/generate_audio.py',
                       peakCeilingDbfs=PEAK_CEIL_DB, loudnessTargetsDbfs=LOUD_TARGET,
                       sphereAudio=sphere_audio, arena=dict(bgm='audio/arena/bgm.wav'),
                       files=manifest), open(mp, 'w'), indent=1)
        print('manifest ->', mp)


if __name__ == '__main__':
    main()
