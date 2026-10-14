# 새싹 플레이- 아이들과 바로 보는 짧고 좋은 배움 영상

첨부 `saessak-play-nextjs.zip`을 기반으로 만든 독립 Next.js 16 웹앱입니다.
로컬 폴더는 `preschool-video-player`, GitHub 저장소와 Vercel 프로젝트도
`preschool-video-player`입니다.

## 실행

```bash
npm ci
npm test
npm run lint
npm run typecheck
npm run build
npm start
```

## 구현 및 현재 범위

- 원본의 초록·민트·피치 테마, 데스크톱 3컬럼, 모바일 플레이어·목록 유지.
- 22편 메타데이터와 샘플 캔버스 애니메이션. ZIP에는 실제 영상 파일이 없습니다.
- 공개 MP4/WebM URL 등록과 브라우저 영상 재생. 파일 업로드는 별도 파일
  저장소가 없어 비활성화되어 있으며 화면에 설명합니다.
- 주제·검색·찜·최근 본 영상, 학급별 자료 조회·삭제, 텍스트/JSON 영상 목록
  가져오기, 24시간 일회용 에이전트 수집 토큰.
- 체험 프로필은 방문자별 별도 식별자를 사용합니다. 이메일 입력은 Google
  인증으로 취급하지 않으며 Google 사용자 자료에 접근할 수 없습니다.

## 저장 및 Google 인증

현재 자료 저장은 서버 인스턴스 메모리입니다. 서버 재시작·확장·재배포 시
자료가 초기화될 수 있으며 영구 저장이나 인스턴스 간 동기화를 보장하지 않습니다.
원본 ZIP의 설명과 달리 Neon 연결 코드는 포함되어 있지 않습니다.
`DATABASE_URL` 설정만으로 영구 저장이 활성화되지 않습니다.

실제 Google 로그인은 `AUTH_SECRET`, `GOOGLE_CLIENT_ID`,
`GOOGLE_CLIENT_SECRET`이 모두 설정될 때만 활성화됩니다.
Google Console에 `https://preschool-video-player.vercel.app/api/auth/callback/google`
리디렉션 주소를 등록해야 합니다. 현재 배포는 체험 모드입니다.
비밀 값은 `.env.local` 또는 Vercel 환경 변수에만 저장하세요.
OpenAI 키는 현재 기능에 필요하지 않습니다.

## 검증

타입 검사, 린트, 프로덕션 빌드와 자동 테스트 7개를 통과했습니다.
기존 세 테스트는 메모리 저장소의 격리·삭제·가져오기 검사이며
실제 Google OAuth 또는 Neon 연결 성공을 증명하지 않습니다.
추가 테스트는 체험 계정 가장 방지, 방문자 분리, 토큰 재사용 차단,
비공개 영상 접근 차단을 검사합니다.
