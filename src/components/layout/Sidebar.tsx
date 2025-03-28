
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
  X,
  LockKeyhole,
  AlertTriangle,
  BarChart2,
  Eye,
  Fingerprint,
  MapPin,
  Flag
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '../../context/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: Home, clearance: 'level-1' },
  { name: 'Cases', path: '/cases', icon: FileText, clearance: 'level-2' },
  { name: 'Criminals', path: '/criminals', icon: Database, clearance: 'level-3' },
  { name: 'Evidence', path: '/evidence', icon: FileStack, clearance: 'level-3' },
  { name: 'Witnesses', path: '/witnesses', icon: Users, clearance: 'level-2' },
  { name: 'Officers', path: '/officers', icon: Shield, clearance: 'level-4' },
  { name: 'Courts', path: '/courts', icon: GavelIcon, clearance: 'level-2' },
  { name: 'Reports', path: '/reports', icon: BarChart2, clearance: 'level-1' },
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

  const getClearanceColor = (clearance: string) => {
    switch(clearance) {
      case 'level-1': return 'bg-secure-green/20 border-secure-green/40 text-secure-green';
      case 'level-2': return 'bg-secure-blue/20 border-secure-blue/40 text-secure-blue';
      case 'level-3': return 'bg-secure-yellow/20 border-secure-yellow/40 text-secure-yellow';
      case 'level-4': return 'bg-secure-red/20 border-secure-red/40 text-secure-red';
      default: return 'bg-muted border-muted-foreground/40 text-muted-foreground';
    }
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
      <div className="fbi-header flex items-center justify-between p-4">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-md bg-fbi-blue flex items-center justify-center text-white font-bold relative overflow-hidden">
            <div className="z-10">FBI</div>
            <div className="absolute inset-0 bg-gradient-to-r from-fbi-blue via-fbi-blue/50 to-fbi-blue animate-data-flow"></div>
          </div>
          {!collapsed && (
            <div className="ml-3">
              <h1 className="text-lg font-semibold tracking-tight transition-opacity">
                CrimeConnect
              </h1>
              <div className="text-[10px] text-muted-foreground opacity-80">FEDERAL BUREAU OF INVESTIGATION</div>
            </div>
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
        <div className="flex items-center justify-between mb-2 px-2">
          <p className="text-xs font-semibold text-muted-foreground">
            {collapsed ? 'MENU' : 'MAIN MENU'}
          </p>
          {!collapsed && <LockKeyhole size={14} className="text-primary" />}
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                'flex items-center px-3 py-2 rounded-md transition-colors relative',
                'hover:bg-muted group',
                isActive 
                  ? 'bg-primary/10 text-primary font-medium' 
                  : 'text-foreground/80'
              )}
              onClick={isMobile ? toggleMobileSidebar : undefined}
            >
              <item.icon size={18} />
              {!collapsed && (
                <>
                  <span className="ml-3 flex-1">{item.name}</span>
                  <span className={cn(
                    'text-[9px] px-1.5 py-0.5 rounded border',
                    getClearanceColor(item.clearance)
                  )}>
                    SEC {item.clearance.split('-')[1]}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-auto px-3 py-2">
        <div className="digital-divider"></div>
        {!collapsed && (
          <div className="terminal-box mb-2 text-[10px]">
            <p>SYSTEM STATUS: <span className="text-secure-green">OPERATIONAL</span></p>
            <p>ENCRYPTION: <span className="text-secure-green">ACTIVE</span></p>
            <p>LAST LOGIN: {new Date().toLocaleString()}</p>
          </div>
        )}
        <div className="p-3 rounded-md hover:bg-muted transition-colors">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center relative overflow-hidden">
              <Fingerprint size={16} className="text-primary z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 animate-scanner-line"></div>
            </div>
            {!collapsed && (
              <div className="ml-3">
                <p className="text-sm font-medium">{user?.username}</p>
                <p className="text-xs text-muted-foreground flex items-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-secure-green mr-1"></span> 
                  <span className="capitalize">{user?.role}</span>
                </p>
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
          {!collapsed && <span className="ml-3">Secure Logout</span>}
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
            className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
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
        "transition-all duration-300 ease-in-out scanner-effect",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {sidebarContent}
    </div>
  );
};

export default Sidebar;
