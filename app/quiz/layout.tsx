import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "소리 퀴즈",
  description: "글자 소리를 듣고 알맞은 한글과 알파벳을 찾아요.",
};

export default function QuizLayout({ children }: LayoutProps<"/quiz">) {
  return children;
}
