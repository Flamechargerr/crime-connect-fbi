import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Alert, AlertDescription } from '../components/ui/alert';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, User, Mail, Eye, EyeOff, AlertTriangle, CheckCircle } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Security codes do not match');
      setLoading(false);
      return;
    }

    const result = await register(formData);
    
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
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* FBI Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/30 mb-4 holographic-element">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-wider mb-2">
            <span className="animated-text-scan">Agent Registration</span>
          </h1>
          <p className="text-muted-foreground text-sm">Federal Bureau of Investigation</p>
          <p className="text-xs text-primary/80 mt-1 font-mono">SECURE CREDENTIALS REQUEST</p>
        </div>

        <Card className="glass-card">
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center">
              <User className="mr-2 h-5 w-5 text-primary" />
              New Agent Registration
            </CardTitle>
            <CardDescription>Request access credentials for the FBI CrimeConnect system</CardDescription>
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
                <Label htmlFor="username" className="text-sm font-medium">Agent Name</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="bg-black/20 border-primary/30 focus:border-primary"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Official Email</Label>
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
                    placeholder="Create security code"
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
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Security Code</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm security code"
                  className="bg-black/20 border-primary/30 focus:border-primary"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 transition-all duration-300"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                    Processing Request...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Request Access Credentials
                  </div>
                )}
              </Button>
            </form>
            
            <div className="mt-6">
              <div className="digital-divider"></div>
              
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-2">Already have credentials?</p>
                <Link to="/login">
                  <Button variant="outline" className="w-full border-primary/30 hover:border-primary transition-all duration-300">
                    <Lock className="mr-2 h-4 w-4" />
                    Access Secure System
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security notice */}
        <div className="mt-6 p-4 bg-secure-blue/10 border border-secure-blue/30 rounded-lg">
          <div className="flex items-start">
            <Shield className="h-4 w-4 text-secure-blue mt-0.5 mr-2 flex-shrink-0" />
            <div className="text-xs">
              <p className="text-secure-blue font-medium mb-1">SECURITY NOTICE</p>
              <p className="text-muted-foreground">
                All registration requests are subject to background verification and security clearance approval. 
                Access will be granted only to authorized federal personnel.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;