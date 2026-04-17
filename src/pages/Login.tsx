import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Loader2, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function Login() {
  const navigate = useNavigate();
  const { signIn, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await signIn(email, password);
      toast.success('Authenticated');
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      toast.error('Authentication failed', { description: err?.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.15),transparent_60%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.04)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.04)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <Card className="relative w-full max-w-md card-intel border-primary/20 backdrop-blur-xl">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto h-14 w-14 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-[0_0_30px_-4px_hsl(var(--primary)/0.6)]">
            <Lock className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <span className="classified-tag mb-3 inline-block">Top Secret</span>
            <CardTitle className="text-2xl tracking-tight">CrimeConnect</CardTitle>
            <CardDescription className="font-mono text-[11px] uppercase tracking-[0.2em] mt-1">
              Investigation Console — Secure Access
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs uppercase tracking-wider">Email</Label>
              <Input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="agent@fbi.gov" className="font-mono" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs uppercase tracking-wider">Password</Label>
                <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot?</Link>
              </div>
              <Input id="password" type="password" autoComplete="current-password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <Button type="submit" disabled={submitting} className="w-full h-11 font-medium">
              {submitting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Authenticating</> : <><ShieldCheck className="h-4 w-4 mr-2" /> Sign in</>}
            </Button>
          </form>
          <p className="text-center text-xs text-muted-foreground mt-6">
            New agent? <Link to="/register" className="text-primary hover:underline">Request access</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
