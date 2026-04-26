# Audio Assets

Place future game audio files in this folder.

Suggested structure:

```text
audio/
  arena/
    bgm.mp3
  knight/
    weaponCollision.mp3
    damage.mp3
    ability.mp3
  samurai/
    weaponCollision.mp3
    damage.mp3
    ability.mp3
```

Update the placeholders in `js/data.js`:

- `SPHERE_AUDIO.<sphereKey>.weaponCollision`
- `SPHERE_AUDIO.<sphereKey>.damage`
- `SPHERE_AUDIO.<sphereKey>.ability`
- `ARENA_AUDIO.bgm`
