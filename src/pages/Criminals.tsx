import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Plus, Search, Star } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';

const threatColor: Record<string, string> = {
  extreme: 'bg-destructive/20 text-destructive border-destructive/40',
  high: 'bg-warning/20 text-warning border-warning/40',
  medium: 'bg-primary/15 text-primary border-primary/30',
  low: 'bg-muted text-muted-foreground',
};

export default function Criminals() {
  const [q, setQ] = useState('');
  const { data, isLoading } = useQuery({
    queryKey: ['criminals'],
    queryFn: async () => (await supabase.from('criminals').select('*').order('threat_level', { ascending: false })).data ?? [],
  });

  const filtered = (data ?? []).filter((c: any) =>
    [c.full_name, c.alias, c.nationality, c.last_known_location].join(' ').toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Criminal Database</h1>
          <p className="text-muted-foreground text-sm">Suspect profiles and threat assessments.</p>
        </div>
        <Button asChild>
          <Link to="/criminals/add"><Plus className="h-4 w-4 mr-2" /> Add suspect</Link>
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, alias, location…" className="pl-9" />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading && Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-44" />)}
        {filtered.map((c: any) => {
          const initials = c.full_name.split(' ').map((n: string) => n[0]).slice(0, 2).join('');
          return (
            <Card key={c.id} className="card-intel">
              <CardContent className="pt-5">
                <div className="flex items-start gap-3 mb-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-destructive/15 text-destructive font-semibold">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold truncate">{c.full_name}</div>
                    {c.alias && <div className="text-xs text-muted-foreground italic truncate">"{c.alias}"</div>}
                  </div>
                  {c.most_wanted && <Star className="h-4 w-4 text-warning fill-warning shrink-0" />}
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  <Badge variant="outline" className={`${threatColor[c.threat_level]} text-[10px] uppercase`}>{c.threat_level}</Badge>
                  <Badge variant="secondary" className="text-[10px] uppercase">{c.status.replace('_', ' ')}</Badge>
                  {c.nationality && <Badge variant="outline" className="text-[10px]">{c.nationality}</Badge>}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{c.description}</p>
                {c.last_known_location && (
                  <p className="text-[10px] font-mono text-muted-foreground/70 mt-2 truncate">📍 {c.last_known_location}</p>
                )}
              </CardContent>
            </Card>
          );
        })}
        {!isLoading && filtered.length === 0 && (
          <Card className="card-intel sm:col-span-2 lg:col-span-3">
            <CardContent className="py-10 text-center text-muted-foreground">No suspects match your search.</CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
