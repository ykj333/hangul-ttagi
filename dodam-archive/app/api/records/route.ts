import { auth } from "@/auth";
import { listRecords, saveRecord, deleteRecord } from "@/lib/database";
import { recordSchema } from "@/lib/records";
import { apiError, sameOrigin } from "@/lib/api";
import { z } from "zod";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return apiError("로그인이 필요합니다.", 401);
  if (!process.env.DATABASE_URL)
    return apiError("서버 데이터베이스 연결이 필요합니다.", 503);
  try {
    return Response.json(await listRecords(session.user.id), {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch {
    return apiError(
      "기록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.",
      503,
    );
  }
}
export async function POST(request: Request) {
  if (!sameOrigin(request)) return apiError("허용되지 않은 요청입니다.", 403);
  const session = await auth();
  if (!session?.user?.id) return apiError("로그인이 필요합니다.", 401);
  if (!process.env.DATABASE_URL)
    return apiError("서버 데이터베이스 연결이 필요합니다.", 503);
  const text = await request.text();
  if (text.length > 4_000_000)
    return apiError("기록의 크기가 너무 큽니다.", 413);
  let input: unknown;
  try {
    input = JSON.parse(text);
  } catch {
    return apiError("올바른 기록 형식이 아닙니다.", 400);
  }
  const parsed = recordSchema.safeParse(input);
  if (!parsed.success) return apiError(parsed.error.issues[0].message, 400);
  const record = { ...parsed.data, updatedAt: new Date().toISOString() };
  try {
    await saveRecord(session.user.id, record);
    return Response.json(record);
  } catch {
    return apiError(
      "저장하지 못했습니다. 입력 내용은 유지됩니다. 다시 시도해 주세요.",
      503,
    );
  }
}
export async function DELETE(request: Request) {
  if (!sameOrigin(request)) return apiError("허용되지 않은 요청입니다.", 403);
  const session = await auth();
  if (!session?.user?.id) return apiError("로그인이 필요합니다.", 401);
  const id = new URL(request.url).searchParams.get("id");
  if (!z.string().uuid().safeParse(id).success || !id)
    return apiError("올바른 기록 ID가 아닙니다.", 400);
  try {
    await deleteRecord(session.user.id, id);
    return Response.json({ ok: true });
  } catch {
    return apiError("삭제하지 못했습니다. 다시 시도해 주세요.", 503);
  }
}
