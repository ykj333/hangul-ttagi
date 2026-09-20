import { auth, googleReady } from "@/auth";
import { Archive } from "@/components/archive";
import { demoTeachers, type Teacher } from "@/lib/records";
export const dynamic = "force-dynamic";
export default async function Page() {
  const session = await auth();
  const user = session?.user;
  const demo = demoTeachers.find(t => user?.id?.startsWith(`${t.id}:`));
  const teacher: Teacher | null = user?.id ? demo || { id: user.id, name: user.name || "선생님", className: "우리 반", demo: false } : null;
  return <Archive teacher={teacher} googleReady={googleReady} cloudReady={Boolean(process.env.DATABASE_URL)} imageReady={Boolean(process.env.OPENAI_API_KEY && process.env.DATABASE_URL)} />;
}
