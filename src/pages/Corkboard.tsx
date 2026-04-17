import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pin, ShieldAlert, FileSearch, Folder, Link2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Lightweight investigation board — visual representation of cases, suspects
 * and evidence as a connected mind-map.
 */
export default function Corkboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['corkboard'],
    queryFn: async () => {
      const [cases, links] = await Promise.all([
        supabase.from('cases').select('id, case_number, title, priority').limit(6),
        supabase.from('case_criminals').select('case_id, criminals(full_name, threat_level), role'),
      ]);
      return { cases: cases.data ?? [], links: links.data ?? [] };
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <span className="classified-tag mb-2 inline-block">Investigation Board</span>
        <h1 className="text-2xl font-bold">Corkboard</h1>
        <p className="text-muted-foreground text-sm">Visual mind-map linking active cases with their suspects.</p>
      </div>

      <div className="relative grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading && Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-64" />)}
        {data?.cases.map((c: any) => {
          const suspects = data.links.filter((l: any) => l.case_id === c.id);
          return (
            <Card key={c.id} className="card-intel relative scan-line overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-7 w-7 rounded bg-primary/15 text-primary flex items-center justify-center">
                    <Pin className="h-3.5 w-3.5" />
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground uppercase">{c.case_number}</span>
                  <Badge variant="outline" className="text-[10px] uppercase ml-auto">{c.priority}</Badge>
                </div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Folder className="h-4 w-4 text-primary" /> {c.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1">
                  <Link2 className="h-3 w-3" /> Linked suspects
                </div>
                <div className="space-y-1.5">
                  {suspects.length === 0 && <p className="text-xs text-muted-foreground italic">No links</p>}
                  {suspects.map((s: any, i: number) => s.criminals && (
                    <div key={i} className="flex items-center gap-2 p-2 rounded bg-card-elevated text-xs">
                      <ShieldAlert className="h-3.5 w-3.5 text-destructive" />
                      <span className="truncate flex-1">{s.criminals.full_name}</span>
                      <Badge variant="outline" className="text-[9px] uppercase">{s.role}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
