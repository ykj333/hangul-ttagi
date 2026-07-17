import { useEffect, useRef } from "react";

const SIZE = 640;

type Point = Readonly<{ x: number; y: number }>;

export function useTraceKeyboard(
  stamp: (x: number, y: number) => void,
  resetKey: string,
) {
  const cursorRef = useRef<HTMLSpanElement>(null);
  const pointRef = useRef<Point>({ x: SIZE / 2, y: SIZE / 2 });

  useEffect(() => {
    pointRef.current = { x: SIZE / 2, y: SIZE / 2 };
    cursorRef.current?.style.setProperty("--keyboard-x", "50%");
    cursorRef.current?.style.setProperty("--keyboard-y", "50%");
  }, [resetKey]);

  const move = (deltaX: number, deltaY: number) => {
    const last = pointRef.current;
    const point = {
      x: Math.min(SIZE, Math.max(0, last.x + deltaX)),
      y: Math.min(SIZE, Math.max(0, last.y + deltaY)),
    };
    const distance = Math.hypot(point.x - last.x, point.y - last.y);
    const steps = Math.max(1, Math.floor(distance / 6));
    for (let step = 1; step <= steps; step += 1) {
      stamp(
        last.x + ((point.x - last.x) * step) / steps,
        last.y + ((point.y - last.y) * step) / steps,
      );
    }
    pointRef.current = point;
    cursorRef.current?.style.setProperty("--keyboard-x", `${(point.x / SIZE) * 100}%`);
    cursorRef.current?.style.setProperty("--keyboard-y", `${(point.y / SIZE) * 100}%`);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLCanvasElement>) => {
    const step = event.shiftKey ? 40 : 16;
    const directions: Partial<Record<string, readonly [number, number]>> = {
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
    };
    const direction = directions[event.key];
    if (direction) {
      event.preventDefault();
      move(...direction);
    } else if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      stamp(pointRef.current.x, pointRef.current.y);
    }
  };

  return { cursorRef, handleKeyDown };
}
