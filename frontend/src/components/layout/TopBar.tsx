
import React from 'react';
import { Search, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from 'next-themes';
import { NavLink } from 'react-router-dom';

const TopBar: React.FC = () => {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto h-14 px-4 sm:px-6 flex items-center gap-4">
        <NavLink to="/dashboard" className="font-semibold text-sm sm:text-base">CrimeConnect</NavLink>

        <div className="flex-1 max-w-xl ml-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <input
              type="search"
              placeholder="Search…"
              className="block w-full pl-9 pr-3 py-2 text-sm bg-muted/40 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-4 text-sm">
          <NavLink to="/dashboard" className={({isActive}) => isActive ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'}>Dashboard</NavLink>
          <NavLink to="/cases" className={({isActive}) => isActive ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'}>Cases</NavLink>
          <NavLink to="/reports" className={({isActive}) => isActive ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'}>Reports</NavLink>
        </nav>

        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="ml-auto inline-flex items-center justify-center h-9 w-9 rounded-md border border-input hover:bg-muted"
        >
          {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </button>

        <NavLink to="/profile" className="inline-flex items-center gap-2 text-sm">
          <img src={user?.avatar || '/placeholder.svg'} alt="Profile" className="w-8 h-8 rounded-full border object-cover" />
          <span className="hidden sm:block text-muted-foreground">{user?.email || 'Agent'}</span>
        </NavLink>
      </div>
    </header>
  );
};

export default TopBar;
