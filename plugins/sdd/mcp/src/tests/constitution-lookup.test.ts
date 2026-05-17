import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { constitutionLookupTools } from "../tools/constitution-lookup.js";

const lookup = constitutionLookupTools.find(t => t.name === "constitution_lookup")!;

const CONSTITUTION = `
**Version:** 2.1.0

### P01 — Spec First
Never write code before the spec is approved.

### P02 — Security
All endpoints must be authenticated.

### P03 — Performance
P99 latency under 200 ms.
`;

async function tmpRoot(withConstitution?: string) {
  const root = await mkdtemp(join(tmpdir(), "sdd-const-"));
  if (withConstitution !== undefined) {
    const dir = join(root, ".specify", "memory");
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, "constitution.md"), withConstitution);
  }
  return root;
}

test("constitution_lookup returns error when constitution absent", async () => {
  const root = await tmpRoot();
  const r = await lookup.handler({ root }) as { error: string };
  assert.ok(r.error.includes("constitution not found"));
});

test("constitution_lookup returns version and all principles", async () => {
  const root = await tmpRoot(CONSTITUTION);
  const r = await lookup.handler({ root }) as { version: string; principles: { id: string; name: string }[] };
  assert.equal(r.version, "2.1.0");
  assert.equal(r.principles.length, 3);
  assert.equal(r.principles[0].id, "P01");
  assert.equal(r.principles[2].id, "P03");
});

test("constitution_lookup filters principles by keyword", async () => {
  const root = await tmpRoot(CONSTITUTION);
  const r = await lookup.handler({ root, keywords: ["security"] }) as { principles: { id: string }[] };
  assert.equal(r.principles.length, 1);
  assert.equal(r.principles[0].id, "P02");
});

test("constitution_lookup returns empty list when no keyword matches", async () => {
  const root = await tmpRoot(CONSTITUTION);
  const r = await lookup.handler({ root, keywords: ["caching"] }) as { principles: unknown[] };
  assert.equal(r.principles.length, 0);
});
