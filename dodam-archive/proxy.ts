import { NextResponse, type NextRequest } from "next/server";
import { managedAuth } from "@/lib/managed-auth";
export async function proxy(request: NextRequest) {
  if (
    managedAuth &&
    request.nextUrl.searchParams.has("neon_auth_session_verifier")
  ) {
    return managedAuth.middleware({ loginUrl: "/login" })(request);
  }
  return NextResponse.next();
}
export const config = { matcher: ["/"] };
