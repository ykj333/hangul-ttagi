import { auth } from "@/auth";
import { getProfile, saveProfile } from "@/lib/database";
import { apiError, sameOrigin } from "@/lib/api";
import { z } from "zod";
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return apiError("로그인이 필요합니다.", 401);
  try { return Response.json(await getProfile(session.user.id), { headers: { "Cache-Control": "private, no-store" } }); }
  catch { return apiError("학급 정보를 불러오지 못했어요.", 503); }
}
export async function POST(request: Request) {
  if (!sameOrigin(request)) return apiError("허용되지 않은 요청입니다.", 403);
  const session = await auth();
  if (!session?.user?.id) return apiError("로그인이 필요합니다.", 401);
  const data = z.object({ institution: z.string().trim().max(60), classRole: z.string().trim().max(60) }).safeParse(await request.json().catch(() => null));
  if (!data.success) return apiError("학급 정보를 확인해 주세요.", 400);
  try { await saveProfile(session.user.id, data.data); return Response.json(data.data); }
  catch { return apiError("학급 정보를 저장하지 못했어요.", 503); }
}
