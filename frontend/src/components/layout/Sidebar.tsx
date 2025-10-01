import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Hop as Home, FileText, Database, Users, Shield, Gavel, FileStack, User, Flag, ChartBar as BarChart2, Globe, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: Home },
  { name: 'Cases', path: '/cases', icon: FileText },
  { name: 'Criminals', path: '/criminals', icon: Database },
  { name: 'Evidence', path: '/evidence', icon: FileStack },
  { name: 'Witnesses', path: '/witnesses', icon: Users },
  { name: 'Officers', path: '/officers', icon: Shield },
  { name: 'Courts', path: '/courts', icon: Gavel },
  { name: 'Reports', path: '/reports', icon: BarChart2 },
  { name: '3D Globe', path: '/globe', icon: Globe },
  { name: 'Most Wanted', path: '/most-wanted', icon: Flag },
  { name: 'Profile', path: '/profile', icon: User },
];

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useIsMobile();

  return (
    <aside
      className={cn(
        'h-full relative',
        'backdrop-blur-xl bg-gradient-to-b from-background/95 via-background/90 to-background/95',
        'border-r border-cyan-500/20',
        collapsed ? 'w-20' : 'w-72',
        'transition-all duration-300 ease-in-out hidden md:flex flex-col',
        'before:absolute before:inset-0 before:bg-gradient-to-b before:from-cyan-500/5 before:to-transparent before:pointer-events-none'
      )}
    >
      <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-cyan-500/50 to-transparent"></div>

      <div className="h-16 flex items-center justify-between px-4 border-b border-cyan-500/20 relative">
        <div className={cn('flex items-center gap-3', collapsed && 'justify-center w-full')}>
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-transparent animate-pulse"></div>
            <Shield className="h-5 w-5 text-cyan-400 relative z-10" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-base bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">CrimeConnect</span>
              <span className="text-xs text-muted-foreground">Command Center</span>
            </div>
          )}
        </div>
        <button
          className={cn(
            'h-8 w-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 hover:border-cyan-500/50',
            'flex items-center justify-center transition-all duration-300',
            'hover:scale-110 active:scale-95',
            collapsed && 'absolute -right-3 top-1/2 -translate-y-1/2 z-10'
          )}
          onClick={() => setCollapsed(v => !v)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="h-4 w-4 text-cyan-400" /> : <ChevronLeft className="h-4 w-4 text-cyan-400" />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin scrollbar-thumb-cyan-500/20 scrollbar-track-transparent">
        {navItems.map((item, index) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'group relative flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium',
                'transition-all duration-300',
                'hover:translate-x-1',
                collapsed && 'justify-center px-0',
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-300 shadow-lg shadow-cyan-500/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-cyan-500/5 border border-transparent hover:border-cyan-500/10'
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-r-full"></div>
                )}
                <div className={cn(
                  'h-10 w-10 rounded-lg flex items-center justify-center relative transition-all duration-300',
                  isActive
                    ? 'bg-gradient-to-br from-cyan-500/30 to-blue-500/30 border border-cyan-400/50'
                    : 'bg-cyan-500/5 border border-cyan-500/10 group-hover:border-cyan-500/30'
                )}>
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-transparent animate-pulse rounded-lg"></div>
                  )}
                  <item.icon className={cn(
                    'h-5 w-5 relative z-10 transition-all duration-300',
                    isActive ? 'text-cyan-400' : 'text-muted-foreground group-hover:text-cyan-400'
                  )} />
                </div>
                {!collapsed && (
                  <span className="flex-1">{item.name}</span>
                )}
                {!collapsed && isActive && (
                  <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse shadow-lg shadow-cyan-400/50"></div>
                )}
                {collapsed && (
                  <div className={cn(
                    'absolute left-full ml-2 px-3 py-2 rounded-lg',
                    'bg-background/95 backdrop-blur-xl border border-cyan-500/30',
                    'opacity-0 invisible group-hover:opacity-100 group-hover:visible',
                    'transition-all duration-300 whitespace-nowrap z-50',
                    'shadow-xl shadow-cyan-500/10'
                  )}>
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 rotate-45 bg-background/95 border-l border-b border-cyan-500/30"></div>
                    {item.name}
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className={cn(
        'p-4 border-t border-cyan-500/20 relative',
        'before:absolute before:top-0 before:left-0 before:right-0 before:h-px',
        'before:bg-gradient-to-r before:from-transparent before:via-cyan-500/50 before:to-transparent'
      )}>
        <div className={cn(
          'flex items-center gap-3 px-3 py-2 rounded-lg bg-cyan-500/5 border border-cyan-500/10',
          collapsed && 'justify-center px-0'
        )}>
          <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse shadow-lg shadow-green-400/50"></div>
          {!collapsed && (
            <span className="text-xs text-muted-foreground">System Online</span>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;