import { NextResponse } from "next/server";
import { getServerTeacherSession } from "@/lib/auth";
import { globalSaessakStore } from "@/lib/core-store.mjs";

export async function POST(request: Request) {
  try {
    const teacher = await getServerTeacherSession();
    const body = await request.json();

    if (body.mode === "create-agent-token") {
      const tokenRecord = globalSaessakStore.createAgentImportToken({
        actorEmail: teacher.email,
        actorName: teacher.name,
        className: teacher.className
      });
      return NextResponse.json({ tokenRecord });
    }

    const inserted = globalSaessakStore.scrapeVideoListToClassDb({
      actorEmail: teacher.email,
      actorName: body.creatorName || teacher.name,
      className: body.className || teacher.className,
      sourceUrlOrText: body.sourceUrlOrText,
      defaultCategory: body.defaultCategory || "언어·동화",
      defaultAgeGroup: body.defaultAgeGroup || "만 3-5세",
      isSharedCuration: Boolean(body.isSharedCuration),
      rightsConfirmed: Boolean(body.rightsConfirmed ?? true),
      sponsorFreeConfirmed: Boolean(body.sponsorFreeConfirmed ?? true)
    });

    return NextResponse.json({ inserted, count: inserted.length }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "스크랩 처리 중 오류가 발생했습니다.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
