export type Lang = "ko" | "en";

export type LetterItem = Readonly<{
  char: string;
  name: string;
  group: string;
}>;

export type LetterGroup = Readonly<{
  label: string;
  items: readonly LetterItem[];
}>;

const KO_CONSONANTS = [
  ["ㄱ", "기역"],
  ["ㄴ", "니은"],
  ["ㄷ", "디귿"],
  ["ㄹ", "리을"],
  ["ㅁ", "미음"],
  ["ㅂ", "비읍"],
  ["ㅅ", "시옷"],
  ["ㅇ", "이응"],
  ["ㅈ", "지읒"],
  ["ㅊ", "치읓"],
  ["ㅋ", "키읔"],
  ["ㅌ", "티읕"],
  ["ㅍ", "피읖"],
  ["ㅎ", "히읗"],
] as const;

const KO_VOWELS = [
  ["ㅏ", "아"],
  ["ㅑ", "야"],
  ["ㅓ", "어"],
  ["ㅕ", "여"],
  ["ㅗ", "오"],
  ["ㅛ", "요"],
  ["ㅜ", "우"],
  ["ㅠ", "유"],
  ["ㅡ", "으"],
  ["ㅣ", "이"],
] as const;

const KO_SYLLABLES = [
  "가",
  "나",
  "다",
  "라",
  "마",
  "바",
  "사",
  "아",
  "자",
  "차",
  "카",
  "타",
  "파",
  "하",
] as const;

export const KO_GROUPS: readonly LetterGroup[] = [
  {
    label: "자음",
    items: KO_CONSONANTS.map(([char, name]) => ({ char, name, group: "자음" })),
  },
  {
    label: "모음",
    items: KO_VOWELS.map(([char, name]) => ({ char, name, group: "모음" })),
  },
  {
    label: "쉬운 글자",
    items: KO_SYLLABLES.map((char) => ({ char, name: char, group: "쉬운 글자" })),
  },
];

export const EN_GROUPS: readonly LetterGroup[] = [
  {
    label: "ABC",
    items: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((char) => ({
      char,
      name: char,
      group: "ABC",
    })),
  },
];

export function groupsFor(lang: Lang): readonly LetterGroup[] {
  return lang === "ko" ? KO_GROUPS : EN_GROUPS;
}

export function poolFor(lang: Lang): readonly LetterItem[] {
  return groupsFor(lang).flatMap((group) => group.items);
}

export type QuizRound = Readonly<{
  target: LetterItem;
  options: readonly LetterItem[];
}>;

function shuffled<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

export function makeRounds(lang: Lang, count = 8): readonly QuizRound[] {
  const pool = poolFor(lang);
  const targets = shuffled(pool).slice(0, Math.min(count, pool.length));

  return targets.map((target) => {
    const distractors = shuffled(
      pool.filter((item) => item.char !== target.char),
    ).slice(0, 3);

    return {
      target,
      options: shuffled([...distractors, target]),
    };
  });
}
