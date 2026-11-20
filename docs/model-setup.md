# Ollama model setup

Install [Ollama](https://ollama.com/download), start it, and use `ollama list` to see local models. For example, `ollama pull gemma3` downloads one model family. Pookie discovers models through Ollama `/api/tags` and reads `/api/show` capabilities. Only models reporting `completion` are offered for chat. Select one that also reports `vision` for screenshots. A text-only model can still answer ordinary chat questions. Downloads are initiated by the user outside Pookie.
