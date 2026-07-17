import Link from "next/link";

const GAMES = [
  {
    href: "/trace",
    emoji: "✏️",
    title: "따라쓰기",
    desc: "글자를 손가락으로 쓱쓱 따라 써요",
    bg: "from-amber-200 to-orange-300",
  },
  {
    href: "/quiz",
    emoji: "🔊",
    title: "소리 퀴즈",
    desc: "소리를 듣고 알맞은 글자를 찾아요",
    bg: "from-sky-200 to-indigo-300",
  },
];

const DECORATIONS = [
  { emoji: "🎈", className: "left-[8%] top-[10%] text-5xl", delay: "0s" },
  { emoji: "🧸", className: "right-[10%] top-[16%] text-5xl", delay: "0.6s" },
  { emoji: "🌈", className: "left-[14%] bottom-[14%] text-4xl", delay: "1.1s" },
  { emoji: "🎵", className: "right-[16%] bottom-[10%] text-4xl", delay: "1.6s" },
];

export default function Home() {
  return (
    <main className="no-select relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-sky-100 via-amber-50 to-pink-100 px-6 py-10">
      {DECORATIONS.map((d) => (
        <span
          key={d.emoji}
          aria-hidden
          className={`animate-float absolute ${d.className}`}
          style={{ animationDelay: d.delay }}
        >
          {d.emoji}
        </span>
      ))}

      <h1 className="bg-gradient-to-r from-orange-500 via-pink-500 to-indigo-500 bg-clip-text text-center text-5xl leading-tight text-transparent drop-shadow-sm sm:text-6xl">
        한글 떼기 놀이터
      </h1>
      <p className="mt-4 text-xl text-amber-700 sm:text-2xl">
        우리 아이 첫 한글 놀이 🌱
      </p>

      <div className="mt-12 grid w-full max-w-xl gap-6 sm:grid-cols-2">
        {GAMES.map((g) => (
          <Link
            key={g.href}
            href={g.href}
            className={`rounded-3xl bg-gradient-to-br ${g.bg} p-6 shadow-xl transition-transform duration-200 hover:scale-105 active:scale-95`}
          >
            <div className="animate-bounce-slow text-6xl">{g.emoji}</div>
            <div className="mt-4 text-3xl text-gray-800">{g.title}</div>
            <div className="mt-1 text-lg text-gray-600">{g.desc}</div>
          </Link>
        ))}
      </div>

      <p className="mt-12 rounded-full bg-white/70 px-5 py-2 text-lg text-gray-600 shadow">
        🔊 소리가 나와요! 볼륨을 켜 주세요
      </p>
    </main>
  );
}
