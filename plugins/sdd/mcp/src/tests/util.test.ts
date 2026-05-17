import { test } from "node:test";
import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { listFiles, reqIdRegex, readMaybe, dataDir } from "../util.js";

test("reqIdRegex matches valid FEAT-NNN-RNN IDs", () => {
  const matches = "see FEAT-001-R01 and FEAT-123-R99".match(reqIdRegex());
  assert.deepEqual(matches, ["FEAT-001-R01", "FEAT-123-R99"]);
});

test("reqIdRegex does not match partial IDs", () => {
  assert.equal("FEAT-1-R1 FEAT-001-R".match(reqIdRegex()), null);
});

test("readMaybe returns null for missing file", async () => {
  assert.equal(await readMaybe("/no/such/path/file.md"), null);
});

test("readMaybe returns file content when it exists", async () => {
  const dir = await mkdtemp(join(tmpdir(), "sdd-util-"));
  const p = join(dir, "f.md");
  await writeFile(p, "hello");
  assert.equal(await readMaybe(p), "hello");
});

test("listFiles returns files matching predicate", async () => {
  const dir = await mkdtemp(join(tmpdir(), "sdd-util-"));
  await writeFile(join(dir, "a.md"), "");
  await writeFile(join(dir, "b.ts"), "");
  const results = await listFiles(dir, (p) => p.endsWith(".md"));
  assert.equal(results.length, 1);
  assert.ok(results[0].endsWith("a.md"));
});

test("dataDir respects SDD_DATA_DIR env var", () => {
  const orig = process.env.SDD_DATA_DIR;
  process.env.SDD_DATA_DIR = "/custom/data";
  assert.equal(dataDir(), "/custom/data");
  orig === undefined ? delete process.env.SDD_DATA_DIR : (process.env.SDD_DATA_DIR = orig);
});
