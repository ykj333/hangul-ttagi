import type { Metadata, Viewport } from "next";
import { Jua } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const jua = Jua({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-jua",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "한글 떼기 놀이터",
    template: "%s | 한글 떼기 놀이터",
  },
  description: "아이와 함께 글자를 따라 쓰고 소리로 익히는 첫 한글 놀이",
  applicationName: "한글 떼기 놀이터",
  category: "education",
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fffaf0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const enableDevTools =
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_DISABLE_REACT_DEVTOOLS !== "1";

  return (
    <html lang="ko" className={`${jua.variable} antialiased`}>
      <head>
        {enableDevTools && (
          <>
            <Script
              src="https://unpkg.com/react-scan/dist/auto.global.js"
              crossOrigin="anonymous"
              strategy="beforeInteractive"
            />
            <Script
              src="https://unpkg.com/react-grab/dist/index.global.js"
              crossOrigin="anonymous"
              strategy="beforeInteractive"
            />
          </>
        )}
      </head>
      <body>
        <a className="skip-link" href="#main-content">
          본문으로 바로 가기
        </a>
        {children}
      </body>
    </html>
  );
}
