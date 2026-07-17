import type { ReactNode } from "react";

export type IconName =
  | "arrow-right"
  | "eraser"
  | "home"
  | "pencil"
  | "refresh"
  | "speaker"
  | "star";

type IconProps = Readonly<{
  name: IconName;
  className?: string;
}>;

function iconPath(name: IconName): ReactNode {
  switch (name) {
    case "arrow-right":
      return <path d="M5 12h14m-5-5 5 5-5 5" />;
    case "eraser":
      return (
        <>
          <path d="m7 19-4-4 9.5-9.5a2.1 2.1 0 0 1 3 0l3 3a2.1 2.1 0 0 1 0 3L11 19H7Z" />
          <path d="m9 9 6 6M11 19h9" />
        </>
      );
    case "home":
      return (
        <>
          <path d="m3 11 9-8 9 8" />
          <path d="M5.5 10v10h13V10M9 20v-6h6v6" />
        </>
      );
    case "pencil":
      return (
        <>
          <path d="m4 16-1 5 5-1L19 9 15 5 4 16Z" />
          <path d="m13.5 6.5 4 4M4 16l4 4" />
        </>
      );
    case "refresh":
      return (
        <>
          <path d="M20 7v5h-5" />
          <path d="M18.2 16a8 8 0 1 1 .6-7.2L20 12" />
        </>
      );
    case "speaker":
      return (
        <>
          <path d="M5 9H2v6h3l5 4V5L5 9Z" />
          <path d="M14 9a4 4 0 0 1 0 6M17 6a8 8 0 0 1 0 12" />
        </>
      );
    case "star":
      return <path d="m12 2.5 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.1l6.2-.9L12 2.5Z" />;
  }
}

export function Icon({ name, className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      {iconPath(name)}
    </svg>
  );
}
