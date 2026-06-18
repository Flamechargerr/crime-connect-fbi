import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { getCase, updateCase, deleteCase } from '@/lib/api';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';

export default function CaseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);

  const { data: caseData, isLoading } = useQuery({
    queryKey: ['case', id],
    queryFn: () => getCase(id!),
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => updateCase(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['case', id] });
      queryClient.invalidateQueries({ queryKey: ['cases'] });
      setEditing(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteCase(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cases'] });
      navigate('/cases');
    },
  });

  if (isLoading) return <div className="p-6"><div className="h-8 w-48 bg-muted animate-pulse rounded" /></div>;
  if (!caseData) return <div className="p-6">Case not found.</div>;

  const priorityColors: Record<string, string> = {
    critical: 'bg-destructive/15 text-destructive border-destructive/30',
    high: 'bg-warning/15 text-warning border-warning/30',
    medium: 'bg-primary/15 text-primary border-primary/30',
    low: 'bg-muted text-muted-foreground',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate('/cases')} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setEditing(!editing)}>
            {editing ? 'Cancel' : 'Edit'}
          </Button>
          <Button variant="destructive" onClick={() => deleteMutation.mutate()} className="gap-2">
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">{caseData.title}</h1>
        <div className="flex gap-2 mt-2">
          <Badge variant={caseData.status === 'open' ? 'default' : 'secondary'} className="text-[10px] uppercase">{caseData.status}</Badge>
          <Badge variant="outline" className={`${priorityColors[caseData.priority] || priorityColors.medium} text-[10px] uppercase`}>{caseData.priority}</Badge>
        </div>
      </div>

      <Card className="card-intel">
        <CardContent className="pt-6">
          {editing ? (
            <form onSubmit={(e) => { e.preventDefault(); updateMutation.mutate(caseData); }} className="space-y-4 max-w-xl">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input defaultValue={caseData.title} onChange={(e) => caseData.title = e.target.value} className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <textarea
                  defaultValue={caseData.description}
                  onChange={(e) => caseData.description = e.target.value}
                  className="mt-1 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-[100px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Priority</label>
                  <Select
                    value={caseData.priority}
                    onValueChange={(v) => caseData.priority = v}
                    options={[
                      { value: 'low', label: 'Low' },
                      { value: 'medium', label: 'Medium' },
                      { value: 'high', label: 'High' },
                      { value: 'critical', label: 'Critical' },
                    ]}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Select
                    value={caseData.status}
                    onValueChange={(v) => caseData.status = v}
                    options={[
                      { value: 'open', label: 'Open' },
                      { value: 'in_progress', label: 'In Progress' },
                      { value: 'closed', label: 'Closed' },
                    ]}
                    className="mt-1"
                  />
                </div>
              </div>
              <Button type="submit" disabled={updateMutation.isPending} className="gap-2">
                <Save className="h-4 w-4" /> Save Changes
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">Description</div>
                <p className="text-sm">{caseData.description || 'No description provided.'}</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">Assigned To</div>
                  <p className="text-sm font-medium">{caseData.assigned_to || 'Unassigned'}</p>
                </div>
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">Created</div>
                  <p className="text-sm font-mono">{caseData.created_at?.slice(0, 10)}</p>
                </div>
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">Updated</div>
                  <p className="text-sm font-mono">{caseData.updated_at?.slice(0, 10)}</p>
                </div>
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">Case ID</div>
                  <p className="text-sm font-mono">{caseData.id.slice(0, 8)}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
