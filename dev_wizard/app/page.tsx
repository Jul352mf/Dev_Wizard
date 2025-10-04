import { FolderGit2, Plus, Activity, Clock } from 'lucide-react';

export default function Dashboard() {
  const projects = [
    { id: 1, name: 'jagi-oap', type: 'Next.js', status: 'running', port: 3000 },
    { id: 2, name: 'dev-wizard', type: 'Next.js + Electron', status: 'stopped', port: null },
    { id: 3, name: 'langgraph-agent', type: 'Python', status: 'stopped', port: null },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-slate-400">Manage your development projects and services</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass rounded-xl p-6 hover:shadow-lg hover:shadow-purple-500/10 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <FolderGit2 className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-2xl font-bold text-purple-400">3</span>
          </div>
          <h3 className="text-slate-300 font-medium">Total Projects</h3>
          <p className="text-slate-500 text-sm mt-1">Across workspace</p>
        </div>

        <div className="glass rounded-xl p-6 hover:shadow-lg hover:shadow-green-500/10 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <Activity className="w-6 h-6 text-green-400" />
            </div>
            <span className="text-2xl font-bold text-green-400">1</span>
          </div>
          <h3 className="text-slate-300 font-medium">Running Services</h3>
          <p className="text-slate-500 text-sm mt-1">Active dev servers</p>
        </div>

        <div className="glass rounded-xl p-6 hover:shadow-lg hover:shadow-blue-500/10 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Clock className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-2xl font-bold text-blue-400">0</span>
          </div>
          <h3 className="text-slate-300 font-medium">Pending Tasks</h3>
          <p className="text-slate-500 text-sm mt-1">In queue</p>
        </div>
      </div>

      {/* Projects List */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-200">Recent Projects</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-violet-500 rounded-lg hover:shadow-lg hover:shadow-purple-500/20 transition-all">
            <Plus className="w-4 h-4" />
            New Project
          </button>
        </div>

        <div className="space-y-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors border border-purple-900/10"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-500 rounded-lg flex items-center justify-center">
                  <FolderGit2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-slate-200">{project.name}</h3>
                  <p className="text-sm text-slate-500">{project.type}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      project.status === 'running' ? 'bg-green-400' : 'bg-slate-600'
                    }`}
                  />
                  <span className="text-sm text-slate-400 capitalize">{project.status}</span>
                  {project.port && (
                    <span className="text-xs text-slate-500 ml-2">:{project.port}</span>
                  )}
                </div>
                <button className="px-4 py-1.5 text-sm bg-purple-500/20 text-purple-300 rounded hover:bg-purple-500/30 transition-colors">
                  Open
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
