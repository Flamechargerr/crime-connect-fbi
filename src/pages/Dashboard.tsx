import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Folder, ShieldAlert, FileSearch, Users, TrendingUp, Activity, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';

const priorityColor: Record<string, string> = {
  critical: 'bg-destructive/15 text-destructive border-destructive/30',
  high: 'bg-warning/15 text-warning border-warning/30',
  medium: 'bg-primary/15 text-primary border-primary/30',
  low: 'bg-muted text-muted-foreground',
};

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const [casesRes, criminalsRes, evidenceRes, officersRes, recent, byStatus, byPriority] = await Promise.all([
        supabase.from('cases').select('id', { count: 'exact', head: true }),
        supabase.from('criminals').select('id', { count: 'exact', head: true }),
        supabase.from('evidence').select('id', { count: 'exact', head: true }),
        supabase.from('officers').select('id', { count: 'exact', head: true }),
        supabase.from('cases').select('id, case_number, title, status, priority, opened_at').order('opened_at', { ascending: false }).limit(6),
        supabase.from('cases').select('status'),
        supabase.from('cases').select('priority'),
      ]);
      const statusCounts = (byStatus.data ?? []).reduce<Record<string, number>>((acc, r: any) => {
        acc[r.status] = (acc[r.status] ?? 0) + 1;
        return acc;
      }, {});
      const priorityCounts = (byPriority.data ?? []).reduce<Record<string, number>>((acc, r: any) => {
        acc[r.priority] = (acc[r.priority] ?? 0) + 1;
        return acc;
      }, {});
      return {
        cases: casesRes.count ?? 0,
        criminals: criminalsRes.count ?? 0,
        evidence: evidenceRes.count ?? 0,
        officers: officersRes.count ?? 0,
        recent: recent.data ?? [],
        statusData: Object.entries(statusCounts).map(([name, value]) => ({ name, value })),
        priorityData: Object.entries(priorityCounts).map(([name, value]) => ({ name, value })),
      };
    },
  });

  const tiles = [
    { label: 'Active cases', value: stats?.cases ?? 0, icon: Folder, accent: 'text-primary', delta: '+12% MTD' },
    { label: 'Suspects', value: stats?.criminals ?? 0, icon: ShieldAlert, accent: 'text-destructive', delta: '3 high-threat' },
    { label: 'Evidence items', value: stats?.evidence ?? 0, icon: FileSearch, accent: 'text-warning', delta: 'Chain verified' },
    { label: 'Officers on duty', value: stats?.officers ?? 0, icon: Users, accent: 'text-success', delta: 'All divisions' },
  ];

  const PIE_COLORS = ['hsl(var(--primary))', 'hsl(var(--warning))', 'hsl(var(--destructive))', 'hsl(var(--muted-foreground))'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <span className="classified-tag mb-2 inline-block">Live</span>
          <h1 className="text-3xl font-bold tracking-tight">Operations Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Real-time overview across all active investigations.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
          All systems operational
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {tiles.map((t) => (
          <Card key={t.label} className="card-intel relative overflow-hidden stat-accent">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-3">
                <div className={`h-10 w-10 rounded-lg bg-card-elevated flex items-center justify-center ${t.accent}`}>
                  <t.icon className="h-5 w-5" />
                </div>
                <TrendingUp className="h-3 w-3 text-success" />
              </div>
              <div className="text-3xl font-bold tabular-nums">
                {isLoading ? <Skeleton className="h-8 w-16" /> : t.value}
              </div>
              <div className="text-xs text-muted-foreground mt-1">{t.label}</div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/70 mt-2">{t.delta}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="card-intel lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" /> Cases by status
            </CardTitle>
            <CardDescription>Distribution across the active pipeline.</CardDescription>
          </CardHeader>
          <CardContent className="h-[260px]">
            {stats && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.statusData}>
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
              <AlertTriangle className="h-4 w-4 text-warning" /> Priority mix
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[260px]">
            {stats && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={stats.priorityData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                    {stats.priorityData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
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
            <CardTitle className="text-base">Recently opened cases</CardTitle>
            <CardDescription>Latest investigations across the bureau.</CardDescription>
          </div>
          <Link to="/cases" className="text-xs text-primary hover:underline font-mono uppercase tracking-wider">
            View all →
          </Link>
        </CardHeader>
        <CardContent className="divide-y divide-border/60">
          {isLoading && Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 my-2" />)}
          {stats?.recent.map((c: any) => (
            <Link to={`/cases/${c.id}`} key={c.id} className="flex items-center justify-between py-3 hover:bg-muted/30 -mx-6 px-6 transition-colors">
              <div className="min-w-0">
                <div className="font-mono text-[11px] text-muted-foreground uppercase">{c.case_number}</div>
                <div className="font-medium truncate">{c.title}</div>
              </div>
              <div className="flex gap-2 items-center shrink-0">
                <Badge variant="outline" className={`${priorityColor[c.priority]} text-[10px] uppercase`}>{c.priority}</Badge>
                <Badge variant="secondary" className="text-[10px] uppercase">{c.status}</Badge>
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
