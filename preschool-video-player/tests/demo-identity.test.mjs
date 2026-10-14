import test from "node:test";
import assert from "node:assert/strict";
import { demoEmail } from "../src/lib/demo-identity.mjs";

test("email input cannot impersonate an OAuth owner", () => {
  const claimedEmail = "ykj3377@gmail.com";
  const result = demoEmail({ visitorId: "visitor-one", label: claimedEmail });
  assert.notEqual(result, claimedEmail);
  assert.match(result, /@saessak\.local$/);
});

test("different browser visitors have isolated demo identities", () => {
  const first = demoEmail({ visitorId: "visitor-one", label: "teacher" });
  const second = demoEmail({ visitorId: "visitor-two", label: "teacher" });
  assert.notEqual(first, second);
});
