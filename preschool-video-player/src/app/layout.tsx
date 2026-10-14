import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "새싹 플레이- 아이들과 바로 보는 짧고 좋은 배움 영상",
  description:
    "영유아 교육기관 동화 동영상·이야기나누기 동영상 재생, 교사 직접 업로드, 동영상 사이트 리스트 스크랩 및 구글 계정 기반 반별 DB 분리 관리 웹앱"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="antialiased selection:bg-[#D8EFE4] selection:text-[#1B5E4B]">
        {children}
      </body>
    </html>
  );
}
