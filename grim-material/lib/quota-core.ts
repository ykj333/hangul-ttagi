export const DAILY_LIMIT = 30;
export function koreanDay(date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(date);
}
// Immutable numbered slots make the limit atomic even across server instances.
export async function claimSlot(prefix: string, create: (path: string) => Promise<boolean>): Promise<number | null> {
  for (let slot = 1; slot <= DAILY_LIMIT; slot++) {
    if (await create(`${prefix}/${slot}.json`)) return DAILY_LIMIT - slot;
  }
  return null;
}
