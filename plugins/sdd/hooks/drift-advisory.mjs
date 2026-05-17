// Lightweight invoker: import drift_detector directly from the built MCP and run in advisory mode.
// Avoids the overhead of speaking JSON-RPC for a one-shot hook.
try {
  const mod = await import(`${process.env.CLAUDE_PLUGIN_ROOT}/mcp/dist/tools/drift-detector.js`);
  const tool = mod.driftDetectorTools.find((t) => t.name === "drift_detector");
  if (!tool) process.exit(0);
  const res = await tool.handler({ root: process.cwd(), mode: "advisory" });
  if (res && res.advisory) process.stdout.write(res.advisory + "\n");
} catch {
  // silent — advisory is best-effort
}
