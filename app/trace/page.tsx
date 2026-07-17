"use client";

import { useState } from "react";
import ConfettiBurst from "@/components/ConfettiBurst";
import { Icon } from "@/components/Icon";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import TopBar from "@/components/TopBar";
import TraceCanvas from "@/components/TraceCanvas";
import { groupsFor, type Lang, type LetterItem } from "@/lib/letters";
import { randomPraise, speak } from "@/lib/speech";

export default function TracePage() {
  const [lang, setLang] = useState<Lang>("ko");
  const groups = groupsFor(lang);
  const [letter, setLetter] = useState<LetterItem>(
    () => groupsFor("ko")[0].items[0],
  );
  const [resetCount, setResetCount] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);

  const selectLetter = (item: LetterItem) => {
    setLetter(item);
    setCompleted(false);
    speak(item.name, lang);
  };

  const switchLanguage = (nextLang: Lang) => {
    const firstLetter = groupsFor(nextLang)[0].items[0];
    setLang(nextLang);
    setLetter(firstLetter);
    setCompleted(false);
    setResetCount((count) => count + 1);
  };

  const nextLetter = () => {
    const letters = groups.flatMap((group) => group.items);
    const index = letters.findIndex((item) => item.char === letter.char);
    selectLetter(letters[(index + 1) % letters.length]);
  };

  const handleComplete = () => {
    setCompleted(true);
    setConfettiKey((key) => key + 1);
    speak(`${letter.name}. ${randomPraise(lang)}`, lang);
  };

  const handleClear = () => {
    setResetCount((count) => count + 1);
    setCompleted(false);
  };

  return (
    <div className="learning-shell learning-shell--trace">
      <TopBar title="따라쓰기" icon="pencil" />

      <main id="main-content" className="learning-content">
        <LanguageSwitch lang={lang} onChange={switchLanguage} />

        <section className="trace-stage" aria-label={`${letter.name} 따라쓰기`}>
          <div className="trace-stage__heading">
            <div>
              <p className="section-kicker">손가락으로 천천히</p>
              <h2>{letter.name}</h2>
            </div>
            <button
              type="button"
              className="round-sound-button"
              onClick={() => speak(letter.name, lang)}
            >
              <Icon name="speaker" />
              <span>소리 듣기</span>
            </button>
          </div>

          <div className="trace-stage__canvas">
            <TraceCanvas
              key={`${lang}-${letter.char}-${resetCount}`}
              letter={letter.char}
              letterName={letter.name}
              onComplete={handleComplete}
            />
            {completed && (
              <div className="completion-toast" role="status" aria-live="polite">
                <Icon name="star" />
                <strong>{lang === "ko" ? "참 잘했어요" : "Great job"}</strong>
                <span>다음 글자도 만나 볼까요?</span>
              </div>
            )}
          </div>

          <div className="action-bar" aria-label="따라쓰기 조작">
            <button type="button" className="action-button" onClick={handleClear}>
              <Icon name="eraser" />
              다시 쓰기
            </button>
            <button
              type="button"
              className="action-button action-button--primary"
              onClick={nextLetter}
            >
              다음 글자
              <Icon name="arrow-right" />
            </button>
          </div>
        </section>

        <section className="letter-groups" aria-labelledby="letter-picker-title">
          <div className="section-heading">
            <div>
              <p className="section-kicker">골라서 연습해요</p>
              <h2 id="letter-picker-title">어떤 글자를 써 볼까요?</h2>
            </div>
          </div>

          {groups.map((group) => (
            <section key={group.label} className="letter-group">
              <h3>{group.label}</h3>
              <div className="letter-grid">
                {group.items.map((item) => (
                  <button
                    key={item.char}
                    type="button"
                    aria-label={`${item.name} 선택`}
                    aria-pressed={item.char === letter.char}
                    className="letter-button"
                    onClick={() => selectLetter(item)}
                  >
                    {item.char}
                  </button>
                ))}
              </div>
            </section>
          ))}
        </section>
      </main>

      <ConfettiBurst key={confettiKey} fire={confettiKey > 0} />
    </div>
  );
}
