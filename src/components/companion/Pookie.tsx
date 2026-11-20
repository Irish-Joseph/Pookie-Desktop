import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
} from "react";
import { posePosition, type Mood } from "../../animations/states";
export type { Mood } from "../../animations/states";

export function Pookie({
  mood,
  size,
  onClick,
  onMouseDown,
  onMouseMove,
  onContextMenu,
}: {
  mood: Mood;
  size: number;
  onClick: () => void;
  onMouseDown: (e: MouseEvent) => void;
  onMouseMove: (e: MouseEvent) => void;
  onContextMenu: (e: MouseEvent) => void;
}) {
  const [visible, setVisible] = useState(() => !document.hidden);
  const [departing, setDeparting] = useState<Mood | null>(null);
  const lastMood = useRef(mood);
  useLayoutEffect(() => {
    if (lastMood.current === mood) return;
    const oldMood = lastMood.current;
    lastMood.current = mood;
    if (mood === "blink" || oldMood === "blink") {
      setDeparting(null);
      return;
    }
    setDeparting(oldMood);
    const timer = window.setTimeout(() => setDeparting(null), 180);
    return () => window.clearTimeout(timer);
  }, [mood]);
  useEffect(() => {
    const syncVisibility = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", syncVisibility);
    return () =>
      document.removeEventListener("visibilitychange", syncVisibility);
  }, []);

  return (
    <button
      aria-label={`Open Pookie chat. Pookie is ${mood}.`}
      title="Pookie"
      className={`pookie mood-${mood}${visible ? "" : " is-hidden"}`}
      style={{ "--size": `${size}px` } as CSSProperties}
      onClick={onClick}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onContextMenu={onContextMenu}
    >
      <span
        className="pookie-sprite"
        style={{ backgroundPosition: posePosition(mood) }}
        aria-hidden="true"
      />
      {departing && (
        <span
          className="pookie-sprite departing"
          style={{ backgroundPosition: posePosition(departing) }}
          aria-hidden="true"
        />
      )}
    </button>
  );
}
