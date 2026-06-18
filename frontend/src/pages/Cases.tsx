import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { getCases, deleteCase } from '@/lib/api';
import { Plus, Trash2, ArrowRight, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* ═══ HUD HEADER ═══ */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-mono font-bold uppercase tracking-wider text-glow text-white flex items-center gap-3">
            <Shield className="h-6 w-6 text-primary" />
            CASE_MANAGEMENT <span className="text-primary/50">//</span> TACTICAL_DATABASE
          </h1>
          <p className="text-[10px] font-mono uppercase tracking-widest text-primary/60 mt-1">
            Internal investigations and case tracking • Clearance Level: Authorized
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Live case count indicator */}
          {cases && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 px-3 py-1.5 rounded border border-primary/20 bg-primary/5"
            >
              <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-wider text-primary/80">
                {cases.length} Active Records
              </span>
            </motion.div>
          )}
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              onClick={() => navigate('/cases/new')}
              className="gap-2 shadow-[0_0_15px_rgba(0,255,255,0.15)] hover:shadow-[0_0_25px_rgba(0,255,255,0.3)] transition-shadow"
            >
              <Plus className="h-4 w-4" /> New Case
            </Button>
          </motion.div>
        </div>
      </div>

      {/* ═══ TABLE CARD ═══ */}
      <Card className="card-intel overflow-hidden relative">
        {/* Scan line overlay */}
        <div className="absolute left-0 right-0 h-[1px] bg-primary/10 animate-scan top-0 pointer-events-none" />

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs font-mono uppercase tracking-wider">Title</TableHead>
                  <TableHead className="text-xs font-mono uppercase tracking-wider">Status</TableHead>
                  <TableHead className="text-xs font-mono uppercase tracking-wider">Priority</TableHead>
                  <TableHead className="text-xs font-mono uppercase tracking-wider">Assigned</TableHead>
                  <TableHead className="text-xs font-mono uppercase tracking-wider">Created</TableHead>
                  <TableHead className="text-right text-xs font-mono uppercase tracking-wider">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 6 }).map((_, j) => <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>)}
                  </TableRow>
                ))}
                {cases?.map((c: any, i: number) => (
                  <motion.tr
                    key={c.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, type: 'spring', stiffness: 300, damping: 30 }}
                    className="cursor-pointer border-b border-border/50 transition-colors hover:bg-muted/50"
                    onClick={() => navigate(`/cases/${c.id}`)}
                  >
                    <TableCell className="font-medium font-mono text-sm">{c.title}</TableCell>
                    <TableCell>
                      <Badge variant={c.status === 'open' ? 'default' : 'secondary'} className="text-[10px] uppercase font-mono">
                        {c.status === 'open' && <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse mr-1.5 inline-block" />}
                        {c.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${priorityColors[c.priority] || priorityColors.medium} text-[10px] uppercase font-mono`}>{c.priority}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground font-mono">{c.assigned_to || '—'}</TableCell>
                    <TableCell className="font-mono text-xs text-primary/70">{c.created_at?.slice(0, 10)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        <motion.button
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => { e.stopPropagation(); deleteMutation.mutate(c.id); }}
                          className="p-1 rounded hover:bg-destructive/10 hover:text-destructive transition-colors hover:shadow-[0_0_8px_rgba(255,0,0,0.3)]"
                        >
                          <Trash2 className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
