import { NextResponse } from "next/server";
import { getServerTeacherSession } from "@/lib/auth";
import { globalSaessakStore } from "@/lib/core-store.mjs";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const teacher = await getServerTeacherSession();
    const { id } = await context.params;
    const body = await request.json();

    if (body.action === "bookmark") {
      const result = globalSaessakStore.toggleBookmark({
        actorEmail: teacher.email,
        videoId: id
      });
      return NextResponse.json(result);
    }

    if (body.action === "view") {
      const result = globalSaessakStore.recordView({
        actorEmail: teacher.email,
        videoId: id
      });
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: "지원하지 않는 요청입니다." }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "요청 처리 실패";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const teacher = await getServerTeacherSession();
    const { id } = await context.params;
    const removed = globalSaessakStore.deleteTeacherVideo({
      actorEmail: teacher.email,
      videoId: id
    });
    return NextResponse.json({ removed });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "삭제 권한이 없습니다.";
    return NextResponse.json({ error: message }, { status: 403 });
  }
}
