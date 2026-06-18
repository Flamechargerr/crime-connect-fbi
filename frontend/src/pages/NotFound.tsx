import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-background bg-cyber-grid px-4 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Scan line overlay */}
      <div className="absolute left-0 right-0 h-[1px] bg-primary/10 animate-scan top-0 pointer-events-none" />

      {/* Floating glow blobs */}
      <div className="glow-blob w-72 h-72 bg-primary/15 top-1/4 -left-20 absolute" />
      <div className="glow-blob w-96 h-96 bg-destructive/10 bottom-1/4 -right-24 absolute" />
      <div className="glow-blob w-56 h-56 bg-warning/10 top-1/3 right-1/4 absolute" />

      <div className="text-center space-y-6 relative z-10">
        {/* Alert icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
        >
          <AlertTriangle className="h-14 w-14 text-destructive mx-auto animate-pulse" />
        </motion.div>

        {/* Massive 404 with glitch */}
        <motion.h1
          className="text-9xl font-mono font-bold text-white text-glow animate-glitch select-none"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          404
        </motion.h1>

        {/* Signal lost label */}
        <motion.p
          className="text-sm font-mono font-bold uppercase tracking-widest text-primary/80"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
        >
          SIGNAL_LOST // UNAUTHORIZED_SECTOR
        </motion.p>

        {/* Description */}
        <motion.p
          className="text-xs font-mono text-muted-foreground max-w-md mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
        >
          The requested resource could not be located in the secure network.
          <br />
          <span className="text-destructive/60">ERR::NODE_UNREACHABLE — PATH_NOT_FOUND</span>
        </motion.p>

        {/* Return to base button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.4 }}
        >
          <Link to="/">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                className="font-mono uppercase tracking-wider text-xs gap-2 border-primary/40 text-primary hover:bg-primary/10 hover:text-primary hover:shadow-[0_0_15px_rgba(0,255,255,0.15)] transition-shadow"
              >
                <ArrowLeft className="h-4 w-4" />
                Return to Base
              </Button>
            </motion.div>
          </Link>
        </motion.div>

        {/* Bottom status line */}
        <motion.div
          className="pt-4 flex items-center justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          <span className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-destructive/60">
            SYSTEM BREACH DETECTED — SECTOR QUARANTINED
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}
