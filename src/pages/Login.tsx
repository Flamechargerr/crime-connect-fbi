
import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from '../components/ui/sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield } from 'lucide-react';

const Login: React.FC = () => {
  const { login, isAuthenticated, loading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    try {
      setIsLoggingIn(true);
      setError('');
      await login(username, password);
      toast.success('Login successful');
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid username or password');
      toast.error('Login failed');
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background/90 p-4">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/20" />
      </div>
      
      <div className="w-full max-w-md glass-card p-8 animate-scale-in">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center mx-auto mb-4">
            <Shield className="text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">CrimeConnect</h1>
          <p className="text-muted-foreground mt-2">Sign in to your account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">
              Username
            </label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full"
              autoComplete="username"
              disabled={isLoggingIn}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full"
              autoComplete="current-password"
              disabled={isLoggingIn}
            />
          </div>
          
          {error && <p className="text-sm text-destructive">{error}</p>}
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoggingIn || loading}
          >
            {isLoggingIn ? 'Signing in...' : 'Sign in'}
          </Button>
          
          <div className="text-center text-sm text-muted-foreground">
            <p>Demo accounts:</p>
            <p className="font-medium">admin / password</p>
            <p className="font-medium">officer / password</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
