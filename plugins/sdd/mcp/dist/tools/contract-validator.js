import { promises as fs } from "node:fs";
import path from "node:path";
import Ajv from "ajv";
import YAML from "yaml";
import { listFiles } from "../util.js";
export const contractValidatorTools = [
    {
        name: "contract_validator",
        description: "Validate JSON Schema / OpenAPI files under a feature's contracts/ directory. Returns per-file parse and schema-shape errors.",
        inputSchema: {
            type: "object",
            properties: {
                root: { type: "string" },
                contractsDir: { type: "string", description: "Path to contracts directory (default: scans specs/*/contracts)" }
            }
        },
        handler: async (args) => {
            const root = args.root ?? process.cwd();
            const targetDir = args.contractsDir ?? path.join(root, "specs");
            const files = await listFiles(targetDir, (p) => /\/contracts\/[^/]+\.(json|ya?ml)$/.test(p));
            const ajv = new Ajv({ strict: false, allErrors: true });
            const results = [];
            for (const f of files) {
                const text = await fs.readFile(f, "utf8");
                try {
                    const data = f.endsWith(".json") ? JSON.parse(text) : YAML.parse(text);
                    if (data && typeof data === "object" && ("openapi" in data || "swagger" in data)) {
                        // Surface-level OpenAPI check
                        const required = ["openapi" in data ? "openapi" : "swagger", "info", "paths"];
                        const missing = required.filter(k => !(k in data));
                        results.push({ file: path.relative(root, f), ok: missing.length === 0, errors: missing.length ? [`missing top-level: ${missing.join(",")}`] : undefined });
                    }
                    else {
                        // Treat as JSON Schema — compile it
                        try {
                            ajv.compile(data);
                            results.push({ file: path.relative(root, f), ok: true });
                        }
                        catch (e) {
                            results.push({ file: path.relative(root, f), ok: false, errors: [e.message] });
                        }
                    }
                }
                catch (e) {
                    results.push({ file: path.relative(root, f), ok: false, errors: [`parse error: ${e.message}`] });
                }
            }
            return { count: results.length, results };
        }
    }
];
//# sourceMappingURL=contract-validator.js.map