# Troubleshooting

**Ollama unavailable:** Start Ollama and confirm `http://127.0.0.1:11434/api/tags` responds. Pookie only accepts numeric loopback HTTP endpoints.

**No model listed:** Run `ollama list`, pull a chat model if needed, and use Test connection in Settings. Embedding-only models are filtered out.

**Screenshot rejected:** Enable capture in Settings and select a model reporting vision capability. Elevated, secure, or protected windows may not capture.

**Rust linker error:** Install Visual Studio Build Tools with Desktop development with C++ and restart the terminal.

**Widget outside the visible desktop:** Delete the `pookie.window.position` key from Pookie's WebView local storage, or reconnect the previous monitor. The app also clamps positions to an available monitor on startup.
