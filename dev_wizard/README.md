# Dev Wizard

A unified development hub for managing projects, tasks, secrets, and deployments. Dev Wizard provides a modern, intuitive interface for developers to streamline their local development workflow.

## Features

- 📁 **Project Management** - Discover, create, and import projects from your workspace
- ⚡ **Task Automation** - Run builds, tests, and custom tasks with ease
- 🔐 **Secrets Management** - Securely manage environment variables and API keys
- 🚀 **Dev Server Control** - Start, stop, and monitor development servers
- 🎨 **Modern UI** - Beautiful dark theme with purple/violet accents and glass effects

## Tech Stack

- **Frontend**: Next.js 15 with TypeScript, React 19, Tailwind CSS 4
- **Desktop**: Electron 38 for cross-platform desktop application
- **API**: Express with TypeScript for backend services
- **UI Components**: Custom components with Lucide React icons
- **Real-time**: WebSocket support for live updates

## Getting Started

### Prerequisites

- Node.js 20.x or later
- npm 10.x or later

### Installation

```bash
npm install
```

### Running the Application

#### Web Mode

Run the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

#### Desktop Mode (Electron)

Run the application as a desktop app:

```bash
npm run electron
```

#### With API Server

Run both the frontend and API server:

```bash
npm run dev:all
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- API: [http://localhost:3001](http://localhost:3001)

## Building for Production

### Desktop Application

```bash
npm run electron:build
```

Distributables will be created in the `release/` directory.

## Project Structure

```
dev_wizard/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Dashboard page
│   ├── projects/          # Projects pages
│   ├── actions/           # Actions page
│   ├── secrets/           # Secrets management page
│   └── settings/          # Settings page
├── api/                   # Express API server
├── components/            # React components
├── electron/             # Electron main process
├── lib/                 # Utility functions
├── config/             # Configuration files
├── docs/               # Documentation
└── pm/                 # Project management & decisions
```

## API Endpoints

- `GET /api/projects` - List all projects
- `GET /api/projects/:id` - Get project details
- `POST /api/projects` - Create new project
- `GET /api/tasks` - List all tasks
- `POST /api/tasks` - Create new task
- `GET /api/health` - Health check

## Documentation

- [Architecture](docs/architecture.md) - System architecture and design decisions
- [PRD](docs/PRD.md) - Product requirements document
- [Security Strategy](docs/security_strategy.md) - Security guidelines
- [Roadmap](docs/roadmap.md) - Project roadmap and planned features

## Development

### Available Scripts

- `npm run dev` - Start Next.js development server
- `npm run api:dev` - Start API development server
- `npm run electron` - Run Electron development mode
- `npm run electron:build` - Build Electron application
- `npm run dev:all` - Run frontend and API concurrently
- `npm run lint` - Run ESLint

## License

Proprietary - All rights reserved
