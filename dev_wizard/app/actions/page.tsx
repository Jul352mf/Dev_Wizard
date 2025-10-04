import { Zap, Play, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function ActionsPage() {
  const actions = [
    {
      id: 1,
      name: 'Build Project',
      description: 'Compile and bundle the application',
      status: 'completed',
      lastRun: '2 hours ago',
      duration: '45s',
    },
    {
      id: 2,
      name: 'Run Tests',
      description: 'Execute unit and integration tests',
      status: 'running',
      lastRun: 'Running',
      duration: '12s',
    },
    {
      id: 3,
      name: 'Lint Code',
      description: 'Check code for style and quality issues',
      status: 'idle',
      lastRun: '1 day ago',
      duration: '5s',
    },
    {
      id: 4,
      name: 'Deploy to Staging',
      description: 'Deploy application to staging environment',
      status: 'failed',
      lastRun: '3 days ago',
      duration: '120s',
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'running':
        return <Play className="w-5 h-5 text-blue-400 animate-pulse" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Clock className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-green-500/20 bg-green-500/10';
      case 'running':
        return 'border-blue-500/20 bg-blue-500/10';
      case 'failed':
        return 'border-red-500/20 bg-red-500/10';
      default:
        return 'border-slate-500/20 bg-slate-500/10';
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
          Actions
        </h1>
        <p className="text-slate-400">Automate tasks and manage workflows</p>
      </div>

      <div className="mb-6">
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-violet-500 rounded-lg hover:shadow-lg hover:shadow-purple-500/20 transition-all">
          <Zap className="w-4 h-4" />
          Create Action
        </button>
      </div>

      <div className="space-y-4">
        {actions.map((action) => (
          <div
            key={action.id}
            className={`glass rounded-xl p-6 border ${getStatusColor(action.status)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className="p-3 bg-purple-500/20 rounded-lg">
                  {getStatusIcon(action.status)}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-200 mb-1">{action.name}</h3>
                  <p className="text-sm text-slate-400 mb-4">{action.description}</p>
                  <div className="flex items-center gap-6 text-sm text-slate-500">
                    <span>Last run: {action.lastRun}</span>
                    <span>Duration: {action.duration}</span>
                  </div>
                </div>
              </div>
              <button className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors">
                Run
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
