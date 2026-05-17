import { promises as fs } from "node:fs";
import path from "node:path";

export type ToolDef = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  handler: (args: Record<string, unknown>) => Promise<unknown>;
};

export function dataDir(): string {
  return process.env.SDD_DATA_DIR ?? path.join(process.cwd(), ".sdd-data");
}

export async function ensureDir(p: string): Promise<void> {
  await fs.mkdir(p, { recursive: true });
}

export async function listFiles(root: string, predicate: (p: string) => boolean): Promise<string[]> {
  const out: string[] = [];
  async function walk(dir: string) {
    let entries;
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      if (e.name === "node_modules" || e.name.startsWith(".git")) continue;
      const full = path.join(dir, e.name);
      if (e.isDirectory()) await walk(full);
      else if (predicate(full)) out.push(full);
    }
  }
  await walk(root);
  return out;
}

export function reqIdRegex(): RegExp {
  return /\bFEAT-\d{3}-R\d{2}\b/g;
}

export async function readMaybe(p: string): Promise<string | null> {
  try {
    return await fs.readFile(p, "utf8");
  } catch {
    return null;
  }
}
