import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Folder, ShieldAlert, MapPin, Users, TrendingUp, Activity, AlertTriangle, Terminal } from 'lucide-react';
import { getCrimeSummary, getCrimes, getCases } from '@/lib/api';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';

const PIE_COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted-foreground))'];

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
    ? Object.entries(stats.by_type).slice(0, 6).map(([name, value]) => ({ name, value: Number(value) }))
    : [];

  const priorityData = stats?.by_arrest
    ? Object.entries(stats.by_arrest).map(([name, value]) => ({ name, value: Number(value) }))
    : [];

  const tiles = [
    { label: 'Total crimes ingested', value: stats?.total_records ?? 0, icon: Folder, accent: 'text-primary' },
    { label: 'Ingested crime types', value: stats?.by_type ? Object.keys(stats.by_type).length : 0, icon: ShieldAlert, accent: 'text-destructive' },
    { label: 'Active districts', value: stats?.by_district ? Object.keys(stats.by_district).length : 0, icon: MapPin, accent: 'text-warning' },
    { label: 'Active case files', value: cases?.length ?? 0, icon: Users, accent: 'text-success' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-border/40 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-glow text-white">
            Operations Control Center
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Real-time telemetry and analytical overview of the Chicago Metropolitan Area
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-primary/70 bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/20 shadow-[0_0_10px_rgba(0,255,255,0.05)]">
          <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
          Live Ingestion Feed
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {tiles.map((t, i) => (
          <motion.div
            key={t.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <Card className="card-intel relative overflow-hidden h-full">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center border border-border/85 ${t.accent}`}>
                    <t.icon className="h-5 w-5 text-glow" />
                  </div>
                  <TrendingUp className="h-3.5 w-3.5 text-success text-glow animate-pulse" />
                </div>
                <div className="text-3xl font-bold font-mono tracking-tight text-white tabular-nums">
                  {statsLoading ? (
                    <Skeleton className="h-8 w-20 bg-white/5" />
                  ) : (
                    t.value.toLocaleString()
                  )}
                </div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mt-2">
                  {t.label}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Bar Chart Panel */}
        <Card className="card-intel lg:col-span-2">
          <CardHeader className="border-b border-border/40 pb-3">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-white flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" /> Incidents by Category
            </CardTitle>
            <CardDescription className="text-[10px] font-mono uppercase">Top 6 crime types registered by frequency</CardDescription>
          </CardHeader>
          <CardContent className="h-[280px] pt-6">
            {statsLoading ? (
              <Skeleton className="w-full h-full bg-white/5" />
            ) : statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.15}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 255, 255, 0.05)" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={9} className="font-mono" />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={9} className="font-mono" />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'rgba(5, 7, 10, 0.9)', 
                      border: '1px solid rgba(0, 255, 255, 0.2)', 
                      borderRadius: 10,
                      backdropFilter: 'blur(8px)',
                      color: '#FFF',
                      fontFamily: 'monospace',
                      fontSize: 10
                    }} 
                  />
                  <Bar dataKey="value" fill="url(#barGrad)" stroke="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-xs font-mono text-muted-foreground">NO_TELEMETRY_LOGGED</div>
            )}
          </CardContent>
        </Card>

        {/* Pie Chart Panel */}
        <Card className="card-intel">
          <CardHeader className="border-b border-border/40 pb-3">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-white flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning animate-pulse" /> Arrest Ratio Status
            </CardTitle>
            <CardDescription className="text-[10px] font-mono uppercase">Decryption of closed vs open incidents</CardDescription>
          </CardHeader>
          <CardContent className="h-[280px] pt-6 flex flex-col justify-between">
            {statsLoading ? (
              <Skeleton className="w-full h-full bg-white/5" />
            ) : priorityData.length > 0 ? (
              <>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={priorityData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={75} paddingAngle={3}>
                        {priorityData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="rgba(0, 0, 0, 0.5)" strokeWidth={1} />)}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          background: 'rgba(5, 7, 10, 0.9)', 
                          border: '1px solid rgba(0, 255, 255, 0.2)', 
                          borderRadius: 10,
                          backdropFilter: 'blur(8px)',
                          color: '#FFF',
                          fontFamily: 'monospace',
                          fontSize: 10
                        }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                {/* Custom legends */}
                <div className="flex justify-center gap-4 text-[10px] font-mono">
                  {priorityData.map((item, i) => (
                    <div key={item.name} className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                      <span className="uppercase text-muted-foreground">{item.name ? 'ARRESTED' : 'UNARRESTED'}: {item.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-xs font-mono text-muted-foreground">NO_RATIO_CALCULATED</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Incidents Panel */}
      <Card className="card-intel relative overflow-hidden">
        {/* Scanner fine scanline */}
        <div className="absolute left-0 right-0 h-[1px] bg-primary/10 animate-scan top-0 pointer-events-none" />

        <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 pb-3">
          <div>
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-white flex items-center gap-2">
              <Terminal className="h-4 w-4 text-primary" /> Real-time Feed Stream
            </CardTitle>
            <CardDescription className="text-[10px] font-mono uppercase">Most recent incident files retrieved from live API</CardDescription>
          </div>
          <Link to="/data" className="cursor-pointer">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button variant="outline" size="sm" className="text-[10px] font-mono uppercase border-primary/20 text-primary hover:bg-primary/10 hover:text-primary cursor-pointer shadow-[0_0_10px_rgba(0,255,255,0.05)]">
                Launch data console →
              </Button>
            </motion.div>
          </Link>
        </CardHeader>
        <CardContent className="divide-y divide-border/40 px-6">
          {recentLoading && Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 my-3 bg-white/5" />)}
          {recent?.slice(0, 6).map((c: any, index: number) => (
            <motion.div 
              key={c.id} 
              className="flex items-center justify-between py-3 hover:bg-primary/5 -mx-6 px-6 transition-colors border-l border-transparent hover:border-primary cursor-pointer"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.04 }}
            >
              <div className="min-w-0">
                <div className="font-mono text-[9px] text-primary/60 uppercase tracking-widest">
                  CASE_FILE_ID: {c.case_number || c.id}
                </div>
                <div className="font-mono font-bold text-xs uppercase text-white truncate mt-1 tracking-wider">
                  {c.primary_type}
                </div>
              </div>
              <div className="flex gap-3 items-center shrink-0">
                <Badge variant="outline" className="text-[9px] font-mono border-primary/20 text-primary bg-primary/5 uppercase tracking-widest px-2.5">
                  DISTRICT {c.district}
                </Badge>
                <Badge 
                  variant={c.arrest ? 'default' : 'secondary'} 
                  className={c.arrest 
                    ? 'text-[9px] font-mono bg-success/15 hover:bg-success/20 text-success border border-success/30 uppercase tracking-widest px-2.5' 
                    : 'text-[9px] font-mono bg-warning/10 hover:bg-warning/15 text-warning border border-warning/20 uppercase tracking-widest px-2.5'
                  }
                >
                  {c.arrest ? 'Arrested' : 'No Arrest'}
                </Badge>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
