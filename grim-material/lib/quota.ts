import { put, head, BlobNotFoundError } from '@vercel/blob';
import { claimSlot, DAILY_LIMIT, koreanDay } from './quota-core';
function prefix() { return `grim-material/quota/public/${koreanDay()}`; }
export async function reserveGeneration() {
  return claimSlot(prefix(), async path => {
    try {
      await put(path, JSON.stringify({reservedAt:new Date().toISOString()}), {access:'private',addRandomSuffix:false,allowOverwrite:false,contentType:'application/json'});
      return true;
    } catch(error) {
      try { await head(path); return false; } catch { /* Only an existing immutable slot is a conflict. */ }
      throw error;
    }
  });
}
export async function remainingGenerations() {
  const used = await Promise.all(Array.from({length:DAILY_LIMIT},async (_,i) => {
    try { await head(`${prefix()}/${i+1}.json`); return 1; }
    catch(error) { if(error instanceof BlobNotFoundError) return 0; throw error; }
  }));
  return DAILY_LIMIT-used.reduce<number>((sum,value)=>sum+value,0);
}
