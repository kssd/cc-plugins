#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { specStoreTools } from "./tools/spec-store.js";
import { traceabilityTools } from "./tools/traceability-graph.js";
import { constitutionLookupTools } from "./tools/constitution-lookup.js";
import { contractValidatorTools } from "./tools/contract-validator.js";
import { driftDetectorTools } from "./tools/drift-detector.js";
import { acceptanceRunnerTools } from "./tools/acceptance-runner.js";

const allTools = [
  ...specStoreTools,
  ...traceabilityTools,
  ...constitutionLookupTools,
  ...contractValidatorTools,
  ...driftDetectorTools,
  ...acceptanceRunnerTools,
];

const server = new Server(
  { name: "sdd", version: "0.1.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: allTools.map((t) => ({
    name: t.name,
    description: t.description,
    inputSchema: t.inputSchema,
  })),
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const tool = allTools.find((t) => t.name === request.params.name);
  if (!tool) {
    return {
      content: [{ type: "text", text: `unknown tool: ${request.params.name}` }],
      isError: true,
    };
  }
  try {
    const result = await tool.handler(request.params.arguments ?? {});
    return {
      content: [
        {
          type: "text",
          text: typeof result === "string" ? result : JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (err) {
    return {
      content: [{ type: "text", text: `error: ${(err as Error).message}` }],
      isError: true,
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
