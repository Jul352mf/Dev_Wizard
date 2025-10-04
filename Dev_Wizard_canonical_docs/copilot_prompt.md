You are the GitHub Copilot Cloud Run agent tasked with bootstrapping the **Dev Wizard** project inside the JAGI monorepo.  Follow these guidelines strictly:

## Repository context

* **Location:** Work in the `Jul352mf/JAGI` repository.
* **New application:** Create a standalone app called `dev_wizard` under `apps/dev_wizard`.  Do not modify existing `apps/jagi-os-core` or `apps/jagi-oap` code unless explicitly instructed.

## Reference documents

* Read the following files in the `/docs/Dev_Wizard` directory before starting:
  * `PRD.md` – defines goals, functional requirements and non‑goals.
  * `architecture.md` – describes the system architecture and components.
  * `security_strategy.md` – specifies how to handle secrets, authentication and secure communication.
  * `roadmap.md` – outlines phases and sprints for delivery.
  * `survey.md` – summarises existing tools and integration notes.

## Actions to perform

1. **Scaffold the project:**
   * Create a new `dev_wizard` app using the monorepo tooling (e.g., Turborepo or pnpm workspaces).  Use Next.js (TypeScript) and set up an Electron wrapper for desktop packaging.  Configure the project to run both as a web app (`npm run dev`) and as a desktop app (`npm run electron`).
   * Initialise a basic directory structure with pages for `dashboard`, `projects/[id]`, `actions`, `secrets` and `settings`.  Use shadcn components and create a single navigation drawer with nested sections as described in the PRD.
   * Add a `README.md` in the `dev_wizard` folder explaining how to run and build the project.

2. **Backend skeleton:**
   * Within `apps/dev_wizard`, create an `api` folder.  Implement a simple Express or FastAPI server (depending on chosen language) that exposes endpoints `/projects` and `/tasks` returning mock data.
   * Set up a basic database using SQLite or an in‑memory store. TypeScript aligns with the Next.js frontend, enabling shared models and easier integration. Python offers mature libraries for LangGraph and Configu. A service boundary could allow mixing languages (e.g., Python microservice for MCP and TypeScript for core API).

3. **Commit after each step:**
   * After scaffolding the project structure, commit with message `chore(dev_wizard): scaffold project structure`.
   * After creating the navigation drawer and basic pages, commit with message `feat(dev_wizard): add navigation and pages`.
   * After implementing the backend skeleton and API endpoints, commit with message `feat(dev_wizard): add basic API server`.
   * Continue committing after each significant change, following conventional commits.
   * every commit must follow the Conventional Commits format (e.g., feat:, fix:, docs:, chore:) to keep the history structured.

4. **Documentation:**
   * Copy the documents from `docs\Dev_Wizard\Dev_Wizard_canonical_docs` into `apps/dev_wizard/docs` for easy reference in the repository.
   * Generate a `pm/decisions.md` file summarising decisions taken during implementation (e.g., language choice, database selection).  Commit it as `docs: record initial decisions`.

## Constraints

* Do not push to remote until the entire task is complete.
* Ensure that environment variables and secrets are **not** hardcoded.  Use placeholders and refer to the security strategy.
* Keep code modular and prepare for expansion according to the roadmap.

Once all steps are complete, signal completion so the integration can proceed.  Document any assumptions or deviations in the decision log.