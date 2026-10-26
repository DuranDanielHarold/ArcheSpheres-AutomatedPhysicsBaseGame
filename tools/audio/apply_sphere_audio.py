#!/usr/bin/env python3
"""Rewrite every `SPHERE_AUDIO.<key> = {...};` block in js/classes/<key>.js
from audio/manifest.json, and set ARENA_AUDIO.bgm in js/data/audioConfig.js.

Idempotent and text-only: nothing else in those files is touched.
Run from the repo root:   python tools/audio/apply_sphere_audio.py
Add --check to only report what would change (exit 1 if anything differs).
"""
import json, os, re, sys

SLOT_ORDER = ['weaponCollision', 'damage', 'ability', 'projectileThrow', 'projectileHit']
BLOCK = re.compile(r'SPHERE_AUDIO\.(\w+) = \{.*?\n\};', re.S)


def main():
    check = '--check' in sys.argv
    manifest = json.load(open('audio/manifest.json', encoding='utf-8'))
    audio = manifest['sphereAudio']
    changed, problems = [], []

    for key, slots in sorted(audio.items()):
        path = f'js/classes/{key}.js'
        if not os.path.exists(path):
            problems.append(f'missing class file: {path}')
            continue
        src = open(path, encoding='utf-8', newline='').read()
        eol = '\r\n' if '\r\n' in src else '\n'
        found = [m for m in BLOCK.finditer(src) if m.group(1) == key]
        if len(found) != 1:
            problems.append(f'{path}: expected exactly 1 SPHERE_AUDIO.{key} block, found {len(found)}')
            continue
        for rel in slots.values():
            if not os.path.exists(rel):
                problems.append(f'{path}: audio file missing on disk: {rel}')
        lines = [f'  "{s}": "{slots[s]}"' for s in SLOT_ORDER if s in slots]
        new = f'SPHERE_AUDIO.{key} = {{{eol}' + (',' + eol).join(lines) + f'{eol}}};'
        if found[0].group(0) != new:
            changed.append(path)
            if not check:
                out = src[:found[0].start()] + new + src[found[0].end():]
                open(path, 'w', encoding='utf-8', newline='').write(out)

    cfg = 'js/data/audioConfig.js'
    bgm = manifest['arena']['bgm']
    src = open(cfg, encoding='utf-8', newline='').read()
    pat = re.compile(r"(const ARENA_AUDIO = \{\s*bgm:\s*)'[^']*'")
    if not pat.search(src):
        problems.append(f'{cfg}: ARENA_AUDIO.bgm line not found')
    elif f"bgm: '{bgm}'" not in src:
        changed.append(cfg)
        if not check:
            open(cfg, 'w', encoding='utf-8', newline='').write(pat.sub(lambda m: f"{m.group(1)}'{bgm}'", src, count=1))

    # every class in DEF should have an entry
    for f in sorted(os.listdir('js/classes')):
        k = f[:-3]
        if f.endswith('.js') and k != 'normalize-stats' and k not in audio:
            problems.append(f'class {k} has no entry in manifest.json')

    print(('would change' if check else 'changed'), len(changed), 'file(s)')
    for c in changed:
        print('  ', c)
    for p in problems:
        print('PROBLEM:', p)
    sys.exit(1 if problems or (check and changed) else 0)


if __name__ == '__main__':
    main()
