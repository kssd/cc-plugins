import { promises as fs } from "node:fs";
import path from "node:path";
import { Project, SyntaxKind } from "ts-morph";
import { dataDir, ensureDir, listFiles, readMaybe, type ToolDef } from "../util.js";

type SymbolEntry = { file: string; symbol: string; kind: string; reqIds: string[]; signature?: string };
type Snapshot = { takenAt: string; symbols: SymbolEntry[] };

async function buildSurface(root: string): Promise<SymbolEntry[]> {
  const tsFiles = await listFiles(root, (p) => /\.(ts|tsx)$/.test(p) && !p.includes("/node_modules/") && !p.includes("/dist/"));
  if (tsFiles.length === 0) return [];
  const project = new Project({ skipAddingFilesFromTsConfig: true, skipLoadingLibFiles: true });
  const out: SymbolEntry[] = [];
  for (const f of tsFiles) {
    const text = await fs.readFile(f, "utf8");
    if (!text.includes("REQ:FEAT-")) continue;
    const reqIds = Array.from(new Set(text.match(/REQ:(FEAT-\d{3}-R\d{2})/g)?.map(s => s.slice(4)) ?? []));
    const sf = project.createSourceFile(f, text, { overwrite: true });
    for (const fn of sf.getFunctions()) {
      if (fn.isExported()) {
        out.push({
          file: path.relative(root, f),
          symbol: fn.getName() ?? "<anon>",
          kind: "function",
          reqIds,
          signature: fn.getText().slice(0, 300).split("{")[0].trim()
        });
      }
    }
    for (const cls of sf.getClasses()) {
      if (cls.isExported()) {
        out.push({ file: path.relative(root, f), symbol: cls.getName() ?? "<anon>", kind: "class", reqIds });
      }
    }
    for (const iface of sf.getInterfaces()) {
      if (iface.isExported()) {
        out.push({ file: path.relative(root, f), symbol: iface.getName(), kind: "interface", reqIds });
      }
    }
    for (const ta of sf.getTypeAliases()) {
      if (ta.isExported()) {
        out.push({ file: path.relative(root, f), symbol: ta.getName(), kind: "type", reqIds });
      }
    }
    project.removeSourceFile(sf);
  }
  return out;
}

async function snapshotPath(): Promise<string> {
  const dir = dataDir();
  await ensureDir(dir);
  return path.join(dir, "drift-snapshot.json");
}

export const driftDetectorTools: ToolDef[] = [
  {
    name: "drift_detector.snapshot",
    description: "Capture the current AST surface (exported functions, classes, interfaces, types) of files annotated with REQ:FEAT-* as the baseline for future drift checks.",
    inputSchema: {
      type: "object",
      properties: { root: { type: "string" } }
    },
    handler: async (args) => {
      const root = (args.root as string) ?? process.cwd();
      const symbols = await buildSurface(root);
      const snap: Snapshot = { takenAt: new Date().toISOString(), symbols };
      await fs.writeFile(await snapshotPath(), JSON.stringify(snap), "utf8");
      return { symbols: symbols.length, takenAt: snap.takenAt };
    }
  },
  {
    name: "drift_detector",
    description: "Compare current AST surface to the last snapshot; report added / removed / renamed / signature-changed symbols with their REQ-IDs.",
    inputSchema: {
      type: "object",
      properties: {
        root: { type: "string" },
        mode: { type: "string", enum: ["report", "advisory"], default: "report" }
      }
    },
    handler: async (args) => {
      const root = (args.root as string) ?? process.cwd();
      const raw = await readMaybe(await snapshotPath());
      if (!raw) return { error: "no snapshot — run drift_detector.snapshot first" };
      const prev = JSON.parse(raw) as Snapshot;
      const curr = await buildSurface(root);

      const key = (e: SymbolEntry) => `${e.file}::${e.symbol}`;
      const prevMap = new Map<string, SymbolEntry>(prev.symbols.map(e => [key(e), e] as const));
      const currMap = new Map<string, SymbolEntry>(curr.map(e => [key(e), e] as const));

      const added: SymbolEntry[] = [];
      const removed: SymbolEntry[] = [];
      const signatureChanged: { before: SymbolEntry; after: SymbolEntry }[] = [];

      for (const [k, c] of currMap) {
        const p = prevMap.get(k);
        if (!p) added.push(c);
        else if (p.signature && c.signature && p.signature !== c.signature) {
          signatureChanged.push({ before: p, after: c });
        }
      }
      for (const [k, p] of prevMap) {
        if (!currMap.has(k)) removed.push(p);
      }

      // Naive rename detection: removed + added with same symbol name in different file, or same file diff symbol with same reqIds
      const renamed: { from: SymbolEntry; to: SymbolEntry }[] = [];
      for (let i = removed.length - 1; i >= 0; i--) {
        const r = removed[i];
        const candIdx = added.findIndex(a =>
          a.kind === r.kind && (
            a.symbol === r.symbol /* moved */ ||
            (a.file === r.file && r.reqIds.length > 0 && r.reqIds.every(id => a.reqIds.includes(id)))
          )
        );
        if (candIdx >= 0) {
          renamed.push({ from: r, to: added[candIdx] });
          added.splice(candIdx, 1);
          removed.splice(i, 1);
        }
      }

      const result = {
        snapshotAt: prev.takenAt,
        comparedAt: new Date().toISOString(),
        added,
        removed,
        renamed,
        signatureChanged,
        summary: {
          added: added.length,
          removed: removed.length,
          renamed: renamed.length,
          signatureChanged: signatureChanged.length
        }
      };

      if (args.mode === "advisory") {
        const flagged = removed.filter(r => r.reqIds.length > 0);
        if (flagged.length === 0 && signatureChanged.length === 0) return { advisory: null };
        return {
          advisory: `sdd drift advisory: ${flagged.length} REQ-linked removals, ${signatureChanged.length} signature changes (run /sdd:sync)`,
          ...result
        };
      }
      return result;
    }
  }
];
