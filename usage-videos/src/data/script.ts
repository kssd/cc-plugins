export type SpecLine = {
  text: string;
  kind?: "req" | "ac" | "code" | "muted" | "normal";
};

// ── Scene 2: Installation ─────────────────────────────────────────────────────
export const INSTALL_LINES = [
  "$ claude plugin marketplace add cc-plugins",
  "  ✓ Marketplace registered",
  "$ claude plugin install scaffold",
  "  ✓ scaffold@0.1.1 installed",
  "$ claude plugin install sdd",
  "  ✓ sdd@0.1.0 installed",
];

// ── Scene 3: Scaffold demo ────────────────────────────────────────────────────
export const SCAFFOLD_LINES = [
  "$ /scaffold:init",
  "",
  "? Stack ›  Node/TypeScript",
  "? License ›  MIT",
  "? CI (GitHub Actions) ›  Yes",
  "? Devcontainer ›  No",
  "? Package manager ›  npm",
  "? Project name ›  task-tracker",
  "? Description ›  CLI tool for managing tasks",
  "",
  "Writing files …",
  "  ✓ README.md",
  "  ✓ .gitignore   ✓ .editorconfig   ✓ LICENSE",
  "  ✓ tsconfig.json   ✓ eslint.config.mjs",
  "  ✓ .github/workflows/ci.yml",
  "",
  "Next: git init && git add -A && git commit -m 'chore: scaffold'",
];

// ── Scene 5: Constitution ─────────────────────────────────────────────────────
export const CONSTITUTION_LINES = [
  "$ /sdd:constitution performance integrity testability",
  "",
  "Drafting .specify/memory/constitution.md …",
  "",
  "  P1  All operations complete in <50 ms for lists ≤10 000 tasks",
  "  P2  Tasks are never silently dropped — errors are explicit",
  "  P3  Every requirement has ≥1 acceptance test",
  "",
  "constitution-guardian: PASS — 3 principles, all falsifiable",
];

// ── Scene 6: Specify Feature 1 ────────────────────────────────────────────────
export const SPECIFY1_LINES = [
  "$ /sdd:specify create task with title description and due date",
  "",
  "Creating specs/001-task-creation/ …",
];

export const SPECIFY1_SPEC: SpecLine[] = [
  { text: "# specs/001-task-creation/spec.md", kind: "muted" },
  { text: "" },
  { text: "FEAT-001-R01  Create task with title, description, due date", kind: "req" },
  { text: "FEAT-001-R02  Persist tasks to JSON store", kind: "req" },
  { text: "FEAT-001-R03  Reject task if title is missing or blank", kind: "req" },
  { text: "" },
  { text: "WHEN user calls createTask(input)", kind: "ac" },
  { text: "  THE SYSTEM SHALL return the saved Task object", kind: "ac" },
  { text: "  *(satisfies FEAT-001-R01)*", kind: "muted" },
  { text: "IF title is blank", kind: "ac" },
  { text: "  THEN THE SYSTEM SHALL throw ValidationError", kind: "ac" },
  { text: "  *(satisfies FEAT-001-R03)*", kind: "muted" },
];

// ── Scene 7: Specify Feature 2 ────────────────────────────────────────────────
export const SPECIFY2_LINES = [
  "$ /sdd:specify filter tasks by completion status",
  "",
  "Creating specs/002-task-filter/ …",
];

export const SPECIFY2_SPEC: SpecLine[] = [
  { text: "# specs/002-task-filter/spec.md", kind: "muted" },
  { text: "" },
  { text: "FEAT-002-R01  Filter tasks by status (open | done)", kind: "req" },
  { text: "FEAT-002-R02  Return empty list (not error) when no match", kind: "req" },
  { text: "" },
  { text: "WHEN user calls filterTasks({ status })", kind: "ac" },
  { text: "  THE SYSTEM SHALL return only tasks matching status", kind: "ac" },
  { text: "  *(satisfies FEAT-002-R01)*", kind: "muted" },
  { text: "WHEN no tasks match", kind: "ac" },
  { text: "  THE SYSTEM SHALL return []", kind: "ac" },
  { text: "  *(satisfies FEAT-002-R02)*", kind: "muted" },
];

// ── Scene 8: Plan + gate ──────────────────────────────────────────────────────
export const PLAN_LINES = [
  "$ /sdd:plan",
  "",
  "plan-architect: generating plan.md, data-model.md, contracts/ …",
  "",
  "constitution-guardian checking …",
  "  P1  operations < 50 ms → in-memory Map lookup   ✓",
  "  P2  errors thrown, never swallowed              ✓",
  "  P3  acceptance tests in Wave 2                  ✓",
  "",
  "constitution gate: PASS",
];

// ── Scene 9: Tasks DAG ────────────────────────────────────────────────────────
export const TASKS_LINES = [
  "$ /sdd:tasks",
  "",
  "Wave 1  ──────────────────────────────────",
  "  T001  createTask() + validation",
  "        [Satisfies FEAT-001-R01, R02, R03]",
  "  T002  JSON store read/write  [P]",
  "        [Satisfies FEAT-001-R02]",
  "",
  "Wave 2  ──────────────────────────────────",
  "  T003  filterTasks()",
  "        [Satisfies FEAT-002-R01, R02]",
  "  T004  acceptance tests (all ACs)",
  "        [depends T001, T002, T003]",
  "",
  "Coverage: 5 REQs → 4 tasks  ✓",
];

// ── Scene 10: Implement ───────────────────────────────────────────────────────
export const IMPLEMENT_LINES = [
  "$ /sdd:implement T001",
  "",
  "implementer: writing src/tasks/create.ts …",
  "  running tests …",
  "  ✓ tests pass (3/3)",
  "  ✓ T001 marked done",
  "  next eligible: T002",
];

export const IMPLEMENT_CODE = `// REQ:FEAT-001-R01 — create task
export function createTask(
  input: CreateTaskInput
): Task {
  validate(input);       // REQ:FEAT-001-R03
  const task = {
    ...input,
    id: uuid(),
    status: "open" as const,
  };
  persist(task);         // REQ:FEAT-001-R02
  return task;
}`;

// ── Scene 11: Checklist ───────────────────────────────────────────────────────
export const CHECKLIST_ROWS = [
  "Spec — 0 clarification markers",
  "Spec — 5 REQs, all EARS-shaped",
  "Plan — req→component map complete",
  "Plan — constitution compliance rows present",
  "Plan — contracts validate",
  "Tasks — coverage table 5/5 REQs",
  "Tasks — no dependency cycles",
  "Code — all REQs have REQ: annotations",
  "Tests — 4/4 tasks have acceptance tests",
  "Sync — 0 drift",
];
