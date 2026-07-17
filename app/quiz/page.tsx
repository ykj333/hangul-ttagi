"use client";

import Link from "next/link";
import { useEffect, useReducer, useRef } from "react";
import ConfettiBurst from "@/components/ConfettiBurst";
import { Icon } from "@/components/Icon";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import TopBar from "@/components/TopBar";
import {
  makeRounds,
  type Lang,
  type LetterItem,
  type QuizRound,
} from "@/lib/letters";
import { findPrompt, randomPraise, speak } from "@/lib/speech";
import { INITIAL_QUIZ_STATE, quizReducer } from "@/lib/quiz-state";

const ROUND_COUNT = 8;

export default function QuizPage() {
  const [state, dispatch] = useReducer(quizReducer, INITIAL_QUIZ_STATE);
  const timerRef = useRef<number | null>(null);
  const { lang, rounds, questionIndex, stars, wrongChar, locked, done } = state;
  const round: QuizRound | undefined = rounds[questionIndex];

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      dispatch({ type: "initialize", rounds: makeRounds("ko", ROUND_COUNT) });
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!round || done) return;
    const timer = window.setTimeout(
      () => speak(findPrompt(round.target.name, lang), lang),
      350,
    );
    return () => window.clearTimeout(timer);
  }, [round, lang, done]);

  const clearTimer = () => {
    if (timerRef.current === null) return;
    window.clearTimeout(timerRef.current);
    timerRef.current = null;
  };

  useEffect(
    () => () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    },
    [],
  );

  const restart = (nextLang: Lang = lang) => {
    clearTimer();
    dispatch({
      type: "restart",
      lang: nextLang,
      rounds: makeRounds(nextLang, ROUND_COUNT),
    });
  };

  const switchLanguage = (nextLang: Lang) => {
    restart(nextLang);
  };

  const onPick = (item: LetterItem) => {
    if (locked || done || !round) return;
    clearTimer();

    if (item.char !== round.target.char) {
      dispatch({ type: "wrong", char: item.char });
      speak(lang === "ko" ? "다시 한 번 생각해 보자." : "Try again.", lang);
      timerRef.current = window.setTimeout(
        () => dispatch({ type: "clear-wrong" }),
        650,
      );
      return;
    }

    const nextStars = stars + 1;
    dispatch({ type: "correct" });
    speak(randomPraise(lang), lang);
    timerRef.current = window.setTimeout(() => {
      if (questionIndex + 1 >= rounds.length) {
        dispatch({ type: "finish" });
        speak(
          lang === "ko"
            ? `퀴즈 끝. 별 ${nextStars}개를 모았어요.`
            : `All done. You earned ${nextStars} stars.`,
          lang,
        );
        return;
      }

      dispatch({ type: "next" });
    }, 900);
  };

  return (
    <div className="learning-shell learning-shell--quiz">
      <TopBar title="소리 퀴즈" icon="speaker" />

      <main id="main-content" className="learning-content learning-content--quiz">
        <LanguageSwitch lang={lang} onChange={switchLanguage} />

        {!round ? (
          <section className="loading-card" role="status">
            <span className="loading-card__dot" aria-hidden="true" />
            문제를 준비하고 있어요
          </section>
        ) : done ? (
          <section className="result-card" aria-labelledby="result-title">
            <span className="result-card__icon" aria-hidden="true">
              <Icon name="star" />
            </span>
            <p className="section-kicker">오늘의 퀴즈 끝</p>
            <h2 id="result-title">
              {lang === "ko" ? "끝까지 잘 해냈어요" : "You finished every round"}
            </h2>
            <p className="result-card__score">
              <strong>{stars}</strong>
              <span>
                {lang === "ko"
                  ? ` / ${rounds.length}개 별`
                  : ` / ${rounds.length} stars`}
              </span>
            </p>
            <p className="result-card__message">
              {lang === "ko"
                ? <>
                    소리를 잘 듣고 글자를 골랐어요. <span className="keep-together">한 번 더 하면</span> 더 익숙해질 거예요.
                  </>
                : "You listened carefully and found every letter. Play again whenever you are ready."}
            </p>
            <div className="result-card__actions">
              <button
                type="button"
                className="action-button action-button--primary"
                onClick={() => restart()}
              >
                <Icon name="refresh" />
                다시 하기
              </button>
              <Link href="/" className="action-button">
                <Icon name="home" />
                처음으로
              </Link>
            </div>
          </section>
        ) : (
          <section className="quiz-card" aria-labelledby="quiz-instruction">
            <div className="quiz-progress">
              <ol aria-label="퀴즈 진행 상황">
                {rounds.map((item, index) => (
                  <li
                    key={item.target.char}
                    data-state={
                      index < questionIndex
                        ? "done"
                        : index === questionIndex
                          ? "current"
                          : "upcoming"
                    }
                    aria-current={index === questionIndex ? "step" : undefined}
                  >
                    <span className="sr-only">{index + 1}번째 문제</span>
                  </li>
                ))}
              </ol>
              <span className="star-count" data-testid="quiz-stars">
                <Icon name="star" />
                {stars}
              </span>
            </div>

            <button
              type="button"
              className="listen-card"
              onClick={() => speak(findPrompt(round.target.name, lang), lang)}
            >
              <span className="listen-card__icon" aria-hidden="true">
                <Icon name="speaker" />
              </span>
              <span>
                <strong id="quiz-instruction">
                  {lang === "ko"
                    ? "소리를 듣고 글자를 찾아보세요"
                    : "Listen and find the letter"}
                </strong>
                <small>{lang === "ko" ? "누르면 다시 들려줘요" : "Tap to hear it again"}</small>
              </span>
            </button>

            <div className="quiz-options" aria-label="글자 선택지">
              {round.options.map((item) => {
                const isWrong = wrongChar === item.char;
                const isCorrect = locked && item.char === round.target.char;
                return (
                  <button
                    key={item.char}
                    type="button"
                    data-name={item.name}
                    data-state={isCorrect ? "correct" : isWrong ? "wrong" : "idle"}
                    aria-label={`${item.name} 선택`}
                    disabled={locked}
                    className="quiz-option"
                    onClick={() => onPick(item)}
                  >
                    {item.char}
                    {isCorrect && <span>정답</span>}
                    {isWrong && <span>다시 생각해요</span>}
                  </button>
                );
              })}
            </div>

            <p className="quiz-status" role="status" aria-live="polite">
              {wrongChar
                ? lang === "ko"
                  ? "괜찮아요. 소리를 다시 듣고 골라 보세요."
                  : "Listen once more and try again."
                : " "}
            </p>
          </section>
        )}
      </main>

      <ConfettiBurst fire={done} />
    </div>
  );
}
