import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileSearch, ShieldAlert, MapPin, Calendar, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

const priorityColor: Record<string, string> = {
  critical: 'bg-destructive/15 text-destructive border-destructive/30',
  high: 'bg-warning/15 text-warning border-warning/30',
  medium: 'bg-primary/15 text-primary border-primary/30',
  low: 'bg-muted text-muted-foreground',
};

export default function CaseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['case', id],
    queryFn: async () => {
      const [caseRes, evidenceRes, linksRes] = await Promise.all([
        supabase.from('cases').select('*, officers(full_name, badge_number, rank)').eq('id', id).maybeSingle(),
        supabase.from('evidence').select('*').eq('case_id', id),
        supabase.from('case_criminals').select('role, criminals(*)').eq('case_id', id),
      ]);
      return { case: caseRes.data, evidence: evidenceRes.data ?? [], suspects: linksRes.data ?? [] };
    },
    enabled: !!id,
  });

  if (isLoading) return <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />;
  if (!data?.case) return <div className="text-center text-muted-foreground py-12">Case not found.</div>;

  const c = data.case;

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4 mr-2" /> Back
      </Button>

      <Card className="card-intel">
        <CardHeader>
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className="font-mono text-xs text-muted-foreground uppercase">{c.case_number}</span>
            <Badge variant="outline" className={`${priorityColor[c.priority]} text-[10px] uppercase`}>{c.priority}</Badge>
            <Badge variant="secondary" className="text-[10px] uppercase">{c.status}</Badge>
          </div>
          <CardTitle className="text-2xl">{c.title}</CardTitle>
          <CardDescription className="text-base mt-2">{c.description}</CardDescription>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{c.location ?? '—'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Opened {format(new Date(c.opened_at), 'MMM d, yyyy')}</span>
          </div>
          {c.officers && (
            <div className="text-muted-foreground">Lead: <span className="text-foreground font-medium">{c.officers.full_name}</span></div>
          )}
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="card-intel">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><ShieldAlert className="h-4 w-4 text-destructive" /> Suspects ({data.suspects.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.suspects.length === 0 && <p className="text-sm text-muted-foreground">No suspects linked.</p>}
            {data.suspects.map((s: any) => s.criminals && (
              <Link key={s.criminals.id} to={`/criminals`} className="flex items-center justify-between p-3 rounded-lg bg-card-elevated hover:bg-muted/50 transition-colors">
                <div>
                  <div className="font-medium">{s.criminals.full_name}</div>
                  <div className="text-xs text-muted-foreground">{s.role} • {s.criminals.threat_level} threat</div>
                </div>
                <Badge variant="outline" className="text-[10px] uppercase">{s.criminals.status}</Badge>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card className="card-intel">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><FileSearch className="h-4 w-4 text-warning" /> Evidence ({data.evidence.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.evidence.length === 0 && <p className="text-sm text-muted-foreground">No evidence logged.</p>}
            {data.evidence.map((e: any) => (
              <div key={e.id} className="p-3 rounded-lg bg-card-elevated">
                <div className="flex items-center justify-between mb-1">
                  <div className="font-medium">{e.label}</div>
                  <Badge variant="outline" className="text-[10px] uppercase">{e.evidence_type}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{e.description}</p>
                <p className="text-[10px] text-muted-foreground/70 font-mono mt-1">{e.storage_location}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
