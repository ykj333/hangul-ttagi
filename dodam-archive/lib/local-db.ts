import { openDB } from "idb";
import { ArchiveRecord, Teacher, sampleRecords } from "./records";
async function database() {
  return openDB("dodam-archive-v1", 1, {
    upgrade(db) {
      db.createObjectStore("records", { keyPath: "key" });
      db.createObjectStore("settings");
    },
  });
}
export async function loadLocal(teacher: Teacher): Promise<ArchiveRecord[]> {
  const db = await database();
  if (!(await db.get("settings", teacher.id))) {
    const tx = db.transaction(["records", "settings"], "readwrite");
    for (const record of sampleRecords(teacher))
      await tx
        .objectStore("records")
        .put({ key: `${teacher.id}:${record.id}`, owner: teacher.id, record });
    await tx.objectStore("settings").put(true, teacher.id);
    await tx.done;
  }
  const rows: { owner: string; record: ArchiveRecord }[] =
    await db.getAll("records");
  return rows
    .filter((row) => row.owner === teacher.id)
    .map((row) => row.record);
}
export async function saveLocal(teacher: Teacher, record: ArchiveRecord) {
  const db = await database();
  await db.put("records", {
    key: `${teacher.id}:${record.id}`,
    owner: teacher.id,
    record,
  });
}
export async function deleteLocal(teacher: Teacher, id: string) {
  const db = await database();
  await db.delete("records", `${teacher.id}:${id}`);
}
