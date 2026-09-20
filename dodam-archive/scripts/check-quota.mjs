import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import postgres from "postgres";
process.loadEnvFile(".env.local");
const sql = postgres(process.env.DATABASE_URL, { max: 5 });
const owner = "qa-quota:" + randomUUID();
try {
  const results = await Promise.all(
    Array.from(
      { length: 5 },
      () =>
        sql`INSERT INTO dodam_image_usage (owner_id, day, count) VALUES (${owner}, (NOW() AT TIME ZONE 'Asia/Seoul')::date, 1) ON CONFLICT (owner_id, day) DO UPDATE SET count=dodam_image_usage.count+1 WHERE dodam_image_usage.count < 2 RETURNING count`,
    ),
  );
  assert.equal(results.filter((r) => r.length).length, 2);
  console.log("PASS: 5 concurrent requests allow exactly 2 daily image claims");
} finally {
  await sql`DELETE FROM dodam_image_usage WHERE owner_id=${owner}`;
  await sql.end();
}
