import { createHash } from 'node:crypto';

export function demoEmail({ visitorId, label }) {
  return `${createHash('sha256').update(`${visitorId}:${label}`).digest('hex')}@saessak.local`;
}
