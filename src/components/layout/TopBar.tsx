
import React, { useState } from 'react';
import { Bell, Search, Shield, AlertTriangle, MapPin, Calendar, Clock, Filter, Globe, Key } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';

const TopBar: React.FC = () => {
  const { user } = useAuth();
  const [showAlerts, setShowAlerts] = useState(false);

  // Mock alerts data
  const alerts = [
    { id: 1, type: 'warning', message: 'New suspect identified in Case #45B28', time: '10 min ago' },
    { id: 2, type: 'critical', message: 'Unauthorized access attempt detected', time: '25 min ago' },
    { id: 3, type: 'info', message: 'System maintenance scheduled for 02:00 UTC', time: '1 hour ago' },
  ];

  return (
    <header className="fbi-header h-16 border-b border-border flex items-center justify-between px-6 bg-background/90 backdrop-blur-md sticky top-0 z-10">
      <div className="lg:w-96 w-48">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <input
            type="search"
            className="block w-full pl-10 pr-12 py-2 text-sm border border-input bg-black/30 rounded-md placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-input"
            placeholder="Search criminal database..."
          />
          <Button 
            variant="ghost" 
            size="sm" 
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 px-2"
          >
            <Filter size={14} />
          </Button>
        </div>
      </div>
      
      <div className="hidden md:flex items-center space-x-4 text-xs text-muted-foreground">
        <div className="flex items-center space-x-1">
          <Clock size={14} className="text-primary" />
          <span>{format(new Date(), 'HH:mm:ss')}</span>
        </div>
        <div className="h-3 w-px bg-border"></div>
        <div className="flex items-center space-x-1">
          <Calendar size={14} className="text-primary" />
          <span>{format(new Date(), 'MMM dd, yyyy')}</span>
        </div>
        <div className="h-3 w-px bg-border"></div>
        <div className="flex items-center space-x-1">
          <MapPin size={14} className="text-primary" />
          <span>LOCATION: CLASSIFIED</span>
        </div>
        <div className="h-3 w-px bg-border"></div>
        <div className="flex items-center space-x-1">
          <Globe size={14} className="text-primary" />
          <span>NETWORK: SECURE</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative">
          <button 
            className="relative p-2 rounded-full hover:bg-muted transition-colors"
            onClick={() => setShowAlerts(!showAlerts)}
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-secure-red rounded-full"></span>
          </button>
          
          {showAlerts && (
            <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-md shadow-lg z-50 py-2 animate-fade-in">
              <div className="px-3 py-2 border-b border-border">
                <h3 className="font-medium">System Alerts</h3>
                <p className="text-xs text-muted-foreground">Latest security notifications</p>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {alerts.map(alert => (
                  <div key={alert.id} className="px-3 py-2 hover:bg-muted/50 border-b border-border/50 last:border-0">
                    <div className="flex items-start">
                      <div className="mr-2 mt-0.5">
                        {alert.type === 'warning' && (
                          <AlertTriangle size={14} className="text-secure-yellow" />
                        )}
                        {alert.type === 'critical' && (
                          <AlertTriangle size={14} className="text-secure-red" />
                        )}
                        {alert.type === 'info' && (
                          <Bell size={14} className="text-secure-blue" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm">{alert.message}</p>
                        <p className="text-xs text-muted-foreground">{alert.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-3 py-2 border-t border-border">
                <button className="text-xs text-primary hover:underline w-full text-center">
                  View All Alerts
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="hidden md:block text-right">
            <div className="flex items-center">
              <Key size={12} className="text-primary mr-1" />
              <span className="text-xs text-secure-green">ACCESS GRANTED</span>
            </div>
            <div className="text-sm">
              Agent <span className="font-medium">{user?.username}</span>
            </div>
          </div>
          
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center relative overflow-hidden">
            <span className="text-sm font-medium text-primary z-10">
              {user?.username.charAt(0).toUpperCase()}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 animate-scanner-line"></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
