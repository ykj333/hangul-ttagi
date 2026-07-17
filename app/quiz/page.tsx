'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import TopBar from '@/components/TopBar';
import ConfettiBurst from '@/components/ConfettiBurst';
import {
  makeRounds,
  type Lang,
  type LetterItem,
  type QuizRound,
} from '@/lib/letters';
import { findPrompt, randomPraise, speak } from '@/lib/speech';

const ROUND_COUNT = 8;

export default function QuizPage() {
  const [lang, setLang] = useState<Lang>('ko');
  // 하이드레이션 불일치 방지: 문항은 마운트 후 생성
  const [rounds, setRounds] = useState<QuizRound[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [stars, setStars] = useState(0);
  const [wrongChar, setWrongChar] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  const [done, setDone] = useState(false);
  const timerRef = useRef<number | null>(null);

  const round: QuizRound | undefined = rounds[qIndex];

  useEffect(() => {
    setRounds(makeRounds('ko', ROUND_COUNT));
  }, []);

  // 문제를 소리로 읽어주기
  useEffect(() => {
    if (!round || done) return;
    const t = window.setTimeout(
      () => speak(findPrompt(round.target.name, lang), lang),
      400,
    );
    return () => window.clearTimeout(t);
  }, [round, lang, done]);

  const clearTimer = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };
  useEffect(() => clearTimer, []);

  const restart = (nextLang: Lang = lang) => {
    clearTimer();
    setRounds(makeRounds(nextLang, ROUND_COUNT));
    setQIndex(0);
    setStars(0);
    setWrongChar(null);
    setLocked(false);
    setDone(false);
  };

  const switchLang = (l: Lang) => {
    setLang(l);
    restart(l);
  };

  const onPick = (it: LetterItem) => {
    if (locked || done || !round) return;
    if (it.char === round.target.char) {
      setLocked(true);
      const newStars = stars + 1;
      setStars(newStars);
      speak(randomPraise(lang), lang);
      timerRef.current = window.setTimeout(() => {
        if (qIndex + 1 >= rounds.length) {
          setDone(true);
          speak(
            lang === 'ko'
              ? `퀴즈 완료! 별 ${newStars}개를 모았어요. 정말 대단해요!`
              : `All done! You earned ${newStars} stars!`,
            lang,
          );
        } else {
          setQIndex((i) => i + 1);
          setLocked(false);
          setWrongChar(null);
        }
      }, 1300);
    } else {
      setWrongChar(it.char);
      speak(lang === 'ko' ? '다시 한번 생각해 보자!' : 'Try again!', lang);
      timerRef.current = window.setTimeout(() => setWrongChar(null), 700);
    }
  };

  return (
    <main className="no-select min-h-dvh bg-gradient-to-b from-sky-100 via-indigo-50 to-purple-100 pb-12">
      <TopBar title="소리 퀴즈" emoji="🔊" />

      {/* 언어 선택 */}
      <div className="mt-4 flex justify-center gap-3 px-4">
        {(['ko', 'en'] as Lang[]).map((l) => (
          <button
            key={l}
            onClick={() => switchLang(l)}
            className={`rounded-full px-6 py-2 text-xl shadow-md transition-all active:scale-95 ${
              lang === l
                ? 'scale-105 bg-gradient-to-r from-indigo-400 to-purple-400 text-white'
                : 'bg-white text-gray-500'
            }`}
          >
            {l === 'ko' ? '한글' : 'ABC'}
          </button>
        ))}
      </div>

      {!round ? (
        <div className="mt-20 text-center text-2xl text-gray-400">
          준비 중...
        </div>
      ) : done ? (
        <section className="mx-auto mt-10 flex w-full max-w-xl flex-col items-center px-4">
          <div className="animate-pop w-full rounded-3xl bg-white p-8 text-center shadow-2xl">
            <div className="text-6xl">🎉</div>
            <h2 className="mt-4 text-3xl text-gray-700">
              {lang === 'ko' ? '퀴즈 완료!' : 'All done!'}
            </h2>
            <div className="mt-3 text-4xl tracking-wide">
              {'⭐'.repeat(stars)}
              {'☆'.repeat(Math.max(0, rounds.length - stars))}
            </div>
            <p className="mt-3 text-xl text-gray-500">
              {lang === 'ko'
                ? `별 ${stars}개를 모았어요!`
                : `You earned ${stars} stars!`}
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={() => restart()}
                className="rounded-2xl bg-gradient-to-r from-pink-400 to-orange-400 px-6 py-3 text-xl text-white shadow-md transition-transform hover:scale-105 active:scale-95"
              >
                🔁 다시 하기
              </button>
              <Link
                href="/"
                className="rounded-2xl bg-white px-6 py-3 text-xl text-gray-700 shadow-md transition-transform hover:scale-105 active:scale-95"
              >
                🏠 홈으로
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <section className="mx-auto mt-6 w-full max-w-xl px-4">
          {/* 진행 표시 */}
          <div className="flex items-center justify-between">
            <div className="flex gap-1.5">
              {rounds.map((_, i) => (
                <span
                  key={i}
                  className={`h-3 w-3 rounded-full ${
                    i < qIndex
                      ? 'bg-pink-400'
                      : i === qIndex
                        ? 'bg-amber-400'
                        : 'bg-white'
                  }`}
                />
              ))}
            </div>
            <div
              data-testid="quiz-stars"
              className="rounded-full bg-white px-4 py-1 text-xl shadow"
            >
              ⭐ {stars}
            </div>
          </div>

          {/* 문제: 눌러서 다시 듣기 */}
          <button
            onClick={() => speak(findPrompt(round.target.name, lang), lang)}
            className="mt-6 w-full rounded-3xl bg-white p-6 text-center shadow-xl transition-transform hover:scale-[1.02] active:scale-95"
          >
            <div className="animate-wiggle inline-block text-5xl">🔊</div>
            <div className="mt-2 text-2xl text-gray-700">
              {lang === 'ko'
                ? '소리를 듣고 글자를 찾아보세요'
                : 'Listen and find the letter'}
            </div>
            <div className="mt-1 text-lg text-indigo-400">
              {lang === 'ko' ? '눌러서 다시 듣기' : 'Tap to hear again'}
            </div>
          </button>

          {/* 선택지 */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            {round.options.map((it) => {
              const isWrong = wrongChar === it.char;
              const isCorrect = locked && it.char === round.target.char;
              return (
                <button
                  key={it.char}
                  data-name={it.name}
                  onClick={() => onPick(it)}
                  className={`flex h-28 items-center justify-center rounded-3xl text-6xl shadow-xl transition-all active:scale-90 sm:h-32 ${
                    isCorrect
                      ? 'scale-105 bg-gradient-to-br from-green-300 to-emerald-400 ring-4 ring-green-300'
                      : isWrong
                        ? 'animate-shake bg-rose-100 ring-4 ring-rose-300'
                        : 'bg-white hover:bg-indigo-50'
                  }`}
                >
                  <span
                    className={
                      isCorrect ? 'text-white drop-shadow' : 'text-gray-700'
                    }
                  >
                    {it.char}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      <ConfettiBurst fire={done} />
    </main>
  );
}
