import { useAuth } from '@/context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { Search, Bell, User } from 'lucide-react';

export function TopBar() {
  const { user } = useAuth();
  const location = useLocation();
  const path = location.pathname;

  const breadcrumb = path === '/dashboard' ? 'Dashboard' :
    path === '/data' ? 'Data Browser' :
    path === '/map' ? 'Crime Map' :
    path === '/cases' ? 'Cases' :
    path === '/predictions' ? 'Predictions' :
    path === '/reports' ? 'Reports' :
    path === '/profile' ? 'Profile' : '';

  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-2 text-sm">
        <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
        <span className="text-muted-foreground">/</span>
        <span className="font-medium">{breadcrumb}</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 bg-muted rounded-md px-3 py-1.5 border border-border">
          <Search className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Search...</span>
        </div>
        <button className="relative p-2 rounded-md hover:bg-muted transition-colors">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
        </button>
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-3.5 w-3.5 text-primary" />
          </div>
          <span className="text-sm hidden md:block">{user?.name || 'Agent'}</span>
        </div>
      </div>
    </header>
  );
}
