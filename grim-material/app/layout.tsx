import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {title:'그림교구실 | 선생님을 위한 AI 그림 교구',description:'수업 주제와 연령에 맞춘 이야기나누기 그림자료, 그림카드, 활동지를 만들고 저장하세요.'};
export default function Layout({children}:{children:React.ReactNode}) {return <html lang="ko"><body>{children}</body></html>;}
