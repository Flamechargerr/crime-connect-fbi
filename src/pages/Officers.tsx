import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Mail, Phone } from 'lucide-react';

const statusColor: Record<string, string> = {
  active: 'bg-success/15 text-success',
  on_leave: 'bg-warning/15 text-warning',
  inactive: 'bg-muted text-muted-foreground',
};

export default function Officers() {
  const { data, isLoading } = useQuery({
    queryKey: ['officers'],
    queryFn: async () => (await supabase.from('officers').select('*').order('full_name')).data ?? [],
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Officers</h1>
        <p className="text-muted-foreground text-sm">Active personnel across all divisions.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading && Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-32" />)}
        {data?.map((o: any) => {
          const initials = o.full_name.split(' ').map((n: string) => n[0]).slice(0, 2).join('');
          return (
            <Card key={o.id} className="card-intel">
              <CardContent className="pt-5">
                <div className="flex items-start gap-3 mb-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/15 text-primary font-semibold">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold">{o.full_name}</div>
                    <div className="text-xs text-muted-foreground">{o.rank}</div>
                    <div className="font-mono text-[10px] text-muted-foreground/80 uppercase">{o.badge_number}</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  <Badge className={`${statusColor[o.status]} border-0 text-[10px] uppercase`}>{o.status.replace('_', ' ')}</Badge>
                  {o.division && <Badge variant="outline" className="text-[10px]">{o.division}</Badge>}
                </div>
                {o.email && <div className="flex items-center gap-2 text-xs text-muted-foreground"><Mail className="h-3 w-3" />{o.email}</div>}
                {o.phone && <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5"><Phone className="h-3 w-3" />{o.phone}</div>}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
