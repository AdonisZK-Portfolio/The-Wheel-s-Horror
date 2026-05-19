# The Wheel's Horror

The Wheel's Horror turns survival into a timed panic loop. Each spin gives you a target to gather before the countdown ends. Success buys breathing room. Failure summons The Wheel, while anomalies distort the world and pull your focus away.

## Asset Notice

All current visual, audio, and icon assets are placeholder assets for prototype and portfolio review. They are not final production assets and may be replaced in future versions.

## Links

- [Game Design Document](https://www.notion.so/The-Wheel-s-Horror-35d4dedd24de800d9d18dc64aa73477f)
- [![YouTube Video](https://img.youtube.com/vi/wVTp7mh9c1Q/hqdefault.jpg)](https://youtu.be/wVTp7mh9c1Q)
- [rgl](https://github.com/ink0rr/rgl)

## Download

Download the latest `.mcaddon` from the [Releases page](https://github.com/AdonisZK-Portfolio/The-Wheel-s-Horror/releases/tag/v1.0.0).

1. Open the latest release.
2. Download `TheWheelsHorror-*.mcaddon` from Assets.
3. Open the downloaded file with Minecraft Bedrock.
4. Enable both the Behavior Pack and Resource Pack in your world settings.

## Repository Layout

- `data/scripts`: TypeScript source for Script API gameplay logic.
- `packs/BP`: Behavior pack files.
- `packs/RP`: Resource pack files.
- `config.json`: rgl project configuration.
- `package.json`: Script API package dependencies.

## Development

Install dependencies:

```bash
npm install
```

Install rgl by following the official setup guide on the [rgl project page](https://github.com/ink0rr/rgl).

Start development watch mode:

```bash
rgl watch
```

rgl handles TypeScript compilation and pack output. Source scripts stay in `data/scripts`.
