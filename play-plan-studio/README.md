# 놀이결 · 놀이 실행안 스튜디오

만 3~5세 유아의 관심과 현재 놀이 모습을 입력하면 교사가 검토할 수 있는 놀이 실행안을 생성합니다. 생성된 8개 항목은 화면에서 수정할 수 있고 DOCX로 내보낼 수 있습니다.

## 실행

```bash
npm install
cp .env.example .env.local
# .env.local의 OPENAI_API_KEY를 서버용 키로 설정
npm run dev
```

`OPENAI_API_KEY`는 서버의 `/api/generate`에서만 사용합니다. 입력 내용은 OpenAI API로 전송되며, 생성 결과는 이 앱의 서버에 저장되지 않습니다. DOCX는 브라우저에서 생성됩니다.

## 검증

```bash
npm run typecheck
npm run lint
npm run build
```

Vercel 프로젝트의 Root Directory를 `play-plan-studio`로 설정하고 `OPENAI_API_KEY`를 Production 환경 변수로 등록합니다.
