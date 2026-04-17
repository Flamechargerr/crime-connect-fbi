import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Search, Folder } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';
import { format } from 'date-fns';

const priorityColor: Record<string, string> = {
  critical: 'bg-destructive/15 text-destructive border-destructive/30',
  high: 'bg-warning/15 text-warning border-warning/30',
  medium: 'bg-primary/15 text-primary border-primary/30',
  low: 'bg-muted text-muted-foreground',
};
const statusColor: Record<string, string> = {
  open: 'bg-primary/15 text-primary',
  investigating: 'bg-warning/15 text-warning',
  closed: 'bg-success/15 text-success',
  cold: 'bg-muted text-muted-foreground',
};

export default function Cases() {
  const [q, setQ] = useState('');
  const { data, isLoading } = useQuery({
    queryKey: ['cases'],
    queryFn: async () => {
      const { data } = await supabase
        .from('cases')
        .select('*, officers(full_name, badge_number)')
        .order('opened_at', { ascending: false });
      return data ?? [];
    },
  });

  const filtered = (data ?? []).filter((c: any) =>
    [c.title, c.case_number, c.category, c.location].join(' ').toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Cases</h1>
          <p className="text-muted-foreground text-sm">All open and historical investigations.</p>
        </div>
        <Button asChild>
          <Link to="/cases/add"><Plus className="h-4 w-4 mr-2" /> New case</Link>
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by title, number, location…" className="pl-9" />
      </div>

      <div className="grid gap-3">
        {isLoading && Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
        {filtered.map((c: any) => (
          <Link to={`/cases/${c.id}`} key={c.id}>
            <Card className="card-intel hover:translate-y-[-1px] transition-transform">
              <CardContent className="pt-5 pb-5 flex items-center gap-4">
                <div className="h-11 w-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Folder className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[11px] text-muted-foreground uppercase">{c.case_number}</span>
                    <Badge variant="outline" className={`${priorityColor[c.priority]} text-[10px] uppercase`}>{c.priority}</Badge>
                    <Badge className={`${statusColor[c.status]} text-[10px] uppercase border-0`}>{c.status}</Badge>
                  </div>
                  <div className="font-semibold mt-1 truncate">{c.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {c.location} • {c.category} {c.officers && <>• Lead: {c.officers.full_name}</>}
                  </div>
                </div>
                <div className="text-right text-xs text-muted-foreground font-mono shrink-0 hidden sm:block">
                  {format(new Date(c.opened_at), 'MMM d, yyyy')}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
        {!isLoading && filtered.length === 0 && (
          <Card className="card-intel">
            <CardContent className="py-10 text-center text-muted-foreground text-sm">No cases match your search.</CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
