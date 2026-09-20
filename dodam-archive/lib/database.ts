import postgres from "postgres";
import type { ArchiveRecord } from "./records";

let connection: ReturnType<typeof postgres> | undefined;
let initialized: Promise<void> | undefined;
function database() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_NOT_CONFIGURED");
  connection ??= postgres(process.env.DATABASE_URL, { max: 3, idle_timeout: 20, connect_timeout: 10 });
  return connection;
}
async function ready() {
  const sql = database();
  initialized ??= (async () => {
    await sql`CREATE TABLE IF NOT EXISTS dodam_profiles (owner_id TEXT PRIMARY KEY, institution TEXT NOT NULL, class_role TEXT NOT NULL)`;
    await sql`CREATE TABLE IF NOT EXISTS dodam_records (owner_id TEXT NOT NULL, id UUID NOT NULL, document JSONB NOT NULL, updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), PRIMARY KEY(owner_id, id))`;
    await sql`CREATE TABLE IF NOT EXISTS dodam_image_usage (owner_id TEXT NOT NULL, day DATE NOT NULL DEFAULT CURRENT_DATE, count INTEGER NOT NULL DEFAULT 0, PRIMARY KEY(owner_id, day))`;
  })().catch(error => { initialized = undefined; throw error; });
  await initialized;
  return sql;
}
export async function listRecords(owner: string) {
  const sql = await ready();
  const rows = await sql<{ document: ArchiveRecord }[]>`SELECT document FROM dodam_records WHERE owner_id = ${owner} ORDER BY document->>'date' DESC, updated_at DESC`;
  return rows.map(row => row.document);
}
export async function saveRecord(owner: string, record: ArchiveRecord) {
  const sql = await ready();
  await sql`INSERT INTO dodam_records (owner_id, id, document) VALUES (${owner}, ${record.id}, ${sql.json(record)}) ON CONFLICT (owner_id, id) DO UPDATE SET document = EXCLUDED.document, updated_at = NOW()`;
}
export async function deleteRecord(owner: string, id: string) {
  const sql = await ready();
  await sql`DELETE FROM dodam_records WHERE owner_id = ${owner} AND id = ${id}`;
}
export async function claimImage(owner: string, limit: number) {
  const sql = await ready();
  const rows = await sql`INSERT INTO dodam_image_usage (owner_id, day, count) VALUES (${owner}, (NOW() AT TIME ZONE 'Asia/Seoul')::date, 1) ON CONFLICT (owner_id, day) DO UPDATE SET count = dodam_image_usage.count + 1 WHERE dodam_image_usage.count < ${limit} RETURNING count`;
  return rows.length > 0;
}
export async function getProfile(owner: string): Promise<{ institution: string; classRole: string } | null> {
  const sql = await ready();
  const rows = await sql`SELECT institution, class_role FROM dodam_profiles WHERE owner_id = ${owner}`;
  return rows[0] ? { institution: rows[0].institution, classRole: rows[0].class_role } : null;
}
export async function saveProfile(owner: string, profile: { institution: string; classRole: string }) {
  const sql = await ready();
  await sql`INSERT INTO dodam_profiles (owner_id, institution, class_role) VALUES (${owner}, ${profile.institution}, ${profile.classRole}) ON CONFLICT (owner_id) DO UPDATE SET institution = EXCLUDED.institution, class_role = EXCLUDED.class_role`;
}
