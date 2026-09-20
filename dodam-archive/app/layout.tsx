import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "도담 기록실 | 아이의 오늘을, 내일의 이야기로", description: "유치원 교사를 위한 사진 앨범, 관찰 기록, 성장 포트폴리오와 교재 교구.", robots: { index: false, follow: false } };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="ko"><body>{children}</body></html>; }
