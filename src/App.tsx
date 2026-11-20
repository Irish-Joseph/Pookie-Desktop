import { useCallback, useEffect, useRef, useState } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import {
  Camera,
  CircleStop,
  EyeOff,
  MessageCircle,
  Moon,
  RotateCcw,
  Send,
  Settings2,
  X,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "./components/chat/CodeBlock";
import { Pookie, type Mood } from "./components/companion/Pookie";
import { useAmbientMood } from "./hooks/useAmbientMood";
import { native } from "./services/native";
import { placeWindow, trackPosition } from "./services/window";
import {
  defaults,
  type Capture,
  type Message,
  type Model,
  type Settings,
} from "./types";

export default function App() {
  const [settings, setSettings] = useState<Settings>(defaults);
  const [models, setModels] = useState<Model[]>([]);
  const [connected, setConnected] = useState(false);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"chat" | "settings">("chat");
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [capture, setCapture] = useState<Capture | null>(null);
  const [mood, setMood] = useState<Mood>("idle");
  const displayMood = useAmbientMood(mood);
  useEffect(() => {
    if (mood !== "happy" && mood !== "confused" && mood !== "error") return;
    const timer = window.setTimeout(() => setMood("idle"), mood === "happy" ? 1500 : 3000);
    return () => window.clearTimeout(timer);
  }, [mood]);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [menu, setMenu] = useState(false);
  const [ready, setReady] = useState(false);
  const placed = useRef(false);
  const autoSelected = useRef(false);
  const drag = useRef(false);
  const down = useRef<{ x: number; y: number } | null>(null);
  const busyRef = useRef<string | null>(null);
  const messagesRef = useRef<Message[]>([]);

  useEffect(() => {
    native
      .settings()
      .then((s) => {
        setSettings(s);
        if (s.historyEnabled) {
          try {
            setMessages(
              JSON.parse(localStorage.getItem("pookie.chat") || "[]"),
            );
          } catch {
            localStorage.removeItem("pookie.chat");
          }
        }
        if (!s.onboardingDone) {
          setOpen(true);
          setTab("settings");
        }
        setReady(true);
      })
      .catch((e) => setError(String(e)));
  }, []);
  useEffect(() => {
    if (ready && settings.historyEnabled)
      localStorage.setItem("pookie.chat", JSON.stringify(messages));
  }, [messages, settings.historyEnabled, ready]);
  useEffect(() => {
    if (!ready) return;
    placeWindow(open, !placed.current)
      .then(() => {
        placed.current = true;
      })
      .catch((e) => setError(String(e)));
  }, [open, ready]);
  useEffect(() => {
    let unlisten: (() => void) | undefined;
    let disposed = false;
    trackPosition().then((fn) => {
      if (disposed) void fn();
      else unlisten = fn;
    });
    return () => {
      disposed = true;
      void unlisten?.();
    };
  }, []);
  const refresh = useCallback(async (endpoint: string) => {
    try {
      const list = await native.models(endpoint);
      setModels(list);
      setConnected(true);
      if (!busyRef.current) setMood((previous) => previous === "offline" ? "idle" : previous);
      setError("");
    } catch (e) {
      setConnected(false);
      if (!busyRef.current) setMood("offline");
      setError(`Ollama unavailable: ${String(e)}`);
    }
  }, []);
  useEffect(() => {
    refresh(settings.endpoint);
  }, [settings.endpoint, refresh]);
  useEffect(() => {
    if (!ready || autoSelected.current || settings.model || models.length === 0) return;
    autoSelected.current = true;
    const next = { ...settings, model: models[0].name };
    setSettings(next);
    native.saveSettings(next).catch((e) => setError(String(e)));
  }, [ready, models, settings]);
  useEffect(() => {
    const timer = window.setInterval(() => refresh(settings.endpoint), 30000);
    return () => clearInterval(timer);
  }, [settings.endpoint, refresh]);
  useEffect(() => {
    let unlisten: (() => void) | undefined;
    let disposed = false;
    native
      .listen((e) => {
        if (e.requestId !== busyRef.current) return;
        if (e.delta) {
          setMood("speaking");
          setMessages((previous) => {
            const next = [...previous];
            const last = next.at(-1);
            if (last?.role === "assistant")
              next[next.length - 1] = {
                ...last,
                content: last.content + e.delta,
              };
            return next;
          });
        }
        if (e.error) {
          setError(e.error);
          setMood("error");
        }
        if (e.done || e.error) {
          busyRef.current = null;
          setBusy(null);
          if (!e.error) setMood("happy");
        }
      })
      .then((fn) => {
        if (disposed) void fn();
        else unlisten = fn;
      });
    return () => {
      disposed = true;
      void unlisten?.();
    };
  }, []);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);
  const save = async (next: Settings) => {
    setSettings(next);
    try {
      await native.saveSettings(next);
    } catch (e) {
      setError(String(e));
    }
  };
  const send = async (text = draft) => {
    const content = text.trim();
    if (!content || busyRef.current || !settings.model) {
      if (!settings.model) {
        setError("Select an installed Ollama model in Settings.");
        setMood("confused");
        setTab("settings");
        setOpen(true);
      }
      return;
    }
    const id = crypto.randomUUID();
    const history = [
      ...messagesRef.current,
      { role: "user" as const, content },
    ];
    setMessages([...history, { role: "assistant", content: "" }]);
    setDraft("");
    setError("");
    setBusy(id);
    busyRef.current = id;
    setMood(capture ? "processing" : "thinking");
    try {
      await native.chat(
        id,
        settings.model,
        settings.endpoint,
        history,
        capture?.image,
      );
      setCapture(null);
    } catch (e) {
      setError(String(e));
      setBusy(null);
      busyRef.current = null;
      setMood("error");
    }
  };
  const doCapture = async (mode: "screen" | "window") => {
    if (!settings.captureEnabled) {
      setError("Enable screen capture in Settings first.");
      setTab("settings");
      setOpen(true);
      return;
    }
    if (!models.find((m) => m.name === settings.model)?.vision) {
      setError("Screen explanations need a vision-capable Ollama model. Your current model supports text chat only; choose a vision model in Settings.");
      setMood("confused");
      return;
    }
    setMood("capture");
    setError("");
    try {
      const result = await native.capture(mode);
      setCapture(result);
      setOpen(true);
      setTab("chat");
      setMood("idle");
    } catch (e) {
      setError(String(e));
      setMood("error");
    }
  };
  const stop = () => {
    if (busyRef.current) native.cancel(busyRef.current);
  };
  const onMascotDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      down.current = { x: e.screenX, y: e.screenY };
      drag.current = false;
    }
  };
  const onMascotMove = (e: React.MouseEvent) => {
    if (!down.current || !(e.buttons & 1) || drag.current) return;
    if (
      Math.hypot(e.screenX - down.current.x, e.screenY - down.current.y) > 6
    ) {
      drag.current = true;
      setMood("dragging");
      getCurrentWindow()
        .startDragging()
        .catch((err) => setError(String(err)))
        .finally(() => {
          down.current = null;
          setMood("idle");
          window.setTimeout(() => (drag.current = false), 200);
        });
    }
  };
  const onMascotClick = () => {
    if (!drag.current) {
      setOpen((v) => !v);
      setTab("chat");
    }
  };
  return (
    <div className={`app ${settings.theme}`}>
      {open && (
        <section className="panel" aria-label="Pookie panel">
          <header>
            <div className="brand">
              <span className="brand-icon">✦</span>
              <div>
                <strong>Pookie</strong>
                <small>
                  {connected
                    ? `${settings.model || "Choose a model"} · Local only`
                    : "Ollama is offline"}
                </small>
              </div>
            </div>
            <div className="header-actions">
              <button
                title="Chat"
                aria-label="Chat"
                onClick={() => setTab("chat")}
              >
                <MessageCircle size={17} />
              </button>
              <button
                title="Settings"
                aria-label="Settings"
                onClick={() => setTab("settings")}
              >
                <Settings2 size={17} />
              </button>
              <button
                title="Close"
                aria-label="Close"
                onClick={() => setOpen(false)}
              >
                <X size={17} />
              </button>
            </div>
          </header>
          {tab === "chat" ? (
            <>
              <div className="messages" aria-live="polite">
                {messages.length === 0 && (
                  <div className="welcome">
                    <span>✧</span>
                    <h2>Hi, I’m Pookie.</h2>
                    <p>
                      Ask me anything, or let me explain what’s on your screen.
                    </p>
                    <div className="quick">
                      <button onClick={() => setDraft("Help me understand ")}>
                        Ask Pookie
                      </button>
                      <button onClick={() => doCapture("window")}>
                        Explain a window
                      </button>
                      <button onClick={() => doCapture("screen")}>
                        Explain my screen
                      </button>
                    </div>
                    {connected && !models.some((model) => model.vision) && (
                      <p className="vision-hint">
                        Text chat is ready. Screen explanations need a vision model installed in Ollama.
                      </p>
                    )}
                  </div>
                )}
                {messages.map((m, i) => (
                  <div key={i} className={`message ${m.role}`}>
                    {m.role === "assistant" ? (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          pre: ({ children }) => (
                            <CodeBlock>{children}</CodeBlock>
                          ),
                          code: ({ children }) => <code>{children}</code>,
                        }}
                      >
                        {m.content || (busy ? "Thinking…" : "")}
                      </ReactMarkdown>
                    ) : (
                      m.content
                    )}
                  </div>
                ))}
              </div>
              {capture && (
                <div className="preview">
                  <img
                    src={`data:image/png;base64,${capture.image}`}
                    alt={`Capture preview: ${capture.source}`}
                  />
                  <div>
                    <span>{capture.source} · preview</span>
                    <button
                      aria-label="Discard capture"
                      onClick={() => setCapture(null)}
                    >
                      <X size={15} />
                    </button>
                  </div>
                </div>
              )}
              {error && (
                <p className="error" role="alert">
                  {error}
                </p>
              )}
              <div className="composer">
                <textarea
                  aria-label="Message Pookie"
                  value={draft}
                  placeholder={
                    capture ? "What should I explain?" : "Ask me anything…"
                  }
                  onChange={(e) => setDraft(e.target.value)}
                  onFocus={() => { if (!busyRef.current && connected) setMood("listening"); }}
                  onBlur={() => setMood((previous) => previous === "listening" ? "idle" : previous)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                />
                <button
                  aria-label={busy ? "Stop generation" : "Send message"}
                  onClick={busy ? stop : () => send()}
                >
                  {busy ? <CircleStop size={19} /> : <Send size={19} />}
                </button>
              </div>
              <footer>
                <button
                  onClick={() => {
                    setMessages([]);
                    setCapture(null);
                    localStorage.removeItem("pookie.chat");
                  }}
                >
                  <RotateCcw size={13} /> New chat
                </button>
                <span>
                  <span className="status-dot" /> Local AI
                </span>
              </footer>
            </>
          ) : (
            <div className="settings-body">
              <h2>
                {settings.onboardingDone ? "Settings" : "Welcome to Pookie"}
              </h2>
              <p className="intro">
                Your desktop companion runs locally with Ollama. Screen capture
                starts only when you ask.
              </p>
              {error && <p className="error" role="alert">{error}</p>}
              <label>
                Ollama endpoint
                <input
                  value={settings.endpoint}
                  onChange={(e) =>
                    save({ ...settings, endpoint: e.target.value })
                  }
                />
              </label>
              <button
                className="secondary"
                onClick={() => refresh(settings.endpoint)}
              >
                Test connection
              </button>
              <label>
                Model
                <select
                  value={settings.model}
                  onChange={(e) => save({ ...settings, model: e.target.value })}
                >
                  <option value="">Choose a model</option>
                  {models.map((m) => (
                    <option key={m.name} value={m.name}>
                      {m.name}
                      {m.vision ? " · vision" : " · text"}
                    </option>
                  ))}
                </select>
              </label>
              {models.length === 0 && (
                <p className="hint">
                  Install Ollama, then run <code>ollama pull gemma3</code> in a
                  terminal and refresh.
                </p>
              )}
              <label>
                Character size{" "}
                <input
                  type="range"
                  min="80"
                  max="160"
                  value={settings.size}
                  onChange={(e) =>
                    save({ ...settings, size: Number(e.target.value) })
                  }
                />
              </label>
              <label>
                Theme
                <select
                  value={settings.theme}
                  onChange={(e) =>
                    save({
                      ...settings,
                      theme: e.target.value as Settings["theme"],
                    })
                  }
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </label>
              <label>
                Response timeout (seconds)
                <input
                  type="number"
                  min="5"
                  max="300"
                  value={settings.timeout}
                  onChange={(e) =>
                    save({ ...settings, timeout: Number(e.target.value) })
                  }
                />
              </label>
              <label className="check">
                <input
                  type="checkbox"
                  checked={settings.alwaysOnTop}
                  onChange={(e) => {
                    const v = e.target.checked;
                    save({ ...settings, alwaysOnTop: v });
                    native.setTop(v);
                  }}
                />{" "}
                Always on top
              </label>
              <label className="check">
                <input
                  type="checkbox"
                  checked={settings.captureEnabled}
                  onChange={(e) =>
                    save({ ...settings, captureEnabled: e.target.checked })
                  }
                />{" "}
                Allow screen capture when I request it
              </label>
              <label className="check">
                <input
                  type="checkbox"
                  checked={settings.historyEnabled}
                  onChange={(e) => {
                    if (!e.target.checked)
                      localStorage.removeItem("pookie.chat");
                    save({ ...settings, historyEnabled: e.target.checked });
                  }}
                />{" "}
                Save text chat on this computer
              </label>
              <button
                className="secondary"
                onClick={() => {
                  setMessages([]);
                  localStorage.removeItem("pookie.chat");
                }}
              >
                Clear saved chat
              </button>
              <p className="hint">
                <EyeOff size={14} /> No telemetry, cloud calls, or saved
                screenshots. Captures stay in memory until sent to local Ollama
                or discarded. Saved text is not encrypted.
              </p>
              <button
                className="primary"
                onClick={() => {
                  save({ ...settings, onboardingDone: true });
                  setTab("chat");
                }}
              >
                Done
              </button>
            </div>
          )}
        </section>
      )}
      <div className="mascot-wrap">
        <Pookie
          mood={displayMood}
          size={settings.size}
          onClick={onMascotClick}
          onMouseDown={onMascotDown}
          onMouseMove={onMascotMove}
          onContextMenu={(e) => {
            e.preventDefault();
            setMenu((v) => !v);
          }}
        />
        {menu && (
          <div className="context">
            <button
              onClick={() => {
                setOpen(true);
                setTab("chat");
                setMenu(false);
              }}
            >
              <MessageCircle size={15} /> Chat
            </button>
            <button
              onClick={() => {
                doCapture("window");
                setMenu(false);
              }}
            >
              <Camera size={15} /> Explain window
            </button>
            <button
              onClick={() => {
                setOpen(true);
                setTab("settings");
                setMenu(false);
              }}
            >
              <Settings2 size={15} /> Settings
            </button>
            <button
              onClick={() => {
                native.hide();
                setMenu(false);
              }}
            >
              <Moon size={15} /> Hide to tray
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
