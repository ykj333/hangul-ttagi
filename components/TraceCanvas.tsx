"use client";

import { useEffect, useRef, useState } from "react";
import { useTraceKeyboard } from "./useTraceKeyboard";

const SIZE = 640;
const STROKE = 34;
const HIT_RADIUS = STROKE / 2 + 8;
const COMPLETE_RATIO = 0.65;
const GUIDE_FILL = "#e8edf7";
const GUIDE_LINE = "#a9b9d8";

type TraceCanvasProps = Readonly<{
  letter: string;
  letterName: string;
  onComplete?: () => void;
}>;

type Point = Readonly<{
  x: number;
  y: number;
}>;

function pointFromEvent(event: React.PointerEvent<HTMLCanvasElement>): Point {
  const rect = event.currentTarget.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * SIZE,
    y: ((event.clientY - rect.top) / rect.height) * SIZE,
  };
}

export default function TraceCanvas({
  letter,
  letterName,
  onComplete,
}: TraceCanvasProps) {
  const guideRef = useRef<HTMLCanvasElement>(null);
  const drawRef = useRef<HTMLCanvasElement>(null);
  const maskRef = useRef<Uint8Array | null>(null);
  const hitRef = useRef<Uint8Array | null>(null);
  const totalRef = useRef(0);
  const hitCountRef = useRef(0);
  const drawingRef = useRef(false);
  const lastRef = useRef<Point | null>(null);
  const hueRef = useRef(18);
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  const progressFrameRef = useRef<number | null>(null);
  const pendingProgressRef = useRef(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(
    () => () => {
      if (progressFrameRef.current !== null) {
        window.cancelAnimationFrame(progressFrameRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    let active = true;

    const buildGuide = () => {
      if (!active) return;
      const guide = guideRef.current;
      const context = guide?.getContext("2d");
      if (!guide || !context) return;

      const family = getComputedStyle(document.body).fontFamily;
      const offscreen = document.createElement("canvas");
      offscreen.width = SIZE;
      offscreen.height = SIZE;
      const offscreenContext = offscreen.getContext("2d");
      if (!offscreenContext) return;

      let fontSize = 380;
      offscreenContext.font = `${fontSize}px ${family}`;
      const measuredWidth = offscreenContext.measureText(letter).width;
      if (measuredWidth > SIZE * 0.82) {
        fontSize = Math.floor((fontSize * SIZE * 0.82) / measuredWidth);
        offscreenContext.font = `${fontSize}px ${family}`;
      }

      offscreenContext.textAlign = "center";
      offscreenContext.textBaseline = "middle";
      offscreenContext.fillStyle = "#000";
      offscreenContext.fillText(letter, SIZE / 2, SIZE / 2 + fontSize * 0.04);

      const imageData = offscreenContext.getImageData(0, 0, SIZE, SIZE).data;
      const mask = new Uint8Array(SIZE * SIZE);
      let total = 0;
      for (let index = 0; index < SIZE * SIZE; index += 1) {
        if (imageData[index * 4 + 3] <= 100) continue;
        mask[index] = 1;
        total += 1;
      }

      maskRef.current = mask;
      hitRef.current = new Uint8Array(SIZE * SIZE);
      totalRef.current = total;
      hitCountRef.current = 0;
      completedRef.current = false;
      setProgress(0);

      context.clearRect(0, 0, SIZE, SIZE);
      context.drawImage(offscreen, 0, 0);
      context.globalCompositeOperation = "source-in";
      context.fillStyle = GUIDE_FILL;
      context.fillRect(0, 0, SIZE, SIZE);
      context.globalCompositeOperation = "source-over";
      context.font = offscreenContext.font;
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.lineWidth = 3;
      context.strokeStyle = GUIDE_LINE;
      context.strokeText(letter, SIZE / 2, SIZE / 2 + fontSize * 0.04);
    };

    const loadGuide = async () => {
      const family = getComputedStyle(document.body).fontFamily;
      await Promise.allSettled([
        document.fonts.ready,
        document.fonts.load(`380px ${family}`, letter),
      ]);
      buildGuide();
    };

    void loadGuide();
    const fallbackTimer = window.setTimeout(() => {
      if (hitCountRef.current === 0) buildGuide();
    }, 700);

    return () => {
      active = false;
      window.clearTimeout(fallbackTimer);
    };
  }, [letter]);

  const scheduleProgress = (ratio: number) => {
    pendingProgressRef.current = ratio;
    if (progressFrameRef.current !== null) return;
    progressFrameRef.current = window.requestAnimationFrame(() => {
      setProgress(pendingProgressRef.current);
      progressFrameRef.current = null;
    });
  };

  const markHits = (x: number, y: number) => {
    const mask = maskRef.current;
    const hit = hitRef.current;
    if (!mask || !hit || totalRef.current === 0) return;

    const radius = HIT_RADIUS;
    const startX = Math.max(0, Math.floor(x - radius));
    const endX = Math.min(SIZE - 1, Math.ceil(x + radius));
    const startY = Math.max(0, Math.floor(y - radius));
    const endY = Math.min(SIZE - 1, Math.ceil(y + radius));
    let changed = false;

    for (let row = startY; row <= endY; row += 1) {
      for (let column = startX; column <= endX; column += 1) {
        const deltaX = column - x;
        const deltaY = row - y;
        if (deltaX * deltaX + deltaY * deltaY > radius * radius) continue;
        const index = row * SIZE + column;
        if (mask[index] !== 1 || hit[index] !== 0) continue;
        hit[index] = 1;
        hitCountRef.current += 1;
        changed = true;
      }
    }

    if (!changed) return;
    const ratio = Math.min(1, hitCountRef.current / totalRef.current);
    scheduleProgress(ratio);
    if (completedRef.current || ratio < COMPLETE_RATIO) return;
    completedRef.current = true;
    onCompleteRef.current?.();
  };

  const stamp = (x: number, y: number) => {
    const context = drawRef.current?.getContext("2d");
    if (!context) return;
    hueRef.current = (hueRef.current + 1.4) % 360;
    context.fillStyle = `hsl(${hueRef.current} 82% 58%)`;
    context.beginPath();
    context.arc(x, y, STROKE / 2, 0, Math.PI * 2);
    context.fill();
    markHits(x, y);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    drawingRef.current = true;
    const point = pointFromEvent(event);
    lastRef.current = point;
    stamp(point.x, point.y);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    const point = pointFromEvent(event);
    const last = lastRef.current ?? point;
    const distance = Math.hypot(point.x - last.x, point.y - last.y);
    const steps = Math.max(1, Math.floor(distance / 6));

    for (let step = 1; step <= steps; step += 1) {
      stamp(
        last.x + ((point.x - last.x) * step) / steps,
        last.y + ((point.y - last.y) * step) / steps,
      );
    }
    lastRef.current = point;
  };

  const stopDrawing = () => {
    drawingRef.current = false;
    lastRef.current = null;
  };

  const percentage = Math.round(progress * 100);
  const { cursorRef, handleKeyDown } = useTraceKeyboard(stamp, letter);

  return (
    <div className="trace-canvas">
      <div className="trace-progress">
        <span>완성도</span>
        <output className="sr-only" aria-live="polite" aria-atomic="true">
          {letterName} 따라쓰기 완성도 {Math.floor(percentage / 10) * 10}%
        </output>
        <progress
          className="trace-progress__bar"
          value={percentage}
          max={100}
          aria-label={`${letterName} 따라쓰기 진행률`}
        />
        <strong>{percentage}%</strong>
      </div>
      <div className="trace-board">
        <canvas
          ref={guideRef}
          width={SIZE}
          height={SIZE}
          className="trace-board__layer"
          aria-hidden="true"
        />
        <canvas
          ref={drawRef}
          width={SIZE}
          height={SIZE}
          data-testid="trace-canvas"
          className="trace-board__layer trace-board__draw"
          tabIndex={0}
          aria-describedby="trace-keyboard-help"
          aria-label={`${letterName} 글자를 따라 쓰는 영역. 방향키로 선을 그리고, Enter 또는 스페이스로 점을 찍습니다.`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={stopDrawing}
          onPointerCancel={stopDrawing}
          onPointerLeave={stopDrawing}
          onKeyDown={handleKeyDown}
        />
        <span ref={cursorRef} className="trace-board__keyboard-cursor" aria-hidden="true" />
      </div>
      <p id="trace-keyboard-help" className="trace-hint">
        연한 글자 안쪽을 색칠하듯 따라가 보세요. 키보드는 방향키로 선을 그릴 수 있어요.
      </p>
    </div>
  );
}
