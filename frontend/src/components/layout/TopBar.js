import React, { useState, useEffect } from 'react';
import { Bell, Search, Settings, Shield, Globe, Radio, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useAuth } from '../../context/AuthContext';

const TopBar = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications] = useState([
    { id: 1, type: 'alert', message: 'High priority case updated', time: '2 min ago' },
    { id: 2, type: 'warning', message: 'System maintenance scheduled', time: '1 hour ago' },
    { id: 3, type: 'info', message: 'New evidence submitted', time: '3 hours ago' }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 bg-[#061623]/60 backdrop-blur-md border-b border-primary/20 flex items-center justify-between px-6 relative z-20">
      {/* Left section - Search */}
      <div className="flex items-center space-x-4 flex-1">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search cases, criminals, evidence..."
            className="pl-10 pr-4 bg-black/20 border-primary/30 focus:border-primary transition-colors"
          />
        </div>
      </div>

      {/* Right section - Status & User */}
      <div className="flex items-center space-x-4">
        {/* System Status */}
        <div className="hidden md:flex items-center space-x-3 text-xs">
          <div className="flex items-center text-secure-green">
            <Radio size={12} className="mr-1 animate-pulse" />
            <span>SECURE</span>
          </div>
          <div className="flex items-center text-secure-blue">
            <Globe size={12} className="mr-1" />
            <span>ONLINE</span>
          </div>
          <div className="flex items-center text-primary/80">
            <AlertTriangle size={12} className="mr-1" />
            <span>CLASSIFIED</span>
          </div>
        </div>

        {/* Time Display */}
        <div className="hidden lg:block text-xs text-muted-foreground font-mono">
          {currentTime.toLocaleTimeString()} UTC
        </div>

        {/* Notifications */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="relative p-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <Bell className="h-5 w-5" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-secure-red rounded-full flex items-center justify-center text-xs font-bold text-white animate-pulse">
                {notifications.length}
              </span>
            )}
          </Button>
        </div>

        {/* Settings */}
        <Button
          variant="ghost"
          size="sm"
          className="p-2 text-muted-foreground hover:text-primary transition-colors"
        >
          <Settings className="h-5 w-5" />
        </Button>

        {/* User Badge */}
        <div className="flex items-center space-x-2 bg-black/20 rounded-md px-3 py-1.5 border border-primary/20">
          <div className="h-6 w-6 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
            <Shield className="h-3 w-3 text-primary" />
          </div>
          <div className="hidden sm:block text-xs">
            <div className="font-medium text-foreground">{user?.username}</div>
            <div className="text-muted-foreground">{user?.badge}</div>
          </div>
          <div className="h-4 w-px bg-primary/20 hidden sm:block"></div>
          <div className="text-xs font-mono text-primary hidden sm:block">
            {user?.clearanceLevel}
          </div>
        </div>
      </div>

      {/* Scanning effect */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-primary/30 scanner-effect"></div>
    </header>
  );
};

export default TopBar;