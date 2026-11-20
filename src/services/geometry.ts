export type Rect = { x: number; y: number; width: number; height: number };

export function clampWindow(
  position: { x: number; y: number },
  size: { width: number; height: number },
  areas: Rect[],
) {
  const area =
    areas.find(
      (a) =>
        position.x >= a.x &&
        position.x < a.x + a.width &&
        position.y >= a.y &&
        position.y < a.y + a.height,
    ) ?? areas[0];
  if (!area) return position;
  return {
    x: Math.max(area.x, Math.min(position.x, area.x + area.width - size.width)),
    y: Math.max(
      area.y,
      Math.min(position.y, area.y + area.height - size.height),
    ),
  };
}
