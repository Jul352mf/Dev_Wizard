import { Play, Square, RotateCw, Terminal, Settings, Activity } from 'lucide-react';

export function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ];
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = {
    id: id,
    name: 'jagi-oap',
    type: 'Next.js',
    path: '/workspace/jagi-oap',
    status: 'running',
    port: 3000,
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
              {project.name}
            </h1>
            <p className="text-slate-400">{project.type} • {project.path}</p>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                project.status === 'running' ? 'bg-green-400 animate-pulse' : 'bg-slate-600'
              }`}
            />
            <span className="text-sm text-slate-400 capitalize">{project.status}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-8">
        <button className="flex items-center gap-2 px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600 transition-colors">
          <Play className="w-4 h-4" />
          Start
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition-colors">
          <Square className="w-4 h-4" />
          Stop
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors">
          <RotateCw className="w-4 h-4" />
          Restart
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
          <Terminal className="w-4 h-4" />
          Terminal
        </button>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Server Info */}
        <div className="glass rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-400" />
            Server Status
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-400">Status:</span>
              <span className="text-green-400 capitalize">{project.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Port:</span>
              <span className="text-slate-200">{project.port || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">URL:</span>
              <a href={`http://localhost:${project.port}`} className="text-purple-400 hover:underline">
                http://localhost:{project.port}
              </a>
            </div>
          </div>
        </div>

        {/* Configuration */}
        <div className="glass rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-purple-400" />
            Configuration
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-400">Type:</span>
              <span className="text-slate-200">{project.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Environment:</span>
              <span className="text-slate-200">Development</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Secrets:</span>
              <span className="text-slate-200">5 configured</span>
            </div>
          </div>
        </div>
      </div>

      {/* Logs */}
      <div className="glass rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Terminal className="w-5 h-5 text-purple-400" />
          Logs
        </h2>
        <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm h-64 overflow-y-auto">
          <div className="text-green-400">[2024-01-15 10:30:25] Server started on port {project.port}</div>
          <div className="text-blue-400">[2024-01-15 10:30:26] Ready in 1.5s</div>
          <div className="text-slate-400">[2024-01-15 10:30:27] Compiled successfully</div>
          <div className="text-green-400">[2024-01-15 10:30:28] ✓ All checks passed</div>
        </div>
      </div>
    </div>
  );
}
