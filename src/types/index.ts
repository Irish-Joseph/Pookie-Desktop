export type Model = { name: string; vision: boolean };
export type Message = { role: "user" | "assistant"; content: string };
export type Capture = { image: string; source: string };
export type Settings = {
  model: string;
  endpoint: string;
  size: number;
  theme: "light" | "dark";
  alwaysOnTop: boolean;
  captureEnabled: boolean;
  historyEnabled: boolean;
  snap: boolean;
  timeout: number;
  onboardingDone: boolean;
};
export const defaults: Settings = {
  model: "",
  endpoint: "http://127.0.0.1:11434",
  size: 120,
  theme: "light",
  alwaysOnTop: true,
  captureEnabled: false,
  historyEnabled: false,
  snap: false,
  timeout: 60,
  onboardingDone: false,
};
