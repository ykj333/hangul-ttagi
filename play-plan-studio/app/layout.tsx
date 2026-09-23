import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "놀이결 | 놀이 실행안 스튜디오",
  description: "유아의 관심에서 시작하는 놀이 실행안 자동 제작 도구",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body>{children}</body></html>;
}
