import { NextResponse } from "next/server";
import { globalSaessakStore } from "@/lib/core-store.mjs";

export async function POST(
  request: Request,
  context: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await context.params;
    const payload = await request.json();
    const imported = globalSaessakStore.importViaAgentToken({ token, payload });
    return NextResponse.json({
      ok: true,
      importedCount: imported.length,
      videos: imported
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "에이전트 임포트 오류";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
