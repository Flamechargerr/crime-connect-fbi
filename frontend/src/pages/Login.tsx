import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Shield, AlertCircle, Key, Mail, Fingerprint } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background px-4 bg-cyber-grid overflow-hidden">
      {/* Background blobs */}
      <div className="glow-blob bg-primary w-[300px] h-[300px] top-[10%] left-[10%] opacity-10" />
      <div className="glow-blob bg-secondary w-[300px] h-[300px] bottom-[10%] right-[10%] opacity-10" />

      {/* Grid Fine */}
      <div className="absolute inset-0 bg-cyber-grid-fine opacity-30 pointer-events-none" />

      <motion.div 
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 200, damping: 18 }}
      >
        <div className="glass-panel p-8 rounded-2xl border border-primary/20 shadow-[0_0_40px_rgba(0,255,255,0.08)] relative overflow-hidden">
          {/* Scanline */}
          <div className="absolute left-0 right-0 h-[1.5px] bg-primary/20 animate-scan top-0 pointer-events-none" />

          {/* Corner Decors */}
          <div className="absolute top-2 left-2 font-mono text-[9px] text-primary/40">SECURE_AUTH // V2.0</div>
          <div className="absolute top-2 right-2 font-mono text-[9px] text-primary/40">LOC: 41.8781 N</div>
          <div className="absolute bottom-2 left-2 font-mono text-[9px] text-primary/40">SHIELD_STATUS: OK</div>
          <div className="absolute bottom-2 right-2 font-mono text-[9px] text-primary/40">PORT: 443 [TLS]</div>

          <div className="text-center mb-8">
            <motion.div 
              className="h-14 w-14 rounded-2xl bg-primary/5 flex items-center justify-center mx-auto mb-4 border border-primary/30 shadow-[0_0_15px_rgba(0,255,255,0.15)]"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Shield className="h-7 w-7 text-primary text-glow" />
            </motion.div>
            <h1 className="text-2xl font-bold font-mono tracking-wider text-white uppercase text-glow">
              CRIME CONNECT <span className="text-secondary">FBI</span>
            </h1>
            <p className="text-xs text-muted-foreground font-mono mt-2 tracking-wide uppercase">
              AGENT PORTAL GATEWAY
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            {error && (
              <motion.div 
                className="flex items-center gap-2 text-xs font-mono text-destructive bg-destructive/10 border border-destructive/20 p-3.5 rounded-lg"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>AUTH_ERROR: {error.toUpperCase()}</span>
              </motion.div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-primary" /> Agent Email
              </label>
              <div className="relative group">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="agent@fbi.gov"
                  required
                  className="bg-black/40 border-border/80 focus:border-primary/60 focus:ring-1 focus:ring-primary/60 placeholder:text-muted-foreground/40 font-mono text-xs cursor-text w-full py-5 rounded-lg transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Key className="h-3.5 w-3.5 text-primary" /> Security Keycode
              </label>
              <div className="relative group">
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="bg-black/40 border-border/80 focus:border-primary/60 focus:ring-1 focus:ring-primary/60 placeholder:text-muted-foreground/40 font-mono text-xs cursor-text w-full py-5 rounded-lg transition-all"
                />
              </div>
            </div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="pt-2"
            >
              <Button 
                type="submit" 
                className="w-full font-mono text-xs uppercase tracking-widest bg-primary hover:bg-primary/80 text-background font-semibold cursor-pointer shadow-[0_0_20px_rgba(0,255,255,0.15)] py-6"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Fingerprint className="h-4 w-4 animate-pulse text-background" />
                    DECRYPTING CREDENTIALS...
                  </span>
                ) : (
                  'Establish Secure Connection'
                )}
              </Button>
            </motion.div>
          </form>

          <div className="mt-8 pt-5 border-t border-border/60 text-center relative z-10">
            <p className="text-xs font-mono text-muted-foreground uppercase">
              No authorization credentials?{' '}
              <Link to="/register" className="text-primary hover:text-primary/80 font-bold hover:underline cursor-pointer">
                Request Access
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
