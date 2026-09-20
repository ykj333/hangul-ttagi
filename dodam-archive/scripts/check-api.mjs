import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
const base = process.env.TEST_URL || 'http://localhost:3100';
async function client() {
  const cookies = new Map();
  async function request(path, options = {}) {
    const response = await fetch(base + path, { ...options, redirect: 'manual', headers: { origin: base, cookie: [...cookies].map(([k,v]) => `${k}=${v}`).join('; '), ...options.headers } });
    for (const cookie of response.headers.getSetCookie()) { const pair = cookie.split(';')[0]; const i = pair.indexOf('='); cookies.set(pair.slice(0,i),pair.slice(i+1)); }
    return response;
  }
  const csrf = await (await request('/api/auth/csrf')).json();
  const response = await request('/api/auth/callback/credentials', { method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded','X-Auth-Return-Redirect':'1'}, body:new URLSearchParams({csrfToken:csrf.csrfToken,teacher:'demo-hana',callbackUrl:base}) });
  assert.equal(response.status,200);
  return request;
}
assert.equal((await fetch(base+'/api/records')).status,401);
const first=await client(),second=await client();
const record={id:randomUUID(),category:'observation',title:'QA isolated server record',date:'2026-09-20',child:'Fictional QA',className:'QA',description:'Database persistence test',memo:'',tags:['QA'],attachments:[],starred:false,updatedAt:new Date().toISOString()};
try {
  const saved=await first('/api/records',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(record)});
  assert.equal(saved.status,200,await saved.text());
  const own=await (await first('/api/records')).json(); assert(own.some(r=>r.id===record.id));
  const other=await (await second('/api/records')).json(); assert(!other.some(r=>r.id===record.id));
  await second('/api/records?id='+record.id,{method:'DELETE'});
  assert((await (await first('/api/records')).json()).some(r=>r.id===record.id));
  assert.equal((await first('/api/records',{method:'POST',headers:{'Content-Type':'application/json',origin:'https://untrusted.example'},body:JSON.stringify(record)})).status,403);
  assert.equal((await first('/api/records',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...record,title:''})})).status,400);
  console.log('PASS: unauthenticated access, DB persistence, tenant isolation, cross-owner delete, origin validation, input validation');
} finally { await first('/api/records?id='+record.id,{method:'DELETE'}); }
