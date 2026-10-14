import test from 'node:test';
import assert from 'node:assert/strict';
import { createInMemoryStore } from '../src/lib/core-store.mjs';

test('agent import token can only be used once', () => {
  const store = createInMemoryStore();
  const record = store.createAgentImportToken({actorEmail:'test@saessak.local'});
  const input = {token:record.token,payload:{videos:[{title:'Test',url:'https://example.org/test.mp4'}]}};
  store.importViaAgentToken(input);
  assert.throws(() => store.importViaAgentToken(input), /토큰/);
});

test('bookmarking a private video owned by another teacher is denied', () => {
  const store = createInMemoryStore();
  assert.throws(() => store.toggleBookmark({actorEmail:'test@saessak.local',videoId:'vid-haneul-01'}), /권한/);
});
