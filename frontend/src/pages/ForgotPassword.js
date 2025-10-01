import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Shield, Lock, Mail, ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate password reset request
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess(true);
    } catch (err) {
      setError('Failed to process reset request. Please contact IT support.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#0a1117] bg-digital-circuit flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secure-green/10 border border-secure-green/30 mb-4">
              <CheckCircle className="h-8 w-8 text-secure-green" />
            </div>
            <h1 className="text-2xl font-bold tracking-wider mb-2 text-secure-green">
              Reset Request Sent
            </h1>
          </div>

          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="p-4 bg-secure-green/10 border border-secure-green/30 rounded-lg">
                  <p className="text-sm text-secure-green">
                    A security clearance reset request has been submitted to the IT Security Division.
                  </p>
                </div>
                
                <div className="text-xs text-muted-foreground space-y-2">
                  <p>• Reset instructions will be sent to your official FBI email</p>
                  <p>• Processing time: 2-4 business hours</p>
                  <p>• Contact IT Support if no response within 24 hours</p>
                </div>
                
                <Link to="/login">
                  <Button className="w-full mt-6">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Return to Login
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a1117] bg-digital-circuit flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* FBI Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/30 mb-4 holographic-element">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-wider mb-2">
            <span className="animated-text-scan">Security Reset</span>
          </h1>
          <p className="text-muted-foreground text-sm">Federal Bureau of Investigation</p>
          <p className="text-xs text-primary/80 mt-1 font-mono">CLEARANCE CODE RECOVERY</p>
        </div>

        <Card className="glass-card">
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center">
              <Lock className="mr-2 h-5 w-5 text-primary" />
              Reset Security Code
            </CardTitle>
            <CardDescription>
              Enter your official FBI email to request a security clearance code reset
            </CardDescription>
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
                <Label htmlFor="email" className="text-sm font-medium">Official FBI Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="agent@fbi.gov"
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
                    <Mail className="mr-2 h-4 w-4" />
                    Submit Reset Request
                  </div>
                )}
              </Button>
            </form>
            
            <div className="mt-6">
              <div className="digital-divider"></div>
              
              <div className="text-center">
                <Link to="/login">
                  <Button variant="outline" className="w-full border-primary/30 hover:border-primary transition-all duration-300">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Login
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security notice */}
        <div className="mt-6 p-4 bg-secure-red/10 border border-secure-red/30 rounded-lg">
          <div className="flex items-start">
            <AlertTriangle className="h-4 w-4 text-secure-red mt-0.5 mr-2 flex-shrink-0" />
            <div className="text-xs">
              <p className="text-secure-red font-medium mb-1">SECURITY PROTOCOL</p>
              <p className="text-muted-foreground">
                All password reset requests are logged and monitored by the FBI IT Security Division. 
                Unauthorized requests will trigger security protocols.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;