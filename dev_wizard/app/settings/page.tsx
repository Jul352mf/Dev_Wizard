import { FolderOpen, Globe, Shield, Bell } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-slate-400">Configure your Dev Wizard preferences</p>
      </div>

      <div className="space-y-6">
        {/* Workspace Settings */}
        <div className="glass rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-purple-400" />
            Workspace
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Default Workspace Directory
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-purple-500"
                placeholder="/home/user/workspace"
                defaultValue="/home/user/workspace"
              />
              <p className="text-xs text-slate-500 mt-1">
                Projects will be scanned from this directory
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-slate-300">
                  Auto-scan for projects
                </label>
                <p className="text-xs text-slate-500">Automatically detect new projects in workspace</p>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-purple-500">
                <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition" />
              </button>
            </div>
          </div>
        </div>

        {/* API Settings */}
        <div className="glass rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-purple-400" />
            API Configuration
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                API Server Port
              </label>
              <input
                type="number"
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-purple-500"
                placeholder="3001"
                defaultValue="3001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                MCP Gateway URL
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-purple-500"
                placeholder="http://localhost:8000"
                defaultValue="http://localhost:8000"
              />
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="glass rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-400" />
            Security
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-slate-300">
                  Use OS Keychain
                </label>
                <p className="text-xs text-slate-500">Store secrets in system keychain</p>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-purple-500">
                <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-slate-300">
                  Require FIDO2 for sensitive actions
                </label>
                <p className="text-xs text-slate-500">Use hardware key for authentication</p>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-700">
                <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white transition" />
              </button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="glass rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-purple-400" />
            Notifications
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-slate-300">
                  Desktop notifications
                </label>
                <p className="text-xs text-slate-500">Show system notifications for events</p>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-purple-500">
                <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-slate-300">
                  Task completion alerts
                </label>
                <p className="text-xs text-slate-500">Notify when long-running tasks finish</p>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-purple-500">
                <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition" />
              </button>
            </div>
          </div>
        </div>

        <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-violet-500 rounded-lg hover:shadow-lg hover:shadow-purple-500/20 transition-all">
          Save Settings
        </button>
      </div>
    </div>
  );
}
