import { useEffect, useRef, useState } from "react";
import { ambientState, type Mood } from "../animations/states";

export function useAmbientMood(activeMood: Mood): Mood {
  const [lastInteraction, setLastInteraction] = useState(() => Date.now());
  const [now, setNow] = useState(() => Date.now());
  const [blink, setBlink] = useState(false);
  const [visible, setVisible] = useState(() => !document.hidden);
  const lastInteractionRef = useRef(lastInteraction);

  useEffect(() => {
    const wake = () => {
      const timestamp = Date.now();
      if (timestamp - lastInteractionRef.current < 1000) return;
      lastInteractionRef.current = timestamp;
      setLastInteraction(timestamp);
      setNow(timestamp);
    };
    window.addEventListener("pointerdown", wake);
    window.addEventListener("pointermove", wake);
    window.addEventListener("keydown", wake);
    return () => {
      window.removeEventListener("pointerdown", wake);
      window.removeEventListener("pointermove", wake);
      window.removeEventListener("keydown", wake);
    };
  }, []);

  useEffect(() => {
    const onVisibility = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    if (activeMood !== "idle" || !visible) return;
    let timeout: number;
    let blinkTimeout: number;
    const schedule = () => {
      timeout = window.setTimeout(
        () => {
          setNow(Date.now());
          setBlink(true);
          blinkTimeout = window.setTimeout(() => {
            setBlink(false);
            schedule();
          }, 180);
        },
        4000 + Math.random() * 5000,
      );
    };
    schedule();
    return () => {
      window.clearTimeout(timeout);
      window.clearTimeout(blinkTimeout);
      setBlink(false);
    };
  }, [activeMood, visible]);

  return ambientState(activeMood, now - lastInteraction, blink);
}
