import { FolderGit2, GitBranch, Package, Plus } from 'lucide-react';

export default function ProjectsPage() {
  const projects = [
    {
      id: 1,
      name: 'jagi-oap',
      type: 'Next.js',
      path: '/workspace/jagi-oap',
      lastModified: '2 hours ago',
      status: 'running',
    },
    {
      id: 2,
      name: 'dev-wizard',
      type: 'Next.js + Electron',
      path: '/workspace/dev-wizard',
      lastModified: '1 day ago',
      status: 'stopped',
    },
    {
      id: 3,
      name: 'langgraph-agent',
      type: 'Python',
      path: '/workspace/langgraph-agent',
      lastModified: '3 days ago',
      status: 'stopped',
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
          Projects
        </h1>
        <p className="text-slate-400">Discover and manage your development projects</p>
      </div>

      <div className="mb-6 flex gap-4">
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-violet-500 rounded-lg hover:shadow-lg hover:shadow-purple-500/20 transition-all">
          <Plus className="w-4 h-4" />
          Create Project
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
          <GitBranch className="w-4 h-4" />
          Clone Repository
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
          <FolderGit2 className="w-4 h-4" />
          Import Existing
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <a
            key={project.id}
            href={`/projects/${project.id}`}
            className="glass rounded-xl p-6 hover:shadow-lg hover:shadow-purple-500/10 transition-all border border-purple-900/10"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-violet-500 rounded-lg">
                <FolderGit2 className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    project.status === 'running' ? 'bg-green-400' : 'bg-slate-600'
                  }`}
                />
                <span className="text-xs text-slate-400 capitalize">{project.status}</span>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-slate-200 mb-1">{project.name}</h3>
            <div className="flex items-center gap-2 mb-3">
              <Package className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-slate-400">{project.type}</span>
            </div>

            <p className="text-xs text-slate-500 mb-4 font-mono truncate">{project.path}</p>

            <div className="pt-4 border-t border-purple-900/20">
              <p className="text-xs text-slate-500">Modified {project.lastModified}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
