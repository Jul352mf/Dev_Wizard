# Dev Wizard

A unified development hub for managing projects, tasks, secrets, and deployments. Built with Next.js, Electron, and TypeScript.

## 📁 Repository Structure

```
Dev_Wizard/
├── dev_wizard/              # Main application (standalone)
│   ├── app/                # Next.js pages
│   ├── api/                # Express API server
│   ├── components/         # React components
│   ├── electron/           # Electron desktop wrapper
│   ├── config/             # Configuration examples
│   ├── docs/               # Canonical documentation
│   ├── infra/              # Infrastructure config
│   └── pm/                 # Project management & decisions
├── Dev_Wizard_canonical_docs/  # Original design documents
│   ├── PRD.md              # Product requirements
│   ├── architecture.md     # System architecture
│   ├── security_strategy.md # Security guidelines
│   ├── roadmap.md          # Project roadmap
│   └── copilot_prompt.md   # Implementation guidance
└── Initial_Brainstorm/     # Early planning documents
```

## 🚀 Quick Start

Navigate to the `dev_wizard/` directory and follow the instructions in its README:

```bash
cd dev_wizard
npm install
npm run dev        # Run as web app
npm run electron   # Run as desktop app
npm run dev:all    # Run frontend + API server
```

## 📖 Documentation

- **[Main Application README](dev_wizard/README.md)** - Installation and usage instructions
- **[PRD](Dev_Wizard_canonical_docs/PRD.md)** - Product requirements and goals
- **[Architecture](Dev_Wizard_canonical_docs/architecture.md)** - System design and components
- **[Security Strategy](Dev_Wizard_canonical_docs/security_strategy.md)** - Security guidelines
- **[Roadmap](Dev_Wizard_canonical_docs/roadmap.md)** - Development phases and milestones
- **[Implementation Decisions](dev_wizard/pm/decisions.md)** - Key architectural decisions

## ✨ Features

- 📁 **Project Management** - Discover, create, and manage development projects
- ⚡ **Task Automation** - Run builds, tests, and custom tasks
- 🔐 **Secrets Management** - Securely handle environment variables and API keys
- 🚀 **Dev Server Control** - Start, stop, and monitor development servers
- 🎨 **Modern UI** - Dark theme with purple/violet accents and glass effects
- 💻 **Cross-Platform** - Runs as web app or native desktop application

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS 4
- **Desktop**: Electron 38
- **API**: Express with TypeScript, WebSocket support
- **UI Components**: Custom components with Lucide React icons

## 🏗️ Architecture

Dev Wizard follows a modular, standalone architecture:

1. **Frontend Layer** - Next.js with App Router for modern React development
2. **Desktop Wrapper** - Electron for native OS integration and file system access
3. **API Layer** - Express server with REST endpoints and WebSocket for real-time updates
4. **Data Layer** - PostgreSQL (planned) with SQLite fallback for development

See [architecture.md](Dev_Wizard_canonical_docs/architecture.md) for detailed design.

## 🔒 Security

- Designed for OS keychain integration (macOS Keychain, Windows DPAPI, Linux Secret Service)
- No hardcoded secrets or credentials
- Environment variable-based configuration
- mTLS support for agent communication (planned)

See [security_strategy.md](Dev_Wizard_canonical_docs/security_strategy.md) for complete guidelines.

## 📋 Roadmap

The project follows a phased development approach:

- ✅ **Phase 1**: Foundation & scaffolding (Complete)
- ✅ **Phase 2**: Core pages & navigation (Complete)
- ✅ **Phase 3**: Backend API skeleton (Complete)
- 🚧 **Phase 4**: Database integration (In Progress)
- 📅 **Phase 5**: Project scanning & environment detection (Planned)
- 📅 **Phase 6**: Task execution & dev server management (Planned)
- 📅 **Phase 7**: MCP integration (Planned)

See [roadmap.md](Dev_Wizard_canonical_docs/roadmap.md) for detailed milestones.

## 🤝 Contributing

This is currently a personal project. Implementation follows the canonical documentation strictly.

## 📄 License

Proprietary - All rights reserved

## 🙏 Acknowledgments

Built following the specifications in `Dev_Wizard_canonical_docs/` and inspired by modern development tools.
