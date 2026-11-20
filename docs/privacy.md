# Privacy

Local Mode is the only implemented mode. Ollama endpoints must use HTTP and numeric loopback addresses. The backend disables HTTP proxies and redirects. No cloud provider, telemetry, analytics, crash upload, account, or hosted server is built in. The Vite server runs only in development.

Screen capture is disabled until enabled in Settings. A user must then choose a capture action. The app hides briefly, captures one frame, and shows a preview. Sending a question submits the image to the selected local vision model. Closing the preview discards the image from UI state. The screenshot is never written to disk by Pookie. The OS or other applications may have their own screen recording behavior.

Chat history is off by default. Turning it on stores text messages in WebView local storage without encryption. "Clear saved chat" removes those messages. Settings are stored as plaintext JSON in the user's configuration directory. The model runtime may have its own logging or cache, outside Pookie's control.

Text within captured images is untrusted source material. Model answers may be wrong; Pookie does not click or type on the user's behalf.
