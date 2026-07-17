import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "따라쓰기",
  description: "한글과 알파벳을 손가락으로 따라 쓰며 익혀요.",
};

export default function TraceLayout({ children }: LayoutProps<"/trace">) {
  return children;
}
