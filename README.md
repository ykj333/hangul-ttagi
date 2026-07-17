# 한글 떼기 놀이터

아이들이 한글과 알파벳을 보고, 듣고, 직접 써 보며 익히는 Next.js 학습 웹입니다.

## 주요 기능

- 손가락이나 마우스로 글자를 따라 쓰는 캔버스
- 한글 자음·모음·쉬운 글자와 A–Z 선택
- Web Speech API를 이용한 글자 읽기
- 8문제로 구성된 소리 퀴즈와 즉시 피드백
- 모바일·태블릿·데스크톱 반응형 화면
- 키보드 포커스, 진행 상태 안내, 모션 감소 설정 지원

## 실행

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000`을 엽니다.

## 검증

```bash
npm run lint
npx tsc --noEmit
npm run doctor
npm run build
```

## 기술

- Next.js 16 App Router
- React 19
- TypeScript
- CSS 디자인 토큰과 반응형 레이아웃
