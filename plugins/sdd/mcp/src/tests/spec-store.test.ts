import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { specStoreTools } from "../tools/spec-store.js";

const list   = specStoreTools.find(t => t.name === "spec_store.list")!;
const get    = specStoreTools.find(t => t.name === "spec_store.get")!;
const create = specStoreTools.find(t => t.name === "spec_store.create")!;
const update = specStoreTools.find(t => t.name === "spec_store.update")!;

async function tmpRoot() {
  return mkdtemp(join(tmpdir(), "sdd-spec-"));
}

test("spec_store.list returns empty when no specs dir", async () => {
  const root = await tmpRoot();
  const r = await list.handler({ root }) as { features: unknown[] };
  assert.deepEqual(r.features, []);
});

test("spec_store.list parses feature dirs and req counts", async () => {
  const root = await tmpRoot();
  const dir = join(root, "specs", "001-login");
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, "spec.md"), "**Feature ID:** FEAT-001\nFEAT-001-R01 auth\nFEAT-001-R01 dup\nFEAT-001-R02 rate");
  const r = await list.handler({ root }) as { features: { id: string; slug: string; reqCount: number }[] };
  assert.equal(r.features.length, 1);
  assert.equal(r.features[0].id, "001");
  assert.equal(r.features[0].slug, "login");
  assert.equal(r.features[0].reqCount, 2);
});

test("spec_store.create writes artifact file", async () => {
  const root = await tmpRoot();
  const r = await create.handler({ root, feature: "002-auth", artifact: "spec", content: "# spec" }) as { written: boolean };
  assert.equal(r.written, true);
});

test("spec_store.get reads back created artifact", async () => {
  const root = await tmpRoot();
  await create.handler({ root, feature: "003-signup", artifact: "spec", content: "# my spec" });
  const r = await get.handler({ root, feature: "003-signup", artifact: "spec" }) as { content: string };
  assert.equal(r.content, "# my spec");
});

test("spec_store.update appends text to existing artifact", async () => {
  const root = await tmpRoot();
  await create.handler({ root, feature: "004-profile", artifact: "spec", content: "# initial" });
  await update.handler({ root, feature: "004-profile", artifact: "spec", append: "## amendment" });
  const r = await get.handler({ root, feature: "004-profile", artifact: "spec" }) as { content: string };
  assert.ok(r.content.includes("# initial"));
  assert.ok(r.content.includes("## amendment"));
});

test("spec_store.list reports open clarifications", async () => {
  const root = await tmpRoot();
  const dir = join(root, "specs", "005-pay");
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, "spec.md"), "FEAT-005-R01 pay\n[NEEDS CLARIFICATION: which gateway?]");
  const r = await list.handler({ root }) as { features: { openClarifications: number }[] };
  assert.equal(r.features[0].openClarifications, 1);
});
