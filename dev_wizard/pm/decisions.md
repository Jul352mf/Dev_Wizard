# Implementation Decisions

This document records key decisions made during the implementation of the Dev Wizard project. It serves as a reference for understanding why certain choices were made and documents adaptations from the canonical documentation.

## Repository Layout

**Decision**: Implement Dev Wizard as a standalone application at the repository root in the `dev_wizard/` directory.

**Rationale**: The canonical documentation originally assumed a monorepo layout, but the updated architecture document explicitly states that Dev Wizard should be a standalone repository. This simplifies:
- Release cadence and versioning
- Contributor workflow
- Dependency management
- CI/CD pipelines

**Reference**: `Dev_Wizard_canonical_docs/architecture.md` - Repository strategy section

## Technology Stack

### Frontend Framework

**Decision**: Next.js 15 with TypeScript and App Router

**Rationale**:
- Modern React framework with excellent TypeScript support
- Server and client component model for optimal performance
- Built-in routing and API routes
- Static export capability for Electron packaging
- Aligns with the PRD requirement for Next.js

**Reference**: `Dev_Wizard_canonical_docs/copilot_prompt.md` and `PRD.md`

### Desktop Wrapper

**Decision**: Electron 38 for desktop application

**Rationale**:
- Cross-platform support (Windows, macOS, Linux)
- Native file system access required for project scanning
- OS keychain integration capabilities
- Industry standard for desktop development tools
- Aligns with PRD requirements

**Reference**: `Dev_Wizard_canonical_docs/PRD.md` - Cross-platform support

### Styling

**Decision**: Tailwind CSS 4 with custom dark theme

**Rationale**:
- Utility-first approach for rapid development
- Excellent TypeScript/Next.js integration
- Easy to implement dark mode with purple/violet accents as specified
- Supports glass effects and modern UI patterns
- Swiss-inspired typography can be implemented with custom fonts

**Reference**: `Dev_Wizard_canonical_docs/PRD.md` - UI requirements, `Initial_Brainstorm/` - Design specifications

### UI Components

**Decision**: Custom components instead of shadcn/ui

**Rationale**:
- Network restrictions prevented downloading shadcn/ui registry
- Custom components provide full control over styling
- Implemented using Lucide React icons and class-variance-authority
- Maintains the modern, glass-effect UI specified in the PRD

**Alternative Considered**: shadcn/ui (blocked by network access)

## Backend Architecture

### API Framework

**Decision**: Express with TypeScript

**Rationale**:
- Simple, proven framework for REST APIs
- Excellent TypeScript support
- Easy to add WebSocket support
- Aligns with canonical docs preference for TypeScript
- Service boundary is clear for future Python microservice integration

**Reference**: `Dev_Wizard_canonical_docs/copilot_prompt.md` - Backend skeleton requirements

### Database Strategy

**Decision**: Mock data for MVP, with PostgreSQL-first design and SQLite fallback planned

**Rationale**:
- Mock data allows rapid prototyping and UI development
- Architecture document specifies PostgreSQL-first approach
- SQLite fallback for local development reduces setup friction
- Clear migration path from mock to real database

**Reference**: `Dev_Wizard_canonical_docs/architecture.md` - Database and storage section

**Next Steps**: Implement database layer with PostgreSQL in Docker Compose and SQLite fallback

## API Design

### Port Configuration

**Decision**: Next.js on port 3000, API on port 3001

**Rationale**:
- Standard Next.js development port
- Separates concerns between frontend and API
- Allows independent scaling
- Easy to configure for different environments

### Mock Data Approach

**Decision**: In-memory mock data with realistic timestamps and relationships

**Rationale**:
- Faster development cycle
- No database setup required for initial testing
- Realistic data structure for UI development
- Easy to replace with real database layer

## Electron Integration

### Development Mode

**Decision**: Electron loads Next.js dev server (localhost:3000) in development

**Rationale**:
- Hot module replacement during development
- Faster iteration cycle
- DevTools available for debugging

### Production Mode

**Decision**: Static export with file:// protocol

**Rationale**:
- Self-contained application
- No external server required
- Follows Next.js best practices for Electron apps

**Configuration**: `next.config.ts` with `output: 'export'`

## Build and Development Workflow

### Package Manager

**Decision**: npm (not pnpm, yarn, or bun)

**Rationale**:
- Standard package manager, universally available
- Canonical docs mention pnpm workspaces for monorepo, but we're standalone
- Simpler for contributors
- No workspace complexity needed

**Note**: Canonical docs originally assumed pnpm workspaces for monorepo. Adapted to npm for standalone layout.

### Scripts Organization

**Decision**: Separate scripts for web, electron, and API modes

**Rationale**:
- Clear separation of concerns
- Users can run components independently
- `dev:all` script for running everything concurrently
- Follows Unix philosophy of composable tools

## Security Considerations (MVP)

### Secrets Handling

**Decision**: Placeholder approach with environment variables, no hardcoded secrets

**Rationale**:
- Security strategy document specifies OS keychain integration
- MVP focuses on UI and workflow, not production security
- Clear path to implement keychain integration later

**Reference**: `Dev_Wizard_canonical_docs/security_strategy.md`

**Next Steps**: Implement OS keychain adapters (macOS Keychain, Windows DPAPI, Linux Secret Service)

## Adaptations from Canonical Docs

### Monorepo to Standalone

**Original Assumption**: Canonical docs referenced monorepo layout with `apps/` folder and pnpm workspaces

**Adaptation**: Created standalone structure at repo root with clear module boundaries

**Rationale**: Repository strategy section explicitly states standalone approach for faster iteration and clearer ownership

**Reference**: `Dev_Wizard_canonical_docs/architecture.md` - Repository strategy

### Configuration Files Location

**Original Assumption**: `config/features.json` and `infra/environments.yaml` at monorepo root

**Adaptation**: These files will be created at `dev_wizard/config/` and `dev_wizard/infra/`

**Rationale**: Self-contained application with all configuration in its directory

**Next Steps**: Create example configuration files

### MCP Integration

**Decision**: Deferred to Phase 2

**Rationale**: 
- Focus MVP on core UI and workflow
- MCP integration requires additional dependencies and testing
- Clear service boundary allows easy addition later

**Reference**: `Dev_Wizard_canonical_docs/architecture.md` - MCP proxy specification

**Next Steps**: Implement MCP SDK integration with TypeScript or Python service

## Testing Strategy

**Decision**: Manual testing for MVP, automated tests to be added

**Rationale**:
- Focus on rapid feature development
- Manual testing validates UI/UX directly
- Test infrastructure can be added incrementally

**Next Steps**: Add unit tests for API endpoints, integration tests for project scanning

## UI/UX Decisions

### Color Scheme

**Decision**: Dark theme with purple (#8B5CF6) and violet (#7C3AED) gradients

**Rationale**: 
- Specified in brainstorm documents
- Modern, developer-friendly aesthetic
- Reduces eye strain
- Distinguishes Dev Wizard from other tools

**Reference**: `Initial_Brainstorm/Dev Wizard Brainstorm.md` - UI specifications

### Navigation Pattern

**Decision**: Single left sidebar with nested sections

**Rationale**:
- Avoids multiple sidebar confusion
- Clean, uncluttered interface
- Follows Material Design guidelines
- Specified in PRD and architecture docs

**Reference**: `Dev_Wizard_canonical_docs/PRD.md` - User experience & UI section

### Glass Effects

**Decision**: Subtle glass morphism with backdrop-filter and low opacity

**Rationale**:
- Modern, playful aesthetic as specified
- Not overwhelming or distracting
- Enhances depth perception
- Specified in brainstorm documents

## Outstanding Questions

### Database Selection

**Question**: PostgreSQL in Docker vs embedded SQLite for MVP?

**Current Status**: Mock data, planning PostgreSQL with SQLite fallback

**Next Steps**: Create Docker Compose file with PostgreSQL setup

### MCP SDK Language

**Question**: TypeScript vs Python for MCP integration?

**Analysis**:
- TypeScript: Better frontend integration, shared types
- Python: Mature LangGraph ecosystem, Configu libraries

**Decision**: Defer until Phase 2, evaluate based on integration complexity

**Reference**: `Dev_Wizard_canonical_docs/PRD.md` - Open questions section

### Feature Flags

**Question**: Implement feature flag system in MVP or defer?

**Current Status**: Deferred to Phase 2

**Rationale**: Focus on core features first, add toggles when multiple modes exist

**Next Steps**: Create `config/features.json` schema, implement loader

## Summary

The implementation follows the canonical documentation closely while adapting to the standalone repository structure. Key decisions prioritize:

1. Rapid development with modern, proven technologies
2. Clear service boundaries for future expansion
3. User experience matching the PRD specifications
4. Security-first design with pragmatic MVP approach
5. Cross-platform compatibility from day one

All decisions are reversible and documented for future reference.
