import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Mail } from 'lucide-react';
import { toast } from 'sonner';

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await resetPassword(email);
      setSent(true);
      toast.success('Reset link sent');
    } catch (err: any) {
      toast.error('Could not send', { description: err?.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md card-intel">
        <CardHeader className="text-center">
          <div className="mx-auto h-12 w-12 rounded-xl bg-primary/15 flex items-center justify-center mb-2">
            <Mail className="h-5 w-5 text-primary" />
          </div>
          <CardTitle>Reset password</CardTitle>
          <CardDescription>We'll email you a secure reset link.</CardDescription>
        </CardHeader>
        <CardContent>
          {sent ? (
            <p className="text-sm text-center text-muted-foreground">
              If an account exists for <span className="text-foreground font-mono">{email}</span>, you'll receive instructions shortly.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="font-mono" />
              </div>
              <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send reset link'}
              </Button>
            </form>
          )}
          <p className="text-center text-xs text-muted-foreground mt-6">
            <Link to="/login" className="text-primary hover:underline">Back to sign in</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
