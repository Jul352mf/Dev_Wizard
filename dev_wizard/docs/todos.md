# Dev Wizard Task Plan (Phase Transition: Scaffold -> Functional Core)

This file captures the concrete actionable backlog distilled from the audit of the current implementation versus the canonical documents (`architecture.md`, `PRD.md`, `roadmap.md`, `security_strategy.md`). Tasks are grouped by theme and sequenced for highest leverage. Each task should, when completed, add or prove working vertical functionality (not just placeholders).

Status Legend: ⭕ Not Started · 🚧 In Progress · ✅ Done · 🧪 Requires Test · 📝 ADR Needed

---
## 0. Foundation & Hygiene
1. Add `.gitattributes` enforcing LF for `*.sh` (fix `scripts/verify-docs.sh`) ⭕
2. Create PowerShell equivalent `scripts/verify-docs.ps1` for Windows CI parity ⭕
3. Add basic CI workflow: lint, typecheck, run `verify-docs` (bash + pwsh) ⭕
4. Introduce Vitest (or Jest) + first sample test (feature flag loader) ⭕
5. Configure `eslint` script to include project paths + run on CI ⭕

## 1. Configuration & Feature Flags
1. Implement `config/features.schema.json` (JSON Schema) ⭕
2. Implement `lib/config/loadFeatureFlags.ts` with:
   - File resolution order: `features.json` > `features.example.json` fallback
   - Schema validation (zod or Ajv) & typed export
   - Caching + hot reload in dev (watch) ⭕
3. Expose feature flags via API endpoint `GET /api/flags` (read-only) ⭕
4. Add unit test for invalid flag schema rejection 🧪 ⭕
5. ADR: Feature flag loading strategy & future remote sync 📝 ⭕

## 2. Environment Matrix
1. Implement `lib/config/loadEnvironments.ts` to parse `infra/environments.example.yaml` (support override file `environments.yaml`) ⭕
2. Add schema (YAML -> JSON Schema or zod) for validation ⭕
3. API endpoint `GET /api/environments` returning active + defined envs ⭕
4. Add UI surface (Settings page section) to display environments list ⭕
5. Unit test: environment parse + override precedence 🧪 ⭕

## 3. Project Scanning Service
1. Service module `services/projectScanner.ts`:
   - Accept root path(s)
   - Use glob patterns from environment config
   - Emit structured project objects (id, name, type, path, detectedTools) ⭕
2. Add caching & debounce for FS watch events ⭕
3. API endpoint `GET /api/projects` wired to scanner (in-memory) ⭕
4. UI: Replace static projects on Dashboard & Projects page with fetched data ⭕
5. Unit test: detection of Next.js, Python (pyproject), Node (package.json) 🧪 ⭕
6. ADR: Project detection heuristics & extensibility 📝 ⭕

## 4. Task Automation Layer
1. Define task model (`id`, `projectId`, `command`, `status`, `startedAt`, `endedAt`, `logs`) ⭕
2. Implement `services/taskRunner.ts` using child_process with controlled concurrency ⭕
3. WebSocket channel (or polling fallback) for live log streaming ⭕
4. API endpoints: `POST /api/tasks` (start), `GET /api/tasks`, `GET /api/tasks/:id` ⭕
5. UI: Actions page consumes live task updates (remove static mock) ⭕
6. Unit test: start + finish + failure transitions 🧪 ⭕
7. ADR: Task execution strategy & security sandboxing considerations 📝 ⭕

## 5. Secrets Management (Phase 1 Stub)
1. Abstract interface `services/secretsProvider.ts` (get/set/list/delete) ⭕
2. File-based dev implementation + placeholder keychain adapter interface ⭕
3. API endpoints: `GET /api/secrets`, `POST /api/secrets` (create), `DELETE /api/secrets/:id` ⭕
4. UI: Secrets page loads from API (replace static array) ⭕
5. Add masking + local ephemeral reveal state (already partially UI) ⭕
6. ADR: Secrets storage roadmap & keychain integration plan 📝 ⭕
7. Security placeholder: audit log entry on secret create/delete ⭕
8. Unit test: create + list + delete secret (file backend) 🧪 ⭕

## 6. Decision Log Automation
1. Implement `services/decisionLog.ts` that appends timestamped entries to `pm/decisions.md` ⭕
2. Hook into: feature flag changes (future), environment overrides load, task model config changes ⭕
3. Add API endpoint `POST /api/decisions` to record manual decision note ⭕
4. Unit test: append format correctness 🧪 ⭕

## 7. Security & Compliance Placeholders
1. Stub modules:
   - `security/keychain.ts` (interface only)
   - `security/audit.ts` (record(eventType, payload))
   - `security/mtls.ts` (config structure) ⭕
2. Integrate audit calls in secrets + task runner creation ⭕
3. ADR: Security layering phases (local stub → OS keychain → mTLS) 📝 ⭕

## 8. MCP Integration (Deferred Start)
1. Placeholder `services/mcpClient.ts` with connect() + listAgents() ⭕
2. Feature flag gate (`mcpIntegration`) around a UI placeholder panel ⭕
3. ADR: MCP integration sequencing & dependency assumptions 📝 ⭕

## 9. Electron Integration Verification
1. Ensure `electron/` contains: `main.ts`, `preload.ts`, builder config synergy ⭕
2. Add `ipcBridge` abstraction for tasks & project scanning operations (future offload) ⭕
3. Smoke test: `npm run electron` launches and loads http://localhost:3000 ⭕
4. Test script: headless smoke (CI non-blocking) ⭕

## 10. Logging & Observability
1. Introduce lightweight logger utility (levels + structured JSON option) ⭕
2. Replace `console.log` placeholders incrementally ⭕
3. Add log redaction for secrets events ⭕
4. ADR: Observability stack future (OTel vs custom) 📝 ⭕

## 11. UX & Interaction Enhancements
1. Implement global layout wrapper with persistent side navigation (if missing) ⭕
2. Add `CommandPalette` component (Ctrl+K): fuzzy search projects & actions ⭕
3. Keyboard accessibility for toggles & buttons (ARIA, roles) ⭕
4. Add loading & empty states for dynamic lists ⭕
5. Dark theme token consolidation & theming docs ⭕

## 12. Testing Strategy Expansion
1. Add component test for navigation active state 🧪 ⭕
2. Add integration test: create task → status completes 🧪 ⭕
3. Add security test: secret never appears in logs 🧪 ⭕
4. Coverage threshold config (initial modest 60%) ⭕

## 13. Documentation & ADR Updates
1. Populate `pm/decisions.md` with initial ADRs (flags, tasks, secrets, security phases) ⭕
2. Update `README.md` with implemented endpoints as they become real ⭕
3. Add `docs/DEVELOPMENT.md` (run modes, architecture layering) ⭕
4. Add `docs/SECURITY_NOTES.md` for interim limitations ⭕

## 14. CI Enhancements (Phase 2 after core working)
1. Add typecheck+test matrix (Node 20 & 22) ⭕
2. Add artifact upload for electron build (draft release) ⭕
3. Add codeowners + PR template ⭕

---
## Suggested Sequencing (First 3 Sprints)
Sprint 1 (Foundations): Sections 0, 1, 2, partial 3 (scanner read-only) + minimal tests.
Sprint 2 (Core Interactivity): Finish 3, add 4 (basic task runner), 6 (decision log stub), 5 (secrets stub) + security placeholders.
Sprint 3 (Refinement & Extensibility): 7, 8 placeholder, 9 verification, 10 logger, 11 UX polish, expand tests (12), doc passes (13).

---
## Acceptance Criteria Examples
Feature Flag Loader: Given invalid flag shape → returns validation error & logs audit entry.
Project Scanner: Adding a new `package.json` under workspace appears via `GET /api/projects` within 5s.
Task Runner: POST /api/tasks returns task id; subsequent GET shows status progression (pending → running → success/failure).
Secrets: Secret created via API never appears in plain text logs; list endpoint redacts value.
Decision Log: Posting a decision appends an ISO timestamped entry to `pm/decisions.md`.

---
## Open Questions
- Will remote sync for flags/config use pull (fetch) or push (webhook)?
- Is SQLite acceptable for initial persistence (tasks, secrets) before Postgres migration?
- Preferred transport for real-time: WebSocket vs Server-Sent Events?
- Should Electron own process supervision (dev servers) vs backend API?

---
## Deferred / Nice-to-Have (Not in MVP)
- FIDO2 enforcement flow
- mTLS certificate provisioning automation
- Remote agent orchestration & multi-environment deployment management
- Plugin marketplace for detection heuristics

---
## Meta
Generated from audit findings (date: 2025-10-04). Keep this file pruned—remove completed items promptly and reflect ADR references once published.
