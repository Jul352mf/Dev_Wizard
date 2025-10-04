# Core Insights – Organized Version

## Process Checklist

The following checklist summarizes the steps used to transform the original brainstorming document into a structured corpus.  It serves as both a reminder of the conversion process and a tool for validating completeness:

1. **Decompose** the raw notes into logical topics and sections based on themes and headings.
2. **Parse & segment** individual thoughts while preserving verbatim blocks and existing hyperlinks.
3. **Organize** content using headings (`#..###`) and lists; eliminate exact duplicates and merge near‑duplicates with provenance notes.
4. **Normalize markers**, adding `INCOMPLETE_LIST` labels where `etc.` signals missing items, and relocating unresolved fragments into the *Unresolved or Incomplete* section.
5. **Extract TODOs** into a phased roadmap in `TODO.md`, attaching the nearest heading as a slug for traceability.
6. **Extract FOLLOW‑UPS** by isolating all `@GPT` prompts along with one‑line context and their source anchor, storing them in `FOLLOWUPS.md`.
7. **Light copy‑edit** the narrative (outside of verbatim areas) to improve grammar, spelling, and flow while preserving meaning.
8. **Validate preservation**, ensuring no detail or formatting is lost during the transformation; self‑correct when any preservation issue is detected.
9. **Optimize organization** for readability and clarity, favouring concise headings and lists over dense paragraphs.

## Vision & Tool Purpose

The brainstorming begins with a reflection on the growing complexity of modern development workflows.  URLs, environment variables, API keys, registry entries, commands, services and module deployments are spread across many places, making them hard to track.  The proposed tool aims to consolidate these elements into **one place**.  Several approaches are suggested, ranging from a simple spreadsheet to a **local dev UI** backed by a small database and terminal integration.  The ambition later evolves into a **dynamic workspace manager** and eventually a **local AI agent interface** capable of building and managing its own workspace.

Key aspects include:

- A user interface that offers a command palette for running tasks at the press of a button.
- Integration with AI agents via an MCP (Model Context Protocol) so that the tool itself can communicate with cloud‑based agents.
- A modular architecture: backend services (Dockerized and run locally for file access), a custom frontend, and an MCP component exposed via a public port for agent connectivity.
- Recognition that the core problem has likely been solved in various forms; therefore the project should reuse and adapt existing tools where possible rather than reinventing everything from scratch.

## Project Scope & Versions

The document outlines a phased scope for the project:

### Minimal Viable Product (Version 1)

1. **Core idea** – a tool that runs recurring tasks common to TypeScript/JavaScript/Python projects across multiple repositories.
2. **Backend** – a simple but production‑ready API backed by a local PostgreSQL database, containerized for local file access.
3. **Frontend** – initially a standalone Next.js application with a modern, playful dark‑mode UI using shadcn components and Swiss‑inspired typography.  Later it could be integrated into the larger `jagi‑oap` application.
4. **MCP** – integration with an MCP SDK (decision pending between the TypeScript and Python SDKs) so that cloud agents can connect via a public port.
5. **Complexity reduction**:
   - Support limited to Windows and a single default tech stack for early iterations.
   - Authentication with external providers is delegated to the user; the tool simply surfaces an error and link for login when needed.
   - Avoid multi‑step CLI commands within the UI; instead, provide prompts or context for an agent to walk the user through manual steps.
   - Focus on running **local development servers** initially, assuming the user has the basic setup for Python/TypeScript.

### Expansion (Version 2)

1. Add deployment features and capabilities beyond the MVP.
2. Plan integration with `jagi‑os-core` and `jagi‑oap`; decide whether to maintain a full local UI or rely on a local runtime communicating with cloud services.

### Long‑Term Vision (Version 3)

1. Support users with **no coding or environment prerequisites**.  The tool would install missing tools like VS Code automatically and set up default settings.
2. Gamified developer experience optimized for a “vibe” coding experience, including creating its own email address on `jules.solutions`.

## Architecture Components

### Backend

The backend is expected to run inside a local Docker container, providing access to the file system and a **PostgreSQL** database.  It acts as an API for the frontend and possibly for agent interactions.  The design emphasizes modularity so that parts can be reused or replaced.

### Frontend

The frontend starts as a standalone **Next.js** application written in TypeScript.  It uses **shadcn** components and aims for a **modern, futuristic** appearance with glass and hover effects.  Dark mode with purple/violet accents is the default.  Swiss typography inspires the aesthetic and the UI density is mixed.

The frontend consists of several pages:

- **Login Page** – displayed at program start; allows profile creation or login.
- **Dashboard** – lists existing projects with options to create or open projects.
- **Project Page** – offers sub‑sections for **project overview**, **actions**, **deployments**, **secrets**, **config**, and **settings**.
- **File Editor** – includes a collapsible file tree and editor for viewing or editing rendered and raw files.  Prebuilt components are to be reused where possible.
- **Settings Page** – manages global defaults and third‑party integrations.

### MCP Component

The MCP component exposes a public port to allow cloud agents (e.g., GitHub Copilot agents) to connect.  The document suggests choosing between a TypeScript SDK (aligning with the frontend) and a Python SDK (aligning with other MCP/LangGraph components).  The decision requires evaluating communication ease and potential drawbacks.

### Profiles & Security

Although users of `jagi‑oap` are already authenticated, the tool introduces **profiles** as an additional layer of security.  Sensitive data must never leave the local machine.  Suggested measures include:

- Storing credentials in the OS‑native keychain (macOS Keychain, Windows DPAPI, or Linux Secret Service).
- Combining passkeys or FIDO2 hardware tokens (e.g., YubiKey) with the tool for unlocking and user authentication.
- Using multi‑factor challenges (sudo or TOTP) for root or admin actions.
- For cloud‑to‑local communication, adopting **mutual TLS (mTLS)** with short‑lived credentials from Google IAM and Workload Identity Federation, and avoiding static secrets.

## User Flows & Pages

### Start & Profile Creation

1. **Launching the app** via a desktop icon triggers a welcome message on first use.  Users are prompted to create a profile (username, email and password) and guided through a tutorial to initialize or import their first project.
2. Users specify a path for the tool’s configuration folder (`dev‑wiz‑profile‑config.json`) which stores defaults, settings, reports and logs.
3. An optional **main dev folder** path allows background scanning for projects/services.  Projects outside this folder can be added via an **Add Project** button by providing their repository root.
4. If no project is found, users can start a new one or import from GitHub.  When creating a new project, they choose the tech stack and service/app structure; scaffolding is generated automatically using the appropriate CLI tools.
5. Defaults for commands and required environment variables are prefilled by parsing standard files such as `.git`, `package.json`, `task.yml`, `requirements.txt` **etc.** [INCOMPLETE_LIST].  The list of files to check is incomplete; see **Unresolved or Incomplete** for further action.
6. After configuring defaults, users can run a test; results are logged in the Dev Wizard folder.
7. Users then login to required third‑party services; if authentication fails, the tool surfaces a link or command to perform the login outside the tool.

### Project Page Sections

The **Project Page** contains several sub‑pages accessed via a project sidebar:

1. **Project Dashboard** – lists services within the project and offers an overview.
2. **Actions Page** – allows starting or stopping dev servers, assigning environment variables, deploying services or projects, performing Git operations (adding, committing, pushing, creating branches or issues), creating new services/apps, updating dependencies, running tests, cleaning caches, and editing or rearranging actions.  Some features are only sketched and the list may grow [INCOMPLETE_LIST].
3. **Deployments: Local & Cloud** – provides metrics on deployments (running, crashed, sleeping, failed), colour‑coded like Docker Desktop.  Each deployment has an **Inspect** button that reveals a side panel for redeploying or updating.  There is also a button to generate an up‑to‑date LLM summary of the most recent outputs of all deployments.
4. **Logs Page** – displays logs for deployments.
5. **Secrets Page** – enables adding and editing secrets and other variables, assigning them to services/apps using tables with text fields and dropdowns [INCOMPLETE_LIST].  A dev/staging/prod toggle controls environment contexts.  The tool populates `.env` files and deployment variables based on these values; this section is the single source of truth for secrets.
6. **Config Page** – offers toggles for project‑level configuration settings structured by service/app.
7. **Settings Page** – allows editing defaults and managing third‑party integrations at the project level.

### Global Pages

1. **Dashboard** – accessible from the main sidebar; lists projects with the option to create new ones.
2. **Settings** – accessible from the main sidebar; handles global defaults and integrations across all projects.

## Security & Integration Notes

The notes emphasise security and modularity:

- Profiles are required to maintain an additional security boundary.  Only password hashes are stored locally; no secrets should be synced to the cloud.  OS‑native keychains and hardware‑backed authentication are preferred over generic encryption schemes.
- For communication between cloud and local services, mTLS with **short‑lived credentials** is recommended.  Secrets should never be static; instead use Google IAM’s identity tokens or workload identity federation.
- The project philosophy is to **copy, reuse and adapt** existing open‑source tools where possible.  The backend should orchestrate and execute tools and commands rather than re‑implement them.  The design must be highly modular to integrate seamlessly with the Jagi stack.
- **Feature flags** and a feature matrix help manage modularity and track capabilities.
- Only one terminal window should be opened for pulsed commands; continuous processes run in separate tabs.
- The tool should always use **latest stable versions** of dependencies, downgrading only when necessary.

## Default Tech Stack & Architecture

The latter portion of the document contains a detailed **default tech stack** for the Jagi project, presented as a set of numbered sections.  The following headings preserve that structure:

### Default Tech Stack Based on Jagi Project

The project uses a **monorepo** managed with **pnpm workspaces**.  Major components include:

- **jagi‑oap** – a Next.js 14 App Router frontend.
- **jagi‑os‑core** – a Python LangGraph runtime.
- **MyPrebuilt/** – local cloned agent repositories.
- External agent services integrated via HTTP, MCP and LangGraph deployments.

### 1. High‑Level Architecture

The monorepo combines the frontend, the Python runtime and prebuilt agents.  External agent services reside in separate repositories and communicate via HTTP and MCP endpoints.  Agents are orchestrated by the LangGraph runtime.

### 2. Core Technology Stack

**Frontend:** Next.js 14 (App Router) with TypeScript, React Server & Client components, Supabase authentication (`@supabase/ssr`), theming via `next‑themes`.

**Runtime / Agents:** Python 3 with LangGraph; dependencies are managed via **uv** for fast resolution.

**Inter‑Process Protocols:** HTTP JSON APIs, MCP via proxied endpoints, and Streaming (SSE) for tool outputs and agent events.

**Packages & Build:** `pnpm` workspaces, TypeScript project references, ESLint (and possibly Prettier).

**Environment Management:** Node environment variables via `.env.local`; Python per‑component virtual environments managed by `uv`.  Secrets should never be exposed via `NEXT_PUBLIC_*` unless intentionally public.

### 3. Repository Layout (Key Areas)

The repository contains:

- `jagi‑oap`: UI, API routes, hooks (`src/hooks`), feature modules (`src/features`), reusable components (`src/components`).
- `jagi‑os‑core`: LangGraph runtime code and CLI usage.
- `MyPrebuilt/`: local cloned agent repositories, each with its own Python virtual environment.
- `docs` and `runbooks`: operational guides (e.g., MCP gateway runbook).
- `pm`: planning, roadmap, decisions and build logs.

### 4. Frontend Conventions

API routes live under `src/app/api/<segment>/route.ts` and act as controlled proxies to external services, injecting headers and hiding secrets.  `NEXT_PUBLIC_*` variables are reserved for non‑sensitive configuration.  Dark mode uses CSS variables rather than hardcoded colours.  Hooks follow the `useX()` abstraction pattern.  External services should be wrapped in `src/lib/<service>.ts` with a proxy route and optional hooks.  A `use<PascalService>` hook may sit in `src/hooks`.

### 5. Python LangGraph Runtime

The LangGraph runtime is activated via `Activate.ps1` on Windows.  Building and deploying use `python -m langgraph_cli build`; development uses `langgraph dev --no-browser`.  Agents integrate via a deployment list consumed by the OAP (likely via a `NEXT_PUBLIC_DEPLOYMENTS` variable).

### 6. Agent Integration Patterns

Categories include:

- **RAG Service:** proxied via `/api/rag/*` using `LANGCONNECT_API_URL`.
- **MCP Tools Agent:** called through an MCP server URL proxied at `/api/oap_mcp`.
- **Supervisor / Orchestrator:** exposed through LangGraph endpoints or custom POST tool invocation.

The guiding rule is that **browser calls** route through the **Next.js API proxy** and then to the external service for authentication, CORS handling and logging.  This rule has been revisited – see **Revised Perspectives**.

### 7. Environment & Config

Typical environment variables include `NEXT_PUBLIC_MCP_SERVER_URL`, `LANGCONNECT_API_URL`, and `ARCADE_API_TOKEN`.  When adding a new secret:
1. Add it to the server runtime configuration (.env or hosting platform).
2. Provide a placeholder in `.env.example`.
3. Avoid leaking secrets to the client bundle.

### 8. MCP Integration

Front‑end calls to MCP are proxied through `/api/oap_mcp/*`, injecting authentication headers when required.  Streaming must pass through `Content‑Type: text/event-stream`.  The tool discovery endpoint (`GET /tools`) should return a JSON list.  Additional guidance covers API design conventions, testing assumptions, logging practices, security practices, adding new apps, adding new integrations, streaming patterns, developer workflow, common pitfalls, and fit checklists.

## Special Notations

### Incomplete Lists

Whenever a list uses “etc.” to indicate that additional items are expected, the list is marked as **INCOMPLETE_LIST**.  In this document these occur in:

1. The description of files parsed for defaults (`.git`, `package.json`, `task.yml`, `requirements.txt` **etc.**).
2. The list of actions on the **Actions Page** (various Git operations **etc.**).
3. The description of UI controls on the **Secrets Page** (text fields, dropdowns **etc.**).

Each incomplete list triggers a TODO in `TODO.md` to identify missing items.

### Unresolved or Incomplete

Unresolved questions or incomplete sections are consolidated here:

1. **File Parsing Scope** – The list of files used to prefill defaults (`.git`, `package.json`, `task.yml`, `requirements.txt` etc.) is incomplete.  What other files or folders should be checked to extract relevant data?  *Source: #user-flows-pages*.
2. **Tool Selection** – Are there existing tools that already address parts of this problem?  A comprehensive survey of open‑source solutions is needed.  *Source: #vision-tool-purpose*.
3. **MCP SDK Language** – Should the MCP integration use the TypeScript SDK (aligning with the frontend) or the Python SDK (aligning with other agents)?  This decision requires exploring compatibility, ease of use and possible downsides.  *Source: #architecture-components*.
4. **Integration Strategy** – How will this tool integrate into the existing Jagi monorepo?  Options include adding it as a package under `packages/tools`, treating it as a new app, or a hybrid approach.  The impact on existing `jagi-mcp-gateway`, `jagi-oap` and `jagi-os-core` apps must be analysed.  *Source: #vision-tool-purpose*.
5. **Feature Matrix** – A feature matrix is proposed to track modular capabilities and feature flags, but the exact format and contents are undefined.  *Source: #philosophies-principles*.
6. **Multiple Sidebar UI** – Resolving the multiple sidebar issue requires design decisions; the `@GPT` prompt requests a solution (see `FOLLOWUPS.md`).  *Source: #user-flows-pages*.
7. **Security Implementation** – The document mentions GnuPG as a potential security mechanism but later dismisses it.  The final recommended approach uses OS‑native keychains and hardware tokens, yet details remain to be finalized.  *Source: #security-integration-notes*.

## Revised Perspectives

Several lines contain the arrow (`→`) symbol, indicating shifts in perspective or refined understanding.  These are presented here as **Revised Perspective** callouts, preserving both the original phrase and its evolution:

1. **Default Tech Stack Limitation** – The MVP initially restricts support to Windows and a single default tech stack → **“see todos”**.  The revision signals that the strict limitation may need to be revisited based on broader requirements.  *Source: #project-scope-versions*.
2. **Local Tool Security** – *“Local tool (super secure access)”* → *“OS‑native keychain + hardware‑backed auth”*.  The concept of a generic secure local tool evolves into a concrete recommendation to use platform keychains and hardware tokens.  *Source: #profiles-security*.
3. **Cloud–Local Communication** – *“Cloud↔Cloud↔Local communication”* → *“mTLS with short‑lived credentials”*.  This refinement clarifies that mutual TLS with rotating credentials is the preferred method for secure communication.  *Source: #profiles-security*.
4. **Routing Rule** – *“Always route browser calls”* → *“Next.js API proxy → external service (for auth, CORS, logging)”*.  The guiding rule is refined to specify that browser calls should always go through the Next.js API proxy before reaching external services.  *Source: #agent-integration-patterns*.
5. **Auth Headers** – *“Forgetting to proxy auth headers”* → *“401 from external service”*.  This callout highlights that neglecting to forward authentication headers results in unauthorized responses; it serves as a cautionary note rather than a revision.  *Source: #common-pitfalls*.

## Other Notations

### Philosophy & Principles

The author emphasizes two guiding principles:

1. **Reuse and Adapt** – Copy, reuse and adapt existing tools whenever possible.  Build only what is necessary, focusing on orchestration and integration rather than re‑implementation.
2. **Modularity** – Design the system so that components can be swapped or extended without major refactoring.  Use feature flags and a feature matrix to manage optional capabilities.

### Developer Workflow & Conventions

The later sections provide detailed conventions for adding new services, integrations, testing, logging, and security practices.  These guidelines should be referenced during implementation and are faithfully preserved in the original numbered lists.
