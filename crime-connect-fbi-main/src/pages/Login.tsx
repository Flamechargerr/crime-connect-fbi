
import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield } from 'lucide-react';

const Login: React.FC = () => {
  const { login, isAuthenticated, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    try {
      setIsLoggingIn(true);
      setError('');
      await login(email, password);
      toast.success('Login successful');
    } catch (error: any) {
      setError(error.message || 'Invalid email or password');
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
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" className="w-full" autoComplete="email" disabled={isLoggingIn} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
            </div>
            <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" className="w-full" autoComplete="current-password" disabled={isLoggingIn} />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={isLoggingIn || loading}>
            {isLoggingIn ? 'Signing in...' : 'Sign in'}
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            <Link to="/register" className="text-primary hover:underline">Don't have an account? Register</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
