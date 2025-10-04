'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Home,
  FolderGit2,
  Zap,
  Key,
  Settings,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Projects', href: '/projects', icon: FolderGit2 },
  { name: 'Actions', href: '/actions', icon: Zap },
  { name: 'Secrets', href: '/secrets', icon: Key },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col h-screen bg-gradient-to-b from-slate-900 to-slate-950 border-r border-purple-900/20">
      <div className="p-6 border-b border-purple-900/20">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
          Dev Wizard
        </h1>
        <p className="text-xs text-slate-400 mt-1">Unified Development Hub</p>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                    'hover:bg-purple-500/10 hover:shadow-lg hover:shadow-purple-500/5',
                    isActive
                      ? 'bg-gradient-to-r from-purple-500/20 to-violet-500/20 text-purple-300 shadow-md shadow-purple-500/10'
                      : 'text-slate-400 hover:text-purple-300'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="p-4 border-t border-purple-900/20">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-800/50">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center">
            <span className="text-xs font-bold text-white">DW</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-300 truncate">Developer</p>
            <p className="text-xs text-slate-500 truncate">Local Workspace</p>
          </div>
        </div>
      </div>
    </nav>
  );
}
