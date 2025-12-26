import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Users,
  Package,
  Activity,
  Clock,
  MapPin,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  Shield,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Radio,
  Wifi,
  Lock,
  Eye
} from 'lucide-react';
import { DashboardStats, Case } from '../types';
import { Button } from '@/components/ui/button';

const mockDashboardData: DashboardStats = {
  totalCases: 256,
  openCases: 87,
  closedCases: 169,
  totalCriminals: 324,
  totalEvidence: 512,
  totalWitnesses: 189,
  recentCases: [
    { id: 1, title: 'Armed Robbery - Downtown Bank', status: 'open', description: 'Armed robbery at First National Bank on Main Street', policeStationId: 1, createdAt: new Date('2023-05-15'), updatedAt: new Date('2023-05-18') },
    { id: 2, title: 'Vehicle Theft - Highland Park', status: 'pending', description: 'Luxury vehicle stolen from Highland Park residential area', policeStationId: 2, createdAt: new Date('2023-06-02'), updatedAt: new Date('2023-06-05') },
    { id: 3, title: 'Residential Burglary - Westside', status: 'closed', description: 'Break-in and theft at residential property in Westside neighborhood', policeStationId: 1, createdAt: new Date('2023-04-10'), updatedAt: new Date('2023-04-29') },
    { id: 4, title: 'Assault - Downtown Bar', status: 'open', description: 'Physical assault reported outside The Blue Note Bar', policeStationId: 3, createdAt: new Date('2023-06-10'), updatedAt: new Date('2023-06-10') },
    { id: 5, title: 'Corporate Fraud Investigation', status: 'open', description: 'Financial irregularities detected at major corporation', policeStationId: 4, createdAt: new Date('2023-06-12'), updatedAt: new Date('2023-06-12') }
  ]
};

const StatusBadge: React.FC<{ status: Case['status'] }> = ({ status }) => {
  const styles = {
    open: 'badge-primary',
    closed: 'badge-success',
    pending: 'badge-warning',
  };

  const icons = {
    open: AlertCircle,
    closed: CheckCircle2,
    pending: Clock,
  };

  const Icon = icons[status] || AlertCircle;

  return (
    <span className={`badge ${styles[status] || 'badge-primary'} flex items-center gap-1`}>
      <Icon className="h-3 w-3" />
      <span className="capitalize">{status}</span>
    </span>
  );
};

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        await new Promise(r => setTimeout(r, 300));
        setStats(mockDashboardData);
      } finally { setLoading(false); }
    };
    fetchDashboardData();

    // Update time
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <div className="py-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 rounded-xl bg-muted animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return <div className="p-8 text-center text-muted-foreground">Failed to load dashboard data</div>;

  const statsCards = [
    { title: 'Total Cases', value: stats.totalCases, icon: FileText, trend: '+12%', color: 'blue' },
    { title: 'Open Cases', value: stats.openCases, icon: Activity, trend: `${Math.round((stats.openCases / stats.totalCases) * 100)}%`, color: 'amber' },
    { title: 'Criminals', value: stats.totalCriminals, icon: Users, trend: '+5%', color: 'red' },
    { title: 'Evidence Items', value: stats.totalEvidence, icon: Package, trend: '+24%', color: 'green' },
  ];

  const colorClasses: Record<string, { bg: string; text: string; glow: string }> = {
    blue: { bg: 'bg-blue-500/10 dark:bg-blue-500/20', text: 'text-blue-600 dark:text-blue-400', glow: 'group-hover:shadow-blue-500/20' },
    amber: { bg: 'bg-amber-500/10 dark:bg-amber-500/20', text: 'text-amber-600 dark:text-amber-400', glow: 'group-hover:shadow-amber-500/20' },
    red: { bg: 'bg-red-500/10 dark:bg-red-500/20', text: 'text-red-600 dark:text-red-400', glow: 'group-hover:shadow-red-500/20' },
    green: { bg: 'bg-green-500/10 dark:bg-green-500/20', text: 'text-green-600 dark:text-green-400', glow: 'group-hover:shadow-green-500/20' },
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with Status Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="fbi-header">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Command Center</h1>
              <p className="text-sm text-muted-foreground">FBI CrimeConnect Intelligence Dashboard</p>
            </div>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-green-600 dark:text-green-400 font-medium">SYSTEM ONLINE</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
            <Lock className="h-3 w-3 text-primary" />
            <span className="text-primary font-medium">SECURE</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted border border-border">
            <span className="font-mono text-muted-foreground">
              {currentTime.toLocaleTimeString('en-US', { hour12: false })}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((s, i) => {
          const colors = colorClasses[s.color];
          return (
            <div
              key={s.title}
              className={`group card-modern stat-card p-5 transition-all duration-300 hover:shadow-xl ${colors.glow}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`h-11 w-11 rounded-lg ${colors.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                  <s.icon className={`h-5 w-5 ${colors.text}`} />
                </div>
                <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium">{s.trend}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">{s.title}</p>
                <p className="text-3xl font-bold text-foreground">{s.value.toLocaleString()}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'New Case', icon: FileText, path: '/cases/add', color: 'text-blue-500' },
          { label: 'Add Criminal', icon: Users, path: '/criminals/add', color: 'text-red-500' },
          { label: 'Evidence Log', icon: Package, path: '/evidence', color: 'text-green-500' },
          { label: 'View Reports', icon: Eye, path: '/reports', color: 'text-purple-500' },
        ].map((action) => (
          <Link key={action.label} to={action.path} className="quick-action group">
            <action.icon className={`h-6 w-6 ${action.color} transition-transform group-hover:scale-110`} />
            <span className="text-sm font-medium text-foreground">{action.label}</span>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Cases */}
        <div className="lg:col-span-2 card-modern p-6 scan-effect">
          <div className="flex items-center justify-between mb-6">
            <div className="section-header">
              <FileText className="section-header-icon" />
              <span>Active Cases</span>
              <span className="classified-badge ml-2">CLASSIFIED</span>
            </div>
            <Button asChild variant="ghost" size="sm" className="text-primary">
              <Link to="/cases" className="flex items-center gap-1">
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="space-y-3">
            {stats.recentCases.map((c) => (
              <Link
                key={c.id}
                to={`/cases/${c.id}`}
                className="block p-4 rounded-lg border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-sm font-medium text-foreground truncate">{c.title}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{c.description}</p>
                      </div>
                      <StatusBadge status={c.status} />
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {c.updatedAt.toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        Station {c.policeStationId}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Case Distribution */}
          <div className="card-modern p-6">
            <div className="section-header mb-4">
              <Activity className="section-header-icon" />
              <span>Case Status</span>
            </div>

            <div className="flex flex-col items-center gap-6">
              {/* Donut Chart */}
              <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="10" className="text-muted/30" />
                  <circle
                    cx="50" cy="50" r="40" fill="none" strokeWidth="10"
                    strokeDasharray={`${(stats.closedCases / stats.totalCases) * 251.2} 251.2`}
                    className="text-green-500"
                    style={{ filter: 'drop-shadow(0 0 6px rgba(34, 197, 94, 0.4))' }}
                  />
                  <circle
                    cx="50" cy="50" r="40" fill="none" strokeWidth="10"
                    strokeDasharray={`${(stats.openCases / stats.totalCases) * 251.2} 251.2`}
                    strokeDashoffset={`${-((stats.closedCases / stats.totalCases) * 251.2)}`}
                    className="text-blue-500"
                    style={{ filter: 'drop-shadow(0 0 6px rgba(59, 130, 246, 0.4))' }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">{stats.totalCases}</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Total</div>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="w-full space-y-2">
                <div className="flex items-center justify-between p-2 rounded-lg bg-blue-500/5 border border-blue-500/10">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm">Open</span>
                  </div>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">{stats.openCases}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-green-500/5 border border-green-500/10">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <span className="text-sm">Closed</span>
                  </div>
                  <span className="font-semibold text-green-600 dark:text-green-400">{stats.closedCases}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-500/5 border border-slate-500/10">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-slate-400"></div>
                    <span className="text-sm">Pending</span>
                  </div>
                  <span className="font-semibold text-slate-600 dark:text-slate-400">
                    {stats.totalCases - stats.openCases - stats.closedCases}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* System Alerts */}
          <div className="card-modern p-6">
            <div className="section-header mb-4">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <span>Alerts</span>
            </div>
            <div className="space-y-3">
              {[
                { level: 'warning', message: 'Unauthorized access attempt blocked', time: '2h ago' },
                { level: 'info', message: 'Database backup completed', time: '5h ago' },
                { level: 'error', message: 'Failed login attempts (3x)', time: '8h ago' },
              ].map((alert, i) => {
                const colors = {
                  warning: 'border-amber-500/30 bg-amber-500/5 text-amber-600 dark:text-amber-400',
                  info: 'border-blue-500/30 bg-blue-500/5 text-blue-600 dark:text-blue-400',
                  error: 'border-red-500/30 bg-red-500/5 text-red-600 dark:text-red-400',
                };
                return (
                  <div key={i} className={`p-3 rounded-lg border ${colors[alert.level as keyof typeof colors]}`}>
                    <p className="text-sm font-medium">{alert.message}</p>
                    <p className="text-xs opacity-70 mt-1">{alert.time}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;