
import React, { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, Eye, EyeOff, KeyRound } from 'lucide-react';

const Login: React.FC = () => {
  const { login, isAuthenticated, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);

  useEffect(() => {
    // Autofill from last session if available
    try {
      const lastEmail = localStorage.getItem('last_email');
      if (lastEmail) setEmail(lastEmail);
    } catch {}
  }, []);

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
      if (remember) localStorage.setItem('last_email', email);
      toast.success('Login successful');
    } catch (error: any) {
      setError(error.message || 'Invalid email or password');
      toast.error('Login failed');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('admin@gmail.com');
    setPassword('password');
    try {
      setIsLoggingIn(true);
      await login('admin@gmail.com', 'password');
      toast.success('Signed in as Demo Admin');
    } catch {
      toast.error('Demo sign-in failed');
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
      <div className="w-full max-w-md glass-card p-8 animate-scale-in" role="region" aria-label="Login panel">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center mx-auto mb-4">
            <Shield className="text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">CrimeConnect</h1>
          <p className="text-muted-foreground mt-2">Sign in to your account</p>
          <div className="mt-3 inline-flex items-center text-xs text-muted-foreground bg-primary/10 border border-primary/20 rounded px-2 py-1">
            <KeyRound size={12} className="mr-1 text-primary" />
            Use demo: admin@gmail.com / password
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5" aria-label="Login form">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full"
              autoComplete="email"
              disabled={isLoggingIn}
              required
              aria-required="true"
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pr-10"
                autoComplete="current-password"
                disabled={isLoggingIn}
                required
                aria-required="true"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <label className="inline-flex items-center gap-2 select-none cursor-pointer">
                <input
                  type="checkbox"
                  className="accent-primary"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                />
                Remember email
              </label>
              <button
                type="button"
                onClick={handleDemoLogin}
                className="text-primary hover:underline"
              >
                Quick demo login
              </button>
            </div>
          </div>
          {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
          <Button type="submit" className="w-full" disabled={isLoggingIn || loading} aria-busy={isLoggingIn}>
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
