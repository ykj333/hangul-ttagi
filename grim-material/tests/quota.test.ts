import test from 'node:test';
import assert from 'node:assert/strict';
import { claimSlot, koreanDay } from '../lib/quota-core.ts';
test('concurrent callers cannot exceed two immutable daily slots',async()=>{
  const slots=new Set<string>();
  const create=async(path:string)=>{await Promise.resolve();if(slots.has(path))return false;slots.add(path);return true;};
  const results=await Promise.all(Array.from({length:20},()=>claimSlot('isolated-test',create)));
  assert.equal(results.filter(value=>value!==null).length,2);
  assert.equal(slots.size,2);
  assert.equal(await claimSlot('isolated-test',create),null);
  assert.equal(await claimSlot('next-day-test',create),1);
});
test('quota resets at Korean midnight',()=>{
  assert.equal(koreanDay(new Date('2026-10-08T14:59:59Z')),'2026-10-08');
  assert.equal(koreanDay(new Date('2026-10-08T15:00:00Z')),'2026-10-09');
});
