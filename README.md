# ArcheSpheres

ArcheSpheres is a browser-based HTML5 canvas combat sandbox built around automated physics battles between weaponized spheres. Each sphere has its own stats, weapon geometry, class role, passive behavior, and active ability. The game runs entirely on the client with plain HTML, CSS, and JavaScript.

The project started as a single-file prototype and was later separated into modular files for maintainability. The current structure keeps the original gameplay style intact while making it easier to expand classes, abilities, weapons, visuals, and audio.

## Highlights

- Automated 1v1 arena battles with physics-driven movement and collisions
- Large playable class roster with unique weapons, passives, and active abilities
- HTML5 canvas rendering with custom sprite-like weapon drawing
- Split-file architecture for data, entities, rendering, UI, and engine behavior
- Per-sphere audio placeholders with live support for weapon clash and Wizard projectile audio
- No backend, no database, no account system, no analytics dependency

## Play Locally

Because this project is plain frontend code, you can run it directly in a browser.

### PowerShell

```powershell
start index.html
```

If you prefer a specific browser:

```powershell
Start-Process chrome.exe .\index.html
```

```powershell
Start-Process msedge.exe .\index.html
```

## Project Structure

```text
.
├── index.html
├── styles.css
├── README.md
├── PRIVACY.md
├── .gitignore
├── audio/
│   ├── README.md
│   └── <sphere-name>/
└── js/
    ├── data.js
    ├── weapons.js
    ├── entities.js
    ├── engine.js
    ├── ui.js
    └── main.js
```

## Code Map

`js/data.js`
Defines core class data, descriptions, roles, and audio slot references.

`js/weapons.js`
Contains the custom drawing logic for each weapon style.

`js/entities.js`
Contains sphere behaviors, projectile classes, class-specific firing methods, and entity update logic.

`js/engine.js`
Handles collision resolution, combat effects, particles, the game loop, and audio playback helpers.

`js/ui.js`
Controls the start screen, class picker, selection flow, and countdown overlays.

`js/main.js`
Bootstraps canvas state, mutable game arrays, battle creation, and resize handling.

## Audio System

Audio paths are configured in `js/data.js` under:

- `SPHERE_AUDIO`
- `ARENA_AUDIO`

Current supported live hooks include:

- weapon clash audio
- Wizard projectile throw audio
- Wizard projectile hit audio

Future audio categories already scaffolded in the data map include:

- sphere damage audio
- sphere ability audio
- arena background music

See [audio/README.md](audio/README.md) for folder guidance.

## Customization Workflow

### Add or edit a class

Update `js/data.js`:

- `DEF`
- `CLASS_ROLE`
- `ROLE_COLOR`
- `CLASS_DESC`
- `SPHERE_AUDIO`

### Add audio

1. Put the audio file into the matching `audio/<sphere-name>/` folder.
2. Add or update the relative path in `SPHERE_AUDIO`.
3. Wire the event in `entities.js` or `engine.js` if that audio type is not already connected.

### Tune gameplay

Common balance values live in `DEF`:

- `mass`
- `spd`
- `hp`
- `om`
- `dmg`
- `arm`
- `magDef`
- `rest`
- `reach`
- `tipR`

## Design Intent

The game is built around spectacle from simple rules: elastic motion, rotating weapon arcs, ranged pressure, impact bursts, and class-specific ability spikes. Even though the presentation is compact, the class roster is meant to feel expressive and readable rather than purely random.

## Privacy and Safety

This project is local-first and client-only.

- No user accounts
- No telemetry
- No cookies
- No remote API calls for gameplay
- No personal data storage by default

See [PRIVACY.md](PRIVACY.md) for a short privacy statement you can keep in the repository.

## Recommended Next Steps

- Wire damage and ability audio for more classes
- Add arena BGM support
- Add mute and volume controls in the UI
- Add explicit changelog/version tracking
- Add gameplay capture screenshots or GIFs to this README

## License

This project is released under the [MIT License](LICENSE).
