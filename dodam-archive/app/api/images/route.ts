import { auth } from "@/auth";
import { claimImage } from "@/lib/database";
import { apiError, sameOrigin } from "@/lib/api";
import { z } from "zod";
export const runtime = "nodejs";
export const maxDuration = 120;
export async function POST(request: Request) {
  if (!sameOrigin(request)) return apiError("허용되지 않은 요청입니다.", 403);
  const session = await auth();
  if (!session?.user?.id) return apiError("로그인이 필요합니다.", 401);
  if (!process.env.OPENAI_API_KEY || !process.env.DATABASE_URL) return apiError("이미지 생성 서비스 연결을 준비 중입니다.", 503);
  const input = z.object({ prompt: z.string().trim().min(5).max(1500) }).safeParse(await request.json().catch(() => null));
  if (!input.success) return apiError("그림 설명을 5~1,500자로 입력해 주세요.", 400);
  try {
    // All public demo sessions share a small budget; signing in again cannot reset it.
    const owner = session.user.id.startsWith("demo-") ? "public-demo" : session.user.id;
    if (!await claimImage(owner, 2)) return apiError("오늘의 이미지 생성 한도를 모두 사용했어요. 내일 다시 이용해 주세요.", 429);
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: process.env.OPENAI_IMAGE_MODEL || "gpt-image-2.5-sunburst", prompt: `Create a gentle watercolor illustration for a Korean kindergarten teacher's educational portfolio. Fictional characters only, no real identifying information, no text. Scene: ${input.data.prompt}`, n: 1, size: "1024x1024", quality: "medium", output_format: "webp" }),
      signal: AbortSignal.timeout(110000),
    });
    if (!response.ok) return apiError(response.status === 429 ? "이미지 서비스가 잠시 혼잡합니다. 조금 뒤 다시 시도해 주세요." : "이미지 생성에 실패했습니다. 관리자에게 모델 접근 권한과 API 설정 확인을 요청해 주세요.", 502);
    const result = await response.json() as { data?: { b64_json?: string }[] };
    const data = result.data?.[0]?.b64_json;
    if (!data) return apiError("이미지를 받지 못했습니다.", 502);
    return Response.json({ data: `data:image/webp;base64,${data}` });
  } catch { return apiError("이미지 생성에 실패했습니다. 다시 시도해 주세요.", 503); }
}
