import { NextResponse } from "next/server";
import { getServerTeacherSession } from "@/lib/auth";
import { globalSaessakStore } from "@/lib/core-store.mjs";

export async function GET(request: Request) {
  const teacher = await getServerTeacherSession();
  const { searchParams } = new URL(request.url);
  const curationTab = searchParams.get("curationTab") || "shared";
  const topic = searchParams.get("topic") || "";
  const searchQuery = searchParams.get("q") || "";
  const filterMode = searchParams.get("filterMode") || "all";

  const videos = globalSaessakStore.queryVideos({
    viewerEmail: teacher.email,
    curationTab,
    topic,
    searchQuery,
    filterMode
  });

  const myClassCount = globalSaessakStore.queryVideos({
    viewerEmail: teacher.email,
    curationTab: "teacher"
  }).length;

  const sharedCount = globalSaessakStore.queryVideos({
    viewerEmail: teacher.email,
    curationTab: "shared"
  }).length;

  return NextResponse.json({
    teacher,
    videos,
    counts: {
      myClassCount,
      sharedCount
    }
  });
}

export async function POST(request: Request) {
  try {
    const teacher = await getServerTeacherSession();
    const body = await request.json();

    const created = globalSaessakStore.uploadTeacherVideo({
      actorEmail: teacher.email,
      actorName: body.creatorName || teacher.name,
      className: body.className || teacher.className,
      title: body.title,
      category: body.category || "언어·동화",
      ageGroup: body.ageGroup || "만 3-5세",
      description: body.description || "",
      durationLabel: body.durationLabel || "새 영상",
      playbackUrl: body.playbackUrl || "",
      downloadUrl: body.downloadUrl || "",
      isSharedCuration: Boolean(body.isSharedCuration),
      rightsConfirmed: Boolean(body.rightsConfirmed),
      sponsorFreeConfirmed: Boolean(body.sponsorFreeConfirmed)
    });

    return NextResponse.json({ video: created }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "업로드 중 오류가 발생했습니다.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
