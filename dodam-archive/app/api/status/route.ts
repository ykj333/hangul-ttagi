import { googleReady } from "@/auth";
export function GET() {
  return Response.json({
    google: googleReady,
    database: Boolean(process.env.DATABASE_URL),
    images: Boolean(process.env.OPENAI_API_KEY && process.env.DATABASE_URL),
  });
}
