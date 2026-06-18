import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ArrowRight, Database, Brain, Map, BarChart3, Lock, Terminal, Activity, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MOCK_LOGS = [
  'SYSTEM STATUS: ACTIVE [SECURE]',
  'INGESTING NEW INCIDENTS FROM CHICAGO PORTAL...',
  'AGGREGATING 8,000,000+ HISTORICAL POINTS...',
  'ESTABLISHING JWT ENCRYPTED CHANNEL...',
  'UPDATING GEOSPATIAL HEATMAP CLUSTERS...',
  'RUNNING PREDICTIVE RANDOM FOREST THREAT EVAL...',
  'PRED_RESULT: CASE #9928A -> SEVERITY [HIGH]',
  'ANALYST PORTAL READY ON PORT:443',
  'SYNCED TIME WITH CENTRAL DISPATCH...',
  'MODEL METRIC: OUT-OF-BAG ACCURACY: 84.76%',
];

export default function Landing() {
  const [logs, setLogs] = useState<string[]>([
    'SYSTEM STATUS: ACTIVE [SECURE]',
    'INGESTING NEW INCIDENTS FROM CHICAGO PORTAL...',
    'ESTABLISHING JWT ENCRYPTED CHANNEL...',
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLogs((prev) => {
        const nextLog = MOCK_LOGS[Math.floor(Math.random() * MOCK_LOGS.length)];
        const timestamp = new Date().toLocaleTimeString();
        const formattedLog = `[${timestamp}] ${nextLog}`;
        return [...prev.slice(-5), formattedLog];
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen bg-background overflow-hidden bg-cyber-grid">
      {/* Glow Blobs */}
      <div className="glow-blob bg-primary w-[300px] h-[300px] md:w-[500px] md:h-[500px] top-[-10%] left-[-10%] opacity-10" />
      <div className="glow-blob bg-secondary w-[300px] h-[300px] md:w-[500px] md:h-[500px] bottom-[-10%] right-[-10%] opacity-10" />

      {/* Header */}
      <header className="border-b border-border bg-background/50 backdrop-blur-md relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-2 cursor-pointer"
            whileHover={{ scale: 1.02 }}
          >
            <Shield className="h-5 w-5 text-primary text-glow" />
            <span className="font-mono font-bold tracking-wider uppercase text-sm text-glow text-primary">
              Crime Connect <span className="text-secondary">FBI</span>
            </span>
          </motion.div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="cursor-pointer">
              <motion.div whileHover={{ y: -1 }} whileTap={{ y: 0 }}>
                <Button variant="ghost" size="sm" className="font-mono text-xs hover:text-primary cursor-pointer">
                  Sign In
                </Button>
              </motion.div>
            </Link>
            <Link to="/register" className="cursor-pointer">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Button size="sm" className="font-mono text-xs border border-primary/30 bg-primary/10 hover:bg-primary/20 text-primary shadow-[0_0_15px_rgba(0,255,255,0.15)] cursor-pointer">
                  Get Started
                </Button>
              </motion.div>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-16 pb-24 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Hero text */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div 
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono mb-4 text-glow"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              LIVE DATASTREAM · CHICAGO POLICE API · 8M+ RECORDS
            </motion.div>

            <motion.h1 
              className="text-4xl md:text-6xl font-bold font-mono tracking-tight text-white leading-none"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              CRIME INTELLIGENCE<br />
              <span className="gradient-text text-glow">MADE REAL.</span>
            </motion.h1>

            <motion.p 
              className="text-muted-foreground text-sm md:text-base max-w-xl leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              A tactical, high-performance analytics platform linking real-time crime data, 
              predictive models, and secure case records. Engineered for deep intelligence and fast threat assessment.
            </motion.p>

            <motion.div 
              className="flex flex-wrap gap-4 pt-4"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link to="/register" className="cursor-pointer">
                <Button size="lg" className="gap-2 font-mono text-sm bg-primary hover:bg-primary/80 text-background font-semibold cursor-pointer shadow-[0_0_20px_rgba(0,255,255,0.2)]">
                  Launch Console <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login" className="cursor-pointer">
                <Button size="lg" variant="outline" className="font-mono text-sm border-border hover:bg-white/5 cursor-pointer">
                  Security Access
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Cyber Terminal Preview Widget */}
          <motion.div 
            className="lg:col-span-5 relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Holographic backdrop glow */}
            <div className="absolute inset-0 bg-primary/5 rounded-2xl filter blur-xl" />

            <div className="relative rounded-2xl border border-primary/20 bg-black/80 p-5 font-mono text-xs text-primary shadow-[0_0_30px_rgba(0,255,255,0.15)] overflow-hidden">
              {/* Scanline overlay */}
              <div className="absolute inset-0 pointer-events-none bg-cyber-fine opacity-20" />
              <div className="absolute left-0 right-0 h-[1.5px] bg-primary/30 animate-scan top-0 pointer-events-none" />

              {/* Terminal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-primary/20 mb-4 text-primary/70">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4" />
                  <span className="font-bold">CRIME_NET // SECURE_SHELL</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Activity className="h-3 w-3 animate-pulse text-secondary" />
                  <span className="text-[10px] tracking-widest text-secondary font-bold">ONLINE</span>
                </div>
              </div>

              {/* System info */}
              <div className="grid grid-cols-2 gap-2 mb-4 text-[10px] text-primary/60 border-b border-primary/10 pb-3">
                <div>NODE: CHI_METRO_01</div>
                <div>INTELLIGENCE: RF_V2</div>
                <div>SECURE TUNNEL: ACTIVE</div>
                <div>SHIELD LEVEL: 100%</div>
              </div>

              {/* Log stream */}
              <div className="h-44 overflow-y-auto space-y-1.5 scrollbar-thin text-[11px]">
                <AnimatePresence initial={false}>
                  {logs.map((log, index) => (
                    <motion.div
                      key={index + log}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="leading-relaxed whitespace-nowrap overflow-hidden text-ellipsis"
                    >
                      <span className="text-secondary/70">&gt;</span> {log}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Simulated radar pulse or chart */}
              <div className="mt-4 pt-3 border-t border-primary/20 flex items-center justify-between text-primary/70">
                <div className="flex items-center gap-1">
                  <Cpu className="h-3.5 w-3.5 text-secondary" />
                  <span className="text-[10px] uppercase font-semibold">Threat Probability Matrix</span>
                </div>
                <div className="flex gap-1 items-end h-6">
                  <span className="w-1 bg-primary/40 h-2 animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <span className="w-1 bg-primary/80 h-4 animate-bounce" style={{ animationDelay: '0.3s' }} />
                  <span className="w-1 bg-secondary h-6 animate-bounce" style={{ animationDelay: '0.5s' }} />
                  <span className="w-1 bg-primary h-3 animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <span className="w-1 bg-primary/60 h-5 animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {[
            { label: 'Data Points', value: '8,000,000+', icon: Database, accent: 'text-primary' },
            { label: 'ML Model Accuracy', value: '~85%', icon: Brain, accent: 'text-secondary' },
            { label: 'Districts Covered', value: '25 Districts', icon: Map, accent: 'text-accent' },
            { label: 'Incident Categories', value: '35+ Types', icon: BarChart3, accent: 'text-primary' },
          ].map((stat) => (
            <motion.div 
              key={stat.label} 
              className="card-intel p-5 flex flex-col justify-between hover:border-primary/40 transition-colors"
              whileHover={{ scale: 1.03, y: -2 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            >
              <div>
                <stat.icon className={`h-5 w-5 mb-4 ${stat.accent}`} />
                <div className="text-2xl font-bold font-mono tracking-tight text-white">{stat.value}</div>
              </div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mt-2">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* Features Grid */}
      <section className="relative border-t border-border bg-card/10 backdrop-blur-sm z-10">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl md:text-3xl font-mono font-bold text-white text-glow">
              TACTICAL CORE CAPABILITIES
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              Advanced crime analytics backend integrated into an ergonomic HUD interface.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Real-Time Ingestion',
                desc: 'Continuous fetching from Chicago Open Data. Advanced queries filtered by crime types, date ranges, arrest flags, and community areas.',
                icon: Database,
              },
              {
                title: 'Machine Learning Core',
                desc: 'Random Forest models trained on historical datasets. Instantly generates case triage classifications and threat index predictions.',
                icon: Brain,
              },
              {
                title: 'Geospatial Heatmaps',
                desc: 'Interactive Map visualizations featuring cluster markers, district boundaries, and hot-spot severity filters.',
                icon: Map,
              },
              {
                title: 'Case Telemetry',
                desc: 'Collaborative case tracking. Create, assign, prioritize, and log developments on critical ongoing crime investigation workflows.',
                icon: BarChart3,
              },
              {
                title: 'Bcrypt-JWT Security',
                desc: 'Military-grade password security using Bcrypt hashing with secure JWT tokens. Enforces granular user session authentication.',
                icon: Lock,
              },
              {
                title: 'Temporal Reporting',
                desc: 'Automated statistical summarization. Export crime trends, peak hour distributions, and predictive accuracies on demand.',
                icon: Activity,
              },
            ].map((feature) => (
              <motion.div 
                key={feature.title} 
                className="card-intel p-6 border-border/80 hover:border-primary/30"
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <div className="h-10 w-10 rounded-lg bg-primary/5 flex items-center justify-center mb-4 border border-primary/20">
                  <feature.icon className="h-5 w-5 text-primary text-glow" />
                </div>
                <h3 className="font-mono font-bold text-sm text-white mb-2 tracking-wide uppercase">
                  {feature.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 bg-black/40 z-10 relative">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-xs text-muted-foreground font-mono gap-4">
          <div>
            Crime Connect FBI v2.0.0 // AGENCY USE ONLY
          </div>
          <div className="flex gap-4">
            <span className="hover:text-primary cursor-pointer">Security Protocol</span>
            <span className="hover:text-primary cursor-pointer">Terminal Manual</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
