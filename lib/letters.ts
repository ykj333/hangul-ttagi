export type Lang = 'ko' | 'en';

export interface LetterItem {
  /** 화면에 표시할 글자 */
  char: string;
  /** 소리 내어 읽을 이름 (예: 기역) */
  name: string;
  /** 그룹 라벨 (자음/모음/쉬운 글자/ABC) */
  group: string;
}

export interface LetterGroup {
  label: string;
  items: LetterItem[];
}

const KO_CONSONANTS: Array<[string, string]> = [
  ['ㄱ', '기역'],
  ['ㄴ', '니은'],
  ['ㄷ', '디귿'],
  ['ㄹ', '리을'],
  ['ㅁ', '미음'],
  ['ㅂ', '비읍'],
  ['ㅅ', '시옷'],
  ['ㅇ', '이응'],
  ['ㅈ', '지읒'],
  ['ㅊ', '치읓'],
  ['ㅋ', '키읔'],
  ['ㅌ', '티읕'],
  ['ㅍ', '피읖'],
  ['ㅎ', '히읗'],
];

const KO_VOWELS: Array<[string, string]> = [
  ['ㅏ', '아'],
  ['ㅑ', '야'],
  ['ㅓ', '어'],
  ['ㅕ', '여'],
  ['ㅗ', '오'],
  ['ㅛ', '요'],
  ['ㅜ', '우'],
  ['ㅠ', '유'],
  ['ㅡ', '으'],
  ['ㅣ', '이'],
];

const KO_SYLLABLES = [
  '가', '나', '다', '라', '마', '바', '사',
  '아', '자', '차', '카', '타', '파', '하',
];

export const KO_GROUPS: LetterGroup[] = [
  {
    label: '자음',
    items: KO_CONSONANTS.map(([char, name]) => ({ char, name, group: '자음' })),
  },
  {
    label: '모음',
    items: KO_VOWELS.map(([char, name]) => ({ char, name, group: '모음' })),
  },
  {
    label: '쉬운 글자',
    items: KO_SYLLABLES.map((char) => ({ char, name: char, group: '쉬운 글자' })),
  },
];

export const EN_GROUPS: LetterGroup[] = [
  {
    label: 'ABC',
    items: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      .split('')
      .map((char) => ({ char, name: char, group: 'ABC' })),
  },
];

export function groupsFor(lang: Lang): LetterGroup[] {
  return lang === 'ko' ? KO_GROUPS : EN_GROUPS;
}

export function poolFor(lang: Lang): LetterItem[] {
  return groupsFor(lang).flatMap((g) => g.items);
}

export interface QuizRound {
  target: LetterItem;
  options: LetterItem[];
}

/** 퀴즈 문항 생성: 정답 1개 + 오답 3개, 한 게임 내 중복 정답 없음 */
export function makeRounds(lang: Lang, count = 8): QuizRound[] {
  const pool = poolFor(lang);
  const rounds: QuizRound[] = [];
  const used = new Set<string>();
  let guard = 0;
  while (rounds.length < count && guard < 500) {
    guard++;
    const target = pool[Math.floor(Math.random() * pool.length)];
    if (used.has(target.char)) continue;
    used.add(target.char);
    const distractors = pool
      .filter((it) => it.char !== target.char)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    const options = [...distractors, target].sort(() => Math.random() - 0.5);
    rounds.push({ target, options });
  }
  return rounds;
}
