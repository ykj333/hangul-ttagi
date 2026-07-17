'use client';

import { useEffect, useRef, useState } from 'react';

const SIZE = 640; // 캔버스 낮 해상도 (CSS로 축소 표시)
const STROKE = 34; // 아이 손가락용 굵은 선
const HIT_RADIUS = STROKE / 2 + 8;
const COMPLETE_RATIO = 0.65; // 글자 픽셀의 65%를 칠하면 완료
const GUIDE_FILL = '#E2E8F5';
const GUIDE_LINE = '#B4C3E6';

interface Props {
  letter: string;
  onComplete?: () => void;
}

/**
 * 가이드 글자 위를 손가락/마우스로 따라 쓰는 캔버스.
 * - 포인터 이벤트로 터치+마우스 통합 처리
 * - 글자 픽셀 마스크를 만들어 덮인 비율로 완료 판정
 * - 무지개색 선이 그어진다
 */
export default function TraceCanvas({ letter, onComplete }: Props) {
  const guideRef = useRef<HTMLCanvasElement>(null);
  const drawRef = useRef<HTMLCanvasElement>(null);

  const maskRef = useRef<Uint8Array | null>(null);
  const hitRef = useRef<Uint8Array | null>(null);
  const totalRef = useRef(0);
  const hitCountRef = useRef(0);

  const drawingRef = useRef(false);
  const lastRef = useRef<{ x: number; y: number } | null>(null);
  const hueRef = useRef(Math.floor(Math.random() * 360));
  const completedRef = useRef(false);

  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const [progress, setProgress] = useState(0);

  // 가이드 글자 렌더 + 픽셀 마스크 생성 (폰트 로딩 후)
  useEffect(() => {
    let active = true;

    const build = () => {
      if (!active) return;
      const guide = guideRef.current;
      if (!guide) return;
      const gctx = guide.getContext('2d');
      if (!gctx) return;

      const family = getComputedStyle(document.body).fontFamily;

      // 오프스크린에 글자를 그려 픽셀 마스크를 만든다
      const off = document.createElement('canvas');
      off.width = SIZE;
      off.height = SIZE;
      const octx = off.getContext('2d');
      if (!octx) return;

      let fontSize = 380;
      octx.font = `${fontSize}px ${family}`;
      const measured = octx.measureText(letter).width;
      if (measured > SIZE * 0.82) {
        fontSize = Math.floor((fontSize * (SIZE * 0.82)) / measured);
        octx.font = `${fontSize}px ${family}`;
      }
      octx.textAlign = 'center';
      octx.textBaseline = 'middle';
      octx.fillStyle = '#000';
      octx.fillText(letter, SIZE / 2, SIZE / 2 + fontSize * 0.04);

      const img = octx.getImageData(0, 0, SIZE, SIZE).data;
      const mask = new Uint8Array(SIZE * SIZE);
      let total = 0;
      for (let i = 0; i < SIZE * SIZE; i++) {
        if (img[i * 4 + 3] > 100) {
          mask[i] = 1;
          total++;
        }
      }
      maskRef.current = mask;
      hitRef.current = new Uint8Array(SIZE * SIZE);
      totalRef.current = total;
      hitCountRef.current = 0;
      setProgress(0);

      // 가이드 캔버스: 옅은 글자 + 외곽선
      gctx.clearRect(0, 0, SIZE, SIZE);
      gctx.drawImage(off, 0, 0);
      gctx.globalCompositeOperation = 'source-in';
      gctx.fillStyle = GUIDE_FILL;
      gctx.fillRect(0, 0, SIZE, SIZE);
      gctx.globalCompositeOperation = 'source-over';
      gctx.font = octx.font;
      gctx.textAlign = 'center';
      gctx.textBaseline = 'middle';
      gctx.lineWidth = 3;
      gctx.strokeStyle = GUIDE_LINE;
      gctx.strokeText(letter, SIZE / 2, SIZE / 2 + fontSize * 0.04);
    };

    const run = async () => {
      try {
        await document.fonts.ready;
        const family = getComputedStyle(document.body).fontFamily;
        await document.fonts.load(`380px ${family}`, letter);
      } catch {
        // 웹폰트 로딩 실패 시 시스템 폰트로 진행
      }
      build();
    };
    run();
    // 폰트가 늦게 교첐되는 경우 대비 (이미 그리기 시작했으면 건드리지 않음)
    const t = window.setTimeout(() => {
      if (hitCountRef.current === 0) build();
    }, 700);

    return () => {
      active = false;
      window.clearTimeout(t);
    };
  }, [letter]);

  const markHits = (x: number, y: number) => {
    const mask = maskRef.current;
    const hit = hitRef.current;
    if (!mask || !hit || totalRef.current === 0) return;
    const r = HIT_RADIUS;
    const x0 = Math.max(0, Math.floor(x - r));
    const x1 = Math.min(SIZE - 1, Math.ceil(x + r));
    const y0 = Math.max(0, Math.floor(y - r));
    const y1 = Math.min(SIZE - 1, Math.ceil(y + r));
    let changed = false;
    for (let yy = y0; yy <= y1; yy++) {
      for (let xx = x0; xx <= x1; xx++) {
        const dx = xx - x;
        const dy = yy - y;
        if (dx * dx + dy * dy > r * r) continue;
        const idx = yy * SIZE + xx;
        if (mask[idx] === 1 && hit[idx] === 0) {
          hit[idx] = 1;
          hitCountRef.current++;
          changed = true;
        }
      }
    }
    if (changed) {
      const ratio = Math.min(1, hitCountRef.current / totalRef.current);
      setProgress(ratio);
      if (!completedRef.current && ratio >= COMPLETE_RATIO) {
        completedRef.current = true;
        onCompleteRef.current?.();
      }
    }
  };

  const stamp = (x: number, y: number) => {
    const canvas = drawRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;
    hueRef.current = (hueRef.current + 2) % 360;
    ctx.fillStyle = `hsl(${hueRef.current}, 90%, 60%)`;
    ctx.beginPath();
    ctx.arc(x, y, STROKE / 2, 0, Math.PI * 2);
    ctx.fill();
    markHits(x, y);
  };

  const posFromEvent = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * SIZE,
      y: ((e.clientY - rect.top) / rect.height) * SIZE,
    };
  };

  const handleDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drawingRef.current = true;
    const p = posFromEvent(e);
    lastRef.current = p;
    stamp(p.x, p.y);
  };

  const handleMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    const p = posFromEvent(e);
    const last = lastRef.current ?? p;
    const dist = Math.hypot(p.x - last.x, p.y - last.y);
    const steps = Math.max(1, Math.floor(dist / 6));
    for (let i = 1; i <= steps; i++) {
      stamp(
        last.x + ((p.x - last.x) * i) / steps,
        last.y + ((p.y - last.y) * i) / steps,
      );
    }
    lastRef.current = p;
  };

  const handleUp = () => {
    drawingRef.current = false;
    lastRef.current = null;
  };

  const pct = Math.round(progress * 100);

  return (
    <div className="w-full">
      <div
        className="mx-auto mb-3 h-6 w-full max-w-[520px] overflow-hidden rounded-full bg-white/80 shadow-inner"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          data-testid="trace-progress"
          className="h-full rounded-full bg-gradient-to-r from-amber-400 to-pink-500 transition-[width] duration-150"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="relative mx-auto aspect-square w-full max-w-[520px] overflow-hidden rounded-3xl border-4 border-dashed border-indigo-200 bg-white shadow-xl">
        <canvas
          ref={guideRef}
          width={SIZE}
          height={SIZE}
          className="absolute inset-0 h-full w-full"
        />
        <canvas
          ref={drawRef}
          width={SIZE}
          height={SIZE}
          data-testid="trace-canvas"
          className="absolute inset-0 h-full w-full cursor-pointer touch-none"
          onPointerDown={handleDown}
          onPointerMove={handleMove}
          onPointerUp={handleUp}
          onPointerCancel={handleUp}
          onPointerLeave={handleUp}
        />
      </div>
    </div>
  );
}
