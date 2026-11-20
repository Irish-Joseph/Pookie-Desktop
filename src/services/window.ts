import {
  getCurrentWindow,
  availableMonitors,
  LogicalSize,
  PhysicalPosition,
} from "@tauri-apps/api/window";
import { clampWindow } from "./geometry";

const key = "pookie.window.position";
export async function placeWindow(open: boolean, first: boolean) {
  const window = getCurrentWindow();
  const scale = await window.scaleFactor();
  const oldSize = await window.outerSize();
  const current = await window.outerPosition();
  const monitors = await availableMonitors();
  const previous = first ? readPosition() : null;
  const target =
    previous ??
    (first && monitors[0]
      ? {
          x:
            monitors[0].workArea.position.x +
            monitors[0].workArea.size.width -
            190 * scale,
          y:
            monitors[0].workArea.position.y +
            monitors[0].workArea.size.height -
            190 * scale,
        }
      : { x: current.x, y: current.y });
  const width = (open ? 530 : 180) * scale;
  const height = (open ? 590 : 180) * scale;
  let x = first ? target.x : current.x + oldSize.width - width;
  let y = first ? target.y : current.y + oldSize.height - height;
  const clamped = clampWindow(
    { x, y },
    { width, height },
    monitors.map((m) => ({
      x: m.workArea.position.x,
      y: m.workArea.position.y,
      width: m.workArea.size.width,
      height: m.workArea.size.height,
    })),
  );
  x = clamped.x;
  y = clamped.y;
  await window.setSize(new LogicalSize(open ? 530 : 180, open ? 590 : 180));
  await window.setPosition(new PhysicalPosition(Math.round(x), Math.round(y)));
}
function readPosition(): { x: number; y: number } | null {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "null");
    return Number.isFinite(value?.x) && Number.isFinite(value?.y)
      ? value
      : null;
  } catch {
    return null;
  }
}
export async function trackPosition() {
  return getCurrentWindow().onMoved(({ payload }) => {
    localStorage.setItem(key, JSON.stringify({ x: payload.x, y: payload.y }));
  });
}
