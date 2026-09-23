import { isPlan, sectionKeys, type PlanInput } from "@/lib/plan";

export const runtime = "nodejs";

const textKeys = sectionKeys.filter((key) => key !== "dialogue");
const dialoguePair = { type: "object", properties: { teacher: { type: "string" }, child: { type: "string" } }, required: ["teacher", "child"], additionalProperties: false };

const schema = {
  type: "object",
  properties: {
    title: { type: "string" },
    sections: {
      type: "object",
      properties: Object.fromEntries(textKeys.map((key) => [key, { type: "string" }])),
      required: [...textKeys],
      additionalProperties: false,
    },
    dialogues: { type: "object", properties: { example1: dialoguePair, example2: dialoguePair, example3: dialoguePair }, required: ["example1", "example2", "example3"], additionalProperties: false },
  },
  required: ["title", "sections", "dialogues"],
  additionalProperties: false,
};

export async function POST(request: Request) {
  let input: PlanInput;
  try { input = await request.json(); } catch { return Response.json({ error: "입력 형식을 확인해 주세요." }, { status: 400 }); }
  const { age, title, context, playType } = input ?? {};
  if (!["만 3세", "만 4세", "만 5세"].includes(age) || typeof title !== "string" || !title.trim() || title.length > 100 || typeof context !== "string" || !context.trim() || context.length > 2000 || typeof playType !== "string" || !playType.trim() || playType.length > 100) {
    return Response.json({ error: "연령, 놀이명, 관심·환경, 놀이 유형을 확인해 주세요." }, { status: 400 });
  }
  const key = process.env.OPENAI_API_KEY;
  if (!key) return Response.json({ error: "서버의 생성 기능이 아직 설정되지 않았습니다." }, { status: 503 });

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        store: false,
        instructions: "당신은 대한민국 유아교육 전문가입니다. 입력된 유아의 실제 관심과 놀이 환경을 바탕으로 교사가 바로 활용할 수 있는 놀이 실행안을 한국어로 작성하세요. 2019 개정 누리과정의 놀이 중심 철학을 따르되 성취를 단정하지 마세요. 유아 선택권, 안전, 관찰을 존중하고 과도한 지시식 활동을 피하세요. 각 항목은 구체적이며 서로 중복되지 않게 쓰세요. process에는 도입/전개/마무리의 흐름, support에는 환경·자료·교사 개입 시점, participation에는 유아/교사 각각의 역할, reflection에는 관찰 포인트와 다음 놀이 제안을 포함하세요. dialogues의 example1, example2, example3에는 서로 다른 상황의 자연스러운 교사-유아 발화를 각각 한 쌍씩 쓰세요. 일반적인 문구보다 입력 맥락에 맞는 사례를 우선하세요.",
        input: `연령: ${age}\n놀이명: ${title.trim()}\n유아의 관심·현재 놀이 환경 및 모습: ${context.trim()}\n놀이 유형: ${playType.trim()}`,
        text: { format: { type: "json_schema", name: "play_plan", strict: true, schema } },
        max_output_tokens: 2200,
      }),
      signal: AbortSignal.timeout(45000),
    });
    if (!response.ok) return Response.json({ error: "생성 요청에 실패했습니다. 잠시 후 다시 시도해 주세요." }, { status: 502 });
    const data = await response.json();
    const output = data.output?.flatMap((item: { content?: { type: string; text?: string }[] }) => item.content ?? []).find((part: { type: string }) => part.type === "output_text")?.text;
    if (!output) throw new Error("No text output");
    const plan = JSON.parse(output);
    const pairs = [plan.dialogues?.example1, plan.dialogues?.example2, plan.dialogues?.example3];
    if (pairs.some((pair) => typeof pair?.teacher !== "string" || typeof pair?.child !== "string")) throw new Error("Missing dialogue pairs");
    plan.sections.dialogue = pairs.map((pair) => `교사: ${pair.teacher}  유아: ${pair.child}`).join(String.fromCharCode(10, 10));
    if (!isPlan(plan)) throw new Error("Unexpected output shape");
    return Response.json(plan, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "실행안을 완성하지 못했습니다. 다시 시도해 주세요." }, { status: 502 });
  }
}
