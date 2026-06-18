import { Link } from 'react-router-dom';
import { Shield, ArrowRight, Database, Brain, Map, BarChart3, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-semibold">Crime Connect FBI</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Live Chicago crime data · 8M+ records
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Crime intelligence, <span className="gradient-text">made real.</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl">
            A production-grade analytics platform connecting real-time crime data, 
            machine learning predictions, and case management — built for analysts who need answers, not gimmicks.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/register">
              <Button className="gap-2">
                Launch Dashboard <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline">Demo Access</Button>
            </Link>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
          {[
            { label: 'Data Points', value: '8,000,000+', icon: Database },
            { label: 'ML Accuracy', value: '~85%', icon: Brain },
            { label: 'Districts Covered', value: '25', icon: Map },
            { label: 'Crime Types', value: '35+', icon: BarChart3 },
          ].map((stat) => (
            <div key={stat.label} className="card-intel p-5">
              <stat.icon className="h-5 w-5 text-primary mb-3" />
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-card/30">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold mb-8">What you get</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Real-Time Data',
                desc: 'Pull live crime records from the Chicago open data portal. Filter by type, district, date, and arrest status.',
                icon: Database,
              },
              {
                title: 'Predictive Analytics',
                desc: 'Random Forest model trained on 10,000 real incidents to predict case priority and threat level.',
                icon: Brain,
              },
              {
                title: 'Interactive Mapping',
                desc: 'Leaflet-powered crime heatmap with district clustering, type filtering, and time-based exploration.',
                icon: Map,
              },
              {
                title: 'Case Management',
                desc: 'Create, track, and manage internal cases with priority levels, status tracking, and assignments.',
                icon: BarChart3,
              },
              {
                title: 'Secure Auth',
                desc: 'JWT-based authentication with role-based access. SQLite-backed user management with bcrypt hashing.',
                icon: Lock,
              },
              {
                title: 'Auto Reports',
                desc: 'Generate summary reports with top crime types, model accuracy, and temporal trends on demand.',
                icon: BarChart3,
              },
            ].map((feature) => (
              <div key={feature.title} className="card-intel p-5">
                <feature.icon className="h-5 w-5 text-primary mb-3" />
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-muted-foreground">
          Crime Connect FBI · Built for analysts who need answers, not gimmicks.
        </div>
      </footer>
    </div>
  );
}
