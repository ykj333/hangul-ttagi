'use client';

import { useEffect, useMemo, useState } from 'react';
import TopBar from '@/components/TopBar';
import TraceCanvas from '@/components/TraceCanvas';
import ConfettiBurst from '@/components/ConfettiBurst';
import { groupsFor, type Lang, type LetterItem } from '@/lib/letters';
import { randomPraise, speak } from '@/lib/speech';

export default function TracePage() {
  const [lang, setLang] = useState<Lang>('ko');
  const groups = useMemo(() => groupsFor(lang), [lang]);
  const [letter, setLetter] = useState<LetterItem>(
    () => groupsFor('ko')[0].items[0],
  );
  const [resetCount, setResetCount] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);

  // 언어 전환 시 첫 글자로 이동
  useEffect(() => {
    setLetter(groups[0].items[0]);
    setCompleted(false);
  }, [groups]);

  const selectLetter = (it: LetterItem) => {
    setLetter(it);
    setCompleted(false);
    speak(it.name, lang);
  };

  const nextLetter = () => {
    const flat = groups.flatMap((g) => g.items);
    const idx = flat.findIndex((it) => it.char === letter.char);
    selectLetter(flat[(idx + 1) % flat.length]);
  };

  const handleComplete = () => {
    setCompleted(true);
    setConfettiKey((k) => k + 1);
    speak(`${letter.name}! ${randomPraise(lang)}`, lang);
  };

  const handleClear = () => {
    setResetCount((c) => c + 1);
    setCompleted(false);
  };

  return (
    <main className="no-select min-h-dvh bg-gradient-to-b from-amber-50 via-orange-50 to-pink-100 pb-12">
      <TopBar title="따라쓰기" emoji="✏️" />

      {/* 언어 선택 */}
      <div className="mt-4 flex justify-center gap-3 px-4">
        {(['ko', 'en'] as Lang[]).map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
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

      {/* 쓰기판 */}
      <div className="relative mx-auto mt-4 w-full max-w-2xl px-4">
        <TraceCanvas
          key={`${lang}-${letter.char}-${resetCount}`}
          letter={letter.char}
          onComplete={handleComplete}
        />
        {completed && (
          <div className="animate-pop pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white/95 px-8 py-6 text-center shadow-2xl">
            <div className="text-5xl">🌟</div>
            <div className="mt-2 text-3xl text-pink-500">
              {lang === 'ko' ? '참 잘했어요!' : 'Great job!'}
            </div>
          </div>
        )}
      </div>

      {/* 조작 버튼 */}
      <div className="mx-auto mt-4 flex w-full max-w-2xl items-center justify-center gap-3 px-4">
        <button
          onClick={() => speak(letter.name, lang)}
          className="rounded-2xl bg-white px-5 py-3 text-xl text-gray-700 shadow-md transition-transform hover:scale-105 active:scale-95"
        >
          🔊 소리
        </button>
        <button
          onClick={handleClear}
          className="rounded-2xl bg-white px-5 py-3 text-xl text-gray-700 shadow-md transition-transform hover:scale-105 active:scale-95"
        >
          ↺ 다시
        </button>
        <button
          onClick={nextLetter}
          className="rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 px-5 py-3 text-xl text-white shadow-md transition-transform hover:scale-105 active:scale-95"
        >
          다음 ▶
        </button>
      </div>

      {/* 글자 선택 */}
      <div className="mx-auto mt-6 w-full max-w-2xl space-y-4 px-4">
        {groups.map((g) => (
          <section key={g.label}>
            <h2 className="mb-2 text-lg text-gray-500">{g.label}</h2>
            <div className="flex flex-wrap gap-2">
              {g.items.map((it) => (
                <button
                  key={it.char}
                  onClick={() => selectLetter(it)}
                  aria-label={it.name}
                  className={`h-12 w-12 rounded-2xl text-2xl shadow-md transition-all active:scale-90 ${
                    it.char === letter.char
                      ? 'scale-110 bg-gradient-to-br from-pink-400 to-orange-400 text-white'
                      : 'bg-white text-gray-700 hover:bg-indigo-50'
                  }`}
                >
                  {it.char}
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>

      <ConfettiBurst key={confettiKey} fire={confettiKey > 0} />
    </main>
  );
}
