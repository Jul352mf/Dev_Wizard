# Copilot / AI agent instructions — Dev_Wizard

Purpose: give an AI coding agent the essential, discoverable knowledge to be productive in this repository. Keep edits small and factual; prefer documentation and small scaffolding PRs.

1) Big picture (what this repo contains)
- Primary contents: canonical docs and brainstorm artifacts under `Dev_Wizard_canonical_docs/` and `Initial_Brainstorm/`.
- The project is designed as a cross-platform developer tool (Next.js + Electron frontend, TypeScript backend) that integrates with LangGraph and the JAGI/OAP ecosystem. See `Dev_Wizard_canonical_docs/architecture.md` for design rationale, service boundaries, and the repository strategy (standalone repo, API-first integration).

2) Key files and patterns to reference
- `Dev_Wizard_canonical_docs/architecture.md` — canonical architecture and the single source of truth for design decisions (database choice, feature flags, runtime integration).
- `Dev_Wizard_canonical_docs/PRD.md`, `roadmap.md`, `security_strategy.md` — product, roadmap and security assumptions.
- Config / conventions referenced in docs (expected by implementation): `config/features.json`, `infra/environments.yaml`, `config/registry.json`, `mise.toml`, `Taskfile.yml`, `langgraph.json` (these may not exist yet; treat them as contract points).
- Template/workflow files to create/use: `devcontainer.json` detection is called out in the docs — surface this in tasks/PRs that add tooling support.

3) Developer workflows (what an agent should know)
- This repository currently holds documentation and planning assets; there is no build script or application code yet. Before creating code, update docs and add a clear README describing how to run or build later.
- Git conventions visible in commits: keep commits small and scoped (e.g., `docs:`, `chore:`, `feat:`). Branches target `main` for now.
- When adding executable code, include a minimal README, a short CI workflow, and easy-to-run smoke checks (for docs, use markdown linter). PRs should be self-contained and include tests or verification steps where possible.

4) Project-specific conventions and expectations
- Database: docs state "PostgreSQL-first, configurable" — prefer Postgres as the default in code examples and docker-compose scaffolds, but keep the storage adaptor pluggable (SQLite for local/dev allowed).
- Cross-platform parity: implement and test feature parity for Windows and Linux (pay attention to path separators, OS keychain APIs, process management and CRLF/LF line ending warnings in Git).
- Feature flags & env matrix: the architecture references `config/features.json` and `infra/environments.yaml` — treat these as canonical contracts for runtime toggles and environment mappings.
- Scaffolding artifacts: templates should output `mise.toml` and `Taskfile.yml` entries when appropriate (repository references these names repeatedly).

5) Integration points and external dependencies
- LangGraph / MCP SDK: expect an MCP proxy or client for interactions with LangGraph; document endpoint shape in architecture.md before implementing.
- Configu, OS keychains, and FIDO2: secrets management is multi-modal in the design; spell out which flows are local-only vs remote.

6) What agents should do first (concrete tasks)
- Update README.md at repo root summarising the standalone decision and linking to `Dev_Wizard_canonical_docs/architecture.md`.
- Add a simple `.github/workflows/ci.yml` that runs markdownlint and a basic spellcheck for docs.
- Add a `templates/` directory with one minimal scaffold (Node.js) and a short generator script `scripts/new-project` that creates a scaffold and `mise.toml` entry.
- Add devcontainer detection: add a detector stub or docs entry that lists behaviour when `devcontainer.json` is present.
- When making code changes: include a short usage example, tests or verification steps, and update `architecture.md` if the implementation changes the design assumptions.

7) Agent behaviour rules (how to propose changes)
- Prefer documentation-first changes. If adding code, include tests and a README explaining run steps.
- Keep PRs small and focused (one feature or one doc update). Link PRs to a short rationale that references `architecture.md`.
- Do not make assumptions about external services (LangGraph, Configu) — instead, add a small mock or stub and document the contract used.

8) Examples to cite in PRs
- "This PR adds a README and CI that reflect the standalone repo decision in `Dev_Wizard_canonical_docs/architecture.md`."
- "This PR scaffolds a minimal Node template under `templates/node-basic/` and generates an example `mise.toml` as described in the docs."

If any of the above sections are unclear or you expect different priorities, tell me which parts to expand or change and I will iterate.
