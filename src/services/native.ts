import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import type { Capture, Message, Model, Settings } from "../types";
export const native = {
  settings: () => invoke<Settings>("get_settings"),
  saveSettings: (settings: Settings) =>
    invoke<void>("save_settings", { settings }),
  models: (endpoint: string) => invoke<Model[]>("list_models", { endpoint }),
  chat: (
    requestId: string,
    model: string,
    endpoint: string,
    messages: Message[],
    image?: string,
  ) => invoke<void>("chat", { requestId, model, endpoint, messages, image }),
  cancel: (requestId: string) => invoke<void>("cancel_chat", { requestId }),
  capture: (mode: "window" | "screen") =>
    invoke<Capture>("capture_screen", { mode }),
  setTop: (enabled: boolean) => invoke<void>("set_always_on_top", { enabled }),
  hide: () => invoke<void>("hide_companion"),
  listen: (
    handler: (event: {
      requestId: string;
      delta?: string;
      error?: string;
      done?: boolean;
    }) => void,
  ) =>
    listen<{
      requestId: string;
      delta?: string;
      error?: string;
      done?: boolean;
    }>("chat-event", (e) => handler(e.payload)),
};
