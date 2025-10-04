# Cloud-run AI agent instructions — Dev_Wizard

Purpose: These instructions are written for a cloud-run AI agent whose job is to autonomously create the Dev_Wizard project following the docs. Focus on persistent progress, iterative planning, debugging, and verification loops. Always consult the canonical docs before making decisions.

MANDATORY: the cloud-run agent must follow the steps, constraints and location guidance in `Dev_Wizard_canonical_docs/copilot_prompt.md`. That file contains the authoritative scaffold and operational constraints (what to create, where, and which existing code NOT to modify). Consult it before performing any scaffold or integration actions.

Core expectations (brief)
- Persist changes with an aim to ship: prefer small, verifiable increments that move the repo toward an executable project (README, CI, templates, minimal scaffolds).
- Follow docs to the letter: `Dev_Wizard_canonical_docs/architecture.md` is the single source of truth for architecture decisions; consult other docs (`PRD.md`, `roadmap.md`, `security_strategy.md`) as needed.
- Think, plan, test, verify, repeat: use short plan → implement → unit/behavioral test → smoke verify → iterate loops.
- Push through blockers: when you hit a blocker, diagnose root cause, fix the root, and document the fix. Only fall back to temporary workarounds if you document them and create a follow-up issue/PR to remove the workaround.

Where to read first (required reading order)
1. `Dev_Wizard_canonical_docs/architecture.md` — start here; extract service boundaries, expected config names (e.g., `config/features.json`, `infra/environments.yaml`, `config/registry.json`) and the repository strategy (standalone, API-first).
2. `Dev_Wizard_canonical_docs/PRD.md` — product scope and must-have features.
3. `Dev_Wizard_canonical_docs/roadmap.md` — release priorities and milestone trade-offs.
4. `Dev_Wizard_canonical_docs/security_strategy.md` — any design that touches secrets, keychains, and MFA must reference this before implementation.

Note on monorepo-origin: many canonical docs were originally written assuming a monorepo layout. The cloud-run agent must adapt those sections to the standalone repo layout when they conflict with this repo's structure. Record any such adaptations in `dev_wizard/pm/decisions.md` (or `pm/decisions.md` at repo root if `dev_wizard/` is not yet created).

Key behaviour and operational rules for the cloud-run agent
- Persistency: prioritize edits that create durable value (README, CI, scaffolds, small working examples). Each PR must include how it was verified (commands, expected output) and minimal automation (script or workflow) to reproduce verification.
- Plan & communicate: for multi-step tasks, commit a short plan in the PR description (2–5 bullets: goal, approach, verification steps, rollback plan). Link to exact lines/sections in `architecture.md` that justify design choices.
- Root-cause fixes: if a build or test fails due to a doc/code mismatch, fix the root cause (update code or docs) rather than layering a workaround. Document the decision and why it was necessary.
- Controlled assumptions: if a contract file is mentioned in docs but missing (e.g., `config/features.json`), add a minimal example file under `config/` and document it in the PR rather than assuming values.
- Use mocks/stubs for external systems: for LangGraph, Configu or MCP dependencies, add a lightweight mock or a documented stub with a clear contract and example requests/responses.

Concrete first tasks (implement these before broader features)
1. Add a minimal `README.md` at repo root summarizing the standalone decision, how to run the docs verification, and quick start (how to run local checks). Include a short example for spinning up Postgres via Docker Compose if applicable.
2. Add a `.github/workflows/ci.yml` that runs markdownlint and a smoke verification step (e.g., `scripts/verify-docs.sh`) that ensures canonical docs contain the expected keys (feature flag names, expected config filenames).
3. Add `config/features.example.json` and `infra/environments.example.yaml` using minimal representative content from `architecture.md` so runtime contracts are first-class.
4. Add `templates/node-basic/` with a single-file Node scaffold and a minimal `mise.toml` example. Add `scripts/new-project` (shell/ps1) that copies the template and injects a project name.

Agent verification & CI requirements
- Every PR must include a verification section explaining: commands to run locally, expected outputs, and CI checks added/updated. Example: "Run `./scripts/verify-docs.sh` — expect: `features.json found` and `infra environments mapped`".
- CI workflow must be conservative: syntax/linters and the `scripts/verify-docs.sh` smoke test only — do not add heavy builds until a runnable project exists.

Conflict resolution and blockers
- When encountering merge conflicts or ambiguous doc guidance: prefer the docs. If docs conflict with code, open a PR that either updates the docs (with justification) or updates code to match docs, and include tests/verification.
- For non-trivial blockers (missing external service, ambiguous API contract), add a mock implementation and a short issue describing the real dependency and how to replace the mock.

Agent behaviour rules (how to propose changes)
- Small focused PRs: each PR should do one thing (doc, template, CI, example config). Keep scope minimal and include a rollback plan.
- Link to docs: every design decision must include a link to the exact doc/line in `architecture.md` or PRD that justifies it.
- Preserve audit trail: commit messages should follow conventional style (`docs:`, `chore:`, `feat:`, `fix:`) and PR descriptions should summarize verification steps and why the change was required.

Example PR descriptions (use these verbatim as a template)
"docs(readme): add README linking to `Dev_Wizard_canonical_docs/architecture.md`

Goal: make the standalone repo decision explicit and provide quick start steps.

Approach: add `README.md` with links to architecture and verification commands.

Verification: run `./scripts/verify-docs.sh` (expect `features example present`)."

If this guidance needs to be stricter (e.g., enforce specific test formats or CI providers), tell me which rules to encode and I will update the instructions.
