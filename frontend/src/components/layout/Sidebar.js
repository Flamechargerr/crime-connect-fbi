import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Users,
  Database,
  FileStack,
  Scale,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Shield,
  Eye,
  MapPin,
  UserX,
  Settings,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { logout, user } = useAuth();

  const navigation = [
    {
      name: 'Intelligence Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      color: 'text-primary'
    },
    {
      name: 'Case Files',
      href: '/cases',
      icon: FileText,
      color: 'text-secure-blue'
    },
    {
      name: 'Criminal Database',
      href: '/criminals',
      icon: UserX,
      color: 'text-secure-red'
    },
    {
      name: 'Most Wanted',
      href: '/most-wanted',
      icon: Shield,
      color: 'text-secure-red'
    },
    {
      name: 'Federal Agents',
      href: '/officers',
      icon: Users,
      color: 'text-secure-green'
    },
    {
      name: 'Evidence Locker',
      href: '/evidence',
      icon: FileStack,
      color: 'text-secure-yellow'
    },
    {
      name: 'Witness Protection',
      href: '/witnesses',
      icon: Eye,
      color: 'text-secure-blue'
    },
    {
      name: 'Federal Courts',
      href: '/courts',
      icon: Scale,
      color: 'text-fbi-gold'
    },
    {
      name: 'Investigation Board',
      href: '/corkboard',
      icon: MapPin,
      color: 'text-primary'
    },
    {
      name: 'Intelligence Reports',
      href: '/reports',
      icon: BarChart3,
      color: 'text-secure-green'
    }
  ];

  const isActive = (href) => location.pathname === href;

  return (
    <div className={`${collapsed ? 'w-16' : 'w-64'} bg-[#061623]/80 backdrop-blur-md border-r border-primary/20 flex flex-col transition-all duration-300 relative`}>
      {/* Header */}
      <div className="p-4 border-b border-primary/20">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div>
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-primary mr-2" />
                <div>
                  <h1 className="font-bold text-lg text-primary">CrimeConnect</h1>
                  <p className="text-xs text-muted-foreground font-mono">CLASSIFIED</p>
                </div>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 h-8 w-8 text-primary hover:bg-primary/10"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`
                flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
                ${
                  active
                    ? 'bg-primary/10 text-primary border border-primary/30 shadow-sm'
                    : 'text-muted-foreground hover:bg-primary/5 hover:text-primary border border-transparent'
                }
                ${collapsed ? 'justify-center' : ''}
              `}
              title={collapsed ? item.name : ''}
            >
              <Icon className={`h-5 w-5 ${active ? 'text-primary' : item.color} ${collapsed ? '' : 'mr-3'}`} />
              {!collapsed && (
                <span className="truncate">{item.name}</span>
              )}
              {!collapsed && active && (
                <div className="ml-auto h-2 w-2 rounded-full bg-primary animate-pulse"></div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="border-t border-primary/20 p-4">
        {!collapsed && (
          <div className="mb-3">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mr-3">
                <Shield className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{user?.username}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.clearanceLevel}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="space-y-1">
          {!collapsed && (
            <Link
              to="/settings"
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-primary/5 hover:text-primary transition-colors"
            >
              <Settings className="h-4 w-4 mr-3" />
              Settings
            </Link>
          )}
          <Button
            variant="ghost"
            onClick={logout}
            className={`${collapsed ? 'w-full justify-center px-2' : 'w-full justify-start'} text-secure-red hover:bg-secure-red/10 hover:text-secure-red`}
            title={collapsed ? 'Logout' : ''}
          >
            <LogOut className={`h-4 w-4 ${collapsed ? '' : 'mr-3'}`} />
            {!collapsed && 'Secure Logout'}
          </Button>
        </div>
      </div>

      {/* Security indicator */}
      <div className="absolute bottom-20 right-2">
        <div className="h-2 w-2 rounded-full bg-secure-green animate-pulse"></div>
      </div>
    </div>
  );
};

export default Sidebar;