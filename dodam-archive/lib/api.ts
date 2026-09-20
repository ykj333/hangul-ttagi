export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return origin === new URL(request.url).origin;
}
export function apiError(message: string, status: number) { return Response.json({ error: message }, { status }); }
