import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DevTools } from "@/components/DevTools";
import "./globals.css";
import "./responsive.css";
export const metadata: Metadata = {
	title: "누리 이론 연구실 | AI 영유아 교재교구 연구 및 지도법",
	description:
		"AI Theory 첨부 자료 13개를 기반으로 신체운동·건강, 사회관계, 예술경험, 의사소통, 자연탐구의 이론·교구·지도법을 탐구하는 교사용 대시보드.",
	robots: { index: true, follow: true },
};
export default function RootLayout({
	children,
}: {
	readonly children: ReactNode;
}) {
	return (
		<html lang="ko">
			<body>
				{children}
				{process.env.NODE_ENV === "development" && <DevTools />}
			</body>
		</html>
	);
}
