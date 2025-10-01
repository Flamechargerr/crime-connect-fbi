import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Users, Database, FileStack, Activity, Clock, MapPin, AlertTriangle } from 'lucide-react';
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

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        await new Promise(r => setTimeout(r, 300));
        setStats(mockDashboardData);
      } finally { setLoading(false); }
    };
    fetchDashboardData();
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
    { title: 'Total Cases', value: stats.totalCases, icon: FileText, trend: '+12% this month' },
    { title: 'Open Cases', value: stats.openCases, icon: Activity, trend: `${Math.round((stats.openCases / stats.totalCases) * 100)}% of total` },
    { title: 'Criminals', value: stats.totalCriminals, icon: Database, trend: '+5% this month' },
    { title: 'Evidence', value: stats.totalEvidence, icon: FileStack, trend: '+24% this month' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Overview of cases and operational metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((s) => (
          <Card key={s.title}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{s.title}</p>
                  <div className="text-3xl font-semibold mt-1">{s.value}</div>
                </div>
                <div className="h-10 w-10 rounded-md border flex items-center justify-center text-primary">
                  <s.icon className="h-5 w-5" />
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
                <Activity className="h-3 w-3" /> {s.trend}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Cases</CardTitle>
              <Button asChild variant="outline" size="sm"><Link to="/cases">View all</Link></Button>
            </div>
            <CardDescription>Latest case files and status</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {stats.recentCases.slice(0, 5).map((c) => (
                <div key={c.id} className="px-5 py-3 flex items-center gap-4 hover:bg-muted/50">
                  <div className="h-9 w-9 rounded-md border flex items-center justify-center text-primary"><FileText className="h-4 w-4" /></div>
                  <div className="min-w-0 flex-1">
                    <Link to={`/cases/${c.id}`} className="text-sm font-medium hover:underline line-clamp-1">{c.title}</Link>
                    <div className="text-xs text-muted-foreground line-clamp-1">{c.description}</div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="hidden md:flex items-center gap-1"><Clock className="h-3 w-3" /> {c.updatedAt.toLocaleDateString()}</div>
                    <div className="hidden md:flex items-center gap-1"><MapPin className="h-3 w-3" /> Station {c.policeStationId}</div>
                    <StatusBadge status={c.status} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Case Distribution</CardTitle>
            <CardDescription>Open vs. closed vs. pending</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="relative w-36 h-36">
                <div className="absolute inset-0 rounded-full" style={{
                  background: `conic-gradient(rgb(59,130,246) 0% ${(stats.openCases / stats.totalCases) * 100}%, rgb(34,197,94) ${(stats.openCases / stats.totalCases) * 100}% ${(stats.closedCases / stats.totalCases + stats.openCases / stats.totalCases) * 100}%, rgb(148,163,184) ${(stats.closedCases / stats.totalCases + stats.openCases / stats.totalCases) * 100}% 100%)`
                }} />
                <div className="absolute inset-[18%] rounded-full bg-background border" />
              </div>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-blue-500"></span> Open: {stats.openCases}</div>
                <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-green-500"></span> Closed: {stats.closedCases}</div>
                <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-slate-400"></span> Pending: {stats.totalCases - stats.openCases - stats.closedCases}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Security Alerts</CardTitle>
          <CardDescription>Real-time monitoring</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { id: 1, level: 'warning', message: 'Unauthorized access attempt detected in Sector 7', time: '14:22:41' },
              { id: 2, level: 'info', message: 'System security scan completed', time: '13:05:12' },
              { id: 3, level: 'alert', message: 'Multiple login failures for user REDACTED', time: '11:47:28' }
            ].map((a) => (
              <div key={a.id} className="flex items-start p-3 border rounded-md">
                <AlertTriangle className={`h-4 w-4 mt-0.5 mr-2 ${a.level === 'alert' ? 'text-red-500' : a.level === 'warning' ? 'text-amber-500' : 'text-blue-500'}`} />
                <div className="text-sm">
                  <div className="font-medium text-foreground">{a.message}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
