import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = process.env.DATABASE_PATH || path.join(__dirname, '../../dev_wizard.db');

// Ensure database directory exists
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(DB_PATH);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database schema
export function initializeDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      path TEXT NOT NULL UNIQUE,
      status TEXT DEFAULT 'stopped',
      port INTEGER,
      lastModified TEXT NOT NULL,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      projectId INTEGER NOT NULL,
      name TEXT NOT NULL,
      command TEXT NOT NULL,
      status TEXT DEFAULT 'idle',
      lastRun TEXT,
      duration INTEGER DEFAULT 0,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS secrets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT NOT NULL UNIQUE,
      value TEXT NOT NULL,
      description TEXT,
      environment TEXT DEFAULT 'development',
      lastModified TEXT NOT NULL,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS project_files (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      projectId INTEGER NOT NULL,
      filename TEXT NOT NULL,
      detected BOOLEAN DEFAULT 1,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE CASCADE
    );
  `);

  console.log('✓ Database initialized successfully');
}

export interface Project {
  id?: number;
  name: string;
  type: string;
  path: string;
  status: string;
  port: number | null;
  lastModified: string;
}

export interface Task {
  id?: number;
  projectId: number;
  name: string;
  command: string;
  status: string;
  lastRun: string | null;
  duration: number;
}

export interface Secret {
  id?: number;
  key: string;
  value: string;
  description: string;
  environment: string;
  lastModified: string;
}

// Project operations
export const projectDb = {
  getAll: () => {
    return db.prepare('SELECT * FROM projects ORDER BY lastModified DESC').all() as Project[];
  },

  getById: (id: number) => {
    return db.prepare('SELECT * FROM projects WHERE id = ?').get(id) as Project | undefined;
  },

  getByPath: (path: string) => {
    return db.prepare('SELECT * FROM projects WHERE path = ?').get(path) as Project | undefined;
  },

  create: (project: Omit<Project, 'id'>) => {
    const stmt = db.prepare(`
      INSERT INTO projects (name, type, path, status, port, lastModified)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      project.name,
      project.type,
      project.path,
      project.status,
      project.port,
      project.lastModified
    );
    return result.lastInsertRowid;
  },

  update: (id: number, updates: Partial<Project>) => {
    const fields = Object.keys(updates)
      .filter((key) => key !== 'id')
      .map((key) => `${key} = ?`)
      .join(', ');
    const values = Object.keys(updates)
      .filter((key) => key !== 'id')
      .map((key) => (updates as any)[key]);

    const stmt = db.prepare(`UPDATE projects SET ${fields} WHERE id = ?`);
    return stmt.run(...values, id);
  },

  delete: (id: number) => {
    return db.prepare('DELETE FROM projects WHERE id = ?').run(id);
  },
};

// Task operations
export const taskDb = {
  getAll: (projectId?: number) => {
    if (projectId) {
      return db.prepare('SELECT * FROM tasks WHERE projectId = ? ORDER BY createdAt DESC').all(projectId) as Task[];
    }
    return db.prepare('SELECT * FROM tasks ORDER BY createdAt DESC').all() as Task[];
  },

  getById: (id: number) => {
    return db.prepare('SELECT * FROM tasks WHERE id = ?').get(id) as Task | undefined;
  },

  create: (task: Omit<Task, 'id'>) => {
    const stmt = db.prepare(`
      INSERT INTO tasks (projectId, name, command, status, lastRun, duration)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      task.projectId,
      task.name,
      task.command,
      task.status,
      task.lastRun,
      task.duration
    );
    return result.lastInsertRowid;
  },

  update: (id: number, updates: Partial<Task>) => {
    const fields = Object.keys(updates)
      .filter((key) => key !== 'id')
      .map((key) => `${key} = ?`)
      .join(', ');
    const values = Object.keys(updates)
      .filter((key) => key !== 'id')
      .map((key) => (updates as any)[key]);

    const stmt = db.prepare(`UPDATE tasks SET ${fields} WHERE id = ?`);
    return stmt.run(...values, id);
  },

  delete: (id: number) => {
    return db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
  },
};

// Secret operations
export const secretDb = {
  getAll: () => {
    return db.prepare('SELECT * FROM secrets ORDER BY key ASC').all() as Secret[];
  },

  getById: (id: number) => {
    return db.prepare('SELECT * FROM secrets WHERE id = ?').get(id) as Secret | undefined;
  },

  getByKey: (key: string) => {
    return db.prepare('SELECT * FROM secrets WHERE key = ?').get(key) as Secret | undefined;
  },

  create: (secret: Omit<Secret, 'id'>) => {
    const stmt = db.prepare(`
      INSERT INTO secrets (key, value, description, environment, lastModified)
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      secret.key,
      secret.value,
      secret.description,
      secret.environment,
      secret.lastModified
    );
    return result.lastInsertRowid;
  },

  update: (id: number, updates: Partial<Secret>) => {
    const fields = Object.keys(updates)
      .filter((key) => key !== 'id')
      .map((key) => `${key} = ?`)
      .join(', ');
    const values = Object.keys(updates)
      .filter((key) => key !== 'id')
      .map((key) => (updates as any)[key]);

    const stmt = db.prepare(`UPDATE secrets SET ${fields} WHERE id = ?`);
    return stmt.run(...values, id);
  },

  delete: (id: number) => {
    return db.prepare('DELETE FROM secrets WHERE id = ?').run(id);
  },
};

export default db;
