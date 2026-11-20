# Development

Run `npm ci`, then `npm run tauri dev`. For frontend validation, run `npm run check`, `npm test`, and `npm run build`. For Rust, run `cargo fmt --manifest-path src-tauri/Cargo.toml -- --check` and `cargo test --manifest-path src-tauri/Cargo.toml`. To create the Windows installer, run `npm run tauri build`.

Rust's `x86_64-pc-windows-msvc` target requires Microsoft's `link.exe` and Windows SDK libraries. Install Visual Studio Build Tools with the Desktop development with C++ workload. A Rust installation alone is insufficient.

## Manual Windows checklist

- [ ] Launch with Ollama stopped; mascot remains interactive and status shows unavailable.
- [ ] Start Ollama, install a text model, refresh, ask a question, and see streamed text.
- [ ] Cancel generation and verify it stops.
- [ ] Drag mascot; click without dragging opens chat.
- [ ] Close/reopen panel; mascot remains near its previous screen position.
- [ ] Restart and confirm position and settings persist.
- [ ] Hide to tray, restore, and quit from tray.
- [ ] Enable capture, choose an installed vision model, preview active window and primary monitor, then ask a screen question.
- [ ] Disable capture and confirm capture commands reject requests.
- [ ] Disconnect a monitor and confirm window remains visible.
- [ ] Confirm no outbound network traffic during local chat and capture.
- [ ] Check high DPI and Windows screen scaling.

Do not mark platform behavior verified until this checklist has been run on a graphical Windows session.
