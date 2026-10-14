import test from "node:test";
import assert from "node:assert/strict";
import { createInMemoryStore } from "../src/lib/core-store.mjs";

test("1. 교사 구글 계정별 우리 반 업로드 동영상 DB 완벽 분리 검증", () => {
  const store = createInMemoryStore();

  // 유구종 교수(ykj3377@gmail.com)의 교사 큐레이션(우리 반 DB)은 기본 19개 영상
  const yooPrivateList = store.queryVideos({
    viewerEmail: "ykj3377@gmail.com",
    curationTab: "teacher"
  });
  assert.equal(yooPrivateList.length, 19);
  assert.ok(yooPrivateList.every((v) => v.ownerEmail === "ykj3377@gmail.com"));

  // 김하늘 선생님(haneul.ece@gmail.com)의 교사 큐레이션(열매반 DB)은 기본 1개 전용 영상
  const kimPrivateList = store.queryVideos({
    viewerEmail: "haneul.ece@gmail.com",
    curationTab: "teacher"
  });
  assert.equal(kimPrivateList.length, 1);
  assert.equal(kimPrivateList[0].title, "[열매반 전용] 봄꽃 이름 맞추기 수수께끼 동화");

  // 김하늘 선생님이 열매반 전용(비공개) 동화 영상을 새로 업로드
  const uploaded = store.uploadTeacherVideo({
    actorEmail: "haneul.ece@gmail.com",
    actorName: "김하늘 선생님",
    className: "열매반",
    title: "열매반 무지개 물고기 손인형 동화",
    category: "언어·동화",
    ageGroup: "만 4-5세",
    isSharedCuration: false,
    rightsConfirmed: true,
    sponsorFreeConfirmed: true
  });
  assert.equal(uploaded.ownerEmail, "haneul.ece@gmail.com");

  // 업로드 후 김하늘 선생님의 교사 큐레이션은 2개로 증가
  const kimAfter = store.queryVideos({
    viewerEmail: "haneul.ece@gmail.com",
    curationTab: "teacher"
  });
  assert.equal(kimAfter.length, 2);

  // 반면 유구종 교수나 이서연 선생님의 교사 큐레이션 및 공동 큐레이션에는 김하늘 선생님의 비공개 반 영상이 노출되지 않음
  const yooAfter = store.queryVideos({
    viewerEmail: "ykj3377@gmail.com",
    curationTab: "teacher"
  });
  assert.equal(yooAfter.length, 19);

  const yooShared = store.queryVideos({
    viewerEmail: "ykj3377@gmail.com",
    curationTab: "shared"
  });
  assert.ok(!yooShared.some((v) => v.id === uploaded.id));
});

test("2. 타 교사 계정의 영상 삭제 차단 (소유권 검증)", () => {
  const store = createInMemoryStore();

  // 이서연 선생님이 유구종 교수의 1번 영상을 삭제 시도하면 차단되어야 함
  assert.throws(
    () => {
      store.deleteTeacherVideo({
        actorEmail: "seoyeon.kids@gmail.com",
        videoId: "vid-01"
      });
    },
    /본인 구글 계정/
  );

  // 본인 계정(ykj3377@gmail.com)으로는 삭제 가능
  const deleted = store.deleteTeacherVideo({
    actorEmail: "ykj3377@gmail.com",
    videoId: "vid-01"
  });
  assert.equal(deleted.id, "vid-01");
});

test("3. 외부 동영상 사이트 리스트 스크랩 및 에이전트 임포트 토큰 검증", () => {
  const store = createInMemoryStore();

  const scraped = store.scrapeVideoListToClassDb({
    actorEmail: "seoyeon.kids@gmail.com",
    actorName: "이서연 선생님",
    className: "해님반",
    sourceUrlOrText: [
      "아기 오리들의 소풍 이야기 | https://media.example.edu/ducklings.mp4 | 자연·관찰 | 00:35",
      "친구와 장난감을 나누어 써요 | https://media.example.edu/share-toys.mp4 | 생활 습관 | 00:28"
    ].join("\n"),
    isSharedCuration: false,
    rightsConfirmed: true,
    sponsorFreeConfirmed: true
  });

  assert.equal(scraped.length, 2);
  assert.equal(scraped[0].ownerEmail, "seoyeon.kids@gmail.com");
  assert.equal(scraped[0].category, "자연·관찰");

  // 에이전트 1회용 수집 엔드포인트 토큰 발급 및 JSON 임포트 테스트
  const tokenRec = store.createAgentImportToken({
    actorEmail: "ykj3377@gmail.com",
    actorName: "구종 유",
    className: "새싹반"
  });

  const imported = store.importViaAgentToken({
    token: tokenRec.token,
    payload: {
      creatorName: "구종 유",
      videos: [
        {
          title: "에이전트 수집 - 숲속 곤충들의 음악회",
          description: "곤충 소리를 듣고 리듬을 표현해요",
          playbackUrl: "https://cdn.example.org/insects-concert.mp4",
          downloadUrl: "https://cdn.example.org/insects-concert.mp4",
          ageGroup: "만 3-5세",
          category: "신체·음악",
          durationLabel: "00:32",
          licenseNote: "CC-BY 교육용 허용",
          sponsorFreeConfirmed: true,
          rightsConfirmed: true
        }
      ]
    }
  });

  assert.equal(imported.length, 1);
  assert.equal(imported[0].ownerEmail, "ykj3377@gmail.com");
});
