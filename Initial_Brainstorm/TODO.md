## Discovery

* **Evaluate existing tools for workspace management**  
  source: #vision-tool-purpose  
  note: Research open‑source and commercial solutions that already provide unified management of URLs, env vars, API keys, commands, services and deployments.  Identify what can be reused or integrated.

* **Draft PRD and open questions document**  
  source: #vision-tool-purpose  
  note: Create a product requirements document for the Dev Wizard tool and an accompanying list of open questions to resolve prior to implementation.

* **Identify additional files for default parsing**  
  source: #user-flows-pages  
  note: Extend the incomplete list of files used to prefill defaults beyond `.git`, `package.json`, `task.yml` and `requirements.txt`.

* **Investigate MCP SDK language choice**  
  source: #architecture-components  
  note: Compare the TypeScript and Python MCP SDKs to determine which offers better compatibility with the existing frontend and LangGraph components.

* **Research security mechanisms**  
  source: #profiles-security  
  note: Explore OS‑native keychains, hardware tokens, mTLS configurations and alternative approaches (e.g. GnuPG) to define a final security architecture.

* **Determine integration strategy within the monorepo**  
  source: #vision-tool-purpose  
  note: Decide whether to place the tool under `packages/tools`, create a new app in `apps`, or adopt a hybrid approach that affects `jagi-mcp-gateway`, `jagi-oap` and `jagi-os-core`.

* **Define feature flags and feature matrix**  
  source: #philosophies-principles  
  note: Design the format and contents of a feature matrix to manage modular capabilities and conditional features.

## Design

* **Define MVP scope and features**  
  source: #project-scope-versions  
  note: Specify exactly which capabilities belong in Version 1 (e.g., local dev server management, project creation/import, environment detection) and what is deferred to later versions.

* **Choose UI architecture (standalone vs integrated)**  
  source: #architecture-components  
  note: Decide whether the frontend should remain a standalone application or be integrated into `jagi-oap` from the start.

* **Design multiple sidebar navigation**  
  source: #user-flows-pages  
  note: Resolve how to handle multiple sidebars elegantly across project pages, dashboard and settings; capture options and trade‑offs.

* **Plan file parsing and default prefill strategy**  
  source: #user-flows-pages  
  note: Define the algorithm for scanning projects, detecting services/apps and pre‑filling default commands and environment variables from standard files.

* **Outline actions page capabilities**  
  source: #user-flows-pages  
  note: Complete the incomplete list of actions (e.g., start/stop servers, Git operations, dependency sync) and determine how each action interacts with the backend and MCP.

* **Design secrets page controls**  
  source: #user-flows-pages  
  note: Specify control types (text fields, dropdowns, toggles) and workflows for managing secrets across dev/staging/prod environments.

* **Architect OS keychain integration**  
  source: #profiles-security  
  note: Decide how credentials are stored and retrieved from macOS Keychain, Windows DPAPI and Linux Secret Service, and how FIDO2/YubiKey authentication will be invoked.

* **Plan GitHub CLI authentication**  
  source: #vision-tool-purpose  
  note: Determine how the tool will prompt the user for GitHub authentication via CLI and store resulting tokens securely.

* **Design project detection algorithm**  
  source: #user-flows-pages  
  note: Specify how the tool scans the main dev folder for projects and differentiates between services/apps.

## Build

* **Scaffold Next.js frontend with required pages**  
  source: #architecture-components  
  note: Create the login, dashboard, project page (with sub‑pages), file editor and settings pages using shadcn components and Swiss‑inspired design.

* **Implement backend API and local Postgres**  
  source: #architecture-components  
  note: Build a Dockerized API server with endpoints for projects, actions, deployments, secrets, configs and settings.  Configure a local PostgreSQL database.

* **Develop MCP component using chosen SDK**  
  source: #architecture-components  
  note: Expose a public port for agents, proxy API calls through `/api/oap_mcp`, and implement tool discovery and streaming endpoints.

* **Implement project scanning and environment detection**  
  source: #user-flows-pages  
  note: Write a service that watches the main dev folder, identifies projects and services, and parses configuration files to prefill defaults.

* **Build actions functionality**  
  source: #user-flows-pages  
  note: Support starting/stopping dev servers, deploying services/projects, performing Git operations, creating services/apps, syncing dependencies, running tests, cleaning caches and editing actions.

* **Create secrets management and environment injection**  
  source: #user-flows-pages  
  note: Store secrets in the database, map them to services/apps and environments, and populate `.env` files and deployment variables accordingly.

* **Develop deployments dashboard and metrics**  
  source: #user-flows-pages  
  note: Implement tables and side panels for viewing deployment status (running, crashed, sleeping, failed), and integrate LLM summarization of recent outputs.

* **Implement logs page and LLM summary**  
  source: #user-flows-pages  
  note: Capture and display logs for deployments and use an LLM to summarise latest outputs on demand.

* **Integrate local LangGraph runtime**  
  source: #architecture-components  
  note: Configure a local LangGraph runtime, expose endpoints for agents and ensure compatibility with MCP connections.

* **Implement OS keychain and FIDO2 integration**  
  source: #profiles-security  
  note: Write modules that interact with platform keychains and hardware tokens for credential storage and user authentication.

* **Establish mTLS communication**  
  source: #profiles-security  
  note: Set up mutual TLS with short‑lived credentials between cloud agents and the local tool using Google IAM and Workload Identity Federation.

* **Add feature flags and matrix implementation**  
  source: #philosophies-principles  
  note: Implement a configurable feature flag system and maintain a matrix of available features per environment and version.

* **Enable VM spawning capability**  
  source: #vision-tool-purpose  
  note: Allow the tool to provision and manage virtual machines for isolated development environments.

* **Integrate GitHub authentication CLI**  
  source: #vision-tool-purpose  
  note: Provide commands or prompts for logging into GitHub via CLI and securely store the credentials.

## Validate

* **Write and run frontend tests**  
  source: #default-tech-stack-based-on-jagi-project  
  note: Use Vitest or Jest to test UI components, hooks and API proxies.  Confirm existing test harnesses or bootstrap minimal testing infrastructure if absent.

* **Write and run backend tests**  
  source: #default-tech-stack-based-on-jagi-project  
  note: Use pytest or appropriate frameworks to test API endpoints, project scanning, actions, secrets management and LangGraph runtime integration.

* **Validate multi‑language support**  
  source: #vision-tool-purpose  
  note: Ensure the tool handles projects containing a blend of Python, JavaScript and TypeScript, including file detection and environment setup.

* **Test security measures**  
  source: #profiles-security  
  note: Verify that OS keychain integration, hardware token usage and mTLS communication work across supported platforms.

* **Validate deployment features**  
  source: #user-flows-pages  
  note: Confirm that deployments can be started, updated, inspected, and summarised with accurate metrics and logs.

* **Test user flows and UI navigation**  
  source: #user-flows-pages  
  note: Conduct usability testing on onboarding, project creation, navigation between pages and multi‑sidebar interactions.

* **Measure performance**  
  source: #architecture-components  
  note: Benchmark backend and frontend performance under typical workloads, identifying bottlenecks and tuning configuration.

## Launch

* **Integrate into jagi‑oap**  
  source: #project-scope-versions  
  note: Merge the tool into the existing `jagi-oap` frontend if decided, resolving namespace conflicts and aligning design systems.

* **Write documentation and runbooks**  
  source: #default-tech-stack-based-on-jagi-project  
  note: Produce guides covering installation, configuration, usage, troubleshooting and operational procedures.

* **Prepare user‑friendly defaults**  
  source: #project-scope-versions  
  note: Create sensible defaults for non‑technical users, including automatic installation of editors (e.g., VS Code) and environment setup.

* **Add gamified user experience elements**  
  source: #project-scope-versions  
  note: Implement optional gamification features to enhance the coding experience, such as achievements or custom branding.

* **Release beta and collect feedback**  
  source: #project-scope-versions  
  note: Launch a beta version, gather user feedback and iterate on the design before full release.

* **Extend platform support beyond Windows**  
  source: #project-scope-versions  
  note: Plan and implement support for macOS and Linux to broaden the user base.
