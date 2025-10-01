
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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-background" />
        <div className="absolute inset-0 grid-lines opacity-30"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="w-full max-w-md glass-card rounded-2xl p-8 animate-scale-in scan-line relative" role="region" aria-label="Login panel">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>

        <div className="text-center mb-8">
          <div className="relative inline-block mb-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500/30 to-blue-500/30 border-2 border-cyan-500/50 flex items-center justify-center mx-auto relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-transparent animate-pulse"></div>
              <Shield className="text-cyan-400 h-8 w-8 relative z-10" />
            </div>
            <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl blur-xl -z-10 animate-pulse"></div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">CrimeConnect</h1>
          <p className="text-muted-foreground mt-2">Secure Access Portal</p>
          <div className="mt-4 inline-flex items-center gap-2 text-xs text-cyan-400/70 bg-cyan-500/10 border border-cyan-500/20 rounded-lg px-3 py-2">
            <KeyRound size={14} className="text-cyan-400" />
            <span>Demo: admin@gmail.com / password</span>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5" aria-label="Login form">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
              <span>Email</span>
              <div className="h-1 w-1 rounded-full bg-cyan-400 animate-pulse"></div>
            </label>
            <div className="relative group">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="agent@crimeconnect.fbi"
                className="w-full bg-cyan-500/5 border-cyan-500/20 focus:border-cyan-500/50 focus:ring-cyan-500/20"
                autoComplete="email"
                disabled={isLoggingIn}
                required
                aria-required="true"
                autoFocus
              />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-400/0 via-cyan-400/5 to-cyan-400/0 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                <span>Password</span>
                <div className="h-1 w-1 rounded-full bg-cyan-400 animate-pulse"></div>
              </label>
              <Link to="/forgot-password" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">Forgot password?</Link>
            </div>
            <div className="relative group">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pr-10 bg-cyan-500/5 border-cyan-500/20 focus:border-cyan-500/50 focus:ring-cyan-500/20"
                autoComplete="current-password"
                disabled={isLoggingIn}
                required
                aria-required="true"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-cyan-500/10 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} className="text-cyan-400/70" /> : <Eye size={16} className="text-cyan-400/70" />}
              </button>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-400/0 via-cyan-400/5 to-cyan-400/0 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <label className="inline-flex items-center gap-2 select-none cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
                <input
                  type="checkbox"
                  className="accent-cyan-500 rounded"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                />
                Remember email
              </label>
              <button
                type="button"
                onClick={handleDemoLogin}
                className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
              >
                Quick demo login
              </button>
            </div>
          </div>
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400" role="alert">
              {error}
            </div>
          )}
          <Button
            type="submit"
            className="w-full h-11 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium rounded-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/25"
            disabled={isLoggingIn || loading}
            aria-busy={isLoggingIn}
          >
            {isLoggingIn ? (
              <span className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                Authenticating...
              </span>
            ) : (
              'Sign In'
            )}
          </Button>
          <div className="text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">Register</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
