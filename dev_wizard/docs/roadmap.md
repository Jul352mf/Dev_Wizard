# Dev Wizard – Roadmap

This roadmap outlines the phased plan to deliver the Dev Wizard MVP and lay the foundation for future enhancements.  Each phase is aligned with the discovery → design → build → validate → launch lifecycle described in the TODO list and draws inspiration from the JAGI blueprint’s phased approach【844344696133301†L175-L201】.

## Milestones

### Phase 0 – Discovery & preparation (October 2025)

* **Survey existing tools** – Complete a comprehensive analysis of tools like `mise`, `devpod`, `Configu`, `devenv`, `direnv`, `Taskfile`, OS keychains and FIDO2.  Document capabilities, integration points and limitations【395892949853523†L40-L48】【221446700090586†L388-L432】.
* **Define MVP requirements** – Finalise the product requirements document, clarifying scope, goals and non‑goals.  Identify open questions (e.g., MCP SDK language, configuration storage) and assign research tasks.
* **Security strategy** – Produce a security design document covering threat modelling, secret storage, authentication, mTLS and audit trails【183323877738311†L145-L151】【382439635864551†L298-L303】【864312483546141†L382-L386】.
* **Integration analysis** – Review the JAGI blueprint’s feature flags and environment matrix【844344696133301†L26-L30】【844344696133301†L58-L59】, and determine how Dev Wizard will consume these configurations.

### Phase 1 – Design (November 2025)

* **User experience design** – Create wireframes for the dashboard, project page, actions page, secrets page and settings.  Define UI patterns (single navigation drawer, command palette, collapsible sections).  Identify component libraries (shadcn, Radix UI) and design tokens.
* **Feature flag and environment schema** – Draft the JSON schemas for `config/features.json` and `infra/environments.yaml` and specify default keys and values.  Align with JAGI blueprint guidelines【844344696133301†L26-L30】【844344696133301†L58-L59】.
* **API and data model design** – Define database tables (projects, tasks, secrets, configs, logs, audit events) and API endpoints.  Write an OpenAPI spec or tRPC interface for client and agent use.
* **Proof of concept** – Build a minimal prototype that scans projects, lists them in a UI and starts a basic dev server.  Validate integration with OS keychains and `mise` tasks.

### Phase 2 – Build (December 2025 – January 2026)

* **Frontend scaffolding** – Create a Next.js app with Electron wrapper.  Implement login, dashboard, project details, actions, secrets and settings pages.  Set up global state management and WebSocket connection to backend.
* **Backend implementation** – Build the API server with project scanning, task execution, secrets management and LangGraph proxy.  Integrate with SQLite (local) and optional Postgres.  Implement feature flag loader and environment matrix parser.
* **Secret management** – Write platform adapters for macOS Keychain, Windows DPAPI and Linux Secret Service, plus an abstraction for Configu.  Implement FIDO2 authentication workflow for sensitive operations【382439635864551†L316-L319】.
* **Task runner and server manager** – Support `mise` and `Taskfile` tasks.  Provide fallback to arbitrary commands.  Implement port detection and log streaming.
* **MCP integration** – Use the MCP SDK to list graphs, deploy new ones and invoke tools.  Implement mTLS using short‑lived workload identity certificates【864312483546141†L382-L386】.
* **Feature flags** – Build a module that reads `config/features.json` and toggles modules at runtime.  Support remote overrides via Configu.
* **Preliminary testing** – Write unit tests for API modules and integration tests for project scanning, secrets management and task execution.

### Phase 3 – Validate (February 2026)

* **User testing** – Onboard a small group of developers to test the tool.  Collect feedback on workflows (project discovery, environment configuration, running tasks).  Measure time to first server and environment correctness.
* **Security audits** – Conduct penetration testing focusing on secret storage, authentication flows and mTLS connections.  Verify FIDO2 integration across platforms and ensure secrets are not leaked to logs.
* **Performance tuning** – Benchmark scanning speed, API response times and memory usage.  Optimise file watching and process management.  Consider using Rust or Go for performance‑critical modules if needed.
* **Accessibility and UX improvements** – Refine navigation, ensure screen reader compatibility and keyboard shortcuts.  Enhance command palette search and feedback.
* **Doc and runbook drafting** – Create user guides, developer onboarding docs and operational runbooks (deployment, rotating keys, adding new tasks).  Update decision logs.

### Phase 4 – Launch (March 2026)

* **Beta release** – Package the Electron app for Windows, macOS and Linux.  Publish a beta via GitHub Releases.  Provide installation instructions and feedback channels.  Deploy the backend as part of the Electron package or as a Docker container.
* **Feedback-driven iteration** – Gather user feedback and iterate on UX, performance and stability.  Prioritise bug fixes and critical feature requests.
* **Integration with JAGI OAP** – Depending on the design decision, integrate Dev Wizard into the `jagi-oap` repository as a module or maintain it as a standalone application with a clear upgrade path.
* **Documentation & final release** – Finalise documentation, summarise decision logs and publish the 1.0 release.  Plan for Post‑MVP features (VM spawning, gamification, multi‑tenant support) as part of the next roadmap.

## Sprint planning

Each phase can be broken into 2‑ to 4‑week sprints with specific deliverables.  A sample sprint schedule for Phase 2 (Build) might look like:

| Sprint | Focus | Key deliverables |
| --- | --- | --- |
| **Sprint 2.1** | Frontend setup | Scaffold Electron + Next.js; implement navigation drawer and dashboard; set up state management and WebSocket client. |
| **Sprint 2.2** | Backend core | Implement project scanning service and API endpoints; set up database; connect WebSocket for logs. |
| **Sprint 2.3** | Secrets & tasks | Implement keychain adapters and secrets API; integrate with Configu; implement basic task runner and log streaming. |
| **Sprint 2.4** | LangGraph integration | Add MCP proxy; support listing and deploying graphs; implement feature flag loader; integrate mTLS certificates. |
| **Sprint 2.5** | UI polish & tests | Complete remaining pages (actions, secrets, settings); write unit and integration tests; prepare for user testing. |

Sprints for Phases 1 and 3 can follow similar patterns (design deliverables in Phase 1; validation and documentation deliverables in Phase 3).

## Post‑MVP considerations

After the initial launch, the following enhancements can be prioritised:

* **VM provisioning** – Add the ability to spawn development VMs (local or cloud) with preconfigured environments.  Integrate with WSL2, Hyper‑V or virtualization APIs.  Offer a UI to select and manage VMs.
* **Multi‑tenant management** – Support organisations, roles and permissions.  Leverage the JAGI blueprint’s multi‑tenant model【844344696133301†L116-L134】.  Provide administrative pages for managing memberships, workspaces and project access.
* **Gamification** – Introduce optional achievements and progress tracking to motivate users.  Use feature flags to enable per‑user.
* **Advanced observability** – Integrate with LangFuse or other telemetry providers.  Provide visual dashboards for runtime performance, agent metrics and tasks.
* **Plugin marketplace** – Allow third‑party plugins (tools, actions, UI panels) to extend Dev Wizard.  Define a plugin API and packaging format.

By following this roadmap, the team can deliver a meaningful MVP in a structured manner, gather early feedback and chart a clear path for future improvements.