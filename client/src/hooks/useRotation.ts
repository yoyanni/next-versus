import standard from "@/standard";
import { useEffect, useState } from "react";

const HOUR = 1000 * 60 * 60;

interface Rotation {
  group: readonly string[];
  remaining: string;
}

const getRotation = (now: number): Rotation => {
  const groups = standard.weightClassRotation;
  const secondsLeft = Math.floor((HOUR - 1 - (now % HOUR)) / 1000);
  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");

  return {
    group: groups[Math.floor(now / HOUR) % groups.length],
    remaining: `${minutes}:${seconds}`,
  };
};

// Null until mounted, so the server render and the first client render match.
export const useRotation = () => {
  const [rotation, setRotation] = useState<Rotation | null>(null);

  useEffect(() => {
    const tick = () => setRotation(getRotation(Date.now()));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return rotation;
};
