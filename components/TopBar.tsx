'use client';

import Link from 'next/link';

export default function TopBar({
  title,
  emoji,
}: {
  title: string;
  emoji: string;
}) {
  return (
    <header className="mx-auto flex w-full max-w-2xl items-center justify-between px-4 pt-5">
      <Link
        href="/"
        aria-label="홈으로"
        className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl shadow-md transition-transform hover:scale-110 active:scale-95"
      >
        🏠
      </Link>
      <h1 className="text-2xl text-gray-700 sm:text-3xl">
        {emoji} {title}
      </h1>
      <div className="h-14 w-14" aria-hidden />
    </header>
  );
}
