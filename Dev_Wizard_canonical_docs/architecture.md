# Dev Wizard – Architecture

## Overview

Dev Wizard is a cross‑platform desktop and web application that sits at the intersection of local development tooling and the JAGI platform.  It must provide a consistent experience across Windows, macOS and Linux, and integrate tightly with both the Open Agent Platform (OAP) and the LangGraph runtime.  The architecture therefore divides the system into three major layers:

1. **Frontend/UI** – built with Next.js and packaged as a desktop application via Electron.  It is responsible for project discovery, environment configuration, running commands and visualising logs.  The UI follows the single‑drawer navigation pattern adopted by Material guidelines and leverages shadcn components and a Swiss‑inspired design.  A command palette (`Ctrl + K`) allows quick navigation and action execution.
2. **Backend/API** – a local API server written in TypeScript that exposes REST and WebSocket endpoints for projects, tasks, secrets, actions, logs and LangGraph operations.  It orchestrates processes, manages secrets, communicates with remote MCP agents using mutual TLS and workload identities, and interfaces with the OS keychain.  The backend stores metadata in a lightweight PostgreSQL database.
3. **Services & integrations** – external systems and modules used by Dev Wizard, including:
   * **LangGraph runtime** (local and remote) – hosts agents and graphs.  The backend proxies requests to the runtime via the MCP SDK.  The blueprint emphasises using feature flags and an environment matrix to switch between remote and embedded deployments【844344696133301†L26-L30】【844344696133301†L58-L59】.
   * **Secrets storage** – OS keychains (Keychain, DPAPI, GNOME Keyring) and Configu for centralised configuration【183323877738311†L145-L151】【696141650884648†L30-L67】.
   * **Git repositories and CI** – GitHub CLI, `git` and `gh` for cloning and committing.  CI/CD pipelines are triggered externally; the tool only performs local commits and pushes.
   * **Feature flags and environment matrix** – a `config/features.json` file provides runtime toggles【844344696133301†L26-L30】; `infra/environments.yaml` maps dev/stage/prod URLs and secret names【844344696133301†L58-L59】.

   ## Repository strategy

   Originally the team considered integrating Dev Wizard into the larger project's monorepo. After review we decided to keep Dev Wizard as a standalone repository. This simplifies release cadence, makes contributor workflow lighter, and reduces coupling during early development. The project will expose a clear HTTP API surface so it can later be integrated with the broader system (for example, the monorepo services can call its REST/WebSocket endpoints or an authenticated MCP proxy). Key points:

   - Standalone repo for faster iteration, independent CI/CD, and clearer ownership.
   - Maintain a small, well-documented API contract (REST + WebSocket) for integrations.
   - Use feature flags and an environment matrix to remain compatible with the JAGI blueprint while avoiding monorepo constraints.
   - Provide migration notes in the repo README for any future move into a monorepo if needed.

## Component diagram

**UI (Next.js + Electron)**

* **Navigation drawer and pages:** dashboard, projects, actions, secrets, logs, settings.  Uses a single drawer with nested collapsible sections and tabs for secondary content.
* **Command palette:** global search and command execution overlay.
* **Web socket client:** subscribes to backend events (server status, task progress, logs).
* **Git UI components:** commit, push, branch creation; prompts the user for authentication and commit messages.

**Backend/API server**

* **Project service:** scans the workspace directory for projects, parses configuration files (e.g., `package.json`, `.env`, `mise.toml`, `devenv.nix`, `docker-compose.yml`, `task.yml`, `langgraph.json` and any other that makes sense) and stores metadata in a PostgreSQL database.  This service exposes endpoints to list, create and import projects, and to update commands or environment variables. If no known config files are found, the folder is treated as an unknown project and the user is prompted to configure it.
* **Task and server manager:** spawns child processes to run dev servers and tasks.  Uses a queue to manage concurrent tasks, captures stdout/stderr and relays logs to the UI via WebSocket.  Detects ports automatically and tracks status.
* **Secrets manager:** interfaces with the OS keychain and Configu to fetch, store and rotate secrets.  Exposes endpoints for listing, creating, updating and deleting secrets.  Supports FIDO2 MFA for sensitive operations【382439635864551†L298-L303】.
* **LangGraph proxy:** wraps the MCP SDK, authenticating with short‑lived workload identity certificates【864312483546141†L382-L386】.  Provides endpoints for listing graphs, invoking tools, retrieving agent status, and deploying new graphs.  When a tool is run by the Copilot agent, it records the call and commits after completion.
* **Configuration manager:** reads `config/features.json` to determine which modules are enabled, and `infra/environments.yaml` to map environment variables and URLs【844344696133301†L26-L30】【844344696133301†L58-L59】.  Exposes endpoints for fetching feature flags and environment mappings.  Supports live reloading on file changes.

**Database and storage**

* **PostgreSQL database:** stores project metadata, task definitions, secrets metadata (not the secret values), logs, configuration overrides and audit events.  For cross‑platform compatibility the database runs in a container using Docker Compose or is bundled with the Electron app using SQLite during development; for production a full Postgres instance is recommended.
* **File system watchers:** monitors the workspace directory for file changes (new projects, updated config files) and triggers re‑scans.

## Additional capabilities and refinements

The following capabilities strengthen Dev Wizard's value as a developer-facing tool and reflect the updated strategy:

- Cross‑platform parity: ensure feature parity and consistent behaviour across Windows and Linux (in addition to macOS). This includes consistent keychain/secret handling, path semantics, process management and packaging/test flows so users get the same experience on supported platforms.
- PostgreSQL-first, configurable: adopt PostgreSQL as the recommended default from day one while keeping the storage layer pluggable. Local development can use SQLite or an embedded option; Docker Compose with Postgres is the recommended reproducible path for development and CI.
- Dev‑container support: detect and honour `devcontainer.json` and similar configuration so users can boot consistent containerised environments (Codespaces-style) directly from the tool.
- Project scaffolding templates: provide a small set of templates (Node.js app, Python API, LangGraph agent) and a guided wizard that generates project skeletons and default `mise.toml`/`Taskfile.yml` entries.
- Environment diff viewer: visual diffs for environment variables across dev/stage/prod with colour highlights for additions, removals and changed values to reduce deployment misconfigurations.
- Dependency and toolchain checks: scanner detects outdated dependencies or missing tool versions and suggests remediation; integrates with mise-managed tool versions where available.
- Enhanced command palette: extend quick actions ("jump to logs", "open terminal at project root", "create environment variable", "re-run last task") to improve discoverability and speed.
- AI‑assisted configuration: optional LLM-based helpers that analyse project files to suggest run/test commands, infer `.env.example` entries, and provide setup guidance. Respect privacy: allow local model usage or explicit opt‑in for remote inference.
- Import/export profiles: enable saving and sharing project configuration profiles (tasks, env matrices, secrets schema) so teams can adopt consistent setups.
- Offline mode and caching: cache configuration and secrets locally (encrypted) and queue network actions to be executed when connectivity is restored.
- Notification hooks: desktop notifications, webhooks or email alerts for long-running tasks and deployment results so users can step away safely.
- Customization hooks and plugin API: a lightweight extension API for power users to add actions, visualisations or integrations without changing core code.

Each capability should be scoped and prioritised in the roadmap; immediate priorities are PostgreSQL support, cross‑platform parity, and devcontainer detection, followed by scaffolding templates and dependency checks.

**External systems**

* **JAGI OAP and runtime:** remote agents accessible via the MCP.  The tool loads the deployment registry (`config/registry.json`) and environment matrix to configure connections【844344696133301†L81-L106】.
* **Configu server (optional):** centralised configuration store for secrets and feature flags【696141650884648†L30-L67】.  Synchronises secrets into local keychains on initial setup.
* **MFA devices:** FIDO2 hardware keys integrated through WebAuthn libraries.  Invoked when retrieving sensitive secrets or performing privileged actions【382439635864551†L316-L319】.

## Workflow overview

1. **Startup & project discovery:** When Dev Wizard launches, the backend scans the workspace directory and identifies projects based on standard files.  It populates the database and sends a list of projects to the UI.  The UI displays them in the dashboard.
2. **Environment configuration:** For each project, the secrets manager reads the environment matrix and parses local configuration files to determine missing variables.  It fetches secret values from the keychain or Configu, prompting the user when necessary.
3. **Running servers and tasks:** The user can start a dev server or run a task from the UI.  The backend spawns a child process with injected environment variables, captures logs and emits events over WebSocket.  Upon completion, the Copilot agent can commit changes and move to the next step.
4. **Deploying to runtime:** When the user deploys a graph or service, the backend uses the MCP proxy to call the remote API using mTLS credentials.  Deployment status and logs are relayed back to the UI.
5. **Secret updates and rotation:** Secret values can be rotated via the secrets page or automatically by scheduled jobs.  The secrets manager updates the OS keychain and Configu, reloading any running processes if necessary.

## Design considerations and trade‑offs final decision

* **Language choice for backend:** TypeScript aligns with the Next.js frontend, enabling shared models and easier integration. Python offers mature libraries for LangGraph and Configu. A service boundary could allow mixing languages (e.g., Python microservice for MCP and TypeScript for core API).
  
* **Database selection:** PostgreSQL supports multiple sessions and advanced features; containerising it via Docker is straightforward.
* **Secret storage:** OS keychains provide strong protection but are tied to user sessions【183323877738311†L145-L151】.  Configu centralises secrets and feature flags but adds dependency and potential latency【696141650884648†L30-L67】.  The tool will support both; users can opt out of Configu for offline use.
* **Project scanning:** Continuous file watching could consume resources; performing a scan on startup and on demand is simpler.
* **MFA integration:** Requiring FIDO2 for every secret retrieval increases security but may hinder workflow.  An optional setting can enable MFA for high‑risk actions (e.g., deploying to prod) while using standard keychain access for local dev.
* **Electon vs web:** An Electron wrapper provides desktop features (file system access, OS keychain) but increases application size.  A pure web version would require a companion daemon to access the file system.  For the MVP, the Electron approach is chosen.

## Alignment with JAGI blueprint

The blueprint emphasises feature flags and an environment matrix to manage different deployments and capabilities【844344696133301†L26-L30】【844344696133301†L58-L59】.  Dev Wizard inherits these concepts by reading the same `config/features.json` and `infra/environments.yaml` files and exposing them through its configuration manager.  The tool respects the multi‑tenant model by isolating projects and secrets per user and optionally per organisation.  The deployment registry mechanism used in OAP is reused for selecting remote runtimes【844344696133301†L81-L106】.  By aligning with these existing patterns, Dev Wizard can smoothly integrate into the JAGI ecosystem and evolve alongside it.