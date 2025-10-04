import { Key, Plus, Eye, Copy } from 'lucide-react';

export default function SecretsPage() {
  const secrets = [
    {
      id: 1,
      key: 'DATABASE_URL',
      description: 'PostgreSQL connection string',
      lastModified: '2 hours ago',
      environment: 'development',
    },
    {
      id: 2,
      key: 'NEXT_PUBLIC_API_URL',
      description: 'API endpoint URL',
      lastModified: '1 day ago',
      environment: 'development',
    },
    {
      id: 3,
      key: 'OPENAI_API_KEY',
      description: 'OpenAI API authentication key',
      lastModified: '3 days ago',
      environment: 'production',
    },
    {
      id: 4,
      key: 'GITHUB_TOKEN',
      description: 'GitHub personal access token',
      lastModified: '1 week ago',
      environment: 'development',
    },
  ];

  const getEnvironmentColor = (env: string) => {
    switch (env) {
      case 'production':
        return 'bg-red-500/20 text-red-300';
      case 'staging':
        return 'bg-yellow-500/20 text-yellow-300';
      default:
        return 'bg-blue-500/20 text-blue-300';
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
          Secrets
        </h1>
        <p className="text-slate-400">Manage environment variables and API keys securely</p>
      </div>

      <div className="mb-6">
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-violet-500 rounded-lg hover:shadow-lg hover:shadow-purple-500/20 transition-all">
          <Plus className="w-4 h-4" />
          Add Secret
        </button>
      </div>

      <div className="space-y-4">
        {secrets.map((secret) => (
          <div
            key={secret.id}
            className="glass rounded-xl p-6 border border-purple-900/10 hover:border-purple-500/20 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className="p-3 bg-purple-500/20 rounded-lg">
                  <Key className="w-5 h-5 text-purple-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-slate-200 font-mono">
                      {secret.key}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${getEnvironmentColor(
                        secret.environment
                      )}`}
                    >
                      {secret.environment}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 mb-3">{secret.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Modified {secret.lastModified}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
                  <Eye className="w-4 h-4 text-slate-400" />
                </button>
                <button className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
                  <Copy className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 glass rounded-xl p-6 border border-yellow-500/20">
        <h3 className="text-lg font-semibold text-yellow-400 mb-2">Security Note</h3>
        <p className="text-slate-400 text-sm">
          Secrets are stored securely in your OS keychain. Never commit secrets to version control.
          Use .env.example files for documentation purposes only.
        </p>
      </div>
    </div>
  );
}
