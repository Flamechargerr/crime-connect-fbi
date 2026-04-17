import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Loader2, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

export default function Register() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await signUp(email, password, displayName);
      toast.success('Account created');
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      toast.error('Registration failed', { description: err?.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.15),transparent_60%)]" />
      <Card className="relative w-full max-w-md card-intel">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto h-14 w-14 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
            <Lock className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Request access</CardTitle>
          <CardDescription className="font-mono text-[11px] uppercase tracking-[0.2em]">
            New Agent Onboarding
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs uppercase">Display name</Label>
              <Input id="name" required value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Special Agent Doe" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs uppercase">Email</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="agent@fbi.gov" className="font-mono" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs uppercase">Password</Label>
              <Input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button type="submit" disabled={submitting} className="w-full h-11">
              {submitting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Creating</> : <><UserPlus className="h-4 w-4 mr-2" /> Create account</>}
            </Button>
          </form>
          <p className="text-center text-xs text-muted-foreground mt-6">
            Already enrolled? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
