import { promises as fs } from "node:fs";
import path from "node:path";
export function dataDir() {
    return process.env.SDD_DATA_DIR ?? path.join(process.cwd(), ".sdd-data");
}
export async function ensureDir(p) {
    await fs.mkdir(p, { recursive: true });
}
export async function listFiles(root, predicate) {
    const out = [];
    async function walk(dir) {
        let entries;
        try {
            entries = await fs.readdir(dir, { withFileTypes: true });
        }
        catch {
            return;
        }
        for (const e of entries) {
            if (e.name === "node_modules" || e.name.startsWith(".git"))
                continue;
            const full = path.join(dir, e.name);
            if (e.isDirectory())
                await walk(full);
            else if (predicate(full))
                out.push(full);
        }
    }
    await walk(root);
    return out;
}
export function reqIdRegex() {
    return /\bFEAT-\d{3}-R\d{2}\b/g;
}
export async function readMaybe(p) {
    try {
        return await fs.readFile(p, "utf8");
    }
    catch {
        return null;
    }
}
//# sourceMappingURL=util.js.map