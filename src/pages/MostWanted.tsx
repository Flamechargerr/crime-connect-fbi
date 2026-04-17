import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, MapPin, DollarSign } from 'lucide-react';

export default function MostWanted() {
  const { data, isLoading } = useQuery({
    queryKey: ['most-wanted'],
    queryFn: async () => (await supabase.from('criminals').select('*').eq('most_wanted', true).order('reward_amount', { ascending: false })).data ?? [],
  });

  return (
    <div className="space-y-6">
      <div className="text-center max-w-2xl mx-auto">
        <span className="classified-tag mb-3 inline-block">FBI Bulletin</span>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Most Wanted</h1>
        <p className="text-muted-foreground text-sm mt-2">
          High-priority targets. Report sightings immediately to your field office.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading && Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-72" />)}
        {data?.map((c: any) => {
          const initials = c.full_name.split(' ').map((n: string) => n[0]).slice(0, 2).join('');
          return (
            <Card key={c.id} className="card-intel border-destructive/30 relative overflow-hidden">
              <div className="absolute top-3 right-3 z-10">
                <Star className="h-5 w-5 text-warning fill-warning" />
              </div>
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-3 ring-2 ring-destructive/40">
                  <AvatarFallback className="bg-destructive/15 text-destructive text-2xl font-bold">{initials}</AvatarFallback>
                </Avatar>
                <h3 className="font-bold text-lg">{c.full_name}</h3>
                {c.alias && <p className="text-xs italic text-muted-foreground mb-2">"{c.alias}"</p>}
                <div className="flex flex-wrap gap-1 justify-center mb-3">
                  <Badge variant="outline" className="bg-destructive/15 text-destructive border-destructive/40 text-[10px] uppercase">
                    {c.threat_level} threat
                  </Badge>
                  {c.nationality && <Badge variant="outline" className="text-[10px]">{c.nationality}</Badge>}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-3 mb-3">{c.description}</p>
                {c.last_known_location && (
                  <div className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground/80 mb-2">
                    <MapPin className="h-3 w-3" /> {c.last_known_location}
                  </div>
                )}
                {c.reward_amount > 0 && (
                  <div className="flex items-center gap-1 text-warning font-bold tabular-nums">
                    <DollarSign className="h-4 w-4" />
                    {Number(c.reward_amount).toLocaleString()} reward
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
