import { promises as fs } from "node:fs";
import path from "node:path";
import { dataDir, ensureDir, listFiles, reqIdRegex, readMaybe, type ToolDef } from "../util.js";

type Node = { id: string; kind: "req" | "task" | "code" | "test"; file?: string; symbol?: string; meta?: Record<string, unknown> };
type Graph = { nodes: Node[]; edges: { from: string; to: string; rel: string }[]; builtAt: string; root: string };

const CODE_EXT = new Set([".ts", ".tsx", ".js", ".jsx", ".py", ".go", ".rs", ".rb", ".java", ".kt", ".swift", ".cs", ".cpp", ".c", ".h", ".hpp", ".php", ".sql"]);
const TEST_HINT = /(test|spec)\.(ts|tsx|js|jsx|py|go|rs|rb|java|kt|swift|cs|cpp|c)$/i;

async function buildGraph(root: string): Promise<Graph> {
  const nodes: Node[] = [];
  const edges: Graph["edges"] = [];
  const reqRe = reqIdRegex();

  // 1. REQ-IDs from specs
  const specFiles = await listFiles(path.join(root, "specs"), (p) => p.endsWith("spec.md"));
  for (const f of specFiles) {
    const text = await fs.readFile(f, "utf8");
    const ids = new Set(text.match(reqRe) ?? []);
    for (const id of ids) {
      nodes.push({ id, kind: "req", file: path.relative(root, f) });
    }
  }

  // 2. tasks from tasks.md
  const taskFiles = await listFiles(path.join(root, "specs"), (p) => p.endsWith("tasks.md"));
  for (const f of taskFiles) {
    const text = await fs.readFile(f, "utf8");
    const taskRe = /^- \*\*T(\d{3})(?: \[P\])?\*\* — (.+)$/gm;
    let m: RegExpExecArray | null;
    while ((m = taskRe.exec(text)) !== null) {
      const tid = `T${m[1]}`;
      const after = text.slice(m.index, m.index + 400);
      const satisfies = (after.match(/\*\*Satisfies:\*\*\s*([^\n]+)/)?.[1] ?? "");
      const reqs = satisfies.match(reqIdRegex()) ?? [];
      nodes.push({ id: tid, kind: "task", file: path.relative(root, f), meta: { title: m[2] } });
      for (const r of reqs) edges.push({ from: tid, to: r, rel: "satisfies" });
    }
  }

  // 3. code/test annotations REQ:FEAT-...
  const codeFiles = await listFiles(root, (p) => CODE_EXT.has(path.extname(p)) && !p.includes("/node_modules/") && !p.includes("/dist/"));
  for (const f of codeFiles) {
    const text = await fs.readFile(f, "utf8").catch(() => "");
    if (!text.includes("REQ:")) continue;
    const annot = /REQ:(FEAT-\d{3}-R\d{2})/g;
    const ids = new Set<string>();
    let mm: RegExpExecArray | null;
    while ((mm = annot.exec(text)) !== null) ids.add(mm[1]);
    if (ids.size === 0) continue;
    const rel = path.relative(root, f);
    const kind = TEST_HINT.test(rel) ? "test" : "code";
    const nid = `${kind}:${rel}`;
    nodes.push({ id: nid, kind, file: rel });
    for (const r of ids) edges.push({ from: nid, to: r, rel: "implements" });
  }

  return { nodes, edges, builtAt: new Date().toISOString(), root };
}

async function indexPath(): Promise<string> {
  const dir = dataDir();
  await ensureDir(dir);
  return path.join(dir, "trace.json");
}

export const traceabilityTools: ToolDef[] = [
  {
    name: "traceability_graph.build",
    description: "Scan specs/, tasks.md, and source files for REQ: annotations; build the bidirectional traceability index. Cached under SDD_DATA_DIR.",
    inputSchema: {
      type: "object",
      properties: { root: { type: "string" } }
    },
    handler: async (args) => {
      const root = (args.root as string) ?? process.cwd();
      const g = await buildGraph(root);
      await fs.writeFile(await indexPath(), JSON.stringify(g), "utf8");
      return { nodes: g.nodes.length, edges: g.edges.length, builtAt: g.builtAt };
    }
  },
  {
    name: "traceability_graph.query",
    description: "Query the traceability index by REQ-ID, file, symbol, or kind. Returns adjacent nodes across spec/task/code/test layers.",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "REQ-ID like FEAT-001-R03" },
        file: { type: "string" },
        symbol: { type: "string" },
        kind: { type: "string", enum: ["req", "task", "code", "test"] }
      }
    },
    handler: async (args) => {
      const raw = await readMaybe(await indexPath());
      if (!raw) return { error: "index not built — run traceability_graph.build first" };
      const g = JSON.parse(raw) as Graph;
      let target = g.nodes;
      if (args.id) target = target.filter(n => n.id === args.id);
      if (args.file) target = target.filter(n => n.file && n.file.includes(args.file as string));
      if (args.symbol) target = target.filter(n => n.symbol === args.symbol);
      if (args.kind) target = target.filter(n => n.kind === args.kind);
      const out = target.map(n => {
        const adj = g.edges.flatMap(e =>
          e.from === n.id ? [{ rel: e.rel, dir: "out", node: g.nodes.find(x => x.id === e.to) }]
          : e.to === n.id ? [{ rel: e.rel, dir: "in",  node: g.nodes.find(x => x.id === e.from) }]
          : []
        );
        return { ...n, adjacent: adj };
      });
      return { matches: out, builtAt: g.builtAt };
    }
  }
];
