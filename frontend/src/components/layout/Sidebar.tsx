import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, FileText, Database, Users, Shield, Gavel, FileStack, User, Flag, BarChart2, Globe } from 'lucide-react';
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
  { name: 'Most Wanted', path: '/most-wanted', icon: Flag },
  { name: 'Profile', path: '/profile', icon: User },
];

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useIsMobile();

  return (
    <aside
      className={cn(
        'h-full border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80',
        collapsed ? 'w-16' : 'w-64',
        'transition-[width] duration-200 ease-in-out hidden md:flex flex-col'
      )}
    >
      <div className="h-14 flex items-center justify-between px-4 border-b">
        <span className={cn('font-medium text-sm text-muted-foreground', collapsed && 'sr-only')}>Navigation</span>
        <button
          className="btn-pro h-8 w-8 p-0"
          onClick={() => setCollapsed(v => !v)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? '›' : '‹'}
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto p-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm',
                'hover:bg-muted',
                isActive ? 'bg-muted font-medium text-foreground' : 'text-muted-foreground'
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {!collapsed && <span>{item.name}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;