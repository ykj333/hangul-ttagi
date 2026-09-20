import { managedAuth } from "@/lib/managed-auth";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { randomUUID } from "node:crypto";
import { demoTeachers } from "@/lib/records";

export const googleReady = Boolean(managedAuth);
export const {
  handlers,
  auth: demoAuth,
  signIn,
  signOut,
} = NextAuth({
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  providers: [
    Credentials({
      credentials: { teacher: { type: "text" } },
      authorize(credentials) {
        const teacher = demoTeachers.find((t) => t.id === credentials.teacher);
        if (!teacher) return null;
        return { id: `${teacher.id}:${randomUUID()}`, name: teacher.name };
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 },
  callbacks: {
    jwt({ token, user }) {
      if (user) token.sub = user.id;
      return token;
    },
    session({ session, token }) {
      if (session.user && token.sub) session.user.id = token.sub;
      return session;
    },
  },
  pages: { signIn: "/", error: "/" },
});

export async function auth() {
  if (managedAuth) {
    const { data } = await managedAuth.getSession();
    if (data?.user)
      return {
        user: {
          id: `neon:${data.user.id}`,
          name: data.user.name,
          email: data.user.email,
        },
      };
  }
  return demoAuth();
}
