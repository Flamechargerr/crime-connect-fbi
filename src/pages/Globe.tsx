import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe as GlobeIcon, MapPin } from 'lucide-react';

export default function GlobePage() {
  const { data: cases } = useQuery({
    queryKey: ['globe-cases'],
    queryFn: async () => (await supabase.from('cases').select('case_number, title, location, priority').not('location', 'is', null)).data ?? [],
  });

  const { data: criminals } = useQuery({
    queryKey: ['globe-criminals'],
    queryFn: async () => (await supabase.from('criminals').select('full_name, last_known_location, nationality, threat_level').not('last_known_location', 'is', null)).data ?? [],
  });

  return (
    <div className="space-y-6">
      <div>
        <span className="classified-tag mb-2 inline-block">Spatial Intel</span>
        <h1 className="text-2xl font-bold">Global Operations Map</h1>
        <p className="text-muted-foreground text-sm">All registered locations across active cases and persons of interest.</p>
      </div>

      <Card className="card-intel relative overflow-hidden h-[280px]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary)/0.15),transparent_50%),radial-gradient(circle_at_70%_60%,hsl(var(--destructive)/0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.1)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.1)_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center">
            <GlobeIcon className="h-16 w-16 text-primary/60 mx-auto mb-3 animate-[spin_30s_linear_infinite]" />
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {(cases?.length ?? 0) + (criminals?.length ?? 0)} active geo-pins worldwide
            </div>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="card-intel">
          <CardHeader>
            <CardTitle className="text-base">Cases by location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-[400px] overflow-y-auto scrollbar-thin">
            {cases?.map((c: any, i: number) => (
              <div key={i} className="flex items-center gap-2 p-2 rounded bg-card-elevated">
                <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{c.title}</div>
                  <div className="text-[10px] font-mono text-muted-foreground">{c.location}</div>
                </div>
                <Badge variant="outline" className="text-[10px] uppercase">{c.priority}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="card-intel">
          <CardHeader>
            <CardTitle className="text-base">Suspect last-known locations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-[400px] overflow-y-auto scrollbar-thin">
            {criminals?.map((c: any, i: number) => (
              <div key={i} className="flex items-center gap-2 p-2 rounded bg-card-elevated">
                <MapPin className="h-3.5 w-3.5 text-destructive shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{c.full_name}</div>
                  <div className="text-[10px] font-mono text-muted-foreground">{c.last_known_location}</div>
                </div>
                <Badge variant="outline" className="text-[10px] uppercase">{c.threat_level}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
