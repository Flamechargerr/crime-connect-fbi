import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Shield, Calendar, LogOut, Fingerprint, Radio, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: 'easeOut' } as any,
  }),
};

export default function Profile() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <motion.div
      className="space-y-6 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Scan line overlay */}
      <div className="absolute left-0 right-0 h-[1px] bg-primary/10 animate-scan top-0 pointer-events-none" />

      {/* HUD Header */}
      <div>
        <h1 className="text-2xl font-mono font-bold uppercase tracking-wider text-glow text-white">
          AGENT_IDENTITY // CLEARANCE_MODULE
        </h1>
        <p className="text-[10px] font-mono uppercase tracking-widest text-primary/60 mt-1">
          Secure personnel file — authenticated access only
        </p>
      </div>

      {/* Agent Avatar Section */}
      <motion.div
        className="flex items-center gap-5"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
      >
        <div className="relative">
          <div className="h-16 w-16 rounded-full neon-border-glow bg-primary/5 flex items-center justify-center">
            <User className="h-8 w-8 text-primary" />
          </div>
          <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-success animate-pulse border-2 border-background" />
        </div>
        <div>
          <div className="text-lg font-mono font-bold text-white tracking-wide">{user.name}</div>
          <div className="text-xs font-mono text-muted-foreground tracking-wider">{user.email}</div>
          <div className="flex items-center gap-2 mt-1.5">
            <Badge variant="outline" className="text-[10px] font-mono uppercase tracking-wider border-primary/40 text-primary">
              {user.role}
            </Badge>
            <Badge variant="outline" className="text-[10px] font-mono uppercase tracking-wider border-warning/40 text-warning">
              CLEARANCE: ALPHA
            </Badge>
          </div>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Account Details Card */}
        <motion.div
          custom={0}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ y: -2, transition: { type: 'spring', stiffness: 300 } }}
        >
          <Card className="card-intel">
            <CardHeader>
              <CardTitle className="text-xs font-mono uppercase tracking-wider text-white flex items-center gap-2">
                <Fingerprint className="h-4 w-4 text-primary" />
                ACCOUNT_DETAILS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary/60" />
                  <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Role</span>
                </div>
                <Badge variant="outline" className="text-[10px] font-mono uppercase w-fit border-primary/30 text-primary">
                  {user.role}
                </Badge>

                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary/60" />
                  <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Email</span>
                </div>
                <span className="font-mono text-xs text-white/80">{user.email}</span>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary/60" />
                  <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Agent ID</span>
                </div>
                <span className="font-mono text-xs text-white/80">{user.id.slice(0, 12)}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Session Status Card */}
        <motion.div
          custom={1}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ y: -2, transition: { type: 'spring', stiffness: 300 } }}
        >
          <Card className="card-intel">
            <CardHeader>
              <CardTitle className="text-xs font-mono uppercase tracking-wider text-white flex items-center gap-2">
                <Radio className="h-4 w-4 text-success" />
                SESSION_INTEL
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Session Status</span>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                    <span className="text-xs font-mono text-success uppercase tracking-wider">Active</span>
                  </div>
                </div>
                <div className="h-px bg-border/50" />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Clearance Level</span>
                  <Badge variant="outline" className="text-[10px] font-mono uppercase tracking-wider border-warning/40 text-warning">
                    ALPHA
                  </Badge>
                </div>
                <div className="h-px bg-border/50" />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Encryption</span>
                  <span className="text-xs font-mono text-primary/80 uppercase">AES-256 ACTIVE</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Security Card */}
        <motion.div
          custom={2}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="md:col-span-2"
          whileHover={{ y: -2, transition: { type: 'spring', stiffness: 300 } }}
        >
          <Card className="card-intel">
            <CardHeader>
              <CardTitle className="text-xs font-mono uppercase tracking-wider text-white flex items-center gap-2">
                <Lock className="h-4 w-4 text-destructive" />
                SECURITY_CONTROLS
              </CardTitle>
              <CardDescription className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                Manage your active session and account security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center justify-between p-3 rounded-md bg-card/50 border border-border/30">
                  <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Last Login</span>
                  <span className="text-xs font-mono text-white/70">
                    {new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-md bg-card/50 border border-border/30">
                  <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Auth Method</span>
                  <span className="text-xs font-mono text-white/70">TOKEN / JWT</span>
                </div>
              </div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button variant="destructive" onClick={logout} className="w-full font-mono uppercase tracking-wider text-xs gap-2">
                  <LogOut className="h-4 w-4" />
                  Terminate Session
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
