import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { driftDetectorTools } from "../tools/drift-detector.js";

const snapshot = driftDetectorTools.find(t => t.name === "drift_detector.snapshot")!;
const detect   = driftDetectorTools.find(t => t.name === "drift_detector")!;

async function tmpRoot() {
  const root = await mkdtemp(join(tmpdir(), "sdd-drift-"));
  process.env.SDD_DATA_DIR = join(root, ".sdd-data");
  return root;
}

test("drift_detector.snapshot on empty repo records 0 symbols", async () => {
  const root = await tmpRoot();
  const r = await snapshot.handler({ root }) as { symbols: number };
  assert.equal(r.symbols, 0);
});

test("drift_detector returns error when no snapshot exists", async () => {
  const root = await tmpRoot();
  const r = await detect.handler({ root }) as { error: string };
  assert.ok(r.error.includes("no snapshot"));
});

test("drift_detector reports no changes when code is identical to snapshot", async () => {
  const root = await tmpRoot();
  const src = join(root, "src");
  await mkdir(src, { recursive: true });
  await writeFile(join(src, "auth.ts"), "// REQ:FEAT-001-R01\nexport function login(): void {}");
  await snapshot.handler({ root });
  const r = await detect.handler({ root }) as { summary: { added: number; removed: number; renamed: number } };
  assert.equal(r.summary.added, 0);
  assert.equal(r.summary.removed, 0);
  assert.equal(r.summary.renamed, 0);
});

test("drift_detector detects newly added exported function", async () => {
  const root = await tmpRoot();
  const src = join(root, "src");
  await mkdir(src, { recursive: true });
  await writeFile(join(src, "auth.ts"), "// REQ:FEAT-001-R01\nexport function login(): void {}");
  await snapshot.handler({ root });
  await writeFile(join(src, "auth.ts"), "// REQ:FEAT-001-R01\nexport function login(): void {}\nexport function logout(): void {}");
  const r = await detect.handler({ root }) as { summary: { added: number } };
  assert.equal(r.summary.added, 1);
});

test("drift_detector detects removed exported function", async () => {
  const root = await tmpRoot();
  const src = join(root, "src");
  await mkdir(src, { recursive: true });
  await writeFile(join(src, "auth.ts"), "// REQ:FEAT-001-R01\nexport function login(): void {}\nexport function logout(): void {}");
  await snapshot.handler({ root });
  await writeFile(join(src, "auth.ts"), "// REQ:FEAT-001-R01\nexport function login(): void {}");
  const r = await detect.handler({ root }) as { summary: { removed: number } };
  assert.equal(r.summary.removed, 1);
});

test("drift_detector advisory mode returns null when no REQ-linked removals", async () => {
  const root = await tmpRoot();
  const src = join(root, "src");
  await mkdir(src, { recursive: true });
  await writeFile(join(src, "auth.ts"), "// REQ:FEAT-001-R01\nexport function login(): void {}");
  await snapshot.handler({ root });
  const r = await detect.handler({ root, mode: "advisory" }) as { advisory: null };
  assert.equal(r.advisory, null);
});
