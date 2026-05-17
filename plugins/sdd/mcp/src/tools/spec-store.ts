import { promises as fs } from "node:fs";
import path from "node:path";
import type { ToolDef } from "../util.js";

const SPECS = "specs";

async function exists(p: string): Promise<boolean> {
  try { await fs.access(p); return true; } catch { return false; }
}

export const specStoreTools: ToolDef[] = [
  {
    name: "spec_store.list",
    description: "List all feature spec directories under `specs/` with their numeric ID, slug, REQ count, and status.",
    inputSchema: {
      type: "object",
      properties: {
        root: { type: "string", description: "Repo root (defaults to cwd)" }
      }
    },
    handler: async (args) => {
      const root = (args.root as string) ?? process.cwd();
      const specsDir = path.join(root, SPECS);
      if (!(await exists(specsDir))) return { features: [] };
      const dirs = (await fs.readdir(specsDir, { withFileTypes: true }))
        .filter(e => e.isDirectory() && /^\d{3}-/.test(e.name))
        .map(e => e.name)
        .sort();
      const features = [];
      for (const d of dirs) {
        const specPath = path.join(specsDir, d, "spec.md");
        let reqCount = 0, clarifyCount = 0;
        const content = await fs.readFile(specPath, "utf8").catch(() => "");
        const reqs = content.match(/\bFEAT-\d{3}-R\d{2}\b/g);
        reqCount = reqs ? new Set(reqs).size : 0;
        clarifyCount = (content.match(/\[NEEDS CLARIFICATION:/g) ?? []).length;
        features.push({
          id: d.slice(0, 3),
          slug: d.slice(4),
          dir: path.join(SPECS, d),
          reqCount,
          openClarifications: clarifyCount,
          hasPlan: await exists(path.join(specsDir, d, "plan.md")),
          hasTasks: await exists(path.join(specsDir, d, "tasks.md")),
        });
      }
      return { features };
    }
  },
  {
    name: "spec_store.get",
    description: "Read a named artifact from a feature directory (spec, plan, tasks, clarifications, checklist, quickstart, research, data-model, constitution).",
    inputSchema: {
      type: "object",
      required: ["artifact"],
      properties: {
        root: { type: "string" },
        feature: { type: "string", description: "Feature dir name or NNN id (omit for constitution)" },
        artifact: { type: "string", enum: ["spec","plan","tasks","clarifications","checklist","quickstart","research","data-model","constitution"] }
      }
    },
    handler: async (args) => {
      const root = (args.root as string) ?? process.cwd();
      const artifact = args.artifact as string;
      if (artifact === "constitution") {
        const p = path.join(root, ".specify", "memory", "constitution.md");
        return { path: p, content: await fs.readFile(p, "utf8") };
      }
      const feature = await resolveFeature(root, args.feature as string | undefined);
      const fileName = artifact === "data-model" ? "data-model.md" : `${artifact}.md`;
      const full = path.join(root, SPECS, feature, fileName);
      return { path: full, content: await fs.readFile(full, "utf8") };
    }
  },
  {
    name: "spec_store.create",
    description: "Create or overwrite a feature artifact file with provided content. Use sparingly; commands usually call template skills instead.",
    inputSchema: {
      type: "object",
      required: ["feature", "artifact", "content"],
      properties: {
        root: { type: "string" },
        feature: { type: "string" },
        artifact: { type: "string" },
        content: { type: "string" }
      }
    },
    handler: async (args) => {
      const root = (args.root as string) ?? process.cwd();
      const feature = args.feature as string;
      const dir = path.join(root, SPECS, feature);
      await fs.mkdir(dir, { recursive: true });
      const target = path.join(dir, `${args.artifact}.md`);
      await fs.writeFile(target, args.content as string, "utf8");
      return { path: target, written: true };
    }
  },
  {
    name: "spec_store.update",
    description: "Append text to an existing feature artifact (e.g. amendment notes to clarifications.md).",
    inputSchema: {
      type: "object",
      required: ["feature", "artifact", "append"],
      properties: {
        root: { type: "string" },
        feature: { type: "string" },
        artifact: { type: "string" },
        append: { type: "string" }
      }
    },
    handler: async (args) => {
      const root = (args.root as string) ?? process.cwd();
      const target = path.join(root, SPECS, args.feature as string, `${args.artifact}.md`);
      await fs.appendFile(target, "\n" + (args.append as string) + "\n", "utf8");
      return { path: target, appended: true };
    }
  }
];

async function resolveFeature(root: string, hint?: string): Promise<string> {
  const specsDir = path.join(root, SPECS);
  const dirs = (await fs.readdir(specsDir, { withFileTypes: true }).catch(() => []))
    .filter(e => e.isDirectory() && /^\d{3}-/.test(e.name))
    .map(e => e.name);
  if (!hint) {
    if (dirs.length === 0) throw new Error("no features found");
    // most recently modified
    const stats = await Promise.all(dirs.map(async d => ({ d, m: (await fs.stat(path.join(specsDir, d))).mtimeMs })));
    stats.sort((a, b) => b.m - a.m);
    return stats[0].d;
  }
  const match = dirs.find(d => d === hint || d.startsWith(hint + "-") || d.slice(0,3) === hint || d.includes(hint));
  if (!match) throw new Error(`feature not found: ${hint}`);
  return match;
}
