import { z } from "zod";

export const categories = [
  {
    id: "album",
    name: "사진 앨범",
    description: "사진으로 담아 두는, 반짝이는 하루의 장면",
    icon: "image",
  },
  {
    id: "observation",
    name: "관찰 기록",
    description: "자세히 바라볼수록 발견하는 아이의 가능성",
    icon: "notebook",
  },
  {
    id: "portfolio",
    name: "포트폴리오",
    description: "작은 변화가 모여 완성되는 성장 이야기",
    icon: "folder",
  },
  {
    id: "materials",
    name: "교재 교구",
    description: "함께 놀고 배우는 교실의 아이디어 모음",
    icon: "blocks",
  },
] as const;
export type Category = (typeof categories)[number]["id"];
export const attachmentSchema = z.object({
  id: z.string().uuid(),
  name: z.string().max(180),
  data: z
    .string()
    .max(2_800_000)
    .regex(/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/),
  generated: z.boolean().optional(),
});
export const recordSchema = z
  .object({
    id: z.string().uuid(),
    category: z.enum(["album", "observation", "portfolio", "materials"]),
    title: z.string().trim().min(1, "제목을 입력해 주세요.").max(100),
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .refine(
        (s) =>
          !Number.isNaN(Date.parse(s)) &&
          new Date(s).toISOString().slice(0, 10) === s,
      ),
    child: z.string().trim().max(60),
    className: z.string().trim().max(60),
    description: z.string().trim().max(12000),
    memo: z.string().trim().max(12000),
    tags: z.array(z.string().trim().min(1).max(30)).max(15),
    attachments: z.array(attachmentSchema).max(6),
    starred: z.boolean(),
    updatedAt: z.string().datetime(),
  })
  .refine(
    (r) =>
      r.attachments.reduce((sum, a) => sum + a.data.length, 0) <= 3_500_000,
    "첨부 사진의 전체 크기를 줄여 주세요.",
  );
export type ArchiveRecord = z.infer<typeof recordSchema>;
export type Attachment = z.infer<typeof attachmentSchema>;
export type Teacher = {
  id: string;
  name: string;
  className: string;
  demo: boolean;
};
export const demoTeachers: Teacher[] = [
  { id: "demo-hana", name: "김은지", className: "햇살반", demo: true },
  { id: "demo-seoyeon", name: "박민수", className: "새싹반", demo: true },
];
export function formatDate(date: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Seoul",
  }).format(new Date(date));
}
export function today() {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Seoul" }).format(
    new Date(),
  );
}
export function recordText(record: ArchiveRecord) {
  return [
    `도담 기록실 · ${categories.find((c) => c.id === record.category)?.name}`,
    record.title,
    "─".repeat(36),
    `날짜: ${record.date}`,
    `원아: ${record.child || "전체"}`,
    `학급: ${record.className || "미지정"}`,
    "",
    "[장면 설명]",
    record.description,
    "",
    "[교사 메모]",
    record.memo,
    "",
    `태그: ${record.tags.map((t) => `#${t}`).join(" ")}`,
    `첨부: ${record.attachments.map((a) => a.name).join(", ") || "없음"}`,
  ].join("\n");
}
export function sampleRecords(teacher: Teacher): ArchiveRecord[] {
  const common = {
    child: "우리 반 친구들",
    className: teacher.className,
    attachments: [],
    updatedAt: "2026-09-18T09:00:00.000Z",
    starred: false,
  };
  return [
    {
      ...common,
      id: "00000000-0000-4000-8000-000000000001",
      category: "album",
      title: "작은 씨앗에서 시작된 커다란 발견",
      date: "2026-09-18",
      description:
        "텃밭에서 만난 작은 씨앗을 손바닥 위에 올려 보았어요.\n\n“선생님, 이 작은 씨앗이 정말 꽃이 돼요?”\n친구들은 돋보기로 씨앗의 모양을 살피고, 서로 발견한 것을 나누었습니다. 작은 화분에 흙을 담고 씨앗을 심으며 각자의 꽃에 이름도 지어 주었어요.",
      memo: "씨앗의 크기와 색을 비교하며 자연스럽게 탐색이 이어졌다. 정답을 알려주기보다 아이들의 질문을 기다려 주니, 스스로 가설을 세우는 모습을 볼 수 있었다.\n\n다음 주에는 매일 같은 자리에서 사진을 찍으며 함께 성장 기록을 만들어 보자.",
      tags: ["자연탐구", "텃밭놀이", "함께자라요"],
      starred: true,
    },
    {
      ...common,
      id: "00000000-0000-4000-8000-000000000002",
      category: "album",
      title: "가을빛을 모으는 산책",
      date: "2026-09-16",
      description:
        "산책길에서 서로 다른 색의 나뭇잎을 모았어요. 노랑, 초록, 갈색 잎사귀를 나란히 놓으며 우리만의 가을 팔레트를 만들었습니다.",
      memo: "잎사귀를 꺾지 않고 떨어진 잎만 줍기로 한 약속을 스스로 기억했다.",
      tags: ["가을", "산책", "색깔놀이"],
    },
    {
      ...common,
      id: "00000000-0000-4000-8000-000000000003",
      category: "observation",
      title: "“내가 도와줄게”라는 말의 힘",
      date: "2026-09-17",
      description:
        "블록이 무너져 속상해하는 친구 곁에 다가가 다시 쌓는 것을 도와주었다. 두 아이는 역할을 나누어 더 튼튼한 집을 완성했다.",
      memo: "친구의 감정을 알아차리고 도움을 제안하는 모습이 관찰되었다. 협동 놀이를 할 수 있는 충분한 시간과 공간을 마련해 주자.",
      tags: ["사회관계", "협동", "마음의성장"],
    },
    {
      ...common,
      id: "00000000-0000-4000-8000-000000000004",
      category: "portfolio",
      title: "9월, 스스로 해낸 일들",
      date: "2026-09-15",
      description:
        "신발 정리하기, 물 따르기, 친구에게 먼저 인사하기. 일상 속에서 스스로 해낸 순간을 함께 돌아보았습니다.",
      memo: "결과보다 시도하는 과정을 구체적인 말로 격려해 주었다.",
      tags: ["기본생활", "성장기록"],
    },
    {
      ...common,
      id: "00000000-0000-4000-8000-000000000005",
      category: "materials",
      title: "나뭇잎으로 만드는 이야기 카드",
      date: "2026-09-14",
      description:
        "준비물: 떨어진 나뭇잎, 두꺼운 종이, 색연필\n\n나뭇잎을 종이 위에 놓고 떠오르는 동물을 그려요. 완성한 카드를 이어 붙여 우리 반의 이야기를 만들어 봅니다.",
      memo: "서로 다른 표현을 존중하고 한 가지 정답을 제시하지 않는다.",
      tags: ["재활용교구", "이야기놀이"],
    },
  ];
}
