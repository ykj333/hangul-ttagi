"use client";

import type { Lang } from "./letters";

type SpeechOptions = Readonly<{
  rate?: number;
  pitch?: number;
}>;

export function speak(
  text: string,
  lang: Lang = "ko",
  options?: SpeechOptions,
): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

  const synth = window.speechSynthesis;
  synth.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang === "ko" ? "ko-KR" : "en-US";
  utterance.rate = options?.rate ?? 0.82;
  utterance.pitch = options?.pitch ?? 1.1;
  const prefix = lang === "ko" ? "ko" : "en";
  const voice = synth
    .getVoices()
    .find((candidate) => candidate.lang.toLowerCase().startsWith(prefix));
  if (voice) utterance.voice = voice;
  synth.speak(utterance);
}

const PRAISE = {
  ko: ["참 잘했어요.", "정답이에요.", "아주 멋져요.", "끝까지 잘했어요."],
  en: ["Great job.", "That is right.", "You did it.", "Wonderful."],
} as const satisfies Record<Lang, readonly string[]>;

export function randomPraise(lang: Lang): string {
  const list = PRAISE[lang];
  return list[Math.floor(Math.random() * list.length)];
}

function withEulReul(word: string): string {
  const code = word.charCodeAt(word.length - 1);
  if (code >= 0xac00 && code <= 0xd7a3) {
    return word + ((code - 0xac00) % 28 !== 0 ? "을" : "를");
  }
  return `${word}를`;
}

export function findPrompt(name: string, lang: Lang): string {
  return lang === "ko"
    ? `${withEulReul(name)} 찾아보세요.`
    : `Find the letter ${name}.`;
}
