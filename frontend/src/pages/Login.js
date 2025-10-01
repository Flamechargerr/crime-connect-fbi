import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Alert, AlertDescription } from '../components/ui/alert';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, Eye, EyeOff, Globe, Radio, AlertTriangle } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-[#0a1117] bg-digital-circuit flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-secure-blue/5 animate-float"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-px h-full bg-primary/10"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-px bg-primary/10"></div>
      </div>

      {/* Security status bar */}
      <div className="absolute top-0 left-0 right-0 bg-black/60 backdrop-blur-md border-b border-primary/20 p-2">
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Shield size={12} className="mr-1 text-secure-green animate-pulse" />
              <span>SECURE CONNECTION</span>
            </div>
            <div className="flex items-center">
              <Lock size={12} className="mr-1 text-secure-blue" />
              <span>TLS 1.3 ENCRYPTED</span>
            </div>
            <div className="flex items-center">
              <Globe size={12} className="mr-1 text-primary" />
              <span>FBI NETWORK ACCESS</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Radio size={12} className="mr-1 text-secure-yellow animate-pulse" />
              <span>MONITORING ACTIVE</span>
            </div>
            <div className="font-mono text-primary/80">
              {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* FBI Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/30 mb-4 holographic-element">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-wider mb-2">
            <span className="animated-text-scan">CrimeConnect</span>
          </h1>
          <p className="text-muted-foreground text-sm">Federal Bureau of Investigation</p>
          <p className="text-xs text-primary/80 mt-1 font-mono">CLASSIFIED ACCESS PORTAL</p>
        </div>

        <Card className="glass-card">
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center">
              <Lock className="mr-2 h-5 w-5 text-primary" />
              Agent Authentication
            </CardTitle>
            <CardDescription>Enter your credentials to access the secure system</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert className="border-destructive/50 text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Agent Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="agent@fbi.gov"
                  className="bg-black/20 border-primary/30 focus:border-primary"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Security Clearance Code</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your clearance code"
                    className="bg-black/20 border-primary/30 focus:border-primary pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 transition-all duration-300 relative overflow-hidden"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                    Authenticating...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Shield className="mr-2 h-4 w-4" />
                    Access Secure System
                  </div>
                )}
              </Button>
            </form>
            
            <div className="mt-6 space-y-4">
              <div className="text-center">
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  Forgot Security Code?
                </Link>
              </div>
              
              <div className="digital-divider"></div>
              
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-2">New Agent Registration</p>
                <Link to="/register">
                  <Button variant="outline" className="w-full border-primary/30 hover:border-primary transition-all duration-300">
                    Request Access Credentials
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo credentials notice */}
        <div className="mt-6 p-4 bg-secure-yellow/10 border border-secure-yellow/30 rounded-lg">
          <div className="flex items-start">
            <AlertTriangle className="h-4 w-4 text-secure-yellow mt-0.5 mr-2 flex-shrink-0" />
            <div className="text-xs">
              <p className="text-secure-yellow font-medium mb-1">DEMO ACCESS AVAILABLE</p>
              <p className="text-muted-foreground">
                Email: <span className="font-mono text-secure-yellow">demo@fbi.gov</span><br />
                Code: <span className="font-mono text-secure-yellow">demo123</span>
              </p>
            </div>
          </div>
        </div>

        {/* Security footer */}
        <div className="mt-8 text-center text-xs text-muted-foreground">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <div className="h-1.5 w-1.5 bg-secure-green rounded-full mr-1.5 animate-pulse"></div>
              <span>SYSTEM SECURE</span>
            </div>
            <div className="flex items-center">
              <div className="h-1.5 w-1.5 bg-secure-blue rounded-full mr-1.5"></div>
              <span>SESSION ENCRYPTED</span>
            </div>
          </div>
          <p className="mt-2 font-mono text-primary/60">FBI CrimeConnect v3.2.1 | Build 20240315</p>
        </div>
      </div>
    </div>
  );
};

export default Login;