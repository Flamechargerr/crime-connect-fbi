import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { Search, Bell, User, Clock, Terminal } from 'lucide-react';

export function TopBar() {
  const { user } = useAuth();
  const location = useLocation();
  const path = location.pathname;
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const date = new Date();
      setTime(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const breadcrumb = path === '/dashboard' ? 'DASHBOARD' :
    path === '/data' ? 'DATA_BROWSER' :
    path === '/map' ? 'CRIME_MAP' :
    path === '/cases' ? 'CASES_DB' :
    path === '/predictions' ? 'ML_PREDICTIONS' :
    path === '/reports' ? 'ANALYTICS_REPORTS' :
    path === '/profile' ? 'AGENT_PROFILE' : 'SYSTEM';

  return (
    <header className="h-14 border-b border-border bg-card/45 backdrop-blur-md flex items-center justify-between px-6 shrink-0 relative z-30">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-mono tracking-wider">
        <Link to="/dashboard" className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">HOME</Link>
        <span className="text-muted-foreground/40">/</span>
        <span className="text-white font-bold text-glow">{breadcrumb}</span>
      </div>

      {/* Center status bar for desktop */}
      <div className="hidden lg:flex items-center gap-4 text-[10px] font-mono text-primary/60">
        <div className="flex items-center gap-1">
          <Terminal className="h-3 w-3 text-secondary animate-pulse" />
          <span>SECURE_ID: {user?.id?.substring(0, 8) || 'AGENT_GUEST'}</span>
        </div>
        <span className="text-border">|</span>
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3 text-secondary" />
          <span>SYS_TIME: {time}</span>
        </div>
      </div>

      {/* Right side items */}
      <div className="flex items-center gap-4">
        {/* Search Input HUD */}
        <div className="hidden md:flex items-center gap-2 bg-black/40 rounded-lg px-3 py-1.5 border border-border/80 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/40 transition-all">
          <Search className="h-3.5 w-3.5 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="FILTER INCIDENTS..." 
            className="bg-transparent border-0 outline-none p-0 text-xs font-mono text-white placeholder:text-muted-foreground/30 focus:ring-0 w-32 focus:w-44 transition-all"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-white/5 border border-transparent hover:border-border transition-all cursor-pointer">
          <Bell className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-primary border-glow animate-ping" />
        </button>

        {/* User profile identifier */}
        <div className="flex items-center gap-2 border-l border-border pl-4">
          <div className="h-7 w-7 rounded-lg bg-primary/5 border border-primary/20 flex items-center justify-center">
            <User className="h-3.5 w-3.5 text-primary text-glow" />
          </div>
          <span className="text-xs font-mono text-white tracking-wide hidden md:block">
            {user?.name?.toUpperCase() || 'ANALYST'}
          </span>
        </div>
      </div>
    </header>
  );
}
