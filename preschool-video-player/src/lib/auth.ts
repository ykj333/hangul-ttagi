import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { demoEmail } from "./demo-identity.mjs";
import type { TeacherUser } from "./types";

export const googleOAuthConfigured = Boolean(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.AUTH_SECRET
);

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: googleOAuthConfigured ? [Google({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
  })] : [],
  session: { strategy: "jwt" }
});

export async function getServerTeacherSession(): Promise<TeacherUser> {
  if (googleOAuthConfigured) {
    const session = await auth();
    if (session?.user?.email) {
      const email = session.user.email.toLowerCase();
      const name = session.user.name || email.split("@")[0] || "선생님";
      return {
        id: `google-${email}`, name, email, avatarText: name.charAt(0),
        className: `${name} 선생님 반`, institutionName: "Google 인증", authProvider: "google"
      };
    }
  }
  const cookieStore = await cookies();
  let visitorId = cookieStore.get("saessak_visitor")?.value;
  if (!visitorId) {
    visitorId = randomUUID();
    cookieStore.set("saessak_visitor", visitorId, {
      httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production",
      path: "/", maxAge: 60 * 60 * 24 * 30
    });
  }
  const name = cookieStore.get("saessak_teacher_name")?.value || "체험 교사";
  const label = cookieStore.get("saessak_teacher_email")?.value || "demo";
  return {
    id: `demo-${visitorId}`, name, email: demoEmail({ visitorId, label }),
    avatarText: name.charAt(0), className: cookieStore.get("saessak_teacher_class")?.value || "체험반",
    institutionName: "체험 모드 · 임시 저장", authProvider: "demo"
  };
}
