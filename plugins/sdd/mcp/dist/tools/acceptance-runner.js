import { promises as fs } from "node:fs";
import path from "node:path";
const EARS_RE = /(?:^|\n)[-*]?\s*\*?\*?(AC-[A-Z0-9-]+)\*?\*?\s*[—:-]\s*((?:WHEN|WHILE|IF|WHERE|THE SYSTEM SHALL)[^\n]+)/g;
export const acceptanceRunnerTools = [
    {
        name: "acceptance_runner.scaffold",
        description: "Generate Node test (node:test) skeletons from EARS acceptance clauses in a feature's spec.md. Returns the generated test source as a string; does not write files.",
        inputSchema: {
            type: "object",
            required: ["specPath"],
            properties: {
                specPath: { type: "string", description: "Path to spec.md" },
                framework: { type: "string", enum: ["node-test", "vitest", "jest"], default: "node-test" }
            }
        },
        handler: async (args) => {
            const specPath = args.specPath;
            const text = await fs.readFile(specPath, "utf8");
            const featId = text.match(/\*\*Feature ID:\*\*\s*(FEAT-\d{3})/)?.[1] ?? "FEAT-XXX";
            const clauses = [];
            const matches = [...text.matchAll(EARS_RE)];
            for (const m of matches) {
                const tail = text.slice(m.index + m[0].length, m.index + m[0].length + 200);
                const req = tail.match(/satisfies\s+(FEAT-\d{3}-R\d{2})/)?.[1];
                clauses.push({ id: m[1], clause: m[2].trim(), req });
            }
            const framework = args.framework ?? "node-test";
            const header = framework === "node-test"
                ? `import { test } from "node:test";\nimport assert from "node:assert/strict";\n`
                : framework === "vitest"
                    ? `import { test, expect } from "vitest";\n`
                    : `// jest globals\n`;
            const body = clauses.map(c => `\ntest("${c.id} ${c.req ? `[${c.req}] ` : ""}— ${c.clause.replace(/"/g, '\\"')}", () => {\n  // TODO: implement acceptance check for ${c.req ?? "no REQ"}\n  // REQ:${c.req ?? "FEAT-???-R??"}\n  assert.ok(false, "not implemented");\n});\n`).join("");
            return {
                feature: featId,
                clauseCount: clauses.length,
                source: header + body,
                suggestedFilename: `${path.basename(path.dirname(specPath))}.acceptance.test.ts`
            };
        }
    }
];
//# sourceMappingURL=acceptance-runner.js.map