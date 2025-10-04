import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import path from 'path';
import os from 'os';
import { initializeDatabase, projectDb, taskDb, secretDb } from './database';
import { loadFeatureFlags, getEnabledFeatures } from './lib/config/loadFeatureFlags';
import { initializeProjectScanning, scanDirectory, watchWorkspace } from './scanner';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

const PORT = process.env.API_PORT || 3001;
const WORKSPACE_PATH = process.env.WORKSPACE_PATH || path.join(os.homedir(), 'workspace');

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database and scanner
initializeDatabase();

// Initialize with some sample data if database is empty
const existingProjects = projectDb.getAll();
if (existingProjects.length === 0) {
  console.log('Seeding database with sample data...');
  
  // Add sample projects
  const sampleProjects = [
    {
      name: 'jagi-oap',
      type: 'Next.js',
      path: '/workspace/jagi-oap',
      status: 'running',
      port: 3000,
      lastModified: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      name: 'dev-wizard',
      type: 'Next.js + Electron',
      path: '/workspace/dev-wizard',
      status: 'stopped',
      port: null,
      lastModified: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      name: 'langgraph-agent',
      type: 'Python',
      path: '/workspace/langgraph-agent',
      status: 'stopped',
      port: null,
      lastModified: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  sampleProjects.forEach((project) => {
    projectDb.create(project);
  });

  // Add sample tasks
  const sampleTasks = [
    {
      projectId: 1,
      name: 'Build',
      command: 'npm run build',
      status: 'completed',
      lastRun: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      duration: 45,
    },
    {
      projectId: 1,
      name: 'Test',
      command: 'npm run test',
      status: 'running',
      lastRun: new Date().toISOString(),
      duration: 12,
    },
    {
      projectId: 2,
      name: 'Lint',
      command: 'npm run lint',
      status: 'idle',
      lastRun: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      duration: 5,
    },
  ];

  sampleTasks.forEach((task) => {
    taskDb.create(task);
  });

  // Add sample secrets
  const sampleSecrets = [
    {
      key: 'DATABASE_URL',
      value: 'postgresql://localhost:5432/dev_wizard',
      description: 'PostgreSQL connection string',
      environment: 'development',
      lastModified: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      key: 'NEXT_PUBLIC_API_URL',
      value: 'http://localhost:3001',
      description: 'API endpoint URL',
      environment: 'development',
      lastModified: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      key: 'OPENAI_API_KEY',
      value: 'sk-...',
      description: 'OpenAI API authentication key',
      environment: 'production',
      lastModified: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      key: 'GITHUB_TOKEN',
      value: 'ghp_...',
      description: 'GitHub personal access token',
      environment: 'development',
      lastModified: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  sampleSecrets.forEach((secret) => {
    secretDb.create(secret);
  });

  console.log('✓ Database seeded with sample data');
}

// Routes
app.get('/api/health', (req, res) => {
  const projects = projectDb.getAll();
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    database: 'connected',
    projects: projects.length
  });
});

// Project endpoints
app.get('/api/projects', (req, res) => {
  const projects = projectDb.getAll();
  res.json({ projects });
});

app.get('/api/projects/:id', (req, res) => {
  const project = projectDb.getById(parseInt(req.params.id));
  if (project) {
    res.json({ project });
  } else {
    res.status(404).json({ error: 'Project not found' });
  }
});

app.post('/api/projects', (req, res) => {
  const { name, type, path } = req.body;
  
  // Check if project already exists
  const existing = projectDb.getByPath(path);
  if (existing) {
    return res.status(409).json({ error: 'Project already exists at this path' });
  }

  const projectId = projectDb.create({
    name,
    type,
    path,
    status: 'stopped',
    port: null,
    lastModified: new Date().toISOString(),
  });
  
  const newProject = projectDb.getById(Number(projectId));
  res.status(201).json({ project: newProject });
});

app.put('/api/projects/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const project = projectDb.getById(id);
  
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  projectDb.update(id, {
    ...req.body,
    lastModified: new Date().toISOString(),
  });

  const updated = projectDb.getById(id);
  res.json({ project: updated });
});

app.delete('/api/projects/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const project = projectDb.getById(id);
  
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  projectDb.delete(id);
  res.status(204).send();
});

// Task endpoints
app.get('/api/tasks', (req, res) => {
  const { projectId } = req.query;
  const tasks = projectId 
    ? taskDb.getAll(parseInt(projectId as string))
    : taskDb.getAll();
  res.json({ tasks });
});

app.get('/api/tasks/:id', (req, res) => {
  const task = taskDb.getById(parseInt(req.params.id));
  if (task) {
    res.json({ task });
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

app.post('/api/tasks', (req, res) => {
  const { projectId, name, command } = req.body;
  
  const taskId = taskDb.create({
    projectId,
    name,
    command,
    status: 'idle',
    lastRun: null,
    duration: 0,
  });

  const newTask = taskDb.getById(Number(taskId));
  res.status(201).json({ task: newTask });
});

app.put('/api/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const task = taskDb.getById(id);
  
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  taskDb.update(id, req.body);
  const updated = taskDb.getById(id);
  res.json({ task: updated });
});

app.delete('/api/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const task = taskDb.getById(id);
  
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  taskDb.delete(id);
  res.status(204).send();
});

// Secret endpoints
app.get('/api/secrets', (req, res) => {
  const secrets = secretDb.getAll().map((secret) => ({
    ...secret,
    value: '***', // Mask the actual value
  }));
  res.json({ secrets });
});

app.get('/api/secrets/:id', (req, res) => {
  const secret = secretDb.getById(parseInt(req.params.id));
  if (secret) {
    res.json({ 
      secret: {
        ...secret,
        value: '***', // Mask the actual value
      }
    });
  } else {
    res.status(404).json({ error: 'Secret not found' });
  }
});

app.post('/api/secrets', (req, res) => {
  const { key, value, description, environment } = req.body;
  
  // Check if secret already exists
  const existing = secretDb.getByKey(key);
  if (existing) {
    return res.status(409).json({ error: 'Secret with this key already exists' });
  }

  const secretId = secretDb.create({
    key,
    value,
    description: description || '',
    environment: environment || 'development',
    lastModified: new Date().toISOString(),
  });

  const newSecret = secretDb.getById(Number(secretId));
  res.status(201).json({ 
    secret: {
      ...newSecret,
      value: '***',
    }
  });
});

app.put('/api/secrets/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const secret = secretDb.getById(id);
  
  if (!secret) {
    return res.status(404).json({ error: 'Secret not found' });
  }

  secretDb.update(id, {
    ...req.body,
    lastModified: new Date().toISOString(),
  });

  const updated = secretDb.getById(id);
  res.json({ 
    secret: {
      ...updated,
      value: '***',
    }
  });
});

app.delete('/api/secrets/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const secret = secretDb.getById(id);
  
  if (!secret) {
    return res.status(404).json({ error: 'Secret not found' });
  }

  secretDb.delete(id);
  res.status(204).send();
});

// Feature flags endpoint
app.get('/api/flags', async (req, res) => {
  try {
    const flags = await loadFeatureFlags();
    const enabled = await getEnabledFeatures();
    res.json({ flags, enabled });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error loading flags';
    res.status(500).json({ error: msg });
  }
});

// Scanner endpoints
app.post('/api/scan', async (req, res) => {
  const { path: scanPath } = req.body;
  const targetPath = scanPath || WORKSPACE_PATH;

  try {
    await initializeProjectScanning(targetPath);
    const projects = projectDb.getAll();
    res.json({ 
      message: 'Scan completed successfully',
      projects 
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Scan failed';
    res.status(500).json({ error: msg });
  }
});

app.post('/api/scan/directory', (req, res) => {
  const { path: dirPath } = req.body;

  if (!dirPath) {
    return res.status(400).json({ error: 'Directory path is required' });
  }

  try {
    const result = scanDirectory(dirPath);
    if (result) {
      res.json({ project: result });
    } else {
      res.status(404).json({ error: 'No project found at this path' });
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Directory scan failed';
    res.status(500).json({ error: msg });
  }
});

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('WebSocket client connected');
  
  ws.on('message', (message) => {
    console.log('Received:', message.toString());
    // Echo back for now
    ws.send(JSON.stringify({ type: 'echo', data: message.toString() }));
  });
  
  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
  
  // Send initial connection message
  ws.send(JSON.stringify({ type: 'connected', timestamp: new Date().toISOString() }));
});

// Start server
server.listen(PORT, async () => {
  console.log(`✓ API server running on http://localhost:${PORT}`);
  console.log(`✓ WebSocket server running on ws://localhost:${PORT}`);
  console.log(`✓ Database initialized`);
  console.log(`✓ Workspace path: ${WORKSPACE_PATH}`);
  
  // Start watching workspace if it exists
  const watcher = watchWorkspace(WORKSPACE_PATH, () => {
    // Notify connected WebSocket clients about project changes
    wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(JSON.stringify({ 
          type: 'project_changed',
          timestamp: new Date().toISOString()
        }));
      }
    });
  });

  if (watcher) {
    console.log(`✓ Watching workspace for changes`);
  }
});
