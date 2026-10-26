#!/usr/bin/env python3
"""Validate manifest audio paths and generated class/config registrations."""
import json
import os
import re
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))


def main():
    os.chdir(ROOT)
    errors = []
    with open("audio/manifest.json", encoding="utf-8") as f:
        manifest = json.load(f)

    audio = manifest.get("sphereAudio", {})
    for key, slots in audio.items():
        class_path = f"js/classes/{key}.js"
        if not os.path.isfile(class_path):
            errors.append(f"missing class file: {class_path}")
        else:
            with open(class_path, encoding="utf-8") as f:
                source = f.read()
            blocks = list(re.finditer(rf"SPHERE_AUDIO\.{re.escape(key)}\s*=\s*\{{(.*?)\n\}};", source, re.S))
            if len(blocks) != 1:
                errors.append(f"{class_path}: expected exactly one SPHERE_AUDIO.{key} block")
            else:
                block = blocks[0].group(1)
                for slot, path in slots.items():
                    if not re.search(rf"""["']{re.escape(slot)}["']\s*:\s*["']{re.escape(path)}["']""", block):
                        errors.append(f"{class_path}: {slot} path differs from manifest ({path})")
        for slot, path in slots.items():
            if not os.path.isfile(path):
                errors.append(f"missing {key}.{slot}: {path}")

    arena_path = manifest.get("arena", {}).get("bgm")
    if not arena_path or not os.path.isfile(arena_path):
        errors.append(f"missing arena BGM: {arena_path!r}")

    with open("js/data/audioConfig.js", encoding="utf-8") as f:
        config = f.read()
    if arena_path and f"bgm: '{arena_path}'" not in config:
        errors.append("js/data/audioConfig.js: ARENA_AUDIO.bgm differs from manifest")

    for name in sorted(os.listdir("js/classes")):
        if not name.endswith(".js") or name == "normalize-stats.js":
            continue
        key = name[:-3]
        if key not in audio:
            errors.append(f"class {key} has no manifest audio entry")

    if errors:
        for error in errors:
            print(f"ERROR: {error}")
        return 1
    print(f"audio paths OK: {sum(len(v) for v in audio.values())} sphere slots + arena BGM")
    return 0


if __name__ == "__main__":
    sys.exit(main())
