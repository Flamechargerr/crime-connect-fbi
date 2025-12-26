import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Users,
  Shield,
  Scale,
  Package,
  User,
  Target,
  BarChart3,
  Globe,
  ChevronLeft,
  ChevronRight,
  UserSearch,
  Radio,
  Wifi
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const navItems = [
  { name: 'Command Center', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Cases', path: '/cases', icon: FileText },
  { name: 'Criminals', path: '/criminals', icon: UserSearch },
  { name: 'Evidence', path: '/evidence', icon: Package },
  { name: 'Witnesses', path: '/witnesses', icon: Users },
  { name: 'Officers', path: '/officers', icon: Shield },
  { name: 'Courts', path: '/courts', icon: Scale },
  { name: 'Reports', path: '/reports', icon: BarChart3 },
  { name: 'Global View', path: '/globe', icon: Globe },
  { name: 'Most Wanted', path: '/most-wanted', icon: Target },
];

const bottomNavItems = [
  { name: 'Profile', path: '/profile', icon: User },
];

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useIsMobile();

  return (
    <aside
      className={cn(
        'h-full relative flex flex-col',
        'bg-card border-r border-border',
        collapsed ? 'w-[72px]' : 'w-64',
        'transition-all duration-300 ease-in-out hidden md:flex'
      )}
    >
      {/* Accent line */}
      <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-primary/30 via-transparent to-primary/30"></div>

      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border relative">
        <div className={cn('flex items-center gap-3', collapsed && 'justify-center w-full')}>
          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 relative">
            <Shield className="h-5 w-5 text-primary" />
            <div className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-green-500 border-2 border-card"></div>
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-sm text-foreground truncate">CrimeConnect</span>
              <span className="text-[10px] text-primary font-medium uppercase tracking-wider">FBI SYSTEM</span>
            </div>
          )}
        </div>
        <button
          className={cn(
            'h-7 w-7 rounded-md flex items-center justify-center',
            'text-muted-foreground hover:text-foreground hover:bg-muted',
            'transition-all duration-200',
            collapsed && 'absolute -right-3.5 top-4 bg-card border border-border shadow-md z-10'
          )}
          onClick={() => setCollapsed(v => !v)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium',
                'transition-all duration-200',
                collapsed && 'justify-center px-0',
                isActive
                  ? 'bg-primary/10 text-primary dark:shadow-[inset_0_0_20px_-10px_rgba(59,130,246,0.3)]'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full"></div>
                )}
                <div className={cn(
                  'h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0',
                  'transition-all duration-200',
                  isActive
                    ? 'bg-primary/15'
                    : 'bg-muted/50 group-hover:bg-muted'
                )}>
                  <item.icon className={cn(
                    'h-[18px] w-[18px]',
                    isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                  )} />
                </div>
                {!collapsed && (
                  <span className="truncate">{item.name}</span>
                )}
                {collapsed && (
                  <div className={cn(
                    'absolute left-full ml-2 px-3 py-1.5 rounded-md',
                    'bg-popover border border-border shadow-xl',
                    'opacity-0 invisible group-hover:opacity-100 group-hover:visible',
                    'transition-all duration-200 whitespace-nowrap z-50',
                    'text-sm text-popover-foreground'
                  )}>
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 rotate-45 bg-popover border-l border-b border-border"></div>
                    {item.name}
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="p-3 border-t border-border space-y-3">
        {bottomNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium',
                'transition-all duration-200',
                collapsed && 'justify-center px-0',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className={cn(
                  'h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0',
                  isActive ? 'bg-primary/15' : 'bg-muted/50'
                )}>
                  <item.icon className={cn(
                    'h-[18px] w-[18px]',
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  )} />
                </div>
                {!collapsed && <span>{item.name}</span>}
              </>
            )}
          </NavLink>
        ))}

        {/* Connection Status */}
        {!collapsed && (
          <div className="px-3 py-2 rounded-lg bg-muted/30 border border-border/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Connection</span>
              <div className="flex items-center gap-1">
                <Wifi className="h-3 w-3 text-green-500" />
                <span className="text-[10px] text-green-500 font-medium">SECURE</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
                <div className="h-full w-full bg-gradient-to-r from-green-500 to-green-400 rounded-full"></div>
              </div>
              <span className="text-[10px] text-muted-foreground">256-bit</span>
            </div>
          </div>
        )}

        {collapsed && (
          <div className="flex justify-center">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;