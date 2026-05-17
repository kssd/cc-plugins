import path from "node:path";
import { readMaybe } from "../util.js";
export const constitutionLookupTools = [
    {
        name: "constitution_lookup",
        description: "Return the principles from .specify/memory/constitution.md, optionally filtered to those whose names or text match a keyword set. Use during plan review.",
        inputSchema: {
            type: "object",
            properties: {
                root: { type: "string" },
                keywords: { type: "array", items: { type: "string" } }
            }
        },
        handler: async (args) => {
            const root = args.root ?? process.cwd();
            const content = await readMaybe(path.join(root, ".specify", "memory", "constitution.md"));
            if (!content)
                return { error: "constitution not found — run /sdd:constitution" };
            const version = content.match(/\*\*Version:\*\*\s*([^\n]+)/)?.[1]?.trim() ?? "unknown";
            const principleRe = /^### (P\d+) — (.+)$/gm;
            const principles = [];
            const matches = [...content.matchAll(principleRe)];
            for (let i = 0; i < matches.length; i++) {
                const m = matches[i];
                const start = m.index + m[0].length;
                const end = i + 1 < matches.length ? matches[i + 1].index : content.length;
                principles.push({ id: m[1], name: m[2], body: content.slice(start, end).trim() });
            }
            const kws = args.keywords?.map(k => k.toLowerCase()) ?? [];
            const filtered = kws.length === 0 ? principles
                : principles.filter(p => {
                    const hay = (p.name + " " + p.body).toLowerCase();
                    return kws.some(k => hay.includes(k));
                });
            return { version, principles: filtered };
        }
    }
];
//# sourceMappingURL=constitution-lookup.js.map