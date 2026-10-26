"""Sound recipes. Every function returns a raw float array (unmastered)."""
import numpy as np
import dsp
from dsp import (SR, N, T, mf, lp, hp, bp, filt_sweep, noise, fq, vib, osc, partials, pluck,
                 ex, env_ar, swell, Buf, distort, bitcrush, tremolo, ringmod, echo, reverb)

STEEL = ([1, 2.32, 4.25, 6.63, 9.38], [1, .65, .5, .35, .2], [.26, .18, .12, .08, .05])
BLADE = ([1, 2.76, 5.40, 8.93, 13.3], [1, .6, .4, .25, .15], [.50, .30, .18, .10, .06])
BELL = ([1, 2.0, 3.0, 4.2, 5.4, 6.8], [1, .5, .35, .25, .15, .1], [.7, .5, .4, .3, .2, .15])


def _tick(g=1.0, lo=2000, dur=.012, dec=.004):
    return hp(noise(dur), lo) * ex(dur, dec, 0.0003) * g


def _thump(f, d=.2, dec=.07, drop=.5, up=1.4):
    return osc('sine', fq(f * up, f * drop, d), d) * ex(d, dec)


# ═══════════════════════════ weapon clash ═══════════════════════════════════
CLASH_LEN = {'steel': .6, 'blade': .8, 'heavy': .5, 'wood': .3, 'stone': .4, 'chain': .45,
             'crystal': .8, 'leather': .3, 'shield': .55, 'claw': .35, 'regal': .6, 'dagger': .4,
             'gun': .35, 'glass': .6, 'organic': .25, 'zap': .5, 'jingle': .55, 'shovel': .5}


def clash(mat, f0, size=1.0):
    s = float(np.clip(size, .7, 1.3))
    b = Buf(CLASH_LEN[mat] * s)
    if mat == 'steel':
        r, a, d = STEEL
        b.add(partials(f0, .6 * s, r, a, [x * s for x in d]), 0, .8)
        b.add(_tick(.9), 0)
        b.add(_thump(f0 * .3, .1, .03), 0, .4)
        b.add(bp(noise(.08), f0 * 2, f0 * 6) * ex(.08, .05), .02, .25)
    elif mat == 'blade':
        r, a, d = BLADE
        b.add(partials(f0, .8 * s, r, a, [x * s for x in d]), 0, .75)
        b.add(_tick(.9, 3000), 0)
        b.add(filt_sweep(noise(.15), 9000, 3000, 'high') * ex(.15, .06), 0, .3)
    elif mat == 'heavy':
        b.add(_thump(f0, .3, .09, .45, 2.0), 0, 1.0)
        b.add(partials(f0 * 5, .3, [1, 2.3, 4.1], [.6, .4, .25], [.14, .09, .06]), 0, .5)
        b.add(lp(noise(.1), 1800) * ex(.1, .04), 0, .7)
        b.add(_tick(.8, 1800), 0)
    elif mat == 'wood':
        b.add(partials(f0, .3, [1, 2.4, 4.3], [1, .6, .3], [.07, .045, .03]), 0, .9)
        b.add(bp(noise(.05), f0, 3000) * ex(.05, .02), 0, .7)
        b.add(_thump(f0 * .4, .1, .03), 0, .5)
    elif mat == 'stone':
        b.add(lp(noise(.25), 1200) * ex(.25, .1), 0, .9)
        b.add(_thump(f0 * 3, .3, .08, .27), 0, 1.0)
        b.add(_tick(1.0, 3000, .01, .006), 0)
        for i in range(5):
            b.add(bp(noise(.02), 800, 4000) * ex(.02, .008), .03 + dsp.RNG.uniform(0, .15), .35)
    elif mat == 'chain':
        for i in range(7):
            r = dsp.RNG.uniform(.8, 3.3)
            b.add(partials(f0 * r, .12, [1, 2.7], [1, .4], [.06, .03]), dsp.RNG.uniform(0, .07), .45)
        b.add(_tick(.9, 3000), 0)
        b.add(_thump(f0 * .15, .1, .03), 0, .4)
    elif mat == 'crystal':
        r, a, d = BELL
        sig = partials(f0, .8, r, a, d) + .6 * partials(f0 * 1.005, .8, r, a, d)
        b.add(tremolo(sig, 9, .25), 0, .6)
        b.add(_tick(.7, 4000), 0)
        b.add(_thump(f0 * .4, .1, .04), 0, .35)
    elif mat == 'leather':
        b.add(_tick(1.0, 2500, .02, .008), 0)
        b.add(osc('sine', fq(3000, 500, .08), .08) * ex(.08, .03), 0, .5)
        b.add(bp(noise(.1), 800, 4000) * ex(.1, .04), .01, .35)
        b.add(_thump(f0, .12, .04), 0, .5)
    elif mat == 'shield':
        b.add(partials(f0, .55, [1, 1.5, 2.3, 3.1], [1, .6, .4, .3], [.3, .2, .12, .08]), 0, .8)
        b.add(_thump(f0 * .6, .2, .06, .5), 0, .9)
        b.add(lp(noise(.06), 2500) * ex(.06, .03), 0, .6)
    elif mat == 'claw':
        b.add(filt_sweep(noise(.15), 2000, 9000, 'high') * ex(.15, .07), 0, .6)
        b.add(partials(f0, .3, [1, 2.76], [1, .5], [.25, .15]), 0, .5)
        b.add(_tick(.8, 3500), 0)
    elif mat == 'regal':
        r = [1, 2.92, 5.5, 8.4]
        b.add(partials(f0, .6, r, [1, .5, .3, .2], [.45, .3, .2, .1]), 0, .75)
        b.add(_tick(.8, 3500), 0)
        b.add(partials(f0 * 3.1, .3, [1], [1], [.2]), .01, .3)
    elif mat == 'dagger':
        b.add(partials(f0, .4, [1, 2.76, 5.4], [1, .6, .35], [.22, .14, .08]), 0, .85)
        b.add(_tick(1.0, 3500), 0)
    elif mat == 'gun':
        b.add(partials(f0, .35, [1, 2.5, 4.8], [1, .6, .35], [.12, .08, .05]), 0, .8)
        b.add(_tick(1.0, 4000, .006, .002), 0)
        b.add(_tick(.5, 2500, .006, .002), .045)
    elif mat == 'glass':
        b.add(partials(f0, .6, [1, 2.32, 4.1, 6.2, 9.1], [1, .6, .4, .3, .2], [.3, .2, .15, .1, .07]), 0, .6)
        for i in range(4):
            b.add(partials(dsp.RNG.uniform(3000, 9000), .1, [1], [1], [.05]), dsp.RNG.uniform(0, .1), .35)
        b.add(_tick(.8, 5000), 0)
    elif mat == 'organic':
        b.add(bp(noise(.08), 800, 3000) * ex(.08, .02), 0, .9)
        b.add(_thump(f0, .1, .05, .3, 1.6), 0, .8)
        b.add(_tick(.8, 3000, .006, .002), .02)
    elif mat == 'zap':
        z = distort(osc('saw', fq(f0 * 3, f0 * .8, .15), .15) * ex(.15, .05), 4)
        b.add(z, 0, .6)
        r, a, d = STEEL
        b.add(partials(f0, .5, r, a, d), 0, .4)
        for i in range(6):
            b.add(_tick(.7, 2500, .006, .002), dsp.RNG.uniform(0, .15))
        b.add(hp(noise(.08), 2000) * ex(.08, .03), 0, .4)
    elif mat == 'jingle':
        for i in range(8):
            b.add(partials(f0 * dsp.RNG.uniform(1, 2.4), .25, [1, 3.1], [1, .35], [.15, .06]),
                  dsp.RNG.uniform(0, .1), .35)
        r, a, d = STEEL
        b.add(partials(f0 * .5, .4, r, a, d), 0, .35)
        b.add(_tick(.7, 3000), 0)
    elif mat == 'shovel':
        b.add(partials(f0, .5, [1, 1.8, 2.9, 4.1], [1, .7, .45, .3], [.15, .1, .07, .05]), 0, .8)
        b.add(lp(noise(.06), 3000) * ex(.06, .02), 0, .6)
        b.add(_thump(f0 * .4, .15, .05), 0, .6)
    else:
        raise ValueError(mat)
    return b.x


# ═══════════════════════════ damage taken ═══════════════════════════════════
def hurt(style, f0):
    b = Buf(.32)
    if style == 'armor':
        b.add(_thump(f0, .2, .07, .43, 1.4), 0, 1.0)
        b.add(partials(f0 * 6, .15, [1, 2.3, 4.1], [.5, .35, .2], [.09, .06, .04]), 0, .6)
        b.add(lp(noise(.06), 2500) * ex(.06, .03), 0, .5)
    elif style == 'flesh':
        b.add(_thump(f0, .22, .07, .37, 1.5), 0, 1.0)
        b.add(lp(noise(.1), 1400) * ex(.1, .045), 0, .55)
        g = osc('saw', fq(f0 * 2.1, f0 * 1.4, .16), .16)
        b.add(bp(g, 500, 1100) * ex(.16, .07, .01) * 4, .01, .5)
    elif style == 'light':
        b.add(bp(noise(.05), 1500, 5000) * ex(.05, .018), 0, .7)
        b.add(osc('square', fq(f0 * 1.6, f0 * .7, .12), .12) * ex(.12, .05), 0, .35)
        b.add(_thump(f0 * .35, .1, .04), 0, .5)
    elif style == 'ghost':
        w = sum(osc('sine', vib(fq(f0 * 1.5 * h, f0 * .8 * h, .3), .3, 8, .03), .3) / h for h in (1, 2, 3))
        b.add(w * ex(.3, .12, .02), 0, .7)
        b.add(bp(noise(.3), f0, f0 * 5) * swell(.3, .3), 0, .35)
    elif style == 'magic':
        z = osc('tri', fq(f0 * 2, f0 * .5, .2), .2) * ex(.2, .07)
        b.add(distort(z, 3), 0, .8)
        b.add(bp(noise(.08), 2000, 7000) * ex(.08, .05), 0, .5)
        for i in range(4):
            b.add(_tick(.5, 3000, .005, .002), dsp.RNG.uniform(0, .12))
    elif style == 'stone':
        b.add(lp(noise(.15), 900) * ex(.15, .08), 0, .9)
        b.add(_thump(f0, .2, .08, .25, 2.0), 0, 1.0)
        b.add(_tick(.9, 3000, .008, .004), 0)
        for i in range(4):
            b.add(bp(noise(.02), 800, 4000) * ex(.02, .008), .03 + dsp.RNG.uniform(0, .15), .3)
    elif style == 'glass':
        b.add(_tick(.9, 5000, .012, .005), 0)
        for i in range(5):
            b.add(partials(dsp.RNG.uniform(2000, 7500), .15, [1], [1], [.07]), dsp.RNG.uniform(0, .08), .4)
        b.add(_thump(f0, .08, .03), 0, .4)
    elif style == 'beast':
        g = osc('saw', fq(f0 * 1.8, f0 * .9, .22), .22)
        b.add(bp(g, f0 * 2, f0 * 6) * ex(.22, .09, .01) * 4, 0, .65)
        b.add(_thump(f0 * .5, .15, .05), 0, .7)
        b.add(lp(noise(.06), 1800) * ex(.06, .03), 0, .35)
    elif style == 'wood':
        b.add(partials(f0, .2, [1, 2.4, 3.9], [1, .6, .3], [.05, .035, .02]), 0, .9)
        b.add(bp(noise(.05), f0, 3500) * ex(.05, .02), 0, .6)
        b.add(_thump(f0 * .4, .1, .04), 0, .5)
    else:
        raise ValueError(style)
    if style == 'ghost':
        return reverb(b.x, .15, .6, .15)
    return b.x


# ═══════════════════════════ ability themes ═════════════════════════════════
def t_shield(f=440, wave='sine', dur=1.2):
    b = Buf(dur)
    for det in (1.0, 1.004, .996):
        s = osc(wave, fq(f * det, f * 2 * det, .55, 2), .55)
        if wave != 'sine':
            s = lp(s, f * 5)
        b.add(s * env_ar(.55, .8, 1.2), 0, .25)
    b.add(partials(f * 2, .7, [1, 2.7, 5.4], [1, .5, .3], [.5, .3, .15]), .5, .5)
    hum = osc('sine', f, .7) * ex(.7, .35, .05) * (1 + .3 * np.sin(2 * np.pi * 7 * T(.7)))
    b.add(hum, .5, .35)
    b.add(bp(noise(.5), f * 3, f * 8) * swell(.5, .7), 0, .12)
    return b.x


def t_blink(f=600, dur=.5):
    b = Buf(dur)
    b.add(filt_sweep(noise(.12), 5000, 400, 'low') * ex(.12, .06, .002), 0, .7)
    b.add(_tick(.8, 3000), .11)
    b.add(osc('sine', fq(f * .5, f * 3, .1, 2), .1) * ex(.1, .05), .12, .6)
    for i in range(3):
        b.add(partials(f * 4 * (1 + .3 * i), .2, [1, 2.7], [1, .4], [.1, .06]), .14 + .03 * i, .3)
    return b.x


def t_rage(f=80, dur=1.0):
    b = Buf(dur)
    fr = fq(f, f * 1.5, .9)
    g = osc('saw', fr * (1 + .03 * np.sin(2 * np.pi * 38 * T(.9))), .9)
    g = distort(lp(g, f * 14), 5) * env_ar(.9, .12, 1.2)
    b.add(g, .05, .55)
    b.add(bp(noise(.9), f * 6, f * 24) * env_ar(.9, .2, 1.5), .05, .3)
    b.add(_thump(f * 1.2, .3, .1), 0, 1.0)
    b.add(partials(f * 8, .3, [1, 2.3], [1, .5], [.15, .1]), 0, .3)
    return b.x


def t_charge(f=110, holy=False, dur=.8):
    b = Buf(dur)
    b.add(_thump(f, .3, .1, .4, 1.6), 0, 1.0)
    b.add(filt_sweep(noise(.6), 400, 4500, 'low') * env_ar(.6, .6, 1.2), .03, .6)
    b.add(osc('saw', fq(f * .8, f * 2.5, .6), .6) * env_ar(.6, .7, 1.2) * .5, .03, .3)
    if holy:
        b.add(partials(f * 6, .6, [1, 2.0, 3.0, 4.2], [1, .5, .35, .25], [.5, .35, .25, .2]), .05, .35)
    return b.x


def t_quake(f=55, dur=1.3):
    b = Buf(dur)
    b.add(osc('sine', fq(f * 1.6, f * .55, 1.0), 1.0) * ex(1.0, .45, .003), 0, 1.0)
    rum = lp(noise(1.2), 380) * tremolo(np.ones(N(1.2)), 14, .4) * ex(1.2, .5)
    b.add(rum, 0, 1.0)
    b.add(_tick(1.0, 1500, .03, .01), 0)
    for i in range(14):
        b.add(bp(noise(.03), 600, 3500) * ex(.03, .01), .1 + dsp.RNG.uniform(0, 1.0), .25)
    return b.x


def t_volley(f=400, dur=.95):
    b = Buf(dur)
    for i in range(3):
        at = i * .26
        b.add(pluck(f * 1.5, .22, .99, .9), at, .8)
        b.add(filt_sweep(noise(.16), 2000, 6000, 'high') * ex(.16, .07), at + .02, .45)
        b.add(_thump(f * .35, .1, .03), at, .5)
    b.add(bp(noise(.3), 1500, 5000) * swell(.3, .6), .6, .15)
    return b.x


def t_fire(f=150, dur=1.1):
    b = Buf(dur)
    b.add(filt_sweep(noise(1.0), 600, 3000, 'low') * env_ar(1.0, .25, 1.4), 0, .75)
    b.add(lp(noise(1.0), 300) * env_ar(1.0, .15, 1.6), 0, .8)
    b.add(osc('sine', fq(f * 1.5, f * .7, 1.0), 1.0) * ex(1.0, .5), 0, .4)
    for i in range(24):
        b.add(_tick(.5, 2500, .008, .003), dsp.RNG.uniform(0, 1.0))
    return b.x


def t_thunder(f=60, dur=1.3):
    b = Buf(dur)
    b.add(hp(noise(.03), 400) * ex(.03, .012, 0.0002), 0, 1.0)
    b.add(osc('sine', fq(f * 1.3, f * .5, 1.0), 1.0) * ex(1.0, .4), .005, .9)
    b.add(lp(noise(1.2), 500) * ex(1.2, .5), .01, .8)
    z = distort(osc('saw', fq(2500, 200, .25), .25) * ex(.25, .08), 4)
    b.add(z, 0, .4)
    for i in range(12):
        b.add(_tick(.7, 3000, .006, .002), dsp.RNG.uniform(0, .5))
    return reverb(b.x, .15, 1.0, .2)


def t_arpeggio(f=440, scale=(0, 4, 7, 12, 16, 19), wave='sine', dur=1.0, step=.085):
    b = Buf(dur)
    for i, s in enumerate(scale):
        nf = f * 2 ** (s / 12)
        sig = osc(wave, nf, .4)
        if wave != 'sine':
            sig = lp(sig, nf * 4)
        b.add(sig * ex(.4, .15, .004) + .4 * partials(nf * 2, .3, [1, 2.7], [1, .3], [.12, .06]), i * step, .35)
    b.add(hp(noise(.5), 6000) * swell(.5, .3), .05, .1)
    return reverb(b.x, .2, 1.0, .35)


def t_holy(f=330, dur=1.4):
    b = Buf(dur)
    for r, a in ((1, 1), (1.5, .6), (2, .5), (2.5, .35), (3, .25)):
        s = osc('sine', vib(f * r, 1.2, 5.5, .006), 1.2) * env_ar(1.2, .3, 1.3)
        b.add(s, .05, .22 * a)
    b.add(partials(f * 2, .9, [1, 2.7, 5.4], [1, .5, .3], [.6, .35, .2]), 0, .6)
    b.add(_tick(.5, 4000), 0)
    return reverb(b.x, .25, 1.2, .35)


def t_bubbles(f=600, dur=1.0):
    b = Buf(dur)
    b.add(partials(f * 3, .3, [1, 2.3, 4.1], [1, .6, .3], [.12, .08, .05]), 0, .5)
    b.add(lp(noise(.9), 900) * swell(.9, .4), .05, .35)
    for i in range(22):
        at = .05 + dsp.RNG.uniform(0, .85)
        fr = f * dsp.RNG.uniform(.5, 1.6)
        b.add(osc('sine', fq(fr, fr * 2.2, .07), .07) * ex(.07, .03, .002), at, .4)
    return b.x


def t_void(f=55, dur=1.5):
    b = Buf(dur)
    for det in (1.0, 1.012):
        s = filt_sweep(osc('saw', f * det, 1.4), 1500, 120, 'low') * env_ar(1.4, .35, 1.2)
        b.add(s, 0, .3)
    b.add(osc('sine', fq(f * 2, f * .5, 1.4), 1.4) * env_ar(1.4, .3, 1.2), 0, .6)
    b.add(filt_sweep(noise(1.0), 200, 6000, 'high') * env_ar(1.0, .85, 2.0), 0, .3)
    wub = tremolo(osc('sine', f * 3, 1.0) * env_ar(1.0, .4, 1.3), 9, .8)
    b.add(wub, .1, .3)
    return reverb(b.x, .3, 1.4, .5)


def t_water(f=330, dur=1.1):
    b = Buf(dur)
    for k, at in enumerate((0, .45)):
        b.add(filt_sweep(noise(.5), 500, 2200, 'low') * env_ar(.5, .6, 1.3), at, .55)
        b.add(bp(noise(.3), 1000, 4000) * ex(.3, .12), at + .2, .3)
    for i in range(14):
        fr = f * dsp.RNG.uniform(.8, 2.4)
        b.add(osc('sine', fq(fr, fr * 1.9, .06), .06) * ex(.06, .025, .002), dsp.RNG.uniform(0, .9), .35)
    b.add(_thump(f * .4, .2, .08), 0, .5)
    return b.x


def t_swarm(f=2500, dur=1.25):
    b = Buf(dur)
    fl = tremolo(bp(noise(1.1), 1500, 4200) * env_ar(1.1, .25, 1.3), 26, .7)
    b.add(fl, .05, .6)
    for i in range(16):
        fr = f * dsp.RNG.uniform(.8, 1.6)
        b.add(osc('sine', fq(fr, fr * 1.7, .06), .06) * ex(.06, .03, .002), dsp.RNG.uniform(.05, 1.1), .3)
    b.add(_thump(70, .25, .08), 0, .9)
    b.add(osc('sine', fq(220, 90, 1.0), 1.0) * env_ar(1.0, .3, 1.5), 0, .25)
    return b.x


def t_whip(f=1.0, dur=.5):
    b = Buf(dur)
    b.add(_tick(1.0, 2500, .015, .005), .08)
    b.add(osc('sine', fq(4000, 400, .1), .1) * ex(.1, .03), .08, .5)
    b.add(filt_sweep(noise(.08), 800, 5000, 'low') * env_ar(.08, .9, 1.2), 0, .5)
    b.add(bp(noise(.3), 1000, 3500) * ex(.3, .1), .09, .25)
    return b.x


def t_gong(f=196, dur=1.7):
    b = Buf(dur)
    b.add(partials(f, 1.7, [1, 1.47, 2.09, 2.56, 3.0, 3.96], [1, .7, .55, .4, .3, .2], [1.0, .8, .6, .5, .4, .3], .004), .1, .6)
    b.add(partials(f * 1.006, 1.7, [1, 1.47, 2.09], [.6, .4, .3], [1.0, .8, .6], .004), .1, .4)
    b.add(bp(noise(.2), 300, 1800) * ex(.2, .06), 0, .6)
    b.add(filt_sweep(noise(.4), 400, 4000, 'low') * env_ar(.4, .9, 2), 0, .25)
    return reverb(b.x, .2, 1.0, .3)


def t_jingle(f=1200, dur=1.0):
    b = Buf(dur)
    for i in range(14):
        fr = f * dsp.RNG.choice([1, 1.25, 1.5, 2, 2.5])
        b.add(partials(fr, .3, [1, 3.1], [1, .35], [.14, .06]), i * .06 + dsp.RNG.uniform(0, .03), .35)
    b.add(osc('sine', fq(300, 120, .3), .3) * ex(.3, .12), 0, .5)
    return reverb(b.x, .15, .8, .2)


def t_fanfare(f=220, wave='saw', dur=1.3, notes=(0, 4, 7, 12), deep=False):
    b = Buf(dur)
    for i, s in enumerate(notes):
        nf = f * 2 ** (s / 12)
        sig = lp(osc(wave, nf, .55), nf * 6) * env_ar(.55, .08, 1.4)
        sig += .5 * lp(osc('square', nf * 1.003, .55), nf * 4) * env_ar(.55, .08, 1.4)
        b.add(sig, i * .12, .3)
    if deep:
        b.add(_thump(f * .5, .5, .2), 0, .9)
        b.add(lp(noise(.5), 400) * ex(.5, .2), 0, .5)
    for i in range(4):
        b.add(_thump(110, .12, .04), .55 + i * .08, .4)
    b.add(partials(f * 4, .8, [1, 2.7], [1, .4], [.4, .2]), .4, .25)
    return reverb(b.x, .25, 1.1, .35)


def t_hook(f=300, dur=.75):
    b = Buf(dur)
    for i in range(8):
        fr = f * dsp.RNG.uniform(5, 9)
        b.add(partials(fr, .08, [1, 2.4], [1, .4], [.03, .02]), i * .025, .4)
    b.add(filt_sweep(noise(.3), 600, 3500, 'low') * env_ar(.3, .5, 1.3), .15, .55)
    b.add(osc('sine', fq(f * 1.2, f * 3, .3), .3) * env_ar(.3, .6, 1.2), .15, .25)
    b.add(partials(f * 2, .3, [1, 2.3, 4.1], [1, .5, .3], [.1, .06, .04]), .45, .6)
    b.add(_thump(f * .5, .2, .06), .45, .8)
    return b.x


def t_squeaks(f=3000, dur=.95):
    b = Buf(dur)
    for i in range(9):
        fr = f * dsp.RNG.uniform(.7, 1.3)
        d = dsp.RNG.uniform(.05, .1)
        b.add(osc('sine', vib(fq(fr, fr * 1.6, d), d, 30, .05), d) * ex(d, d / 2, .003),
              i * .09 + dsp.RNG.uniform(0, .04), .35)
    for i in range(28):
        b.add(_tick(.4, 2000, .006, .002), dsp.RNG.uniform(0, .9))
    return b.x


def t_curse(f=110, dur=1.3):
    b = Buf(dur)
    for r in (1, 1.0595, 1.414):
        s = osc('saw', fq(f * r * 2, f * r * .8, 1.2), 1.2)
        b.add(lp(s, f * 8) * env_ar(1.2, .35, 1.2), 0, .22)
    b.add(bp(noise(1.2), 2000, 6000) * swell(1.2, .5), 0, .2)
    b.add(partials(f * 8, .8, [1, 2.7], [1, .4], [.5, .3]), .4, .3)
    return reverb(b.x, .3, 1.3, .4)


def t_lock(f=900, dur=.85):
    b = Buf(dur)
    t = 0.0
    gap = .09
    for i in range(7):
        b.add(_tick(.9, 2500, .008, .003), t)
        b.add(partials(f * 1.4, .05, [1, 2.4], [1, .4], [.025, .015]), t, .25)
        t += gap
        gap *= .84
    b.add(partials(f * .4, .3, [1, 2.3, 4.1], [1, .6, .3], [.12, .08, .05]), t + .02, .8)
    b.add(_thump(f * .15, .15, .05), t + .02, .8)
    for i in range(5):
        b.add(partials(f * dsp.RNG.uniform(3, 6), .2, [1, 2.7], [1, .3], [.1, .05]), t + .1 + i * .035, .3)
    return b.x


def t_shatter(f=3000, dur=.85):
    b = Buf(dur)
    b.add(hp(noise(.12), 3000) * ex(.12, .05, .0005), 0, .9)
    b.add(_thump(160, .1, .03), 0, .6)
    for i in range(26):
        fr = dsp.RNG.uniform(2500, 10000)
        b.add(partials(fr, .2, [1], [1], [.06]), dsp.RNG.uniform(0, .5), .3)
    return b.x


def t_gunshot(f=180, dur=.8):
    b = Buf(dur)
    b.add(filt_sweep(noise(.25), 7000, 500, 'low') * ex(.25, .07, .0003), 0, 1.0)
    b.add(osc('sine', fq(f, 45, .25), .25) * ex(.25, .09, .0005), 0, 1.0)
    b.add(partials(1800, .5, [1, 2.5, 4.4], [1, .5, .3], [.2, .12, .08]), .01, .3)
    return reverb(b.x, .2, 1.1, .25)


def t_sheriff(f=180, dur=1.15):
    b = Buf(dur)
    b.add(tremolo(bp(noise(.3), 600, 3000) * env_ar(.3, .8, 1.2), 30, .7), 0, .5)
    b.add(osc('sine', fq(300, 1200, .3), .3) * env_ar(.3, .8, 1.2) * tremolo(np.ones(N(.3)), 30, .6), 0, .25)
    b.add(distort(osc('saw', fq(3500, 400, .2), .2) * ex(.2, .08), 3), .32, .55)
    b.add(bp(noise(.2), 2000, 8000) * ex(.2, .06), .32, .3)
    b.add(t_gunshot(f * .7, .55), .6, 1.0)
    return b.x


def t_strum(f=220, dur=1.15):
    b = Buf(dur)
    for i, s in enumerate((0, 4, 7, 12)):
        b.add(pluck(f * 2 ** (s / 12), .8, .997, .55), i * .018, .5 + .1 * i)
    out = echo(b.x, .14, .45, .6, 3)
    return reverb(out[:N(dur)], .2, 1.0, .3)


def t_copy(f=440, dur=1.0):
    b = Buf(dur)
    b.add(osc('saw', fq(f * .5, f * 2, .5), .5) * env_ar(.5, .8, 1.2), 0, .22)
    b.add(osc('saw', fq(f * 2, f * .5, .5), .5) * env_ar(.5, .2, 1.2), 0, .22)
    both = ringmod(osc('sine', fq(f, f * 1.5, .4), .4), 90) * env_ar(.4, .5, 1.3)
    b.add(both, .15, .35)
    b.add(partials(f * 1.5, .5, [1, 1.26, 1.5], [1, .8, .8], [.3, .3, .3]), .5, .4)
    b.add(_tick(.7, 4000), .5)
    return reverb(b.x, .15, .8, .2)


def t_net(f=200, dur=1.05):
    b = Buf(dur)
    b.add(filt_sweep(noise(.35), 500, 4500, 'low') * env_ar(.35, .6, 1.3), 0, .6)
    for i in range(6):
        b.add(_tick(.5, 2500, .01, .004), .15 + i * .035)
    crowd = bp(noise(.7), 400, 1800) * swell(.7, .5)
    crowd = tremolo(crowd, 11, .3)
    b.add(crowd, .3, .55)
    b.add(bp(osc('saw', fq(f * 1.2, f * 1.5, .4), .4), 500, 1300) * env_ar(.4, .4, 1.2), .35, .6)
    b.add(_thump(f * .5, .2, .06), .1, .6)
    return b.x


def t_leap(f=140, dur=1.35):
    b = Buf(dur)
    b.add(filt_sweep(noise(.4), 300, 4000, 'low') * env_ar(.4, .9, 1.2), 0, .5)
    b.add(osc('sine', fq(f * 2, f * 8, .4), .4) * env_ar(.4, .9, 1.2), 0, .25)
    b.add(osc('sine', fq(f * 12, f * 3, .45, 1.5), .45) * env_ar(.45, .1, 1.3), .5, .25)
    b.add(_thump(f * .9, .4, .15, .3, 2.2), .98, 1.0)
    b.add(lp(noise(.4), 1500) * ex(.4, .12), .98, .8)
    b.add(partials(f * 6, .5, [1, 2.76, 5.4], [1, .6, .3], [.3, .2, .1]), .98, .5)
    return b.x


def t_slowfield(f=200, dur=1.25):
    b = Buf(dur)
    b.add(osc('sine', fq(f * 3, f * .6, 1.0, .5), 1.0) * ex(1.0, .6, .01), 0, .5)
    b.add(osc('sine', f * .5, 1.2) * env_ar(1.2, .2, 1.2) * (1 + .3 * np.sin(2 * np.pi * 4 * T(1.2))), 0, .5)
    t, g = 0.0, .13
    while t < 1.0:
        b.add(partials(f * 4, .15, [1, 2.76], [1, .4], [.08, .05]), t, .3)
        t += g
        g *= 1.18
    b.add(partials(f * 2, .9, [1, 2.76, 5.4], [1, .5, .3], [.6, .4, .2]), 0, .3)
    return reverb(b.x, .2, 1.1, .3)


def t_stab(f=900, dur=.5):
    b = Buf(dur)
    b.add(bp(noise(.1), f, f * 6) * env_ar(.1, .3, 1.0), 0, .5)
    b.add(partials(f * 2, .3, [1, 2.76], [1, .5], [.2, .1]), .06, .5)
    b.add(_thump(160, .1, .04), .06, .8)
    b.add(_tick(.6, 3500), .06)
    for i in range(4):
        b.add(osc('sine', fq(900, 300, .04), .04) * ex(.04, .02), .15 + i * .07, .3)
    return b.x


def t_slash(f=1800, dur=.6):
    b = Buf(dur)
    b.add(filt_sweep(noise(.12), 1500, 8000, 'low') * env_ar(.12, .5, 1.2), 0, .6)
    b.add(filt_sweep(noise(.12), 8000, 1500, 'low') * env_ar(.12, .5, 1.2), .09, .5)
    b.add(partials(f, .45, [1, 2.76, 5.4], [1, .5, .3], [.35, .2, .1]), .1, .6)
    b.add(_tick(.7, 4000), .1)
    return b.x


def t_phase(f=500, dur=.85):
    b = Buf(dur)
    s = osc('sine', fq(f * 2, f * .7, .7, 1.4), .7) * env_ar(.7, .2, 1.4)
    b.add(s + .7 * np.roll(s, int(.007 * SR)), 0, .35)
    b.add(filt_sweep(noise(.5), 6000, 600, 'low') * swell(.5, .3), 0, .4)
    b.add(partials(f * 3, .6, [1, 2, 3], [1, .5, .3], [.4, .3, .2]), .15, .3)
    b.add(partials(f * 5, .5, [1, 2.7], [1, .4], [.3, .15]), .0, .2)
    return reverb(b.x, .25, 1.0, .25)


def t_creak(f=200, dur=1.05):
    b = Buf(dur)
    wob = np.cumsum(dsp.RNG.normal(0, 1, N(.9))) / 60
    wob = wob - wob.mean()
    fr = f * 2 ** (wob.clip(-1, 1) * .6) * np.linspace(1, 2.2, N(.9))
    s = bp(osc('saw', fr, .9), 500, 1400) * env_ar(.9, .3, 1.3)
    b.add(s * 4, .05, .5)
    b.add(bp(noise(.9), 2000, 6000) * swell(.9, .5), 0, .22)
    b.add(_thump(f * .5, .2, .07), 0, .7)
    for i in range(10):
        b.add(_tick(.4, 2000, .01, .004), dsp.RNG.uniform(.1, .9))
    return b.x


def t_beast(f=330, dur=1.4):
    b = Buf(dur)
    fr = vib(np.interp(np.linspace(0, 1, N(1.2)), [0, .35, 1], [f, f * 1.7, f * 1.25]), 1.2, 5.5, .02)
    h = bp(osc('saw', fr, 1.2), f * 1.5, f * 5) * env_ar(1.2, .25, 1.2) * 3
    b.add(h, .05, .55)
    b.add(osc('sine', fr, 1.2) * env_ar(1.2, .25, 1.2), .05, .3)
    b.add(bp(noise(1.2), 1500, 5000) * env_ar(1.2, .3, 1.4), .05, .1)
    b.add(_thump(90, .2, .07), 0, .7)
    return reverb(b.x, .2, 1.1, .2)


def t_hex(f=300, dur=1.05):
    b = Buf(dur)
    b.add(osc('sine', fq(f, f * .7, .9), .9) * env_ar(.9, .3, 1.2), 0, .35)
    b.add(osc('sine', fq(f * 1.414, f * .9, .9), .9) * env_ar(.9, .3, 1.2), 0, .3)
    b.add(bp(noise(.9), 2500, 7000) * swell(.9, .4), 0, .25)
    for i in range(3):
        b.add(partials(f * 3 * (1 + i * .5), .2, [1, 2.76], [1, .4], [.1, .06]), .25 + i * .1, .35)
    return reverb(b.x, .25, 1.0, .3)


def t_overload(f=90, dur=1.2):
    b = Buf(dur)
    n = N(.65)
    chg = osc('saw', fq(f, f * 9, .65, 2.0), .65) * np.linspace(0, 1, n) ** 1.5
    chg *= 1 + .5 * np.sin(2 * np.pi * np.cumsum(np.linspace(6, 40, n)) / SR)
    b.add(lp(chg, 4000), 0, .4)
    b.add(_thump(f * .8, .5, .2, .3, 2.0), .66, 1.0)
    b.add(lp(noise(.5), 3000) * ex(.5, .15), .66, .7)
    b.add(hp(noise(.4), 5000) * ex(.4, .15), .66, .3)
    return reverb(b.x, .2, 1.1, .3)


def t_wish(f=880, dur=1.05):
    b = Buf(dur)
    pent = (0, 2, 4, 7, 9, 12, 14, 16)
    for i, s in enumerate(pent):
        nf = f * 2 ** (s / 12)
        b.add(partials(nf, .35, [1, 2.0, 3.0], [1, .4, .2], [.2, .12, .08]), i * .065, .35)
    b.add(partials(f * 2, .8, [1, 2.76, 5.4], [1, .5, .3], [.6, .35, .2]), .5, .35)
    b.add(hp(noise(.6), 7000) * swell(.6, .4), .1, .12)
    return reverb(b.x, .25, 1.0, .3)


def t_foresight(f=528, dur=1.35):
    b = Buf(dur)
    rv = partials(f, .8, [1, 2.0, 3.0, 4.2], [1, .6, .4, .3], [.5, .4, .3, .2], .001)[::-1] * env_ar(.8, .95, 1.0)
    b.add(rv, 0, .5)
    b.add(partials(f * 2, .6, [1, 2.76, 5.4], [1, .5, .3], [.4, .25, .12]), .8, .5)
    b.add(tremolo(osc('sine', f * .5, 1.2) * env_ar(1.2, .4, 1.3), 5, .4), 0, .3)
    out = echo(b.x, .11, .5, .5, 3)
    return reverb(out[:N(dur)], .25, 1.1, .3)


def t_exhume(f=90, dur=1.25):
    b = Buf(dur)
    b.add(lp(noise(.3), 700) * ex(.3, .1), 0, 1.0)
    b.add(_thump(f, .3, .1, .4, 1.8), 0, 1.0)
    b.add(partials(f * 4, .5, [1, 1.8, 2.9, 4.1], [1, .7, .45, .3], [.15, .1, .07, .05]), .2, .7)
    b.add(filt_sweep(noise(.8), 200, 1500, 'low') * env_ar(.8, .6, 1.3), .3, .5)
    moan = osc('sine', vib(fq(f * 2.5, f * 3.5, .8), .8, 5, .03), .8) * env_ar(.8, .4, 1.3)
    b.add(moan, .35, .35)
    return reverb(b.x, .25, 1.2, .35)


def t_penitence(f=98, dur=1.35):
    b = Buf(dur)
    for at in (0, .16):
        b.add(_tick(1.0, 2500, .015, .005), at)
        b.add(osc('sine', fq(4000, 400, .1), .1) * ex(.1, .03), at, .5)
    b.add(partials(f * 2, 1.2, [1, 2.4, 3.8, 5.1], [1, .6, .4, .3], [.8, .6, .4, .3], .003), .3, .7)
    for r in (1, 1.5, 2):
        b.add(osc('sine', vib(f * r * 1.5, 1.0, 5, .005), 1.0) * env_ar(1.0, .35, 1.3), .25, .18)
    b.add(_thump(f * .8, .3, .1), .3, .8)
    return reverb(b.x, .3, 1.2, .4)


def t_phalanx(f=110, dur=.85):
    b = Buf(dur)
    for i in range(3):
        b.add(_thump(f, .15, .05, .5, 1.6), i * .13, .7)
    for i in range(10):
        b.add(partials(dsp.RNG.uniform(2500, 5000), .08, [1, 2.4], [1, .4], [.03, .02]), .35 + dsp.RNG.uniform(0, .15), .25)
    b.add(partials(f * 2, .4, [1, 1.5, 2.3, 3.1], [1, .6, .4, .3], [.25, .18, .12, .08]), .4, .75)
    b.add(_thump(f * .6, .2, .06), .4, .9)
    sh = bp(osc('saw', fq(f * 1.6, f * 1.2, .25), .25), 500, 1100) * ex(.25, .1, .01) * 4
    b.add(sh, .02, .4)
    return b.x


def t_royal(f=330, wave='square', dur=1.3, deep=False, queen=False):
    if queen:
        b = Buf(dur)
        for i, s in enumerate((0, 4, 7, 12, 16, 19)):
            b.add(pluck(f * 2 ** (s / 12), .5, .995, .8), i * .06, .5)
        b.add(partials(f * 4, .9, [1, 2.76, 5.4], [1, .5, .3], [.5, .3, .15]), .3, .3)
        b.add(t_stab(f * 2, .4), .38, .4)
        return reverb(b.x, .22, 1.0, .3)
    return t_fanfare(f, wave, dur, (0, 7, 12, 16), deep)


def t_ember(f=700, dur=1.15):
    b = Buf(dur)
    b.add(filt_sweep(noise(1.0), 800, 5000, 'low') * env_ar(1.0, .3, 1.4), 0, .6)
    scr = bp(osc('saw', vib(fq(f, f * 2.4, .8, 1.5), .8, 12, .03), .8), f, f * 6) * env_ar(.8, .5, 1.3) * 3
    b.add(scr, .05, .4)
    b.add(partials(f * 2, .6, [1, 2.0, 3.0, 4.2], [1, .5, .35, .25], [.4, .3, .2, .15]), .5, .3)
    for i in range(18):
        b.add(_tick(.5, 3000, .008, .003), dsp.RNG.uniform(0, 1.0))
    return reverb(b.x, .15, .9, .2)


def t_pyre(f=80, dur=1.3):
    b = Buf(dur)
    b.add(lp(noise(1.2), 350) * env_ar(1.2, .2, 1.3), 0, .9)
    b.add(filt_sweep(noise(1.1), 500, 2800, 'low') * env_ar(1.1, .3, 1.3), 0, .5)
    for r in (1, 1.5):
        b.add(osc('sine', vib(f * 2 * r, 1.1, 5, .004), 1.1) * env_ar(1.1, .3, 1.3), .1, .22)
    b.add(_thump(f, .3, .1), 0, .8)
    for i in range(30):
        b.add(_tick(.5, 2500, .008, .003), dsp.RNG.uniform(0, 1.2))
    return reverb(b.x, .15, .9, .2)


def t_infect(f=300, dur=1.1):
    b = Buf(dur)
    b.add(_tick(.8, 3000), 0)
    b.add(partials(f * 6, .15, [1, 2.7], [1, .4], [.06, .03]), 0, .4)
    b.add(osc('sine', fq(f * 2, f * 4, .08), .08) * ex(.08, .04), .05, .4)
    sick = lp(osc('saw', f * .5 * (1 + .04 * np.sin(2 * np.pi * 5 * T(.9))), .9), f * 3) * env_ar(.9, .3, 1.3)
    b.add(sick, .1, .4)
    for i in range(16):
        fr = f * dsp.RNG.uniform(.6, 1.4)
        b.add(osc('sine', fq(fr, fr * 2, .06), .06) * ex(.06, .025, .002), .1 + dsp.RNG.uniform(0, .9), .3)
    return b.x


def t_rods(f=440, dur=1.2):
    b = Buf(dur)
    b.add(distort(osc('saw', fq(2500, 300, .1), .1) * ex(.1, .04), 4), 0, .35)                    # lightning
    b.add(filt_sweep(noise(.18), 700, 3000, 'low') * env_ar(.18, .5, 1.2), .2, .5)                  # fire
    b.add(osc('sine', fq(f, f * 2, .09), .09) * ex(.09, .04), .44, .5)                              # water blip
    b.add(osc('sine', fq(f * 2.2, f * 1.6, .07), .07) * ex(.07, .03), .5, .4)
    b.add(bp(noise(.2), 1500, 5000) * env_ar(.2, .5, 1.4), .62, .35)                               # wind
    b.add(_thump(f * .25, .2, .07, .4), .86, 1.0)                                                   # earth
    b.add(partials(f * 2, .5, [1, 2.0, 3.0], [1, .5, .3], [.3, .2, .12]), .9, .4)
    return reverb(b.x, .2, 1.0, .25)


# ═══════════════════════════ projectile sounds ═════════════════════════════
def proj_throw(kind, f=1.0):
    if kind == 'arrow':
        b = Buf(.2)
        b.add(pluck(300, .2, .985, .9), 0, .7)
        b.add(filt_sweep(noise(.14), 2000, 6000, 'high') * ex(.14, .06), .01, .4)
    elif kind == 'zip':
        b = Buf(.18)
        b.add(osc('sine', fq(600, 1900, .12), .12) * env_ar(.12, .5, 1.3), 0, .5)
        b.add(hp(noise(.1), 6000) * ex(.1, .04), 0, .15)
    elif kind == 'skull':
        b = Buf(.25)
        b.add(lp(osc('saw', fq(200, 90, .22), .22), 700) * env_ar(.22, .2, 1.5), 0, .45)
        b.add(bp(noise(.22), 1500, 5000) * swell(.22, .4), 0, .18)
    elif kind == 'gunshot':
        b = Buf(.25)
        b.add(filt_sweep(noise(.15), 7000, 600, 'low') * ex(.15, .045, .0003), 0, 1.0)
        b.add(osc('sine', fq(200, 55, .15), .15) * ex(.15, .05, .0005), 0, .9)
    elif kind == 'chime':
        b = Buf(.35)
        b.add(partials(880, .35, [1, 2.76, 5.4], [1, .4, .2], [.2, .12, .06]), 0, .6)
    elif kind == 'note':
        b = Buf(.3)
        b.add(pluck(330, .3, .993, .6), 0, .8)
    elif kind == 'hex':
        b = Buf(.25)
        b.add(osc('sine', fq(420, 240, .2), .2) * env_ar(.2, .2, 1.4), 0, .35)
        b.add(bp(noise(.22), 2500, 7000) * swell(.22, .4), 0, .25)
    elif kind == 'sparkle':
        b = Buf(.14)
        b.add(partials(2400, .14, [1, 1.5], [1, .5], [.05, .03]), 0, .4)
        b.add(partials(3600, .1, [1], [1], [.03]), .03, .3)
    elif kind == 'rune':
        b = Buf(.2)
        g = osc('saw', np.interp(np.linspace(0, 1, N(.15)), [0, .5, 1], [170, 230, 150]), .15)
        b.add(bp(g, 600, 900) * ex(.15, .07, .01) * 4, 0, .6)
    elif kind == 'cannon':
        b = Buf(.35)
        b.add(_thump(110, .3, .1, .3, 2.0), 0, 1.0)
        b.add(filt_sweep(noise(.25), 3000, 300, 'low') * ex(.25, .08), 0, .6)
        b.add(osc('sine', fq(300, 900, .2), .2) * env_ar(.2, .7, 1.2), .0, .2)
    elif kind == 'flask':
        b = Buf(.25)
        b.add(partials(1800, .12, [1, 2.4], [1, .4], [.05, .03]), 0, .5)
        b.add(filt_sweep(noise(.2), 800, 3500, 'low') * env_ar(.2, .5, 1.3), .02, .4)
    elif kind == 'splash':
        b = Buf(.22)
        b.add(osc('sine', fq(350, 900, .1), .1) * ex(.1, .04, .002), 0, .6)
        b.add(bp(noise(.15), 800, 3500) * ex(.15, .06), 0, .35)
    else:
        raise ValueError(kind)
    return b.x


def proj_hit(kind, f=1.0):
    if kind == 'arrow':
        b = Buf(.2)
        b.add(_thump(180, .12, .045, .5, 1.3), 0, 1.0)
        b.add(lp(noise(.06), 1800) * ex(.06, .03), 0, .5)
        b.add(partials(700, .08, [1, 2.4], [1, .4], [.03, .02]), 0, .3)
    elif kind == 'elemental':
        b = Buf(.3)
        b.add(bp(noise(.1), 800, 5000) * ex(.1, .04), 0, .7)
        b.add(osc('sine', fq(1300, 300, .12), .12) * ex(.12, .05), 0, .6)
        b.add(partials(1500, .3, [1, 2.0, 3.0], [1, .5, .3], [.12, .08, .05]), 0, .35)
    elif kind == 'skull':
        b = Buf(.3)
        b.add(lp(noise(.12), 1600) * ex(.12, .05), 0, .8)
        b.add(_thump(140, .15, .05), 0, .8)
        b.add(bp(noise(.25), 3000, 8000) * swell(.25, .3), .02, .2)
    elif kind == 'ricochet':
        b = Buf(.4)
        b.add(_tick(1.0, 3000, .01, .004), 0)
        b.add(osc('tri', fq(2800, 800, .3), .3) * ex(.3, .1), .005, .45)
        b.add(partials(1600, .35, [1, 2.5, 4.4], [1, .5, .3], [.2, .12, .08]), 0, .35)
    elif kind == 'holy':
        b = Buf(.4)
        b.add(partials(1320, .4, [1, 2.0, 3.0, 4.2], [1, .5, .35, .25], [.25, .18, .12, .08]), 0, .6)
        b.add(hp(noise(.2), 6000) * ex(.2, .08), 0, .15)
    elif kind == 'clang_note':
        b = Buf(.35)
        b.add(partials(440, .3, [1, 1.414, 2.1], [1, .8, .5], [.18, .15, .1]), 0, .5)
        b.add(_tick(.6, 2500), 0)
    elif kind == 'hex':
        b = Buf(.3)
        b.add(bp(noise(.28), 2000, 7000) * ex(.28, .1), 0, .5)
        b.add(osc('sine', fq(500, 180, .2), .2) * ex(.2, .08), 0, .5)
        b.add(_thump(120, .1, .04), 0, .5)
    elif kind == 'pop':
        b = Buf(.15)
        b.add(osc('sine', fq(2800, 1400, .08), .08) * ex(.08, .03), 0, .5)
        b.add(partials(3500, .12, [1, 1.5], [1, .5], [.04, .03]), 0, .3)
    elif kind == 'rune':
        b = Buf(.3)
        b.add(lp(noise(.06), 2500) * ex(.06, .025), 0, .5)
        b.add(partials(660, .3, [1, 2.0, 3.0], [1, .4, .2], [.15, .1, .06]), .01, .5)
    elif kind == 'explosion':
        b = Buf(.55)
        b.add(filt_sweep(noise(.45), 3500, 200, 'low') * ex(.45, .15, .0005), 0, 1.0)
        b.add(_thump(90, .5, .18, .3, 1.8), 0, 1.0)
        b.add(hp(noise(.15), 4000) * ex(.15, .05), 0, .25)
    elif kind == 'shatter':
        b = Buf(.4)
        b.add(hp(noise(.1), 3000) * ex(.1, .04, .0005), 0, .8)
        for i in range(10):
            b.add(partials(dsp.RNG.uniform(2500, 9000), .12, [1], [1], [.05]), dsp.RNG.uniform(0, .2), .3)
        b.add(bp(noise(.25), 500, 2500) * ex(.25, .1), .02, .3)
    elif kind == 'splash':
        b = Buf(.35)
        b.add(bp(noise(.3), 800, 3500) * ex(.3, .1), 0, .6)
        b.add(osc('sine', fq(500, 150, .12), .12) * ex(.12, .05), 0, .5)
        for i in range(5):
            b.add(osc('sine', fq(700, 1500, .05), .05) * ex(.05, .02, .002), .03 + i * .03, .25)
    else:
        raise ValueError(kind)
    return b.x
