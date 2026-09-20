import { managedAuth } from "@/lib/managed-auth";
import { apiError, sameOrigin } from "@/lib/api";
const handlers = managedAuth?.handler();
type Context = { params: Promise<{ path: string[] }> };
export async function GET(request: Request, context: Context) {
  if (!handlers) return apiError("Google 로그인 연결을 준비 중입니다.", 503);
  return handlers.GET(request, context);
}
export async function POST(request: Request, context: Context) {
  if (!handlers) return apiError("Google 로그인 연결을 준비 중입니다.", 503);
  if (!sameOrigin(request)) return apiError("허용되지 않은 요청입니다.", 403);
  return handlers.POST(request, context);
}
