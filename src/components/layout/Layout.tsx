
import React, { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { Shield, AlertTriangle, Clock, Database, Lock, Fingerprint, Radio, ServerCrash } from 'lucide-react';
import { format } from 'date-fns';

const Layout: React.FC = () => {
  const { isAuthenticated, loading, user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [systemStatus, setSystemStatus] = useState<'normal' | 'alert' | 'warning'>('normal');
  const [statusMessage, setStatusMessage] = useState('All systems operational');
  const [sessionId] = useState(() => Math.random().toString(36).substring(2, 10).toUpperCase());

  useEffect(() => {
    // Update time every second for the real-time clock
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Random system status changes for visual effect
    const statusId = setInterval(() => {
      const rand = Math.random();
      if (rand > 0.95) {
        setSystemStatus('alert');
        setStatusMessage('Security scan in progress...');
        setTimeout(() => {
          setSystemStatus('normal');
          setStatusMessage('All systems operational');
        }, 5000);
      } else if (rand > 0.85) {
        setSystemStatus('warning');
        setStatusMessage('Database synchronization...');
        setTimeout(() => {
          setSystemStatus('normal');
          setStatusMessage('All systems operational');
        }, 3000);
      }
    }, 30000);
    
    return () => {
      clearInterval(intervalId);
      clearInterval(statusId);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#101419] bg-digital-circuit">
        <div className="animate-pulse flex flex-col items-center bg-black/40 p-8 rounded-lg border border-primary/20 backdrop-blur-xl shadow-[0_0_30px_rgba(0,87,184,0.2)]">
          <div className="h-16 w-16 rounded-full border-4 border-t-transparent border-primary animate-spin mb-4"></div>
          <div className="h-5 w-48 bg-primary/20 rounded animate-pulse mb-3"></div>
          <div className="text-sm text-muted-foreground typing-effect">
            Establishing secure connection...
          </div>
          <div className="mt-4 text-xs text-primary/60 flex items-center">
            <Shield size={12} className="mr-1" />
            <span>VALIDATING CREDENTIALS</span>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-x-10 gap-y-2 text-xs text-muted-foreground">
            <div className="flex items-center">
              <div className="h-1.5 w-1.5 bg-secure-green rounded-full animate-pulse mr-1.5"></div>
              <span>NETWORK SECURE</span>
            </div>
            <div className="flex items-center">
              <div className="h-1.5 w-1.5 bg-secure-yellow rounded-full animate-pulse mr-1.5"></div>
              <span>DECRYPTING</span>
            </div>
            <div className="flex items-center">
              <div className="h-1.5 w-1.5 bg-secure-blue rounded-full animate-pulse mr-1.5"></div>
              <span>API CONNECTED</span>
            </div>
            <div className="flex items-center">
              <div className="h-1.5 w-1.5 bg-secure-green rounded-full animate-pulse mr-1.5"></div>
              <span>TUNNEL ESTABLISHED</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#101419] bg-digital-circuit">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <TopBar />
        <div className="absolute top-16 left-0 right-0 bg-black/40 backdrop-blur-sm py-1.5 px-6 z-10 border-b border-border/50 flex justify-between items-center">
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center">
              <Shield size={12} className="mr-1 text-secure-green" />
              <span>SECRET CLEARANCE</span>
            </div>
            <div className="flex items-center">
              <AlertTriangle size={12} className="mr-1 text-secure-yellow" />
              <span>FOR OFFICIAL USE ONLY</span>
            </div>
            <div className="flex items-center">
              <Database size={12} className="mr-1 text-secure-blue" />
              <span>CONNECTED TO CENTRAL DATABASE</span>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center">
              <Lock size={12} className="mr-1 text-secure-green" />
              <span>ENCRYPTED CHANNEL</span>
            </div>
            <div className="text-primary/80 font-mono">
              SESSION ID: {sessionId}
            </div>
          </div>
        </div>
        
        <main className="flex-1 overflow-y-auto p-6 pt-12 animate-fade-in">
          <div className="flex justify-between items-center mb-4 text-xs text-muted-foreground">
            <div className="flex items-center">
              {systemStatus === 'normal' && (
                <div className="flex items-center text-secure-green">
                  <Radio size={10} className="mr-1 animate-pulse" />
                  <span>{statusMessage}</span>
                </div>
              )}
              {systemStatus === 'warning' && (
                <div className="flex items-center text-secure-yellow">
                  <ServerCrash size={10} className="mr-1 animate-pulse" />
                  <span>{statusMessage}</span>
                </div>
              )}
              {systemStatus === 'alert' && (
                <div className="flex items-center text-secure-red">
                  <AlertTriangle size={10} className="mr-1 animate-pulse" />
                  <span>{statusMessage}</span>
                </div>
              )}
            </div>
            <div className="flex items-center">
              <Clock size={10} className="mr-1.5" />
              <span>TIMESTAMP: {format(currentTime, 'yyyy-MM-dd HH:mm:ss')} UTC</span>
            </div>
          </div>
          
          <Outlet />
          
          <div className="fixed bottom-3 right-3 flex items-center text-xs text-muted-foreground">
            <div className="animate-pulse h-2 w-2 rounded-full bg-secure-green mr-2"></div>
            SECURE CONNECTION ESTABLISHED
          </div>
        </main>
      </div>
      
      {/* Bottom status bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/40 backdrop-blur-md py-1 px-6 z-10 border-t border-primary/30 flex justify-between items-center text-xs">
        <div className="flex items-center space-x-3">
          <div className="flex items-center">
            <div className="h-1.5 w-1.5 bg-secure-green rounded-full animate-pulse mr-1"></div>
            <span>SECURE CONNECTION</span>
          </div>
          <div>
            USER: {user?.email?.split('@')[0]?.toUpperCase() || 'AGENT'}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Fingerprint size={10} className="mr-1 text-secure-blue" />
            <span>AUTHENTICATED</span>
          </div>
          <div className="flex items-center">
            <div className="h-1.5 w-1.5 bg-secure-blue rounded-full mr-1"></div>
            <span>API v3.6.2</span>
          </div>
          <div className="font-mono text-primary/80">
            {format(currentTime, 'HH:mm:ss')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;

