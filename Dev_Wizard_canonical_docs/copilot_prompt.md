You are the GitHub Copilot Cloud Run agent tasked with bootstrapping the **Dev Wizard** project in this repository as a standalone application. Follow these guidelines strictly and adapt any monorepo-oriented docs to the standalone layout.

## Repository context

* **Location:** Work in the `Jul352mf/Dev_Wizard` repository (this repo). Implement the app as a top-level `dev_wizard/` directory at the repo root rather than inside an outer monorepo `apps/` folder.
* **New application:** Create a standalone app called `dev_wizard` at `./dev_wizard`. Do not modify other repositories or external projects.

## Reference documents

* Read the following files in `Dev_Wizard_canonical_docs/` before starting (these are authoritative for design decisions):
   * `PRD.md` – defines goals, functional requirements and non‑goals.
   * `architecture.md` – describes the system architecture and components.
   * `security_strategy.md` – specifies how to handle secrets, authentication and secure communication.
   * `roadmap.md` – outlines phases and sprints for delivery.
   * `survey.md` – summarises existing tools and integration notes.

## Actions to perform

1. **Scaffold the project (standalone flow):**
   * Create a new `dev_wizard/` directory at repo root. Use Next.js (TypeScript) for the frontend and set up an Electron wrapper for desktop packaging. Configure the project so it can run as a web app (`npm run dev`) and as a desktop app (`npm run electron`).
   * Initialise a basic directory structure with pages for `dashboard`, `projects/[id]`, `actions`, `secrets` and `settings`. Use shadcn components and create a single navigation drawer with nested sections as described in the PRD.
   * Add a `README.md` in the `dev_wizard/` folder explaining how to run and build the project.

2. **Backend skeleton:**
   * Within `dev_wizard/`, create an `api/` folder. Implement a simple Express (TypeScript) server that exposes endpoints `/projects` and `/tasks` returning mock data. Keep the service boundary clear so a Python microservice could be added later for MCP integration.
   * Set up a minimal database adapter with PostgreSQL-first defaults but an SQLite fallback for local development; for initial scaffolding a small SQLite example or in-memory store is acceptable.

3. **Commit after each step (push policy):**
   * After scaffolding the project structure, commit with message `chore(dev_wizard): scaffold project structure`.
   * After creating the navigation drawer and basic pages, commit with message `feat(dev_wizard): add navigation and pages`.
   * After implementing the backend skeleton and API endpoints, commit with message `feat(dev_wizard): add basic API server`.
   * Continue committing after each significant change, following conventional commits.
   * Pushing to remote after each task is acceptable. However, aim to complete an entire sprint (set of related tasks) in one coherent session/PR if possible. Document each incremental push with the verification steps performed.

4. **Documentation:**
   * Copy the canonical documents from `Dev_Wizard_canonical_docs/` into `dev_wizard/docs/` for local reference inside the scaffolded app.
   * Generate a `pm/decisions.md` file summarising decisions taken during implementation (e.g., language choice, database selection). Commit it as `docs: record initial decisions`.

## Constraints

* No secrets or environment variables should be hardcoded. Use placeholders and follow `security_strategy.md` for secrets handling.
* Keep code modular and prepare for expansion according to the roadmap.
* Note: the canonical docs in this repo were originally authored with a monorepo layout in mind. If you encounter inconsistencies or conflicts that arise because of the earlier monorepo assumptions, adapt the docs and scaffold to the standalone layout and record the decision in `pm/decisions.md`.

Once all steps are complete, signal completion so the integration can proceed.  Document any assumptions or deviations in the decision log.