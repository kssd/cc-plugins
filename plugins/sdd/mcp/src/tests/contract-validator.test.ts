import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { contractValidatorTools } from "../tools/contract-validator.js";

const validator = contractValidatorTools.find(t => t.name === "contract_validator")!;

async function makeContracts(files: Record<string, string>) {
  const root = await mkdtemp(join(tmpdir(), "sdd-cv-"));
  for (const [rel, content] of Object.entries(files)) {
    const full = join(root, rel);
    await mkdir(dirname(full), { recursive: true });
    await writeFile(full, content);
  }
  return root;
}

test("contract_validator returns empty when no contract files", async () => {
  const root = await mkdtemp(join(tmpdir(), "sdd-cv-empty-"));
  await mkdir(join(root, "specs"), { recursive: true });
  const r = await validator.handler({ root }) as { count: number };
  assert.equal(r.count, 0);
});

test("contract_validator accepts valid JSON Schema", async () => {
  const root = await makeContracts({
    "specs/001-login/contracts/user.json": JSON.stringify({
      $schema: "http://json-schema.org/draft-07/schema#",
      type: "object",
      properties: { name: { type: "string" } },
    }),
  });
  const r = await validator.handler({ root }) as { results: { ok: boolean }[] };
  assert.equal(r.results.length, 1);
  assert.equal(r.results[0].ok, true);
});

test("contract_validator rejects invalid JSON with parse error", async () => {
  const root = await makeContracts({
    "specs/001-login/contracts/bad.json": "{ not valid json }",
  });
  const r = await validator.handler({ root }) as { results: { ok: boolean; errors?: string[] }[] };
  assert.equal(r.results[0].ok, false);
  assert.ok(r.results[0].errors?.[0].includes("parse error"));
});

test("contract_validator accepts valid OpenAPI document", async () => {
  const root = await makeContracts({
    "specs/001-login/contracts/api.json": JSON.stringify({
      openapi: "3.0.0",
      info: { title: "Test API", version: "1.0.0" },
      paths: {},
    }),
  });
  const r = await validator.handler({ root }) as { results: { ok: boolean }[] };
  assert.equal(r.results[0].ok, true);
});

test("contract_validator rejects OpenAPI missing required fields", async () => {
  const root = await makeContracts({
    "specs/001-login/contracts/api.json": JSON.stringify({
      openapi: "3.0.0",
      info: { title: "Test API", version: "1.0.0" },
      // paths omitted
    }),
  });
  const r = await validator.handler({ root }) as { results: { ok: boolean; errors?: string[] }[] };
  assert.equal(r.results[0].ok, false);
  assert.ok(r.results[0].errors?.[0].includes("paths"));
});

test("contract_validator validates YAML contracts", async () => {
  const root = await makeContracts({
    "specs/002-pay/contracts/schema.yaml": `
type: object
properties:
  amount:
    type: number
`,
  });
  const r = await validator.handler({ root }) as { results: { ok: boolean }[] };
  assert.equal(r.results[0].ok, true);
});
