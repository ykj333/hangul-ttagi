# 누리 이론 연구실

**AI 영유아 교재교구 연구 및 지도법 이론 — 누리과정 영역별**. 교사·예비교사를 위한 Next.js 16.4.3 / React 19 학습 대시보드입니다. 자료의 실제 대상은 3~5세 유아입니다.

## 실행

```sh
npm ci
npm run dev
# http://localhost:3107
npm run build
npm start
npm run typecheck
npm run lint
npm test  # starts an isolated production server on an ephemeral port; TEST_URL can target a deployment
```

Vercel Git Root Directory: `nuri-theory-studio`. Framework: Next.js. Build: `npm run build`. 공개 런타임에는 API 키가 필요하지 않습니다.

## 제공 기능

- 5개 영역 각각 3개 상세 이론: 개념, 교수적 함의, 교실 사례, 해석 유의점.
- 영역별 3종 교구: 교육적 기능, 제작·환경 구성, AI 연결, 안전·윤리.
- 영역별 2개 활동: 준비물, 놀이 흐름, 교사의 질문, 관찰, 개별화.
- 관찰·평가 해설, 상황 기반 성찰 문항, 20절 학습 완료 기록.
- 연령·집단·시간·지원 수준·AI 활용 위치를 조정하는 **규칙 기반** 설계 실험실. 실시간 AI 생성이나 발달 진단이 아닙니다.
- 첨부 Markdown 13개 전체 읽기, 목차 이동, 전체 본문 검색, 원문 다운로드.
- 영역별 연구 노트 자동 저장, 설계안 저장 및 Markdown 다운로드. **localStorage에 저장되며 계정·클라우드 동기화는 없습니다.** 브라우저 데이터 삭제 시 기록이 사라질 수 있습니다.
- 반응형 UI, 키보드 탐색, 네이티브 대화상자, reduced-motion 대응.

## 원문과 편집

`scripts/import-sources.mjs`는 부모 프로젝트의 `AI Theory`를 읽어 `data/sources.json`과 메타데이터 색인을 생성합니다. 원본 텍스트·파일명·상대 경로·SHA-256을 보존합니다. 원문의 오류도 그대로 보존하며, 앱 해설은 별도 작성했습니다. 문서 13개는 독립 연구 13편이라는 의미가 아닙니다.

편집 시 사회관계·자연탐구 AI 자료의 발달단계 혼동을 바로잡았습니다. 출처가 불충분한 분석 문헌 수·효과 수치, 의사소통 AI 자료의 불완전 서지, 자연탐구 일반 자료의 예술 참고문헌 혼입을 원문 자료실에 명시했습니다. 개별 논문의 효과를 모두 검증한 체계적 문헌고찰로 주장하지 않습니다.

교육과정 구조는 [i-누리 고시문](https://i-nuri.go.kr/teacher/board/view.do?board_idx=860&data_type=normal&manage_idx=24&menu_idx=19), DAP는 [NAEYC 공식 설명](https://www.naeyc.org/resources/position-statements/dap/core-considerations)과 대조했습니다. 그 외 해설의 주된 근거는 첨부 자료이며, 활동은 교수 설계 예시입니다.

## 드로잉과 비밀정보

`public/learning-table.png`는 **gemini-nano-banana-2.1**로 생성한 수채화·색연필 드로잉입니다. `data/illustration.json`에 모델과 생성일을 기록합니다. 생성 스크립트는 기본 폴더의 `gemini_api_key.txt`를 프로세스 메모리에서만 읽습니다. 실제 키는 소스·응답·공개 정적 자산·Vercel 환경변수에 포함하지 않습니다. 배포된 앱은 이미 생성된 그림만 제공합니다. 공개 이미지 생성 API가 없으므로 런타임 생성 요청 및 계정별 쿼터는 적용되지 않습니다.

## 저장과 개인정보

실제 아동의 이름·사진·음성을 입력하거나 수집하는 흐름은 없습니다. 메모에도 아동 식별정보를 쓰지 않도록 안내합니다. 원문은 비신뢰 Markdown으로 렌더링하며 HTML을 실행하지 않고 외부 이미지도 자동 로드하지 않습니다. API 입력 길이·영역을 검증하고 등록된 문서 ID만 조회합니다.

## 구성

`app/`: Next.js 페이지, 자료 API, 디자인 토큰과 반응형 CSS. `components/`: 대시보드·영역 학습·자료실·원문 리더·설계 실험실·노트. `data/`: 편집 해설 및 원문. `tests/`: 원문 무결성과 실제 HTTP 검색·오류·다운로드 검증. `DESIGN.md`: 디자인·접근성 계약.
