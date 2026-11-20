# Security

Please report security vulnerabilities privately to the repository maintainers through GitHub's private vulnerability reporting, once a public repository is configured. Do not open a public issue containing exploit details or personal screen content.

Pookie currently permits only numeric loopback Ollama endpoints. Its local model server is a separate process; secure that process according to Ollama's own guidance. Optional saved chat is unencrypted WebView local storage. Screen captures are handled in memory and discarded when the preview is cleared or the request completes.
