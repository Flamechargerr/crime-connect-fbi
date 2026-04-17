import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--warning))', 'hsl(var(--destructive))', 'hsl(var(--success))', 'hsl(var(--muted-foreground))'];

export default function Reports() {
  const { data } = useQuery({
    queryKey: ['reports'],
    queryFn: async () => {
      const [cases, criminals, evidence] = await Promise.all([
        supabase.from('cases').select('status, priority, category, opened_at'),
        supabase.from('criminals').select('threat_level, status, nationality'),
        supabase.from('evidence').select('evidence_type'),
      ]);
      const groupBy = (rows: any[], key: string) =>
        Object.entries(
          rows.reduce<Record<string, number>>((acc, r) => {
            const k = r[key] ?? 'unknown';
            acc[k] = (acc[k] ?? 0) + 1;
            return acc;
          }, {})
        ).map(([name, value]) => ({ name, value }));

      return {
        casesByStatus: groupBy(cases.data ?? [], 'status'),
        casesByCategory: groupBy(cases.data ?? [], 'category'),
        criminalsByThreat: groupBy(criminals.data ?? [], 'threat_level'),
        evidenceByType: groupBy(evidence.data ?? [], 'evidence_type'),
        casesByNationality: groupBy(criminals.data ?? [], 'nationality'),
      };
    },
  });

  const tooltipStyle = { background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Intelligence Reports</h1>
        <p className="text-muted-foreground text-sm">Aggregate analytics across the bureau.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="card-intel">
          <CardHeader><CardTitle className="text-base">Cases by status</CardTitle></CardHeader>
          <CardContent className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.casesByStatus ?? []}>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="card-intel">
          <CardHeader><CardTitle className="text-base">Suspects by threat level</CardTitle></CardHeader>
          <CardContent className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data?.criminalsByThreat ?? []} dataKey="value" nameKey="name" outerRadius={90}>
                  {(data?.criminalsByThreat ?? []).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="card-intel">
          <CardHeader><CardTitle className="text-base">Cases by category</CardTitle></CardHeader>
          <CardContent className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.casesByCategory ?? []} layout="vertical">
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={11} width={100} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="value" fill="hsl(var(--warning))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="card-intel">
          <CardHeader><CardTitle className="text-base">Evidence by type</CardTitle></CardHeader>
          <CardContent className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.evidenceByType ?? []}>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="value" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
