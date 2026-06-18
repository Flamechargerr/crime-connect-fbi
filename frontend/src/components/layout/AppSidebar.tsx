import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard, Database, Map, FolderOpen, Brain, FileBarChart, User, LogOut,
  ChevronLeft, ChevronRight, Menu, Shield, Terminal
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Data Browser', icon: Database, path: '/data' },
  { label: 'Crime Map', icon: Map, path: '/map' },
  { label: 'Cases', icon: FolderOpen, path: '/cases' },
  { label: 'Predictions', icon: Brain, path: '/predictions' },
  { label: 'Reports', icon: FileBarChart, path: '/reports' },
  { label: 'Database Console', icon: Terminal, path: '/database' },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { logout } = useAuth();

  const sidebarContent = (
    <div className="flex flex-col h-full bg-sidebar-bg relative">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-border bg-black/15">
        <motion.div 
          className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20"
          whileHover={{ rotate: 180 }}
          transition={{ duration: 0.5 }}
        >
          <Shield className="h-4.5 w-4.5 text-primary text-glow" />
        </motion.div>
        {!collapsed && (
          <div className="min-w-0">
            <div className="font-mono font-bold text-xs tracking-wider uppercase text-white truncate text-glow">CRIME_CONNECT</div>
            <div className="text-[9px] font-mono text-primary/60 uppercase tracking-widest">FBI ANALYTICS // v2.0</div>
          </div>
        )}
      </div>

      {/* Nav Link List */}
      <nav className="flex-1 px-2 py-4 space-y-1.5 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className="block cursor-pointer"
            >
              <motion.div
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all relative overflow-hidden cursor-pointer',
                  isActive
                    ? 'bg-primary/15 text-primary border border-primary/20 shadow-[0_0_15px_rgba(0,255,255,0.05)] font-semibold text-glow'
                    : 'text-sidebar-fg hover:bg-white/5 hover:text-foreground border border-transparent'
                )}
              >
                {/* Active left glowing bar */}
                {isActive && (
                  <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary border-glow" />
                )}
                <item.icon className={cn("h-4 w-4 shrink-0", isActive ? "text-primary text-glow animate-pulse" : "text-sidebar-fg")} />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Telemetry Indicator */}
      {!collapsed && (
        <div className="px-4 py-3 border-t border-border bg-black/10 text-[9px] font-mono text-primary/50 space-y-0.5">
          <div>FEED: ACTIVE</div>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            SECURE ACCESS: ESTABLISHED
          </div>
        </div>
      )}

      {/* Profile & Logout Section */}
      <div className="px-2 py-4 border-t border-border bg-black/20 space-y-1.5">
        <Link
          to="/profile"
          className="block cursor-pointer"
        >
          <motion.div
            whileHover={{ x: 3 }}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer',
              location.pathname === '/profile'
                ? 'bg-primary/15 text-primary border border-primary/20 text-glow'
                : 'text-sidebar-fg hover:bg-white/5 hover:text-foreground border border-transparent'
            )}
          >
            <User className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Profile</span>}
          </motion.div>
        </Link>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider text-sidebar-fg hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 border border-transparent transition-all w-full cursor-pointer"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-card border border-border shadow-lg cursor-pointer"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm cursor-pointer"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          'lg:hidden fixed inset-y-0 left-0 z-50 w-60 bg-sidebar-bg border-r border-sidebar-border transition-transform',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col bg-sidebar-bg border-r border-sidebar-border transition-all duration-200 relative',
          collapsed ? 'w-16' : 'w-60'
        )}
      >
        {sidebarContent}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute top-4 right-0 translate-x-1/2 h-6 w-6 rounded-full bg-card border border-border flex items-center justify-center shadow-md hover:border-primary/30 hover:text-primary transition-colors cursor-pointer z-20"
        >
          {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>
      </aside>
    </>
  );
}
