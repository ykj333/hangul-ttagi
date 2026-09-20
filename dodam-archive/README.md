# 도담 기록실

유치원 교사의 사진 앨범·관찰 기록·포트폴리오·교재 교구를 위한 독립 Next.js 앱입니다.
참조: https://dodam-teacher-archive.kujong.chatgpt.site

기존 상위 폴더의 한글 앱과 별도로 설치·빌드·배포합니다. 원본 사이트의 실제 원아 기록과 사진을 공개 샘플로 복제하지 않았습니다.

## 실행

```bash
npm ci
# .env.example을 .env.local로 복사하고 서버 설정을 채웁니다.
npm run dev
```

http://localhost:3100

## 기능

- 네 가지 기록 유형, 제목·원아·내용·태그 검색, 즐겨찾기, 날짜 정렬
- 새 기록, 수정, 삭제 확인, JPG/PNG/WEBP 첨부 (최대 6장, 원본 장당 5MB)
- 브라우저에서 사진을 1,400px 이하 WebP로 압축, 기록당 첨부 데이터 3.5MB 제한
- 개별/전체 TXT 다운로드, 사진 포함 JSON 백업과 복원 (최대 100MB/500개)
- 김은지·박민수 샘플 로그인: 교사별 IndexedDB, 같은 브라우저에서 유지
- Google 로그인: Neon managed OAuth, 계정별 PostgreSQL 기록과 기관·학급 프로필
- GPT-Image 2.5 Sunburst 삽화: 서버 API 키 사용, 한국시간 날짜 기준 하루 2회 요청
- Google 사용자는 계정별 2회, 샘플 사용자는 모두 합산 2회. DB의 원자적 증가로 동시 요청에도 제한합니다. 실패한 생성 요청도 횟수에 포함됩니다.
- 데스크톱 좌측 탐색/목록/본문, 모바일 목록·본문 전환, 키보드 모달, 저장 오류 표시

## 서버 환경 변수

| 이름 | 용도 |
|---|---|
| `AUTH_SECRET` | 32자 이상 세션 서명 비밀 값 |
| `DATABASE_URL` | 기록·프로필·생성 한도용 PostgreSQL |
| `IDENTITY_NEON_AUTH_BASE_URL` | 관리형 Google OAuth 서비스 URL |
| `OPENAI_API_KEY` | 서버 전용 OpenAI 키 |
| `OPENAI_IMAGE_MODEL` | 기본값 `gpt-image-2.5-sunburst` |

키는 NEXT_PUBLIC 변수로 노출하지 않습니다. `.env*`, `.vercel`, 로그는 Git에서 제외합니다.
샘플 로그인은 누구나 체험할 수 있으므로 실제 아동 개인정보를 입력하지 않습니다.
Google 계정의 기록 API는 검증된 세션 ID를 소유자로 사용하고 모든 조회·변경에 적용합니다.

## 배포

Vercel 프로젝트: `dodam-archive`, Git 루트 디렉터리: `dodam-archive`.
`dodam-archive-db`는 기록 저장, `dodam-archive-auth`는 인증에 사용되는 별도 무료 Neon 리소스입니다.
Google OAuth 도메인은 Neon/Vercel 통합에서 배포에 연결됩니다. 사용자 정의 도메인을 추가하면 인증 제공자의 허용 도메인도 확인하세요.

## 검증

```bash
npm run lint
npm run typecheck
npm run build
node scripts/check-api.mjs
```

`check-api.mjs`는 실행 중인 앱에서 인증 거부, DB 저장·조회, 사용자 간 격리, 다른 사용자의 삭제 차단, 출처 및 입력 검증을 확인하고 생성한 테스트 기록을 정리합니다.
`TEST_URL`로 배포 URL을 지정할 수 있습니다.

## 참고 문서

- Next.js: 설치된 `node_modules/next/dist/docs/`
- Neon Auth: https://github.com/neondatabase/neon-js/blob/main/packages/auth/NEXT-JS.md
- 이미지 모델: https://developers.openai.com/api/docs/models/gpt-image-2.5-sunburst
