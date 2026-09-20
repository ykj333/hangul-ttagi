"use client";
import { useEffect, useRef } from "react";
export function Dialog({ children, onClose, label, className = "" }: { children: React.ReactNode; onClose: () => void; label: string; className?: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { const dialog = ref.current; dialog?.showModal(); return () => dialog?.close(); }, []);
  return <dialog ref={ref} className={className} aria-label={label} onCancel={onClose} onClick={event => { if (event.target === event.currentTarget) { const bounds = event.currentTarget.getBoundingClientRect(); if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose(); } }}>{children}</dialog>;
}
