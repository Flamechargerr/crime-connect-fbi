import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield } from 'lucide-react';

const ForgotPassword: React.FC = () => {
  const { resetPassword, isAuthenticated, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email');
      return;
    }
    try {
      setIsSubmitting(true);
      setError('');
      await resetPassword(email);
      setSent(true);
      toast.success('Password reset email sent!');
    } catch (error: any) {
      setError(error.message || 'Failed to send reset email');
      toast.error('Failed to send reset email');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }
  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background/90 p-4">
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/20" />
        </div>
        <div className="w-full max-w-md glass-card p-8 animate-scale-in text-center">
          <Shield className="w-12 h-12 mx-auto mb-4 text-primary-foreground bg-primary rounded-lg p-2" />
          <h1 className="text-2xl font-bold mb-2">Check your email</h1>
          <p className="text-muted-foreground mb-4">A password reset link has been sent to <span className="font-medium">{email}</span>.</p>
          <Link to="/login" className="text-primary hover:underline">Return to Login</Link>
        </div>
      </div>
    );
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
          <p className="text-muted-foreground mt-2">Reset your password</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" className="w-full" autoComplete="email" disabled={isSubmitting} />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={isSubmitting || loading}>
            {isSubmitting ? 'Sending...' : 'Send Reset Email'}
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            <Link to="/login" className="text-primary hover:underline">Return to Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword; 