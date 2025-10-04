import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import chokidar from 'chokidar';
import { projectDb, Project } from './database';

// Project type detection patterns
const PROJECT_PATTERNS = {
  'Next.js': ['package.json', 'next.config.js', 'next.config.ts', 'next.config.mjs'],
  'React': ['package.json', 'src/App.jsx', 'src/App.tsx'],
  'Node.js': ['package.json', 'index.js', 'server.js', 'app.js'],
  'Python': ['requirements.txt', 'pyproject.toml', 'setup.py'],
  'Django': ['manage.py', 'requirements.txt'],
  'Flask': ['app.py', 'requirements.txt'],
  'LangGraph': ['langgraph.json'],
  'Docker': ['Dockerfile', 'docker-compose.yml', 'compose.yaml'],
  'Rust': ['Cargo.toml'],
  'Go': ['go.mod'],
};

// Common project indicators
const PROJECT_INDICATORS = [
  '.git',
  'package.json',
  'pyproject.toml',
  'requirements.txt',
  'Cargo.toml',
  'go.mod',
  'pom.xml',
  'build.gradle',
  'Makefile',
  'mise.toml',
  'Taskfile.yml',
  'devenv.nix',
  '.envrc',
  'docker-compose.yml',
  'langgraph.json',
];

export interface ScanResult {
  path: string;
  name: string;
  type: string;
  detectedFiles: string[];
}

/**
 * Detect project type based on files present in directory
 */
function detectProjectType(projectPath: string): { type: string; detectedFiles: string[] } {
  const detectedFiles: string[] = [];
  let projectType = 'Unknown';

  // Check for specific project types
  for (const [type, patterns] of Object.entries(PROJECT_PATTERNS)) {
    const matches = patterns.filter((pattern) => {
      const filePath = path.join(projectPath, pattern);
      const exists = fs.existsSync(filePath);
      if (exists) {
        detectedFiles.push(pattern);
      }
      return exists;
    });

    if (matches.length > 0) {
      projectType = type;
      break;
    }
  }

  // Enhanced detection for specific frameworks
  if (projectType === 'Node.js' || projectType === 'Unknown') {
    const packageJsonPath = path.join(projectPath, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      try {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
        const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

        if (deps.next) {
          projectType = 'Next.js';
          if (deps.electron) {
            projectType = 'Next.js + Electron';
          }
        } else if (deps.react) {
          projectType = 'React';
        } else if (deps.express || deps.fastify || deps.koa) {
          projectType = 'Node.js';
        }
      } catch (error) {
        console.error(`Error reading package.json in ${projectPath}:`, error);
      }
    }
  }

  return { type: projectType, detectedFiles };
}

/**
 * Check if directory is a valid project
 */
function isProject(dirPath: string): boolean {
  return PROJECT_INDICATORS.some((indicator) => {
    const indicatorPath = path.join(dirPath, indicator);
    return fs.existsSync(indicatorPath);
  });
}

/**
 * Scan a single directory for project information
 */
export function scanDirectory(dirPath: string): ScanResult | null {
  if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
    return null;
  }

  if (!isProject(dirPath)) {
    return null;
  }

  const { type, detectedFiles } = detectProjectType(dirPath);
  const name = path.basename(dirPath);

  return {
    path: dirPath,
    name,
    type,
    detectedFiles,
  };
}

/**
 * Scan workspace directory for all projects
 */
export async function scanWorkspace(workspacePath: string): Promise<ScanResult[]> {
  if (!fs.existsSync(workspacePath)) {
    console.warn(`Workspace path does not exist: ${workspacePath}`);
    return [];
  }

  const projects: ScanResult[] = [];

  try {
    const entries = fs.readdirSync(workspacePath, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isDirectory()) {
        continue;
      }

      // Skip common non-project directories
      if (['node_modules', '.git', 'dist', 'build', '__pycache__', '.venv', 'venv'].includes(entry.name)) {
        continue;
      }

      const projectPath = path.join(workspacePath, entry.name);
      const scanResult = scanDirectory(projectPath);

      if (scanResult) {
        projects.push(scanResult);
        console.log(`✓ Found project: ${scanResult.name} (${scanResult.type})`);
      }
    }
  } catch (error) {
    console.error(`Error scanning workspace: ${error}`);
  }

  return projects;
}

/**
 * Sync scanned projects to database
 */
export function syncProjectsToDatabase(scanResults: ScanResult[]): void {
  const existingProjects = projectDb.getAll();
  const existingPaths = new Set(existingProjects.map((p) => p.path));

  for (const result of scanResults) {
    if (!existingPaths.has(result.path)) {
      // Add new project
      projectDb.create({
        name: result.name,
        type: result.type,
        path: result.path,
        status: 'stopped',
        port: null,
        lastModified: new Date().toISOString(),
      });
      console.log(`✓ Added project to database: ${result.name}`);
    } else {
      // Update existing project type if changed
      const existing = projectDb.getByPath(result.path);
      if (existing && existing.type !== result.type) {
        projectDb.update(existing.id!, {
          type: result.type,
          lastModified: new Date().toISOString(),
        });
        console.log(`✓ Updated project type: ${result.name} -> ${result.type}`);
      }
    }
  }
}

/**
 * Watch workspace for changes
 */
export function watchWorkspace(workspacePath: string, onProjectChange?: () => void): ReturnType<typeof chokidar.watch> | null {
  if (!fs.existsSync(workspacePath)) {
    console.warn(`Cannot watch non-existent workspace: ${workspacePath}`);
    return null;
  }

  console.log(`👀 Watching workspace: ${workspacePath}`);

  const watcher = chokidar.watch(workspacePath, {
    ignored: /(^|[\/\\])(node_modules|\.git|dist|build|__pycache__|\.venv|venv)([\/\\]|$)/,
    persistent: true,
    ignoreInitial: true,
    depth: 2,
  });

  watcher.on('addDir', async (dirPath) => {
    const scanResult = scanDirectory(dirPath);
    if (scanResult) {
      const existing = projectDb.getByPath(scanResult.path);
      if (!existing) {
        projectDb.create({
          name: scanResult.name,
          type: scanResult.type,
          path: scanResult.path,
          status: 'stopped',
          port: null,
          lastModified: new Date().toISOString(),
        });
        console.log(`✓ New project detected: ${scanResult.name}`);
        if (onProjectChange) onProjectChange();
      }
    }
  });

  watcher.on('unlinkDir', async (dirPath: string) => {
    const project = projectDb.getByPath(dirPath);
    if (project) {
      projectDb.delete(project.id!);
      console.log(`✓ Project removed: ${project.name}`);
      if (onProjectChange) onProjectChange();
    }
  });

  return watcher;
}

/**
 * Initialize project scanning
 */
export async function initializeProjectScanning(workspacePath: string): Promise<void> {
  console.log(`🔍 Scanning workspace: ${workspacePath}`);
  const scanResults = await scanWorkspace(workspacePath);
  console.log(`✓ Found ${scanResults.length} projects`);

  syncProjectsToDatabase(scanResults);
  console.log('✓ Projects synced to database');
}
