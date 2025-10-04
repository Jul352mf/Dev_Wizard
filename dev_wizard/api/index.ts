import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

const PORT = process.env.API_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Mock data
const mockProjects = [
  {
    id: 1,
    name: 'jagi-oap',
    type: 'Next.js',
    path: '/workspace/jagi-oap',
    status: 'running',
    port: 3000,
    lastModified: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    name: 'dev-wizard',
    type: 'Next.js + Electron',
    path: '/workspace/dev-wizard',
    status: 'stopped',
    port: null,
    lastModified: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    name: 'langgraph-agent',
    type: 'Python',
    path: '/workspace/langgraph-agent',
    status: 'stopped',
    port: null,
    lastModified: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const mockTasks = [
  {
    id: 1,
    projectId: 1,
    name: 'Build',
    command: 'npm run build',
    status: 'completed',
    lastRun: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    duration: 45,
  },
  {
    id: 2,
    projectId: 1,
    name: 'Test',
    command: 'npm run test',
    status: 'running',
    lastRun: new Date().toISOString(),
    duration: 12,
  },
  {
    id: 3,
    projectId: 2,
    name: 'Lint',
    command: 'npm run lint',
    status: 'idle',
    lastRun: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    duration: 5,
  },
];

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/projects', (req, res) => {
  res.json({ projects: mockProjects });
});

app.get('/api/projects/:id', (req, res) => {
  const project = mockProjects.find((p) => p.id === parseInt(req.params.id));
  if (project) {
    res.json({ project });
  } else {
    res.status(404).json({ error: 'Project not found' });
  }
});

app.get('/api/tasks', (req, res) => {
  const { projectId } = req.query;
  let tasks = mockTasks;
  
  if (projectId) {
    tasks = tasks.filter((t) => t.projectId === parseInt(projectId as string));
  }
  
  res.json({ tasks });
});

app.post('/api/projects', (req, res) => {
  const { name, type, path } = req.body;
  const newProject = {
    id: mockProjects.length + 1,
    name,
    type,
    path,
    status: 'stopped',
    port: null,
    lastModified: new Date().toISOString(),
  };
  mockProjects.push(newProject);
  res.status(201).json({ project: newProject });
});

app.post('/api/tasks', (req, res) => {
  const { projectId, name, command } = req.body;
  const newTask = {
    id: mockTasks.length + 1,
    projectId,
    name,
    command,
    status: 'idle' as const,
    lastRun: new Date().toISOString(),
    duration: 0,
  };
  mockTasks.push(newTask as any);
  res.status(201).json({ task: newTask });
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
server.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
  console.log(`WebSocket server running on ws://localhost:${PORT}`);
});
