/** Character poses. Each pose has its own artwork; ambient motion is applied in CSS. */
export const companionStates = [
  "idle",
  "blink",
  "thinking",
  "listening",
  "speaking",
  "happy",
  "confused",
  "sleepy",
  "processing",
  "capture",
  "offline",
  "dragging",
  "error",
] as const;

export type Mood = (typeof companionStates)[number];

const poseCoordinates: Record<Mood, readonly [number, number]> = {
  idle: [0, 0],
  blink: [1, 0],
  thinking: [2, 0],
  listening: [3, 0],
  speaking: [0, 1],
  happy: [1, 1],
  confused: [2, 1],
  sleepy: [3, 1],
  processing: [0, 2],
  capture: [1, 2],
  offline: [2, 2],
  dragging: [3, 2],
  error: [0, 3],
};

export function posePosition(mood: Mood): string {
  const [column, row] = poseCoordinates[mood];
  return `${(column * 100) / 3}% ${(row * 100) / 3}%`;
}

export function ambientState(
  activeMood: Mood,
  inactiveForMs: number,
  blink: boolean,
): Mood {
  if (activeMood !== "idle") return activeMood;
  if (inactiveForMs >= 120_000) return "sleepy";
  return blink ? "blink" : "idle";
}
