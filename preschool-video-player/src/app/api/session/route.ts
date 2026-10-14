import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { getServerTeacherSession, googleOAuthConfigured } from "@/lib/auth";

const selectionSchema = z.object({
  email: z.string().trim().min(1).max(200),
  name: z.string().trim().max(60).optional(),
  className: z.string().trim().max(60).optional()
});
const presets = [
  { id: "demo-sprout", name: "새싹반 교사", email: "sprout@saessak.local", avatarText: "새", className: "새싹반", institutionName: "체험 학급", authProvider: "demo" },
  { id: "demo-sun", name: "해님반 교사", email: "sun@saessak.local", avatarText: "해", className: "해님반", institutionName: "체험 학급", authProvider: "demo" }
];

export async function GET() {
  return NextResponse.json({ teacher: await getServerTeacherSession(), presets, googleOAuthConfigured, neonConnected: false });
}

export async function POST(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin) {
    return NextResponse.json({ error: "동일한 사이트에서 요청해 주세요." }, { status: 403 });
  }
  const body = selectionSchema.safeParse(await request.json());
  if (!body.success) return NextResponse.json({ error: "체험 학급 정보를 확인해 주세요." }, { status: 400 });
  const cookieStore = await cookies();
  const values = {
    saessak_teacher_email: body.data.email,
    saessak_teacher_name: body.data.name || "체험 교사",
    saessak_teacher_class: body.data.className || "체험반"
  };
  for (const [key, value] of Object.entries(values)) {
    cookieStore.set(key, value, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 30 });
  }
  return NextResponse.json({ teacher: await getServerTeacherSession() });
}
