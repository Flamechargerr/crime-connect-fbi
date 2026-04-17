import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Lock, ShieldAlert, FileSearch, Users, Globe, ArrowRight, Activity } from 'lucide-react';

export default function Index() {
  const features = [
    { icon: ShieldAlert, title: 'Suspect intelligence', desc: 'Threat-rated profiles, alias graphs and last-known location.' },
    { icon: FileSearch, title: 'Evidence chain', desc: 'Immutable chain-of-custody for digital and physical artifacts.' },
    { icon: Users, title: 'Officer assignments', desc: 'Live agent rosters across divisions with case load tracking.' },
    { icon: Globe, title: 'Global ops view', desc: 'Spatial intelligence for cross-jurisdictional coordination.' },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.18),transparent_60%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.04)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />

      <header className="relative z-10 border-b border-border/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
              <Lock className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-bold">CrimeConnect</div>
              <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">Classified</div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" asChild><Link to="/login">Sign in</Link></Button>
            <Button asChild><Link to="/register">Request access</Link></Button>
          </div>
        </div>
      </header>

      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-16 text-center">
        <span className="classified-tag mb-6 inline-block">Top Secret // FBI Cyber Division</span>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
          Not just connecting clues — <br />
          <span className="gradient-text">connecting dots with data.</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
          A unified investigation console for cases, criminals, evidence, and officers.
          Built for speed, secured by design.
        </p>
        <div className="flex gap-3 justify-center">
          <Button size="lg" asChild className="h-12 px-6">
            <Link to="/login">
              Access console <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="h-12 px-6">
            <Link to="/register">New agent</Link>
          </Button>
        </div>

        <div className="flex items-center justify-center gap-2 mt-8 text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
          <Activity className="h-3 w-3" /> All systems operational
        </div>
      </section>

      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f) => (
            <div key={f.title} className="card-intel p-5">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
