# Pookie

Pookie is an experimental, local-first desktop companion. It floats above your Windows desktop as an animated robot, opens a compact chat panel, and sends questions to an Ollama model running on your own computer. With explicit permission, it can capture the active window or primary monitor and preview that image before sending it to an installed vision model.

![Pookie icon](src-tauri/icons/icon.png)

The mascot uses a transparent pose atlas derived from the approved Pookie character reference, with lightweight CSS motion and event-driven expressions. See [character animation](docs/character-animation.md) for its states and asset workflow.

## Current status

This repository is an early working implementation, **not a finished release**. The React production build passes. Native compilation and live desktop behavior have not yet been verified on the development machine because Visual C++ Build Tools are missing. See [development notes](docs/development.md) and [limitations](#limitations).

## Requirements

- Windows 10 or 11, with WebView2
- Node.js 22 or later and npm
- Rust stable with the MSVC target
- Visual Studio 2022 Build Tools with **Desktop development with C++**
- [Ollama](https://ollama.com/download) for local AI

## Run locally

```powershell
cd D:\Pooki
npm ci
ollama pull gemma3
npm run tauri dev
```

Select an installed model in Settings. Ollama defaults to `http://127.0.0.1:11434`. The model name above is an example; you can use any installed text model for chat and a model reporting `vision` capability for screen explanations. Pookie does not install Ollama or download models for you.

## Build

```powershell
npm ci
npm run check
npm test
cargo test --manifest-path src-tauri/Cargo.toml
npm run tauri build
```

The Windows bundle target is NSIS. Generated files appear under `src-tauri/target/release/bundle/nsis`.

## Privacy

Only numeric loopback Ollama endpoints are accepted. The Rust HTTP client disables proxies and redirects. The webview has no general HTTP plugin permission. Capture is off by default, initiated by the user, previewed in the panel, and kept in memory only. Optional text chat storage uses unencrypted WebView local storage; it is off by default. No telemetry or cloud adapter is included. See [privacy details](docs/privacy.md).

## Limitations

- Windows is the intended initial platform; macOS and Linux have not been tested or packaged.
- Capture currently covers an active window or the primary monitor. Region selection, image import, multi-monitor capture selection, and application exclusions are not implemented.
- Cloud providers, keychain storage, voice, guidance overlays, configurable shortcuts, and full conversation management are not implemented.
- The transparent window is resized with the chat panel; native hit testing of every transparent pixel has not been verified.
- Elevated applications, secure desktops, DRM content, and some fullscreen software may prevent capture.
- Live Ollama, tray, drag, capture, and installer behavior still need manual Windows verification.

See [contributing](CONTRIBUTING.md) and [security](SECURITY.md).

## License

Pookie is open source under the [MIT License](LICENSE). Contributions are welcome through pull requests; the repository owner controls merges to `main`.
