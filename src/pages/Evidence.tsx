import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { FileSearch, Database, Microscope, FileText, Crosshair, Layers } from 'lucide-react';

const typeIcons: Record<string, any> = {
  digital: Database,
  biological: Microscope,
  document: FileText,
  weapon: Crosshair,
  physical: Layers,
  other: FileSearch,
};

const typeColor: Record<string, string> = {
  digital: 'text-primary bg-primary/10',
  biological: 'text-success bg-success/10',
  document: 'text-warning bg-warning/10',
  weapon: 'text-destructive bg-destructive/10',
  physical: 'text-muted-foreground bg-muted',
  other: 'text-muted-foreground bg-muted',
};

export default function Evidence() {
  const { data, isLoading } = useQuery({
    queryKey: ['evidence'],
    queryFn: async () => (await supabase.from('evidence').select('*, cases(case_number, title), officers(full_name)').order('collected_at', { ascending: false })).data ?? [],
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Evidence Locker</h1>
        <p className="text-muted-foreground text-sm">All catalogued evidence with chain-of-custody.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {isLoading && Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
        {data?.map((e: any) => {
          const Icon = typeIcons[e.evidence_type] ?? FileSearch;
          return (
            <Card key={e.id} className="card-intel">
              <CardContent className="pt-5 flex gap-3">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${typeColor[e.evidence_type]}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold truncate">{e.label}</span>
                    <Badge variant="outline" className="text-[10px] uppercase">{e.evidence_type}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{e.description}</p>
                  <div className="text-[10px] font-mono text-muted-foreground/70 mt-2 flex flex-wrap gap-x-3">
                    <span>📦 {e.storage_location}</span>
                    {e.cases && <span>• {e.cases.case_number}</span>}
                    {e.officers && <span>• Collected by {e.officers.full_name}</span>}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
