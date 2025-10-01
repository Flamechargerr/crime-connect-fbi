import React from 'react';
import { Search, Sun, Moon, Bell, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from 'next-themes';
import { NavLink } from 'react-router-dom';

const TopBar: React.FC = () => {
  const { user } = useAuth();
  const { theme, resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => setTheme((resolvedTheme || theme) === 'light' ? 'dark' : 'light');
  const stored = (()=>{ try { const s = localStorage.getItem('userProfile'); return s? JSON.parse(s) : null; } catch { return null; } })();
  const avatar = stored?.avatar || user?.avatar || '/placeholder.svg';

  return (
    <header className="sticky top-0 z-20 border-b border-cyan-500/20 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 relative">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>

      <div className="container-pro h-16 flex items-center gap-4">
        <NavLink to="/dashboard" className="flex items-center gap-2 group">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center relative overflow-hidden group-hover:border-cyan-500/50 transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-transparent group-hover:animate-pulse"></div>
            <Zap className="h-4 w-4 text-cyan-400 relative z-10" />
          </div>
          <span className="font-bold text-base bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent hidden lg:block">CrimeConnect</span>
        </NavLink>

        <div className="flex-1 max-w-2xl ml-2">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none z-10">
              <Search className="h-4 w-4 text-cyan-400/70 group-focus-within:text-cyan-400 transition-colors" />
            </div>
            <input
              type="search"
              placeholder="Search cases, criminals, evidence..."
              className="w-full h-10 pl-11 pr-4 rounded-lg bg-cyan-500/5 border border-cyan-500/20 text-sm focus:outline-none focus:border-cyan-500/50 focus:bg-cyan-500/10 transition-all duration-300 placeholder:text-muted-foreground/70"
            />
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-400/0 via-cyan-400/5 to-cyan-400/0 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-1">
          <NavLink
            to="/dashboard"
            className={({isActive}) => `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              isActive
                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-muted-foreground hover:text-foreground hover:bg-cyan-500/5 border border-transparent hover:border-cyan-500/10'
            }`}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/cases"
            className={({isActive}) => `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              isActive
                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-muted-foreground hover:text-foreground hover:bg-cyan-500/5 border border-transparent hover:border-cyan-500/10'
            }`}
          >
            Cases
          </NavLink>
          <NavLink
            to="/reports"
            className={({isActive}) => `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              isActive
                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-muted-foreground hover:text-foreground hover:bg-cyan-500/5 border border-transparent hover:border-cyan-500/10'
            }`}
          >
            Reports
          </NavLink>
        </nav>

        <div className="flex items-center gap-2">
          <button
            className="relative h-10 w-10 rounded-lg bg-cyan-500/5 border border-cyan-500/20 hover:bg-cyan-500/10 hover:border-cyan-500/40 transition-all duration-300 flex items-center justify-center group"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4 text-cyan-400/70 group-hover:text-cyan-400 transition-colors" />
            <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-gradient-to-br from-red-500 to-orange-500 border-2 border-background flex items-center justify-center">
              <span className="text-[9px] font-bold text-white">3</span>
            </div>
            <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500/50 animate-ping"></div>
          </button>

          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="h-10 w-10 rounded-lg bg-cyan-500/5 border border-cyan-500/20 hover:bg-cyan-500/10 hover:border-cyan-500/40 transition-all duration-300 flex items-center justify-center group"
          >
            {(resolvedTheme || theme) === 'light'
              ? <Moon className="h-4 w-4 text-cyan-400/70 group-hover:text-cyan-400 transition-colors" />
              : <Sun className="h-4 w-4 text-cyan-400/70 group-hover:text-cyan-400 transition-colors" />
            }
          </button>

          <NavLink to="/profile" className="group flex items-center gap-3 pl-3 pr-4 py-2 rounded-lg bg-cyan-500/5 border border-cyan-500/20 hover:bg-cyan-500/10 hover:border-cyan-500/40 transition-all duration-300">
            <div className="relative">
              <img
                src={avatar}
                alt="Profile"
                className="w-7 h-7 rounded-lg border-2 border-cyan-500/30 object-cover group-hover:border-cyan-500/50 transition-all"
              />
              <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-green-400 border-2 border-background"></div>
            </div>
            <div className="hidden sm:flex flex-col items-start">
              <span className="text-xs font-medium text-foreground leading-none">{user?.email?.split('@')[0] || 'Agent'}</span>
              <span className="text-[10px] text-muted-foreground leading-none mt-0.5">Online</span>
            </div>
          </NavLink>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
