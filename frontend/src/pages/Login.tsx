import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Shield, Lock, User, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-background to-cyan-900/5"></div>
      <div className="absolute inset-0 bg-grid-pattern"></div>
      
      {/* Scan lines effect */}
      <div className="absolute inset-0 pointer-events-none scan-lines"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="glass-card rounded-2xl p-8 shadow-2xl border-cyan-500/30">
          {/* FBI Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-transparent animate-pulse"></div>
                <Shield className="h-8 w-8 text-cyan-400 relative z-10" />
              </div>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent mb-2">
              FBI CRIMECONNECT
            </h1>
            <p className="text-sm text-muted-foreground uppercase tracking-widest">
              CLASSIFIED LAW ENFORCEMENT SYSTEM
            </p>
            <div className="flex items-center justify-center gap-2 mt-3">
              <Lock className="h-4 w-4 text-green-400 animate-pulse" />
              <span className="text-xs text-green-400 font-medium">SECURE CONNECTION ESTABLISHED</span>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
              <Zap className="h-4 w-4" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                AGENT IDENTIFICATION
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-cyan-400/70" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-pro w-full pl-10 pr-4 py-3 bg-cyan-500/5 border-cyan-500/20 focus:border-cyan-500/50 focus:bg-cyan-500/10"
                  placeholder="agent.username@fbi.gov"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                SECURITY CLEARANCE
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-cyan-400/70" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-pro w-full pl-10 pr-12 py-3 bg-cyan-500/5 border-cyan-500/20 focus:border-cyan-500/50 focus:bg-cyan-500/10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-cyan-400/70 hover:text-cyan-400 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-cyan-400/70 hover:text-cyan-400 transition-colors" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-cyan-500 focus:ring-cyan-500 border-cyan-500/30 rounded bg-cyan-500/5"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-foreground">
                  Remember device
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors">
                  Forgot credentials?
                </Link>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full btn-pro bg-gradient-to-r from-cyan-500 to-blue-500 border-cyan-500/50 hover:from-cyan-600 hover:to-blue-600 hover:border-cyan-500/70 text-white py-3"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
                    <span>AUTHENTICATING...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Shield className="h-5 w-5" />
                    <span>ACCESS SYSTEM</span>
                  </div>
                )}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground text-center">
              This system is restricted to authorized FBI personnel only.
              Unauthorized access is prohibited and will be prosecuted.
            </p>
            <div className="flex items-center justify-center gap-2 mt-3">
              <div className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-[10px] text-green-400 font-medium">CONNECTION SECURE</span>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Don't have access?{' '}
            <Link to="/register" className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors">
              Request authorization
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;