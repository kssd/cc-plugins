import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { traceabilityTools } from "../tools/traceability-graph.js";

const build = traceabilityTools.find(t => t.name === "traceability_graph.build")!;
const query = traceabilityTools.find(t => t.name === "traceability_graph.query")!;

async function tmpRoot() {
  const root = await mkdtemp(join(tmpdir(), "sdd-trace-"));
  process.env.SDD_DATA_DIR = join(root, ".sdd-data");
  return root;
}

test("traceability_graph.build on repo with no specs returns 0 nodes", async () => {
  const root = await tmpRoot();
  const r = await build.handler({ root }) as { nodes: number; edges: number };
  assert.equal(r.nodes, 0);
  assert.equal(r.edges, 0);
});

test("traceability_graph.build indexes REQ-IDs found in spec.md", async () => {
  const root = await tmpRoot();
  const dir = join(root, "specs", "001-login");
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, "spec.md"), "FEAT-001-R01 The system shall authenticate.\nFEAT-001-R02 Rate limiting.");
  const r = await build.handler({ root }) as { nodes: number };
  assert.equal(r.nodes, 2);
});

test("traceability_graph.build creates edge from code annotation to REQ-ID", async () => {
  const root = await tmpRoot();
  await mkdir(join(root, "specs", "001-login"), { recursive: true });
  await writeFile(join(root, "specs", "001-login", "spec.md"), "FEAT-001-R01 auth");
  await mkdir(join(root, "src"), { recursive: true });
  await writeFile(join(root, "src", "auth.ts"), "// REQ:FEAT-001-R01\nexport function login() {}");
  const r = await build.handler({ root }) as { nodes: number; edges: number };
  assert.ok(r.nodes >= 2);
  assert.equal(r.edges, 1);
});

test("traceability_graph.query returns error when index not built", async () => {
  const root = await tmpRoot();
  const r = await query.handler({ id: "FEAT-001-R01" }) as { error: string };
  assert.ok(r.error.includes("not built"));
});

test("traceability_graph.query finds node by exact REQ-ID", async () => {
  const root = await tmpRoot();
  await mkdir(join(root, "specs", "001-login"), { recursive: true });
  await writeFile(join(root, "specs", "001-login", "spec.md"), "FEAT-001-R01 auth\nFEAT-001-R02 sessions");
  await build.handler({ root });
  const r = await query.handler({ id: "FEAT-001-R01" }) as { matches: { id: string }[] };
  assert.equal(r.matches.length, 1);
  assert.equal(r.matches[0].id, "FEAT-001-R01");
});

test("traceability_graph.query filters by kind", async () => {
  const root = await tmpRoot();
  await mkdir(join(root, "specs", "001-login"), { recursive: true });
  await writeFile(join(root, "specs", "001-login", "spec.md"), "FEAT-001-R01 auth");
  await mkdir(join(root, "src"), { recursive: true });
  await writeFile(join(root, "src", "auth.ts"), "// REQ:FEAT-001-R01\nexport function login() {}");
  await build.handler({ root });
  const r = await query.handler({ kind: "code" }) as { matches: { kind: string }[] };
  assert.ok(r.matches.length >= 1);
  assert.ok(r.matches.every(m => m.kind === "code"));
});
