import { randomUUID } from "node:crypto";
/**
 * Core Server-Verified Repository & Scraper Engine for Saessak Play.
 * Enforces strict per-teacher Google Account (ownerEmail) database isolation
 * for class-uploaded and scraped videos.
 */

export const INITIAL_SEED_VIDEOS = [
  {
    "id": "vid-01",
    "order": 1,
    "title": "토끼와 거북이 막대인형",
    "category": "언어·동화",
    "creatorName": "구종 유",
    "ownerEmail": "ykj3377@gmail.com",
    "className": "새싹반 (유구종 교수 연구실)",
    "ageGroup": "만 3-5세",
    "durationLabel": "새 영상",
    "durationSeconds": 18,
    "description": "토끼와 거북이 막대인형을 활용해 아이들과 함께 이야기를 나누고 등장인물의 마음을 상상해 보는 동화 영상입니다.",
    "isTeacherUpload": true,
    "isSharedCuration": true,
    "rightsConfirmed": true,
    "sponsorFreeConfirmed": true,
    "likes": 0,
    "shares": 0,
    "downloads": 0,
    "views": 24,
    "themeColors": [
      "#8FB996",
      "#F4A261",
      "#E76F51"
    ],
    "characterType": "rabbit-turtle"
  },
  {
    "id": "vid-02",
    "order": 2,
    "title": "인형 캐릭터가 떨어지는 낙엽 신체 표현을 한다",
    "category": "신체·음악",
    "creatorName": "구종 유",
    "ownerEmail": "ykj3377@gmail.com",
    "className": "새싹반 (유구종 교수 연구실)",
    "ageGroup": "만 3-5세",
    "durationLabel": "새 영상",
    "durationSeconds": 15,
    "description": "가을 바람에 흔들리며 떨어지는 낙엽의 움직임을 인형 캐릭터와 함께 온몸으로 표현해 보는 신체·음악 활동 영상입니다.",
    "isTeacherUpload": true,
    "isSharedCuration": true,
    "rightsConfirmed": true,
    "sponsorFreeConfirmed": true,
    "likes": 2,
    "shares": 1,
    "downloads": 1,
    "views": 19,
    "themeColors": [
      "#E9C46A",
      "#F4A261",
      "#E76F51"
    ],
    "characterType": "falling-leaves"
  },
  {
    "id": "vid-03",
    "order": 3,
    "title": "인형 캐릭터가 'ㄱ' 한국어 글자를 신체 표현을 한다",
    "category": "언어·동화",
    "creatorName": "구종 유",
    "ownerEmail": "ykj3377@gmail.com",
    "className": "새싹반 (유구종 교수 연구실)",
    "ageGroup": "만 3-5세",
    "durationLabel": "새 영상",
    "durationSeconds": 16,
    "description": "한글 자음 'ㄱ' 모양을 팔과 다리로 재미있게 만들어 보며 글자와 친숙해지는 언어·신체 통합 영상입니다.",
    "isTeacherUpload": true,
    "isSharedCuration": true,
    "rightsConfirmed": true,
    "sponsorFreeConfirmed": true,
    "likes": 3,
    "shares": 0,
    "downloads": 2,
    "views": 31,
    "themeColors": [
      "#74C69D",
      "#52B788",
      "#2D6A4F"
    ],
    "characterType": "hangul-giyeok"
  },
  {
    "id": "vid-04",
    "order": 4,
    "title": "채소 인형들이 어깨동무를 한다",
    "category": "자연·수학",
    "creatorName": "구종 유",
    "ownerEmail": "ykj3377@gmail.com",
    "className": "새싹반 (유구종 교수 연구실)",
    "ageGroup": "만 3-5세",
    "durationLabel": "새 영상",
    "durationSeconds": 14,
    "description": "당근, 브로콜리, 토마토 채소 인형들이 나란히 어깨동무를 하며 숫자와 규칙성을 알아보는 자연·수학 영상입니다.",
    "isTeacherUpload": true,
    "isSharedCuration": true,
    "rightsConfirmed": true,
    "sponsorFreeConfirmed": true,
    "likes": 1,
    "shares": 0,
    "downloads": 1,
    "views": 17,
    "themeColors": [
      "#95D5B2",
      "#F4A261",
      "#E63946"
    ],
    "characterType": "veggie-friends"
  },
  {
    "id": "vid-05",
    "order": 5,
    "title": "봉제인형 캐릭터가 웃으면서 말한다",
    "category": "언어·동화",
    "creatorName": "구종 유",
    "ownerEmail": "ykj3377@gmail.com",
    "className": "새싹반 (유구종 교수 연구실)",
    "ageGroup": "만 3-5세",
    "durationLabel": "새 영상",
    "durationSeconds": 15,
    "description": "따뜻한 표정의 봉제인형 캐릭터가 인사말과 고운 말을 건네며 이야기 나누기 도입을 돕는 영상입니다.",
    "isTeacherUpload": true,
    "isSharedCuration": true,
    "rightsConfirmed": true,
    "sponsorFreeConfirmed": true,
    "likes": 2,
    "shares": 1,
    "downloads": 0,
    "views": 22,
    "themeColors": [
      "#F7D2C4",
      "#F4A261",
      "#2A9D8F"
    ],
    "characterType": "plush-smile"
  },
  {
    "id": "vid-06",
    "order": 6,
    "title": "'개미와 베짱이' 동화를 '코끼리와 하마' 동화로 개작",
    "category": "언어·동화",
    "creatorName": "구종 유",
    "ownerEmail": "ykj3377@gmail.com",
    "className": "새싹반 (유구종 교수 연구실)",
    "ageGroup": "만 3-5세",
    "durationLabel": "새 영상",
    "durationSeconds": 20,
    "description": "친숙한 '개미와 베짱이' 이야기를 코끼리와 하마의 협동 이야기로 새롭게 개작하여 창의적 사고를 자극하는 동화 영상입니다.",
    "isTeacherUpload": true,
    "isSharedCuration": true,
    "rightsConfirmed": true,
    "sponsorFreeConfirmed": true,
    "likes": 4,
    "shares": 2,
    "downloads": 3,
    "views": 38,
    "themeColors": [
      "#8ECAE6",
      "#219EBC",
      "#FFB703"
    ],
    "characterType": "elephant-hippo"
  },
  {
    "id": "vid-07",
    "order": 7,
    "title": "영어로 이야기 들려주는 유구종 교수",
    "category": "언어·동화",
    "creatorName": "구종 유",
    "ownerEmail": "ykj3377@gmail.com",
    "className": "새싹반 (유구종 교수 연구실)",
    "ageGroup": "만 3-5세",
    "durationLabel": "새 영상",
    "durationSeconds": 18,
    "description": "유아 눈높이에 맞춘 쉬운 영어 표현과 억양으로 짧고 재미있는 이야기를 들려주는 언어 활동 영상입니다.",
    "isTeacherUpload": true,
    "isSharedCuration": true,
    "rightsConfirmed": true,
    "sponsorFreeConfirmed": true,
    "likes": 5,
    "shares": 1,
    "downloads": 2,
    "views": 41,
    "themeColors": [
      "#A8DADC",
      "#457B9D",
      "#1D3557"
    ],
    "characterType": "story-prof"
  },
  {
    "id": "vid-08",
    "order": 8,
    "title": "개구리와 코끼리 테이블 인형",
    "category": "언어·동화",
    "creatorName": "구종 유",
    "ownerEmail": "ykj3377@gmail.com",
    "className": "새싹반 (유구종 교수 연구실)",
    "ageGroup": "만 3-5세",
    "durationLabel": "새 영상",
    "durationSeconds": 16,
    "description": "작은 개구리와 큰 코끼리 테이블 인형이 서로의 다른 점을 인정하고 친구가 되는 인성 동화 영상입니다.",
    "isTeacherUpload": true,
    "isSharedCuration": true,
    "rightsConfirmed": true,
    "sponsorFreeConfirmed": true,
    "likes": 1,
    "shares": 0,
    "downloads": 1,
    "views": 15,
    "themeColors": [
      "#95D5B2",
      "#74C69D",
      "#90E0EF"
    ],
    "characterType": "frog-elephant"
  },
  {
    "id": "vid-09",
    "order": 9,
    "title": "소녀와 놀이하는 유구종 교수",
    "category": "자연·관찰",
    "creatorName": "구종 유",
    "ownerEmail": "ykj3377@gmail.com",
    "className": "새싹반 (유구종 교수 연구실)",
    "ageGroup": "만 3-5세",
    "durationLabel": "새 영상",
    "durationSeconds": 17,
    "description": "일상 속 자연물을 함께 관찰하고 호기심 질문을 주고받는 상호작용 시범 영상입니다.",
    "isTeacherUpload": true,
    "isSharedCuration": true,
    "rightsConfirmed": true,
    "sponsorFreeConfirmed": true,
    "likes": 3,
    "shares": 1,
    "downloads": 1,
    "views": 29,
    "themeColors": [
      "#B7E4C7",
      "#52B788",
      "#F4A261"
    ],
    "characterType": "nature-play"
  },
  {
    "id": "vid-10",
    "order": 10,
    "title": "공룡 줄인형",
    "category": "언어·동화",
    "creatorName": "구종 유",
    "ownerEmail": "ykj3377@gmail.com",
    "className": "새싹반 (유구종 교수 연구실)",
    "ageGroup": "만 3-5세",
    "durationLabel": "새 영상",
    "durationSeconds": 15,
    "description": "줄을 당기면 움직이는 공룡 줄인형과 함께 공룡 시대의 이야기를 상상해 보는 동화 영상입니다.",
    "isTeacherUpload": true,
    "isSharedCuration": true,
    "rightsConfirmed": true,
    "sponsorFreeConfirmed": true,
    "likes": 6,
    "shares": 2,
    "downloads": 3,
    "views": 47,
    "themeColors": [
      "#74C69D",
      "#40916C",
      "#FFB703"
    ],
    "characterType": "dino-puppet"
  },
  {
    "id": "vid-11",
    "order": 11,
    "title": "개구리 손가락 인형",
    "category": "언어·동화",
    "creatorName": "구종 유",
    "ownerEmail": "ykj3377@gmail.com",
    "className": "새싹반 (유구종 교수 연구실)",
    "ageGroup": "만 3-5세",
    "durationLabel": "새 영상",
    "durationSeconds": 14,
    "description": "손가락마다 끼운 개구리 인형으로 리듬감 있게 말놀이를 즐기는 손유희·동화 영상입니다.",
    "isTeacherUpload": true,
    "isSharedCuration": true,
    "rightsConfirmed": true,
    "sponsorFreeConfirmed": true,
    "likes": 2,
    "shares": 0,
    "downloads": 1,
    "views": 21,
    "themeColors": [
      "#80ED99",
      "#57CC99",
      "#38A3A5"
    ],
    "characterType": "frog-finger"
  },
  {
    "id": "vid-12",
    "order": 12,
    "title": "코끼리 손가락 인형",
    "category": "언어·동화",
    "creatorName": "구종 유",
    "ownerEmail": "ykj3377@gmail.com",
    "className": "새싹반 (유구종 교수 연구실)",
    "ageGroup": "만 3-5세",
    "durationLabel": "새 영상",
    "durationSeconds": 14,
    "description": "코끼리 코가 길어진 이유를 손가락 인형극으로 재미있게 풀어낸 짧은 동화 영상입니다.",
    "isTeacherUpload": true,
    "isSharedCuration": true,
    "rightsConfirmed": true,
    "sponsorFreeConfirmed": true,
    "likes": 1,
    "shares": 0,
    "downloads": 1,
    "views": 18,
    "themeColors": [
      "#90E0EF",
      "#00B4D8",
      "#0077B6"
    ],
    "characterType": "elephant-finger"
  },
  {
    "id": "vid-13",
    "order": 13,
    "title": "채소 인형들",
    "category": "마음·감정",
    "creatorName": "구종 유",
    "ownerEmail": "ykj3377@gmail.com",
    "className": "새싹반 (유구종 교수 연구실)",
    "ageGroup": "만 3-5세",
    "durationLabel": "새 영상",
    "durationSeconds": 15,
    "description": "서로 모양과 색깔이 다른 채소 인형들이 각자의 기분과 감정을 이야기하는 마음·감정 수업 자료입니다.",
    "isTeacherUpload": true,
    "isSharedCuration": true,
    "rightsConfirmed": true,
    "sponsorFreeConfirmed": true,
    "likes": 2,
    "shares": 1,
    "downloads": 1,
    "views": 26,
    "themeColors": [
      "#FFCAD4",
      "#F4ACB7",
      "#9D8189"
    ],
    "characterType": "veggie-emotion"
  },
  {
    "id": "vid-14",
    "order": 14,
    "title": "토끼와 거북이 3D 막대인형",
    "category": "언어·동화",
    "creatorName": "구종 유",
    "ownerEmail": "ykj3377@gmail.com",
    "className": "새싹반 (유구종 교수 연구실)",
    "ageGroup": "만 3-5세",
    "durationLabel": "새 영상",
    "durationSeconds": 18,
    "description": "입체감 있는 3D 막대인형으로 재구성한 토끼와 거북이 경주 이야기입니다.",
    "isTeacherUpload": true,
    "isSharedCuration": true,
    "rightsConfirmed": true,
    "sponsorFreeConfirmed": true,
    "likes": 3,
    "shares": 1,
    "downloads": 2,
    "views": 30,
    "themeColors": [
      "#B7E4C7",
      "#F4A261",
      "#2A9D8F"
    ],
    "characterType": "rabbit-turtle-3d"
  },
  {
    "id": "vid-15",
    "order": 15,
    "title": "토끼와 거북이 막대동화",
    "category": "언어·동화",
    "creatorName": "구종 유",
    "ownerEmail": "ykj3377@gmail.com",
    "className": "새싹반 (유구종 교수 연구실)",
    "ageGroup": "만 3-5세",
    "durationLabel": "새 영상",
    "durationSeconds": 17,
    "description": "아이들이 직접 대사를 따라 말하며 참여할 수 있도록 구성된 막대동화 수업 영상입니다.",
    "isTeacherUpload": true,
    "isSharedCuration": true,
    "rightsConfirmed": true,
    "sponsorFreeConfirmed": true,
    "likes": 2,
    "shares": 0,
    "downloads": 1,
    "views": 23,
    "themeColors": [
      "#D8F3DC",
      "#74C69D",
      "#E76F51"
    ],
    "characterType": "rabbit-turtle-story"
  },
  {
    "id": "vid-16",
    "order": 16,
    "title": "GEMINI OMNI-MBTI 성격 유형 돼지 삼형제 이야기",
    "category": "마음·감정",
    "creatorName": "구종 유",
    "ownerEmail": "ykj3377@gmail.com",
    "className": "새싹반 (유구종 교수 연구실)",
    "ageGroup": "만 3-5세",
    "durationLabel": "새 영상",
    "durationSeconds": 21,
    "description": "성격과 성향이 서로 다른 아기돼지 삼형제가 집을 짓고 협력하는 과정을 통해 나와 친구의 다름을 이해하는 마음·감정 동화입니다.",
    "isTeacherUpload": true,
    "isSharedCuration": true,
    "rightsConfirmed": true,
    "sponsorFreeConfirmed": true,
    "likes": 7,
    "shares": 3,
    "downloads": 4,
    "views": 54,
    "themeColors": [
      "#FFB5A7",
      "#FCD5CE",
      "#F9DCC4"
    ],
    "characterType": "three-pigs-mbti"
  },
  {
    "id": "vid-17",
    "order": 17,
    "title": "아기돼지 삼형제가 우주복을 입고 우주헬멧을 쓰고 우주선을 타고 날아간다-",
    "category": "자연·관찰",
    "creatorName": "구종 유",
    "ownerEmail": "ykj3377@gmail.com",
    "className": "새싹반 (유구종 교수 연구실)",
    "ageGroup": "만 3-5세",
    "durationLabel": "새 영상",
    "durationSeconds": 19,
    "description": "우주복과 헬멧을 쓴 아기돼지 삼형제와 함께 우주와 행성에 대한 호기심을 키우는 과학·상상 이야기 영상입니다.",
    "isTeacherUpload": true,
    "isSharedCuration": true,
    "rightsConfirmed": true,
    "sponsorFreeConfirmed": true,
    "likes": 5,
    "shares": 2,
    "downloads": 2,
    "views": 44,
    "themeColors": [
      "#1D3557",
      "#457B9D",
      "#F4A261"
    ],
    "characterType": "space-pigs"
  },
  {
    "id": "vid-18",
    "order": 18,
    "title": "애니메이트 드로잉",
    "category": "마음·감정",
    "creatorName": "구종 유",
    "ownerEmail": "ykj3377@gmail.com",
    "className": "새싹반 (유구종 교수 연구실)",
    "ageGroup": "만 3-5세",
    "durationLabel": "새 영상",
    "durationSeconds": 15,
    "description": "유아가 직접 그린 그림 캐릭터가 살아 움직이며 자신의 기분을 표현하는 AI 애니메이트 드로잉 활동 영상입니다.",
    "isTeacherUpload": true,
    "isSharedCuration": true,
    "rightsConfirmed": true,
    "sponsorFreeConfirmed": true,
    "likes": 4,
    "shares": 1,
    "downloads": 2,
    "views": 35,
    "themeColors": [
      "#FDE2E4",
      "#FAD2E1",
      "#BEE1E6"
    ],
    "characterType": "animate-drawing"
  },
  {
    "id": "vid-19",
    "order": 19,
    "title": "유구종 교수 이야기나누기",
    "category": "자연·관찰",
    "creatorName": "구종 유",
    "ownerEmail": "ykj3377@gmail.com",
    "className": "새싹반 (유구종 교수 연구실)",
    "ageGroup": "만 3-5세",
    "durationLabel": "새 영상",
    "durationSeconds": 18,
    "description": "교실 속 이야기나누기 시간에 아이들의 생각과 질문을 이끌어내는 발문 시범 영상입니다.",
    "isTeacherUpload": true,
    "isSharedCuration": true,
    "rightsConfirmed": true,
    "sponsorFreeConfirmed": true,
    "likes": 3,
    "shares": 1,
    "downloads": 1,
    "views": 28,
    "themeColors": [
      "#95D5B2",
      "#52B788",
      "#1B4332"
    ],
    "characterType": "prof-talk"
  },
  {
    "id": "vid-20",
    "order": 20,
    "title": "하나, 둘, 셋! 도토리를 세어 보아요",
    "category": "자연·수학",
    "creatorName": "새싹플레이 연구실",
    "ownerEmail": "curation@saessak.edu",
    "className": "새싹플레이 공통 큐레이션",
    "ageGroup": "만 3–5세",
    "durationLabel": "00:08",
    "durationSeconds": 8,
    "description": "숲속 다람쥐와 함께 도토리를 하나, 둘, 셋 세어 보며 수 개념을 익히는 짧은 배움 영상입니다.",
    "isTeacherUpload": false,
    "isSharedCuration": true,
    "rightsConfirmed": true,
    "sponsorFreeConfirmed": true,
    "likes": 8,
    "shares": 3,
    "downloads": 5,
    "views": 62,
    "themeColors": [
      "#DDB892",
      "#B08968",
      "#7F5539"
    ],
    "characterType": "acorn-count"
  },
  {
    "id": "vid-21",
    "order": 21,
    "title": "뽀득뽀득 30초 손 씻기 약속",
    "category": "생활 습관",
    "creatorName": "새싹플레이 연구실",
    "ownerEmail": "curation@saessak.edu",
    "className": "새싹플레이 공통 큐레이션",
    "ageGroup": "만 3–5세",
    "durationLabel": "00:08",
    "durationSeconds": 8,
    "description": "비누 거품을 내어 손바닥, 손등, 손가락 사이까지 30초 동안 깨끗이 씻는 건강한 생활 습관 영상입니다.",
    "isTeacherUpload": false,
    "isSharedCuration": true,
    "rightsConfirmed": true,
    "sponsorFreeConfirmed": true,
    "likes": 11,
    "shares": 4,
    "downloads": 7,
    "views": 79,
    "themeColors": [
      "#ADE8F4",
      "#48CAE4",
      "#0096C7"
    ],
    "characterType": "hand-wash"
  },
  {
    "id": "vid-22",
    "order": 22,
    "title": "오늘 내 마음은 어떤 색일까?",
    "category": "마음·감정",
    "creatorName": "새싹플레이 연구실",
    "ownerEmail": "curation@saessak.edu",
    "className": "새싹플레이 공통 큐레이션",
    "ageGroup": "만 4–5세",
    "durationLabel": "00:08",
    "durationSeconds": 8,
    "description": "기쁨, 슬픔, 놀람, 편안함 등 오늘 나의 감정을 색깔로 표현하고 친구와 나누어 보는 마음·감정 영상입니다.",
    "isTeacherUpload": false,
    "isSharedCuration": true,
    "rightsConfirmed": true,
    "sponsorFreeConfirmed": true,
    "likes": 9,
    "shares": 2,
    "downloads": 4,
    "views": 68,
    "themeColors": [
      "#FFAFCC",
      "#BDE0FE",
      "#FFC8DD"
    ],
    "characterType": "emotion-colors"
  },
  {
    "id": "vid-haneul-01",
    "order": 101,
    "title": "[열매반 전용] 봄꽃 이름 맞추기 수수께끼 동화",
    "category": "자연·관찰",
    "creatorName": "김하늘 선생님",
    "ownerEmail": "haneul.ece@gmail.com",
    "className": "열매반 (김하늘 선생님)",
    "ageGroup": "만 4-5세",
    "durationLabel": "00:25",
    "durationSeconds": 25,
    "description": "열매반 아이들과 산책하며 촬영한 봄꽃 사진으로 만든 우리 반 전용 이야기나누기 영상입니다.",
    "isTeacherUpload": true,
    "isSharedCuration": false,
    "rightsConfirmed": true,
    "sponsorFreeConfirmed": true,
    "likes": 4,
    "shares": 0,
    "downloads": 2,
    "views": 16,
    "themeColors": [
      "#FFB5A7",
      "#FCD5CE",
      "#D8E2DC"
    ],
    "characterType": "nature-play"
  },
  {
    "id": "vid-seoyeon-01",
    "order": 201,
    "title": "[해님반 전용] 친구에게 고운 말 건네기 손인형극",
    "category": "생활 습관",
    "creatorName": "이서연 선생님",
    "ownerEmail": "seoyeon.kids@gmail.com",
    "className": "해님반 (이서연 선생님)",
    "ageGroup": "만 3-4세",
    "durationLabel": "00:30",
    "durationSeconds": 30,
    "description": "해님반 교실 약속을 주제로 제작한 우리 반 전용 손인형극 영상입니다.",
    "isTeacherUpload": true,
    "isSharedCuration": false,
    "rightsConfirmed": true,
    "sponsorFreeConfirmed": true,
    "likes": 3,
    "shares": 0,
    "downloads": 1,
    "views": 12,
    "themeColors": [
      "#FFE5D9",
      "#FFCAD4",
      "#B5E2FA"
    ],
    "characterType": "plush-smile"
  }
];

export function createInMemoryStore(seedVideos = INITIAL_SEED_VIDEOS) {
  const state = {
    videos: seedVideos.map((v) => ({ ...v, createdAt: v.createdAt || "2026-10-14T00:00:00.000Z" })),
    bookmarksByEmail: new Map(), // email -> Set<videoId>
    historyByEmail: new Map(),   // email -> Array<videoId>
    followsByEmail: new Map(),   // email -> Set<creatorName>
    agentTokens: new Map()       // token -> { ownerEmail, creatorName, className, expiresAt }
  };

  function normalizeEmail(email) {
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return "demo@saessak.local";
    }
    return email.trim().toLowerCase();
  }

  /**
   * Query videos with strict boundary between:
   * - 'shared' (교사 공동 큐레이션): Only videos where isSharedCuration === true OR owned by the requesting teacher
   * - 'teacher' (교사 큐레이션 / 우리 반 전용 DB): Strictly videos where ownerEmail === normalized requesting teacher's Google email
   */
  function queryVideos({
    viewerEmail = "demo@saessak.local",
    curationTab = "shared",
    topic = "",
    searchQuery = "",
    filterMode = "all" // 'all' | 'liked' | 'recent'
  } = {}) {
    const email = normalizeEmail(viewerEmail);
    const likedSet = state.bookmarksByEmail.get(email) || new Set();
    const recentList = state.historyByEmail.get(email) || [];

    let pool = [];
    if (curationTab === "teacher") {
      // 우리 반 고유 업로드/스크랩 동영상 DB만 별도 조회
      pool = state.videos.filter(
        (v) => v.ownerEmail.toLowerCase() === email && v.isTeacherUpload
      );
    } else {
      // 교사 공동 큐레이션: 공동 큐레이션 허용 영상만 노출 (타 학급 비공개 전용 영상은 절대 노출하지 않음)
      pool = state.videos.filter(
        (v) => v.isSharedCuration === true || v.ownerEmail.toLowerCase() === email
      );
    }

    if (filterMode === "liked") {
      pool = pool.filter((v) => likedSet.has(v.id));
    } else if (filterMode === "recent") {
      const orderMap = new Map(recentList.map((id, idx) => [id, idx]));
      pool = pool
        .filter((v) => orderMap.has(v.id))
        .sort((a, b) => (orderMap.get(a.id) ?? 999) - (orderMap.get(b.id) ?? 999));
    }

    if (topic && topic.trim()) {
      const t = topic.trim();
      pool = pool.filter(
        (v) =>
          v.category === t ||
          v.category.includes(t) ||
          v.title.includes(t) ||
          v.description.includes(t)
      );
    }

    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      pool = pool.filter(
        (v) =>
          v.title.toLowerCase().includes(q) ||
          v.category.toLowerCase().includes(q) ||
          v.creatorName.toLowerCase().includes(q) ||
          (v.description && v.description.toLowerCase().includes(q)) ||
          (v.className && v.className.toLowerCase().includes(q))
      );
    }

    return pool.map((v) => ({
      ...v,
      likedByMe: likedSet.has(v.id),
      isMyClassVideo: v.ownerEmail.toLowerCase() === email
    }));
  }

  /**
   * Upload a new video directly to the authenticated teacher's class DB.
   */
  function uploadTeacherVideo({
    actorEmail,
    actorName,
    className,
    title,
    category = "언어·동화",
    ageGroup = "만 3-5세",
    description = "",
    durationLabel = "새 영상",
    playbackUrl = "",
    downloadUrl = "",
    isSharedCuration = false,
    rightsConfirmed = false,
    sponsorFreeConfirmed = false
  }) {
    const email = normalizeEmail(actorEmail);
    if (!title || !String(title).trim()) {
      throw new Error("영상 제목을 입력해 주세요.");
    }
    if (!rightsConfirmed || !sponsorFreeConfirmed) {
      throw new Error("저작권 및 협찬 광고 없음 확인에 동의해야 업로드할 수 있습니다.");
    }

    const newVideo = {
      id: `vid-upload-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      order: state.videos.length + 1,
      title: String(title).trim(),
      category,
      creatorName: actorName ? String(actorName).trim() : email.split("@")[0],
      ownerEmail: email,
      className: className || `${actorName || "선생님"} 교실`,
      ageGroup,
      durationLabel,
      durationSeconds: 20,
      description: String(description || "").trim() || `${title} 수업 활용 영상입니다.`,
      playbackUrl: playbackUrl || "",
      downloadUrl: downloadUrl || playbackUrl || "",
      isTeacherUpload: true,
      isSharedCuration: Boolean(isSharedCuration),
      rightsConfirmed: true,
      sponsorFreeConfirmed: true,
      likes: 0,
      shares: 0,
      downloads: 0,
      views: 1,
      themeColors: ["#74C69D", "#52B788", "#1B4332"],
      characterType: "rabbit-turtle",
      createdAt: new Date().toISOString()
    };

    state.videos.unshift(newVideo);
    return newVideo;
  }

  /**
   * Delete a video — strictly requires ownerEmail match.
   */
  function deleteTeacherVideo({ actorEmail, videoId }) {
    const email = normalizeEmail(actorEmail);
    const idx = state.videos.findIndex((v) => v.id === videoId);
    if (idx === -1) {
      throw new Error("영상을 찾을 수 없습니다.");
    }
    const target = state.videos[idx];
    if (target.ownerEmail.toLowerCase() !== email) {
      throw new Error("본인 구글 계정(우리 반 DB)으로 업로드한 영상만 삭제할 수 있습니다.");
    }
    const [removed] = state.videos.splice(idx, 1);
    return removed;
  }

  /**
   * Parse and scrape external video lists (URLs, HTML snippets, JSON arrays, or markdown lists)
   * and store them in the authenticated teacher's class DB.
   */
  function scrapeVideoListToClassDb({
    actorEmail,
    actorName,
    className,
    sourceUrlOrText,
    defaultCategory = "언어·동화",
    defaultAgeGroup = "만 3-5세",
    isSharedCuration = false,
    rightsConfirmed = true,
    sponsorFreeConfirmed = true
  }) {
    const email = normalizeEmail(actorEmail);
    if (!rightsConfirmed || !sponsorFreeConfirmed) {
      throw new Error("스크랩 영상의 교육적 활용 권리 및 무광고 확인이 필요합니다.");
    }
    const raw = String(sourceUrlOrText || "").trim();
    if (!raw) {
      throw new Error("스크랩할 동영상 사이트 주소(URL) 또는 동영상 리스트를 입력해 주세요.");
    }

    let parsedItems = [];

    // 1) Try JSON format (matches /api/agent-import schema or array of videos)
    if (raw.startsWith("{") || raw.startsWith("[")) {
      try {
        const obj = JSON.parse(raw);
        const list = Array.isArray(obj) ? obj : Array.isArray(obj.videos) ? obj.videos : [];
        parsedItems = list.map((item, i) => ({
          title: item.title || `스크랩 배움 영상 #${i + 1}`,
          description: item.description || "외부 동영상 플랫폼에서 스크랩한 수업 자료입니다.",
          playbackUrl: item.playbackUrl || item.url || "",
          downloadUrl: item.downloadUrl || item.playbackUrl || item.url || "",
          sourceSiteUrl: item.sourceSiteUrl || item.playbackUrl || "",
          category: item.category || defaultCategory,
          ageGroup: item.ageGroup || defaultAgeGroup,
          durationLabel: item.durationLabel || "00:30",
          licenseNote: item.licenseNote || "교사 교육활동 활용 확인"
        }));
      } catch (_e) {
        // Fall through to line/URL parser
      }
    }

    // 2) Line-by-line or URL/HTML parser
    if (parsedItems.length === 0) {
      const lines = raw
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean);

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        // Format: "제목 | URL | 주제 | 재생시간" or "- 제목 (https://...)" or standalone URL
        const pipeParts = line.split("|").map((p) => p.trim());
        if (pipeParts.length >= 2 && /^https?:\/\//i.test(pipeParts[1])) {
          parsedItems.push({
            title: pipeParts[0],
            playbackUrl: pipeParts[1],
            downloadUrl: pipeParts[1],
            sourceSiteUrl: pipeParts[1],
            category: pipeParts[2] || defaultCategory,
            durationLabel: pipeParts[3] || "00:45",
            ageGroup: defaultAgeGroup,
            description: `${pipeParts[0]} — 외부 동영상 사이트에서 스크랩한 우리 반 맞춤 수업 영상입니다.`
          });
          continue;
        }

        const urlMatch = line.match(/(https?:\/\/[^\s)"'<>]+)/i);
        if (urlMatch) {
          const url = urlMatch[1];
          const cleanTitle = line
            .replace(url, "")
            .replace(/^[-*•0-9.)\[\]\s]+/, "")
            .replace(/[()\[\]]/g, "")
            .trim();
          // Infer a meaningful Korean educational title if only a URL was given
          let inferredTitle = cleanTitle;
          if (!inferredTitle) {
            if (url.includes("ebs") || url.includes("kids")) {
              inferredTitle = `EBS 유아 동화·이야기나누기 스크랩 영상 #${i + 1}`;
            } else if (url.includes("youtube") || url.includes("youtu.be")) {
              inferredTitle = `유튜브 유아교육 동화 큐레이션 영상 #${i + 1}`;
            } else {
              inferredTitle = `외부 교육 사이트 스크랩 영상 #${i + 1} (${new URL(url).hostname})`;
            }
          }
          parsedItems.push({
            title: inferredTitle,
            playbackUrl: url,
            downloadUrl: url,
            sourceSiteUrl: url,
            category: defaultCategory,
            ageGroup: defaultAgeGroup,
            durationLabel: "00:40",
            description: `${url} 에서 스크랩하여 우리 반 DB에 등록한 수업 영상입니다.`
          });
        } else if (line.length >= 2) {
          parsedItems.push({
            title: line.replace(/^[-*•0-9.)\s]+/, "").trim(),
            playbackUrl: "",
            downloadUrl: "",
            sourceSiteUrl: "직접 리스트 스크랩",
            category: defaultCategory,
            ageGroup: defaultAgeGroup,
            durationLabel: "00:30",
            description: `${line} — 동영상 리스트 스크랩 기능으로 등록한 수업 영상입니다.`
          });
        }
      }
    }

    if (parsedItems.length === 0) {
      throw new Error("인식 가능한 동영상 항목을 찾지 못했습니다.");
    }

    const inserted = [];
    for (const item of parsedItems) {
      const created = uploadTeacherVideo({
        actorEmail: email,
        actorName,
        className,
        title: item.title,
        category: item.category || defaultCategory,
        ageGroup: item.ageGroup || defaultAgeGroup,
        description: item.description,
        durationLabel: item.durationLabel || "00:30",
        playbackUrl: item.playbackUrl,
        downloadUrl: item.downloadUrl,
        isSharedCuration,
        rightsConfirmed: true,
        sponsorFreeConfirmed: true
      });
      created.sourceSiteUrl = item.sourceSiteUrl || item.playbackUrl || "";
      inserted.push(created);
    }

    return inserted;
  }

  /**
   * Issue a 24-hour one-time Agent Import Token scoped to a teacher's Google account.
   */
  function createAgentImportToken({ actorEmail, actorName, className }) {
    const email = normalizeEmail(actorEmail);
    const token = `ag_${randomUUID()}`;
    const record = {
      token,
      ownerEmail: email,
      creatorName: actorName || email.split("@")[0],
      className: className || "우리 반 전용 DB",
      expiresAt: Date.now() + 24 * 60 * 60 * 1000
    };
    state.agentTokens.set(token, record);
    return record;
  }

  /**
   * Consume or import videos via a 24-hour Agent Import Token.
   */
  function importViaAgentToken({ token, payload }) {
    const record = state.agentTokens.get(token);
    if (!record || record.expiresAt < Date.now()) {
      throw new Error("유효하지 않거나 만료된 에이전트 연결 토큰입니다.");
    }
    const videos = Array.isArray(payload?.videos) ? payload.videos : [];
    if (videos.length === 0) {
      throw new Error("전송된 videos 배열이 비어 있습니다.");
    }
    const imported = scrapeVideoListToClassDb({
      actorEmail: record.ownerEmail,
      actorName: payload.creatorName || record.creatorName,
      className: record.className,
      sourceUrlOrText: JSON.stringify({ videos }),
      isSharedCuration: false,
      rightsConfirmed: true,
      sponsorFreeConfirmed: true
    });
    state.agentTokens.delete(token);
    return imported;
  }

  function toggleBookmark({ actorEmail, videoId }) {
    const email = normalizeEmail(actorEmail);
    if (!state.bookmarksByEmail.has(email)) {
      state.bookmarksByEmail.set(email, new Set());
    }
    const set = state.bookmarksByEmail.get(email);
    const video = state.videos.find((v) => v.id === videoId);
    if (!video) throw new Error("영상을 찾을 수 없습니다.");
    if (!video.isSharedCuration && video.ownerEmail.toLowerCase() !== email) throw new Error("영상 접근 권한이 없습니다.");

    let liked = false;
    if (set.has(videoId)) {
      set.delete(videoId);
      video.likes = Math.max(0, (video.likes || 0) - 1);
      liked = false;
    } else {
      set.add(videoId);
      video.likes = (video.likes || 0) + 1;
      liked = true;
    }
    return { liked, likes: video.likes };
  }

  function recordView({ actorEmail, videoId }) {
    const email = normalizeEmail(actorEmail);
    const video = state.videos.find((v) => v.id === videoId);
    if (!video) throw new Error("영상을 찾을 수 없습니다.");
    if (!video.isSharedCuration && video.ownerEmail.toLowerCase() !== email) throw new Error("영상 접근 권한이 없습니다.");
    video.views = (video.views || 0) + 1;

    const prev = state.historyByEmail.get(email) || [];
    const updated = [videoId, ...prev.filter((id) => id !== videoId)].slice(0, 50);
    state.historyByEmail.set(email, updated);
    return { views: video.views, recentIds: updated };
  }

  return {
    state,
    queryVideos,
    uploadTeacherVideo,
    deleteTeacherVideo,
    scrapeVideoListToClassDb,
    createAgentImportToken,
    importViaAgentToken,
    toggleBookmark,
    recordView
  };
}

export const globalSaessakStore = createInMemoryStore();
