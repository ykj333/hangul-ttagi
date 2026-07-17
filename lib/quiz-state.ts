import type { Lang, QuizRound } from "./letters";

export type QuizState = Readonly<{
  lang: Lang;
  rounds: readonly QuizRound[];
  questionIndex: number;
  stars: number;
  wrongChar: string | null;
  locked: boolean;
  done: boolean;
}>;

export const INITIAL_QUIZ_STATE: QuizState = {
  lang: "ko",
  rounds: [],
  questionIndex: 0,
  stars: 0,
  wrongChar: null,
  locked: false,
  done: false,
};

type QuizAction =
  | Readonly<{ type: "initialize"; rounds: readonly QuizRound[] }>
  | Readonly<{ type: "restart"; lang: Lang; rounds: readonly QuizRound[] }>
  | Readonly<{ type: "wrong"; char: string }>
  | Readonly<{ type: "clear-wrong" }>
  | Readonly<{ type: "correct" }>
  | Readonly<{ type: "next" }>
  | Readonly<{ type: "finish" }>;

function assertNever(value: never): never {
  throw new Error(`Unhandled quiz action: ${JSON.stringify(value)}`);
}

export function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case "initialize":
      return { ...state, rounds: action.rounds };
    case "restart":
      return {
        ...INITIAL_QUIZ_STATE,
        lang: action.lang,
        rounds: action.rounds,
      };
    case "wrong":
      return { ...state, wrongChar: action.char };
    case "clear-wrong":
      return { ...state, wrongChar: null };
    case "correct":
      return { ...state, stars: state.stars + 1, locked: true };
    case "next":
      return {
        ...state,
        questionIndex: state.questionIndex + 1,
        wrongChar: null,
        locked: false,
      };
    case "finish":
      return { ...state, done: true };
    default:
      return assertNever(action);
  }
}
