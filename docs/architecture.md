# Architecture

React renders the transparent companion window and chat. Tauri commands expose only settings, Ollama model discovery/chat, capture, window controls, and tray behavior. All AI HTTP requests originate in `src-tauri/src/ai.rs`; `src-tauri/src/capture.rs` uses xcap for explicit screenshots. `src-tauri/src/storage.rs` stores non-secret settings in the OS configuration directory. The optional text chat toggle uses WebView local storage.

The Ollama adapter consumes newline-delimited streamed responses and emits `chat-event` deltas to the UI. A per-request cancellation channel closes the stream. Capture bytes are encoded as PNG in memory, previewed in the UI, and included in an Ollama `/api/chat` user message only after the user sends a question. Model vision capability is read from Ollama `/api/show`.

No shell or arbitrary filesystem command is exposed to the webview. Tauri capability grants only core read operations and the window position, size, and drag operations required by the widget.
