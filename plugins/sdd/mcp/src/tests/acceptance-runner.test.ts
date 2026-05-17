import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { acceptanceRunnerTools } from "../tools/acceptance-runner.js";

const scaffold = acceptanceRunnerTools.find(t => t.name === "acceptance_runner.scaffold")!;

const SPEC_WITH_CLAUSES = `
**Feature ID:** FEAT-001

## Acceptance Criteria

- **AC-001** — WHEN user submits valid credentials THE SYSTEM SHALL grant access (satisfies FEAT-001-R01)
- **AC-002** — IF session expires THE SYSTEM SHALL redirect to login (satisfies FEAT-001-R02)
`;

const SPEC_NO_CLAUSES = `
**Feature ID:** FEAT-002

## Description
No EARS acceptance criteria defined yet.
`;

async function makeSpec(content: string, slug = "001-login") {
  const root = await mkdtemp(join(tmpdir(), "sdd-acc-"));
  const dir = join(root, "specs", slug);
  await mkdir(dir, { recursive: true });
  const specPath = join(dir, "spec.md");
  await writeFile(specPath, content);
  return specPath;
}

test("acceptance_runner.scaffold extracts EARS clauses and REQ links", async () => {
  const specPath = await makeSpec(SPEC_WITH_CLAUSES);
  const r = await scaffold.handler({ specPath }) as { clauseCount: number; feature: string; source: string };
  assert.equal(r.clauseCount, 2);
  assert.equal(r.feature, "FEAT-001");
  assert.ok(r.source.includes("AC-001"));
  assert.ok(r.source.includes("AC-002"));
  assert.ok(r.source.includes("FEAT-001-R01"));
});

test("acceptance_runner.scaffold returns 0 clauses when no EARS in spec", async () => {
  const specPath = await makeSpec(SPEC_NO_CLAUSES, "002-empty");
  const r = await scaffold.handler({ specPath }) as { clauseCount: number };
  assert.equal(r.clauseCount, 0);
});

test("acceptance_runner.scaffold derives suggestedFilename from feature dir", async () => {
  const specPath = await makeSpec(SPEC_WITH_CLAUSES);
  const r = await scaffold.handler({ specPath }) as { suggestedFilename: string };
  assert.equal(r.suggestedFilename, "001-login.acceptance.test.ts");
});

test("acceptance_runner.scaffold uses vitest imports when framework=vitest", async () => {
  const specPath = await makeSpec(SPEC_WITH_CLAUSES);
  const r = await scaffold.handler({ specPath, framework: "vitest" }) as { source: string };
  assert.ok(r.source.includes("vitest"));
  assert.ok(!r.source.includes("node:test"));
});

test("acceptance_runner.scaffold uses node:test imports by default", async () => {
  const specPath = await makeSpec(SPEC_WITH_CLAUSES);
  const r = await scaffold.handler({ specPath }) as { source: string };
  assert.ok(r.source.includes("node:test"));
});
