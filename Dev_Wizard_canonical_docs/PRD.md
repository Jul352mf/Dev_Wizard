# Dev Wizard – Product Requirements Document

## Overview

**Dev Wizard** is a unified desktop/web application that helps developers manage local projects, run dev servers, handle environment variables, automate tasks, and deploy services.  It integrates closely with the JAGI Open Agent Platform (OAP), the LangGraph runtime and the Copilot Cloud Run agent.  The goal of the MVP is to deliver a single tool that simplifies day‑to‑day development workflows without heavy setup.

## Goals

* **Unified project hub:** Provide a dashboard where users can discover, create and import projects from their development folder or Git repositories.
* **Environment management:** Detect required environment variables and secrets, fetch them securely (via OS keychain or Configu) and inject them into servers and tasks.
* **Dev server management:** Start, stop and monitor dev servers for each project, with automatic port detection and configurable commands.
* **Task automation:** Allow users to define and run tasks (build, test, lint, deploy) using a declarative file (`mise.toml`, `Taskfile.yml` or script list) and to see status and logs.
* **Agent integration:** Expose the LangGraph runtime and MCP tools via a local API; allow the Copilot Cloud Run agent to perform actions and commit to the repository after each successful step.
* **Cross‑platform support:** Work on Windows (PowerShell), macOS and Linux, with OS‑specific keychain integration and a consistent UI.

## Non‑goals

* Provisioning cloud infrastructure (VM or Kubernetes) – deferred to later versions.
* Advanced gamification or achievements – not part of the MVP.
* Multi‑tenant management beyond a single user/session – initial release is single‑user with project isolation; multi‑tenant will come later.

## Personas & user stories

* **Individual developer (primary persona):** wants a simple way to bootstrap a project, manage environment variables, and run servers without manually editing `.env` files or remembering commands.
* **Copilot Cloud Run agent:** needs to automate tasks (create files, run commands, commit changes) via the Dev Wizard API and commit after each significant step.  Requires observability into server state and environment variables.
* **Team lead:** wants to ensure consistent dev environments across the team and document decisions (architectural choices, security policies).

## Functional requirements

### Project discovery & creation

* Scan a configurable workspace folder for existing projects.  Recognise a project by the presence of common files (`package.json`, `pyproject.toml`, `.git`, `Makefile`, `Dockerfile`, `compose.yaml`, `turbo.json`, `pnpm-workspace.yaml`, `requirements.txt`, `task.yml`, `devenv.nix`, `.env`, `.envrc`).
* Provide a UI to create a new project by selecting a template (Node.js, Python, LangGraph agent, etc.) or cloning a Git repository.  Use `git clone` and optionally `gh repo clone` for GitHub.
* Allow importing existing folders and prompt the user to configure commands and environment variables.
* Unknown project types (no recognised files) are still supported but require the user to manually specify commands and environment variables.

### Environment detection & management

* Parse standard files to detect environment variables: `.env`, `.envrc`, `.env.example`, `mise.toml` (`[env]` section), `devenv.nix` (`env.GREET` etc.), `docker-compose.yml` (`environment:`), `langgraph.json` (LLM keys),`task.yml`, `langgraph.json` and service configuration files.
* Present missing variables to the user with descriptions and optionally suggested values.  Fetch values from the OS keychain or Configu.  Offer to add new secrets.
* Allow adding, editing and deleting secrets via a Secrets page.  Support grouping by environment (dev/staging/prod) and by project/service.  Use appropriate input types (text, password, select) and show description/help.
* Provide the ability to import or export `.env` files for compatibility with existing tooling.

### Dev server and task management

* For each project, detect dev servers based on script names (e.g., `npm run dev`, `python app.py`, `uvicorn main:app`, `docker compose up`) and allow the user to configure additional commands.
* Start, stop and restart servers.  Show status (running/stopped), port and logs.  Allow multiple servers per project.
* Integrate with `mise`/`Taskfile` if present: list defined tasks and allow running them with arguments.  Fallback to running arbitrary commands defined by the user.
* Display logs in real time and allow LLM summarisation of recent output.

### Actions & automation

* Provide an “Actions” page listing available actions: start/stop servers, deploy project, run tests, run lint, sync dependencies, run custom scripts.  Actions may have dependencies and can be executed individually or as a pipeline.
* Offer Git operations: commit, push, pull, create branch, and open PR.  Integrate with the GitHub CLI and prompt the user for authentication.  When run by the Copilot agent, automatically commit after each step with descriptive messages.

### Deployment & remote integration

* Interface with the LangGraph runtime (via MCP) to deploy services or graphs.  Provide a deployment dashboard showing status (running, crashed, failed, sleeping) and metrics.
* Support selecting between local development runtime and remote deployments defined in `NEXT_PUBLIC_DEPLOYMENTS` or the registry defined in `config/registry.json` (from the JAGI blueprint).
* Use mTLS with workload identities when communicating with remote agents (see **Security strategy**).

### User experience & UI

* Use a **single navigation drawer** with nested, collapsible sections and tabs for secondary content, following Material guidelines.  Avoid multiple persistent sidebars.  Provide a command palette (`Ctrl + K`) to quickly jump to any page or run commands.
* Ensure all pages (dashboard, project details, secrets, actions, settings) are responsive.  Adopt a Swiss‑inspired minimal aesthetic consistent with JAGI branding.
* Provide contextual help and tooltips explaining fields and commands.

### Documentation & decision logs

* Automatically generate decision logs and store them under `pm/decisions.md`.  When the user changes a configuration (e.g., chooses `mise` over `devenv`), record the rationale.
* Provide links to architecture diagrams, test plans and runbooks.  Document the environment matrix and feature flags.

## Non‑functional requirements

* **Performance:** Starting the UI and scanning projects should complete within a few seconds; running commands should not introduce significant overhead over CLI execution.
* **Security:** Follow the security strategy document.  No secrets in logs; all communications encrypted; MFA optional but supported.
* **Extensibility:** Modular architecture to allow adding features (VM spawning, gamification, multi‑tenant) in future releases.  Use feature flags to enable/disable modules.
* **Portability:** Runs on Windows, macOS and Linux with minimal user setup.  Provide CLI install instructions for required tools (`mise`, `Taskfile`, `git`, `direnv`, `devenv`, `docker` if using DevPod).

## Success metrics (MVP)

1. **Time to first server:** A new user can create/import a project and start a dev server within **5 minutes**.
2. **Environment correctness:** In 95% of cases the tool detects and injects all required environment variables without manual editing.
3. **Agent productivity:** Copilot Cloud Run agent successfully completes a multi‑step task (e.g., create a new Next.js app, configure environment variables and commit changes) with no manual interventions.
4. **User satisfaction:** At least 80% of beta users report that Dev Wizard simplifies their workflow compared with manual CLI usage.

## Open questions now answered 

* **MCP SDK language choice:** TypeScript aligns with the Next.js frontend, enabling shared models and easier integration. Python offers mature libraries for LangGraph and Configu. A service boundary could allow mixing languages (e.g., Python microservice for MCP and TypeScript for core API). 
* **Configuration storage:** Should Configu be adopted as the primary configuration store, or should a simpler JSON/YAML format suffice for early versions? Yes, both Configu and local files will be supported.
* **VM support:** Should the tool eventually support spawning local or cloud VMs for isolated development?  What providers (WSL2, Hyper‑V, Podman, containerd) are acceptable? Deferred to later versions. If you need to chose something now already take the most obvious choice.
* **User role management:** For later versions, how should multi‑tenant roles and permissions be modelled (orgs, projects, roles)?  Align with JAGI blueprint’s recommendations.

These questions have been addressed during the discovery and design phases and now we are ready for full implementation.