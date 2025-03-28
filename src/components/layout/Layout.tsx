
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { Shield, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

const Layout: React.FC = () => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-16 w-16 rounded-full border-4 border-t-transparent border-primary animate-spin mb-4"></div>
          <div className="h-5 w-48 bg-muted rounded animate-pulse"></div>
          <div className="mt-4 text-sm text-muted-foreground typing-effect">
            Establishing secure connection...
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <TopBar />
        <div className="absolute top-16 left-0 right-0 bg-black/20 backdrop-blur-sm py-1 px-6 z-10 border-b border-border/50 flex justify-between items-center">
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center">
              <Shield size={12} className="mr-1 text-secure-green" />
              <span>SECRET CLEARANCE</span>
            </div>
            <div className="flex items-center">
              <AlertTriangle size={12} className="mr-1 text-secure-yellow" />
              <span>FOR OFFICIAL USE ONLY</span>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            SESSION ID: {Math.random().toString(36).substring(2, 15).toUpperCase()}
          </div>
        </div>
        <main className="flex-1 overflow-y-auto p-6 pt-12 animate-fade-in bg-digital-circuit">
          <div className="text-xs mb-4 text-right text-muted-foreground">
            LAST UPDATED: {format(new Date(), 'yyyy-MM-dd HH:mm:ss')} UTC
          </div>
          <Outlet />
          <div className="fixed bottom-3 right-3 flex items-center text-xs text-muted-foreground">
            <div className="animate-pulse h-2 w-2 rounded-full bg-secure-green mr-2"></div>
            SECURE CONNECTION ESTABLISHED
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
