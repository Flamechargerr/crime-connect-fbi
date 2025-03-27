
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  Database, 
  Users, 
  Shield, 
  GavelIcon, 
  FileStack, 
  User, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '../../context/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: Home },
  { name: 'Cases', path: '/cases', icon: FileText },
  { name: 'Criminals', path: '/criminals', icon: Database },
  { name: 'Evidence', path: '/evidence', icon: FileStack },
  { name: 'Witnesses', path: '/witnesses', icon: Users },
  { name: 'Officers', path: '/officers', icon: Shield },
  { name: 'Courts', path: '/courts', icon: GavelIcon },
  { name: 'Reports', path: '/reports', icon: FileText },
];

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const isMobile = useIsMobile();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
  };

  // Mobile menu trigger button that appears in the TopBar
  const MobileTrigger = () => (
    <button 
      className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-background/80 backdrop-blur-sm border border-border"
      onClick={toggleMobileSidebar}
    >
      {mobileOpen ? <X size={20} /> : <Menu size={20} />}
    </button>
  );

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-bold">
            CC
          </div>
          {!collapsed && (
            <h1 className="ml-3 text-lg font-semibold tracking-tight transition-opacity">
              CrimeConnect
            </h1>
          )}
        </div>
        {!isMobile && (
          <button 
            onClick={toggleSidebar} 
            className="p-1 rounded-full hover:bg-muted transition-colors"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        )}
      </div>

      <div className="px-3 py-2">
        <p className="text-xs font-semibold text-muted-foreground mb-2 px-2">
          {collapsed ? 'MENU' : 'MAIN MENU'}
        </p>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                'flex items-center px-3 py-2 rounded-md transition-colors',
                'hover:bg-muted',
                isActive 
                  ? 'bg-primary/10 text-primary font-medium' 
                  : 'text-foreground/80'
              )}
              onClick={isMobile ? toggleMobileSidebar : undefined}
            >
              <item.icon size={18} />
              {!collapsed && <span className="ml-3">{item.name}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-4">
        <div className="px-3 py-2 rounded-md hover:bg-muted transition-colors">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <User size={16} className="text-primary" />
            </div>
            {!collapsed && (
              <div className="ml-3">
                <p className="text-sm font-medium">{user?.username}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
              </div>
            )}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className={cn(
            'flex items-center mt-2 px-3 py-2 w-full rounded-md transition-colors',
            'hover:bg-destructive/10 text-destructive'
          )}
        >
          <LogOut size={18} />
          {!collapsed && <span className="ml-3">Logout</span>}
        </button>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <>
        <MobileTrigger />
        <div 
          className={cn(
            "fixed inset-0 z-40 transform transition-transform duration-300 ease-in-out lg:hidden",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={toggleMobileSidebar}
          />
          <div className="relative w-64 h-full bg-background border-r border-border flex flex-col">
            {sidebarContent}
          </div>
        </div>
      </>
    );
  }

  return (
    <div 
      className={cn(
        "h-screen bg-sidebar border-r border-sidebar-border flex flex-col",
        "transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {sidebarContent}
    </div>
  );
};

export default Sidebar;
