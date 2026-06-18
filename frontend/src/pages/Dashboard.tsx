import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Folder, ShieldAlert, MapPin, Users, TrendingUp, Activity, AlertTriangle } from 'lucide-react';
import { getCrimeSummary, getCrimes, getCases } from '@/lib/api';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';

const PIE_COLORS = ['hsl(var(--primary))', 'hsl(var(--warning))', 'hsl(var(--destructive))', 'hsl(var(--muted-foreground))'];

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['crime-summary'],
    queryFn: getCrimeSummary,
  });
  const { data: recent, isLoading: recentLoading } = useQuery({
    queryKey: ['recent-crimes'],
    queryFn: () => getCrimes({ limit: '6' }),
  });
  const { data: cases } = useQuery({
    queryKey: ['cases'],
    queryFn: getCases,
  });

  const statusData = stats?.by_type
    ? Object.entries(stats.by_type).slice(0, 6).map(([name, value]) => ({ name, value }))
    : [];

  const priorityData = stats?.by_arrest
    ? Object.entries(stats.by_arrest).map(([name, value]) => ({ name, value }))
    : [];

  const tiles = [
    { label: 'Total crimes', value: stats?.total_records ?? 0, icon: Folder, accent: 'text-primary' },
    { label: 'Crime types', value: stats?.by_type ? Object.keys(stats.by_type).length : 0, icon: ShieldAlert, accent: 'text-destructive' },
    { label: 'Districts', value: stats?.by_district ? Object.keys(stats.by_district).length : 0, icon: MapPin, accent: 'text-warning' },
    { label: 'Active cases', value: cases?.length ?? 0, icon: Users, accent: 'text-success' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Operations Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Real-time overview across Chicago crime data.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
          Live data feed
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {tiles.map((t) => (
          <Card key={t.label} className="card-intel relative overflow-hidden">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-3">
                <div className={`h-10 w-10 rounded-lg bg-secondary flex items-center justify-center ${t.accent}`}>
                  <t.icon className="h-5 w-5" />
                </div>
                <TrendingUp className="h-3 w-3 text-success" />
              </div>
              <div className="text-3xl font-bold tabular-nums">
                {statsLoading ? <Skeleton className="h-8 w-16" /> : t.value.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground mt-1">{t.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="card-intel lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" /> Crimes by type
            </CardTitle>
            <CardDescription>Top 6 crime categories by volume.</CardDescription>
          </CardHeader>
          <CardContent className="h-[260px]">
            {statusData.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="card-intel">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" /> Arrest status
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[260px]">
            {priorityData.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={priorityData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                    {priorityData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="card-intel">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Recent incidents</CardTitle>
            <CardDescription>Latest crimes from Chicago data.</CardDescription>
          </div>
          <Link to="/data">
            <Button variant="ghost" size="sm" className="text-xs font-mono uppercase">
              View all →
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="divide-y divide-border/60">
          {recentLoading && Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 my-2" />)}
          {recent?.slice(0, 6).map((c: any) => (
            <div key={c.id} className="flex items-center justify-between py-3 hover:bg-muted/30 -mx-6 px-6 transition-colors">
              <div className="min-w-0">
                <div className="font-mono text-[11px] text-muted-foreground uppercase">{c.case_number || c.id}</div>
                <div className="font-medium truncate">{c.primary_type}</div>
              </div>
              <div className="flex gap-2 items-center shrink-0">
                <Badge variant="outline" className="text-[10px] uppercase">{c.district}</Badge>
                <Badge variant={c.arrest ? 'default' : 'secondary'} className="text-[10px] uppercase">
                  {c.arrest ? 'Arrested' : 'Open'}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
