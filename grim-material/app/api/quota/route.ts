import { remainingGenerations } from '@/lib/quota';
export async function GET() {
  try { return Response.json({remaining:await remainingGenerations()},{headers:{'Cache-Control':'no-store'}}); }
  catch { return Response.json({error:'생성 한도를 확인할 수 없습니다. 잠시 후 다시 시도해 주세요.'},{status:503}); }
}
