"""Tiny DSP toolkit used by generate_audio.py (numpy + scipy only).

Everything here is deterministic: all randomness goes through RNG, which
generate_audio.py re-seeds per asset from a CRC32 of "<key>/<slot>".
"""
import numpy as np
from scipy.signal import butter, sosfilt

SR = 44100
RNG = np.random.default_rng(0)


def set_seed(seed):
    global RNG
    RNG = np.random.default_rng(int(seed) & 0xFFFFFFFF)


# ── time helpers ────────────────────────────────────────────────────────────
def N(d):
    return max(1, int(round(d * SR)))


def T(d):
    return np.arange(N(d)) / SR


def mf(m):
    """MIDI note number -> Hz."""
    return 440.0 * 2 ** ((m - 69) / 12.0)


# ── filters ─────────────────────────────────────────────────────────────────
def _fc(f):
    return float(np.clip(f, 20.0, SR * 0.45))


def lp(x, fc, o=2):
    return sosfilt(butter(o, _fc(fc) / (SR / 2), 'low', output='sos'), x)


def hp(x, fc, o=2):
    return sosfilt(butter(o, _fc(fc) / (SR / 2), 'high', output='sos'), x)


def bp(x, lo, hi, o=2):
    lo, hi = _fc(lo), _fc(hi)
    if hi <= lo * 1.05:
        hi = min(SR * 0.45, lo * 1.2)
    return sosfilt(butter(o, [lo / (SR / 2), hi / (SR / 2)], 'band', output='sos'), x)


def filt_sweep(x, f0, f1, kind='low', o=2, chunk=441):
    """Low/high-pass whose cutoff glides exponentially f0 -> f1 across x."""
    n = len(x)
    out = np.empty(n)
    zi = None
    nch = (n + chunk - 1) // chunk
    for i in range(nch):
        fc = f0 * (f1 / f0) ** (i / max(1, nch - 1))
        sos = butter(o, _fc(fc) / (SR / 2), kind, output='sos')
        if zi is None:
            zi = np.zeros((sos.shape[0], 2))
        seg = x[i * chunk:(i + 1) * chunk]
        y, zi = sosfilt(sos, seg, zi=zi)
        out[i * chunk:i * chunk + len(seg)] = y
    return out


# ── sources ─────────────────────────────────────────────────────────────────
def noise(d):
    return RNG.uniform(-1, 1, N(d))


def fq(f0, f1, d, power=1.0):
    """Exponential frequency curve f0 -> f1 (array of length N(d))."""
    x = np.linspace(0, 1, N(d)) ** power
    return f0 * (f1 / f0) ** x


def vib(f, d, rate=6.0, depth=0.02):
    t = T(d)
    f = np.full(len(t), float(f)) if np.isscalar(f) else np.asarray(f, float)
    return f * (1 + depth * np.sin(2 * np.pi * rate * t))


def osc(kind, f, d, pw=0.5):
    n = N(d)
    f = np.full(n, float(f)) if np.isscalar(f) else np.asarray(f, float)
    if len(f) != n:
        f = np.interp(np.linspace(0, 1, n), np.linspace(0, 1, len(f)), f)
    ph = np.cumsum(f) / SR
    fr = ph % 1.0
    if kind == 'sine':
        return np.sin(2 * np.pi * ph)
    if kind == 'square':
        return np.where(fr < pw, 1.0, -1.0)
    if kind == 'saw':
        return 2 * fr - 1
    if kind == 'tri':
        return 4 * np.abs(fr - 0.5) - 1
    raise ValueError(kind)


def partials(f, d, ratios, amps, decays, attack=0.001):
    t = T(d)
    out = np.zeros_like(t)
    for r, a, dc in zip(ratios, amps, decays):
        fr = f * r
        if fr >= SR * 0.45:
            continue
        ph = RNG.uniform(0, 2 * np.pi)
        out += a * np.sin(2 * np.pi * fr * t + ph) * np.exp(-t / dc) * np.minimum(1.0, t / attack)
    return out


def pluck(f, d, decay=0.996, bright=0.6):
    """Karplus-Strong string (block-vectorised)."""
    n = N(d)
    D = max(2, int(round(SR / f)))
    Y = np.zeros(n + D + 2)
    exc = RNG.uniform(-1, 1, D)
    if bright < 1:
        exc = lp(exc, 400 + 9000 * bright)
    Y[1:D + 1] = exc
    i = D + 1
    while i < n + 1:
        j = min(i + D, n + D + 2)
        L = j - i
        Y[i:j] = decay * 0.5 * (Y[i - D:i - D + L] + Y[i - D - 1:i - D - 1 + L])
        i += D
    return Y[1:n + 1]


# ── envelopes ───────────────────────────────────────────────────────────────
def ex(d, decay, attack=0.0015):
    t = T(d)
    a = np.minimum(1.0, t / attack) if attack > 0 else 1.0
    return a * np.exp(-t / decay)


def env_ar(d, a=0.3, curve=1.5):
    t = np.linspace(0, 1, N(d))
    return np.where(t < a, t / max(a, 1e-6), np.clip((1 - t) / max(1 - a, 1e-6), 0, 1) ** curve)


def swell(d, peak=0.5):
    t = np.linspace(0, 1, N(d))
    return np.sin(np.pi * t ** (np.log(0.5) / np.log(peak)))


# ── mixing ──────────────────────────────────────────────────────────────────
class Buf:
    def __init__(self, d):
        self.x = np.zeros(N(d))

    def add(self, sig, at=0.0, gain=1.0):
        i = int(round(at * SR))
        if i >= len(self.x) or i < 0:
            return self
        sig = np.array(sig, float)[:max(0, len(self.x) - i)]   # fit the buffer first, then taper
        n = len(sig)
        if n < 2:
            return self
        fo = min(n // 3, int(.012 * SR))          # de-click: taper every layer's tail...
        if fo > 1:
            sig[-fo:] *= 0.5 * (1 + np.cos(np.linspace(0, np.pi, fo)))
        fi = min(n // 4, int(.0003 * SR))         # ...and head
        if fi > 1:
            sig[:fi] *= np.linspace(0, 1, fi)
        j = min(len(self.x), i + n)
        self.x[i:j] += gain * sig[:j - i]
        return self


# ── effects ─────────────────────────────────────────────────────────────────
def distort(x, drive=3.0):
    return np.tanh(drive * x) / np.tanh(drive)


def bitcrush(x, hold=4, levels=64):
    y = np.repeat(x[::hold], hold)[:len(x)]
    return np.round(y * levels) / levels


def tremolo(x, rate, depth=0.5):
    return x * (1 - depth + depth * np.sin(2 * np.pi * rate * T(len(x) / SR)))


def ringmod(x, f):
    return x * np.sin(2 * np.pi * f * T(len(x) / SR))


def echo(x, delay=0.12, fb=0.45, mix=0.5, taps=4):
    D = int(delay * SR)
    out = np.concatenate([x, np.zeros(D * taps)])
    wet = np.zeros_like(out)
    for k in range(1, taps + 1):
        wet[k * D:] += (fb ** k) * out[:len(out) - k * D]
    return out + mix * wet


def _comb(x, D, g):
    y = x.copy()
    for i in range(D, len(x), D):
        j = min(i + D, len(x))
        y[i:j] += g * y[i - D:j - D]
    return y


def _allpass(x, D, g):
    y = x.copy()
    for i in range(D, len(x), D):
        j = min(i + D, len(x))
        y[i:j] = -g * x[i:j] + x[i - D:j - D] + g * y[i - D:j - D]
    return y


def reverb(x, mix=0.25, room=1.0, tail=0.5):
    x = np.concatenate([x, np.zeros(int(tail * SR))])
    wet = np.zeros_like(x)
    for dly, g in ((0.0297, .80), (0.0371, .79), (0.0411, .78), (0.0437, .77)):
        wet += _comb(x, int(dly * room * SR), g)
    wet /= 4
    for dly, g in ((0.0050, .6), (0.0017, .6)):
        wet = _allpass(wet, int(dly * SR), g)
    return x + mix * 2.0 * wet


# ── mastering ───────────────────────────────────────────────────────────────
def db(x):
    return 20 * np.log10(max(float(x), 1e-12))


def loudest_rms(x, win_s):
    w = max(1, int(win_s * SR))
    if len(x) <= w:
        return float(np.sqrt(np.mean(x ** 2) + 1e-18))
    c = np.cumsum(np.concatenate([[0.0], x ** 2]))
    return float(np.sqrt(np.max(c[w:] - c[:-w]) / w + 1e-18))


def soft_limit(x, ceil_db=-1.0, knee=0.6):
    c = 10 ** (ceil_db / 20)
    thr = knee * c
    a = np.abs(x)
    over = a > thr
    y = x.copy()
    y[over] = np.sign(x[over]) * (thr + (c - thr) * np.tanh((a[over] - thr) / (c - thr)))
    return y
