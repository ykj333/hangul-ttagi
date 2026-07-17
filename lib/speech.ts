'use client';

import type { Lang } from './letters';

/** Web Speech API 기반 TTS. 환경이 지원하지 않으면 조용히 무시한다. */
export function speak(
  text: string,
  lang: Lang = 'ko',
  opts?: { rate?: number; pitch?: number },
) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    const synth = window.speechSynthesis;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'ko' ? 'ko-KR' : 'en-US';
    // 아이 대상이므로 조금 느리고 높은 톤으로
    utterance.rate = opts?.rate ?? 0.85;
    utterance.pitch = opts?.pitch ?? 1.15;
    const prefix = lang === 'ko' ? 'ko' : 'en';
    const voice = synth
      .getVoices()
      .find((v) => v.lang.toLowerCase().startsWith(prefix));
    if (voice) utterance.voice = voice;
    synth.speak(utterance);
  } catch {
    // 음성 합성 불가 환경 무시
  }
}

const PRAISE: Record<Lang, string[]> = {
  ko: ['참 잘했어요!', '정답이에요! 최고!', '와, 대단해요!', '잘했어요! 짝짝짝!'],
  en: ['Great job!', 'Awesome!', 'You did it!', 'Wonderful!'],
};

export function randomPraise(lang: Lang): string {
  const list = PRAISE[lang];
  return list[Math.floor(Math.random() * list.length)];
}

/** 받침 유무에 따라 을/를 붙인다 */
function withEulReul(word: string): string {
  const code = word.charCodeAt(word.length - 1);
  if (code >= 0xac00 && code <= 0xd7a3) {
    return word + ((code - 0xac00) % 28 !== 0 ? '을' : '를');
  }
  return word + '을';
}

export function findPrompt(name: string, lang: Lang): string {
  return lang === 'ko'
    ? `${withEulReul(name)} 찾아보세요`
    : `Find the letter ${name}`;
}
