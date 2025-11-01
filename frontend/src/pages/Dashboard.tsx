import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Users, Database, FileStack, Activity, Clock, MapPin, TriangleAlert as AlertTriangle, Shield, Zap, Lock, Eye, Target, Radio, Server, Cpu, Terminal } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
    { id: 4, title: 'Assault - Downtown Bar', status: 'open', description: 'Physical assault reported outside The Blue Note Bar', policeStationId: 3, createdAt: new Date('2023-06-10'), updatedAt: new Date('2023-06-10') }
  ]
};

const StatusBadge: React.FC<{ status: Case['status'] }> = ({ status }) => {
  const style =
    status === 'open' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300' :
    status === 'closed' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
    status === 'pending' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300' :
    'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
  return <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${style}`}>{status}</span>;
};

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    '> System initialized...',
    '> Loading classified data...',
    '> Connection secured...',
    '> Access granted: Level 7 Clearance',
    '> FBI CrimeConnect v2.4.1 ready'
  ]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        await new Promise(r => setTimeout(r, 300));
        setStats(mockDashboardData);
      } finally { setLoading(false); }
    };
    fetchDashboardData();
    
    // Simulate terminal output
    const interval = setInterval(() => {
      const messages = [
        '> Scanning database...',
        '> Cross-referencing evidence...',
        '> Analyzing patterns...',
        '> Updating threat levels...',
        '> Synchronizing with NCIC...',
        '> Checking for updates...',
        '> System status: Operational'
      ];
      setTerminalOutput(prev => {
        const newOutput = [...prev, messages[Math.floor(Math.random() * messages.length)]];
        return newOutput.length > 10 ? newOutput.slice(-10) : newOutput;
      });
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="py-10 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (<div key={i} className="h-28 rounded-lg bg-muted animate-pulse"></div>))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-80 rounded-lg bg-muted animate-pulse lg:col-span-2"></div>
          <div className="h-80 rounded-lg bg-muted animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!stats) return <div>Failed to load</div>;

  const statsCards = [
    { title: 'Total Cases', value: stats.totalCases, icon: FileText, trend: '+12% this month', color: 'from-blue-500 to-cyan-500' },
    { title: 'Open Cases', value: stats.openCases, icon: Activity, trend: `${Math.round((stats.openCases / stats.totalCases) * 100)}% of total`, color: 'from-amber-500 to-orange-500' },
    { title: 'Criminals', value: stats.totalCriminals, icon: Database, trend: '+5% this month', color: 'from-red-500 to-pink-500' },
    { title: 'Evidence', value: stats.totalEvidence, icon: FileStack, trend: '+24% this month', color: 'from-green-500 to-emerald-500' },
  ];

  const systemStatus = [
    { name: 'Database', status: 'Operational', icon: Database, color: 'text-green-400' },
    { name: 'Network', status: 'Secure', icon: Lock, color: 'text-green-400' },
    { name: 'Surveillance', status: 'Active', icon: Eye, color: 'text-green-400' },
    { name: 'Communications', status: 'Encrypted', icon: Radio, color: 'text-green-400' },
    { name: 'Servers', status: 'Online', icon: Server, color: 'text-green-400' },
    { name: 'AI Analysis', status: 'Running', icon: Cpu, color: 'text-amber-400' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header with FBI theme */}
      <div className="relative">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-transparent animate-pulse"></div>
            <Shield className="h-6 w-6 text-cyan-400 relative z-10" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight neon-text bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">FBI CRIMECONNECT</h1>
            <p className="text-sm text-muted-foreground mt-1">CLASSIFIED - FBI LAW ENFORCEMENT ONLY</p>
          </div>
        </div>
        <div className="absolute -bottom-2 left-0 w-48 h-1 bg-gradient-to-r from-cyan-400 to-transparent rounded-full"></div>
      </div>

      {/* System Status Bar */}
      <div className="glass-card rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">SYSTEM STATUS</h2>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-xs text-green-400">ALL SYSTEMS OPERATIONAL</span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {systemStatus.map((item, index) => (
            <div key={item.name} className="flex items-center gap-2 p-2 rounded-lg bg-cyan-500/5 border border-cyan-500/10">
              <item.icon className={`h-4 w-4 ${item.color}`} />
              <div>
                <div className="text-xs font-medium">{item.name}</div>
                <div className="text-[10px] text-muted-foreground">{item.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Cards with FBI styling */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((s, i) => (
          <div key={s.title} className="glass-card rounded-xl p-6 scan-line hover:scale-105 transition-transform duration-300 relative overflow-hidden" style={{ animationDelay: `${i * 100}ms` }}>
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-cyan-400/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="flex items-center justify-between mb-4">
              <div className={`h-12 w-12 rounded-lg bg-gradient-to-br ${s.color}/20 border ${s.color.split(' ')[0]}/30 flex items-center justify-center relative overflow-hidden`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${s.color}/10 to-transparent animate-pulse`}></div>
                <s.icon className={`h-6 w-6 ${s.color.split(' ')[0].replace('from-', 'text-')} relative z-10`} />
              </div>
              <Target className="h-4 w-4 text-cyan-400/30" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{s.title}</p>
              <div className={`text-3xl font-bold bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}>{s.value}</div>
            </div>
            <div className="text-xs text-cyan-400/70 mt-4 flex items-center gap-1">
              <Activity className="h-3 w-3" /> {s.trend}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Cases with enhanced styling */}
        <div className="lg:col-span-2 glass-card rounded-xl p-6 data-stream relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent flex items-center gap-2">
                <FileText className="h-5 w-5" />
                RECENT CASES
              </h2>
              <p className="text-xs text-muted-foreground mt-1">Latest case files and status</p>
            </div>
            <Button asChild variant="outline" size="sm" className="bg-cyan-500/10 border-cyan-500/30 hover:bg-cyan-500/20 hover:border-cyan-500/50 transition-all">
              <Link to="/cases" className="flex items-center gap-2">
                View all
                <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"></div>
              </Link>
            </Button>
          </div>
          <div className="space-y-3">
            {stats.recentCases.slice(0, 5).map((c, i) => (
              <div key={c.id} className="group relative p-4 rounded-lg bg-gradient-to-r from-cyan-500/5 to-transparent border border-cyan-500/10 hover:border-cyan-500/30 transition-all duration-300 hover:translate-x-1">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
                <div className="flex items-center gap-4 relative z-10">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
                    <FileText className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link to={`/cases/${c.id}`} className="text-sm font-semibold hover:text-cyan-400 transition-colors line-clamp-1 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
                      {c.title}
                    </Link>
                    <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{c.description}</div>
                  </div>
                  <div className="flex items-center gap-3 text-xs flex-shrink-0">
                    <div className="hidden md:flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="h-3.5 w-3.5 text-cyan-400/70" />
                      {c.updatedAt.toLocaleDateString()}
                    </div>
                    <div className="hidden md:flex items-center gap-1.5 text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 text-cyan-400/70" />
                      Station {c.policeStationId}
                    </div>
                    <StatusBadge status={c.status} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Case Distribution with enhanced visualization */}
        <div className="glass-card rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-400/20 to-transparent blur-3xl"></div>
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent mb-2 relative z-10 flex items-center gap-2">
            <Target className="h-5 w-5" />
            CASE DISTRIBUTION
          </h2>
          <p className="text-xs text-muted-foreground mb-6 relative z-10">Open vs. closed vs. pending</p>
          <div className="flex flex-col items-center gap-6 relative z-10">
            <div className="relative w-40 h-40">
              <div className="absolute inset-0 rounded-full animate-pulse" style={{
                background: `conic-gradient(
                  from 0deg,
                  rgb(34,211,238) 0% ${(stats.openCases / stats.totalCases) * 100}%,
                  rgb(34,197,94) ${(stats.openCases / stats.totalCases) * 100}% ${(stats.closedCases / stats.totalCases + stats.openCases / stats.totalCases) * 100}%,
                  rgb(148,163,184) ${(stats.closedCases / stats.totalCases + stats.openCases / stats.totalCases) * 100}% 100%
                )`,
                boxShadow: '0 0 30px rgba(0, 200, 255, 0.3)'
              }} />
              <div className="absolute inset-[20%] rounded-full bg-background/90 backdrop-blur-sm border-2 border-cyan-500/20 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-400">{stats.totalCases}</div>
                  <div className="text-xs text-muted-foreground">Total</div>
                </div>
              </div>
            </div>
            <div className="space-y-3 text-sm w-full">
              <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-cyan-500/5 border border-cyan-500/10">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
                  <span>Open</span>
                </div>
                <span className="font-bold text-cyan-400">{stats.openCases}</span>
              </div>
              <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-green-500/5 border border-green-500/10">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-green-400"></span>
                  <span>Closed</span>
                </div>
                <span className="font-bold text-green-400">{stats.closedCases}</span>
              </div>
              <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-500/5 border border-slate-500/10">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-400"></span>
                  <span>Pending</span>
                </div>
                <span className="font-bold text-slate-400">{stats.totalCases - stats.openCases - stats.closedCases}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Terminal Console */}
        <div className="glass-card rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 flex items-center justify-center">
              <Terminal className="h-4 w-4 text-green-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent">TERMINAL CONSOLE</h2>
              <p className="text-xs text-muted-foreground">System logs and diagnostics</p>
            </div>
          </div>
          <div className="bg-black/30 rounded-lg p-4 font-mono text-sm h-48 overflow-y-auto">
            {terminalOutput.map((line, index) => (
              <div key={index} className={`mb-1 ${line.startsWith('>') ? 'text-cyan-400' : line.includes('ERROR') ? 'text-red-400' : 'text-green-400'}`}>
                <span className="text-green-400 mr-2">{'>'}</span>
                {line.substring(1)}
              </div>
            ))}
            <div className="flex items-center mt-2">
              <span className="text-green-400 mr-2">{'>'}</span>
              <div className="h-4 w-2 bg-green-400 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Security Alerts with enhanced styling */}
        <div className="glass-card rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent"></div>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-red-300 to-orange-400 bg-clip-text text-transparent">SECURITY ALERTS</h2>
              <p className="text-xs text-muted-foreground">Real-time monitoring</p>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { id: 1, level: 'warning', message: 'Unauthorized access attempt detected in Sector 7', time: '14:22:41', color: 'amber' },
              { id: 2, level: 'info', message: 'System security scan completed', time: '13:05:12', color: 'blue' },
              { id: 3, level: 'alert', message: 'Multiple login failures for user REDACTED', time: '11:47:28', color: 'red' },
              { id: 4, level: 'info', message: 'Database backup completed successfully', time: '09:15:33', color: 'green' }
            ].map((a) => (
              <div key={a.id} className={`relative group p-3 rounded-lg bg-${a.color}-500/5 border border-${a.color}-500/20 hover:border-${a.color}-500/40 transition-all duration-300`}>
                <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-${a.color}-500 to-transparent rounded-l-lg`}></div>
                <div className="flex items-start gap-3">
                  <div className={`h-8 w-8 rounded-lg bg-${a.color}-500/20 flex items-center justify-center flex-shrink-0`}>
                    <AlertTriangle className={`h-4 w-4 text-${a.color}-400`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground line-clamp-2 mb-1">{a.message}</div>
                    <div className={`text-xs text-${a.color}-400/70 flex items-center gap-1`}>
                      <Clock className="h-3 w-3" />
                      {a.time}
                    </div>
                  </div>
                  <div className={`h-2 w-2 rounded-full bg-${a.color}-400 animate-pulse`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FBI Footer */}
      <div className="glass-card rounded-xl p-4 text-center">
        <p className="text-xs text-muted-foreground">
          FBI CrimeConnect System v2.4.1 | CLASSIFIED - LAW ENFORCEMENT ONLY | 
          <span className="text-cyan-400/70"> SECURE CONNECTION ESTABLISHED</span>
        </p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <Lock className="h-3 w-3 text-green-400" />
          <span className="text-[10px] text-green-400">END-TO-END ENCRYPTED</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;