import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { getCases, deleteCase } from '@/lib/api';
import { Plus, Trash2, ArrowRight } from 'lucide-react';

export default function Cases() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: cases, isLoading } = useQuery({ queryKey: ['cases'], queryFn: getCases });

  const deleteMutation = useMutation({
    mutationFn: deleteCase,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cases'] }),
  });

  const priorityColors: Record<string, string> = {
    critical: 'bg-destructive/15 text-destructive border-destructive/30',
    high: 'bg-warning/15 text-warning border-warning/30',
    medium: 'bg-primary/15 text-primary border-primary/30',
    low: 'bg-muted text-muted-foreground',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Case Management</h1>
          <p className="text-muted-foreground text-sm mt-1">Internal investigations and case tracking.</p>
        </div>
        <Button onClick={() => navigate('/cases/new')} className="gap-2">
          <Plus className="h-4 w-4" /> New Case
        </Button>
      </div>

      <Card className="card-intel overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Assigned</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 6 }).map((_, j) => <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>)}
                  </TableRow>
                ))}
                {cases?.map((c: any) => (
                  <TableRow key={c.id} className="cursor-pointer" onClick={() => navigate(`/cases/${c.id}`)}>
                    <TableCell className="font-medium">{c.title}</TableCell>
                    <TableCell>
                      <Badge variant={c.status === 'open' ? 'default' : 'secondary'} className="text-[10px] uppercase">{c.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${priorityColors[c.priority] || priorityColors.medium} text-[10px] uppercase`}>{c.priority}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{c.assigned_to || '—'}</TableCell>
                    <TableCell className="font-mono text-xs">{c.created_at?.slice(0, 10)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteMutation.mutate(c.id); }}
                          className="p-1 rounded hover:bg-destructive/10 hover:text-destructive transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
