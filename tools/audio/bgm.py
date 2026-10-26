"""Seamless 16-bar chiptune arena loop (A minor, 140 BPM, mono)."""
import numpy as np
import dsp
from dsp import SR, N, T, mf, lp, hp, bp, noise, fq, osc, ex, Buf

BPM = 140
BEAT = 60.0 / BPM
STEP = BEAT / 4          # sixteenth
BARS = 16
LOOP = BARS * 4 * BEAT
TAIL = 2.0

# chord roots (MIDI) + chord tones per 2-bar block: Am F C G | Am F G E
PROG = [(57, (0, 3, 7)), (53, (0, 4, 7)), (60, (0, 4, 7)), (55, (0, 4, 7)),
        (57, (0, 3, 7)), (53, (0, 4, 7)), (55, (0, 4, 7)), (52, (0, 4, 8))]
A_MINOR = [0, 2, 3, 5, 7, 8, 10]   # natural minor degrees


def _square(f, d, pw=.5):
    return osc('square', f, d, pw)


def _note(buf, midi, at, dur, kind, gain, pw=.5, decay=None):
    f = mf(midi)
    n = dur + .02
    if kind == 'tri':
        s = osc('tri', f, n)
    else:
        s = lp(_square(f, n, pw), 6000)
    e = np.minimum(1, T(n) / .004) * (np.exp(-T(n) / decay) if decay else np.clip(1 - T(n) / n, 0, 1) ** .6)
    buf.add(s * e, at, gain)


def _kick(buf, at):
    buf.add(osc('sine', fq(150, 42, .22), .22) * ex(.22, .09, .0005), at, .9)


def _snare(buf, at):
    buf.add(bp(noise(.16), 1200, 7000) * ex(.16, .05, .0005), at, .38)
    buf.add(osc('tri', fq(240, 150, .1), .1) * ex(.1, .04), at, .3)


def _hat(buf, at, open_=False):
    d = .22 if open_ else .05
    buf.add(hp(noise(d), 7000) * ex(d, d / 3, .0003), at, .1 if not open_ else .09)


def _scale_notes(root=57, lo=69, hi=88):
    return [root % 12 + 12 * o + s for o in range(10) for s in A_MINOR if lo <= (root % 12) + 12 * o + s <= hi]


def build():
    dsp.set_seed(0xA7E4A)
    b = Buf(LOOP + TAIL)
    rng = dsp.RNG
    scale = _scale_notes()
    prev = scale[len(scale) // 2]
    for bar in range(BARS):
        root, tones = PROG[bar // 2]
        t0 = bar * 4 * BEAT
        # bass: driving eighths on root, octave jump on offbeats
        for e in range(8):
            m = root - 12 + (12 if e % 4 == 3 else 0)
            _note(b, m, t0 + e * 2 * STEP, 2 * STEP * .9, 'tri', .34)
        # arpeggio: sixteenths through chord tones
        pat = [0, 1, 2, 1, 0, 1, 2, 1, 0, 1, 2, 1, 2, 1, 2, 1]
        for s in range(16):
            m = root + 12 + tones[pat[s] % 3] + (12 if s % 8 == 7 else 0)
            _note(b, m, t0 + s * STEP, STEP * .8, 'sq', .06, .125, decay=.05)
        # drums
        for beat in range(4):
            if beat in (0, 2) or (beat == 3 and bar % 4 == 3 and False):
                _kick(b, t0 + beat * BEAT)
            if beat in (1, 3):
                _snare(b, t0 + beat * BEAT)
            _hat(b, t0 + beat * BEAT)
            _hat(b, t0 + beat * BEAT + 2 * STEP, open_=(beat == 3))
        if bar % 4 == 3:                         # fill
            for k in range(4):
                _snare(b, t0 + 3 * BEAT + k * STEP)
        if bar % 2 == 0 and bar % 4 != 0:
            _kick(b, t0 + 3.5 * BEAT)
        # lead melody (section A: bars 0-7 sparse, B: 8-15 busier + octave)
        ct = [root + 12 + t for t in tones] + [root + 24 + tones[0]]
        sect_b = bar >= 8
        steps = 16 if sect_b else 8
        sl = STEP if sect_b else 2 * STEP
        for s in range(steps):
            strong = (s % (4 if sect_b else 2) == 0)
            if not strong and rng.random() < (.18 if sect_b else .3):
                continue                             # rest
            if strong:
                cands = [m for m in scale if (m - root) % 12 in tones]
                prev = min(cands, key=lambda m: abs(m - prev) + rng.random() * 2)
            else:
                i = scale.index(min(scale, key=lambda m: abs(m - prev)))
                i = int(np.clip(i + rng.choice([-1, 1, 1, -2, 2, 0]), 0, len(scale) - 1))
                prev = scale[i]
            ln = sl * (1.9 if (s == steps - 1 and bar % 4 == 3) else .9)
            _note(b, prev, t0 + s * sl, ln, 'sq', .15, .25 if not sect_b else .5)
    x = b.x
    n = N(LOOP)
    out = x[:n].copy()
    tail = x[n:]
    out[:len(tail)] += tail                         # wrap the tail -> seamless loop
    return out
