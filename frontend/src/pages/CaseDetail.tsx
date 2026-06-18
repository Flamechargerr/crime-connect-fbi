import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { getCase, updateCase, deleteCase } from '@/lib/api';
import { ArrowLeft, Save, Trash2, FileText, User, Calendar, Hash } from 'lucide-react';
import { motion } from 'framer-motion';

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
  if (!caseData) return <div className="p-6 font-mono text-primary/60">[ ERR ] Case not found.</div>;

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
      {/* ═══ TOP NAV BAR ═══ */}
      <div className="flex items-center justify-between">
        <motion.div whileHover={{ x: -3 }} transition={{ type: 'spring', stiffness: 400 }}>
          <Button variant="ghost" onClick={() => navigate('/cases')} className="gap-2 font-mono text-xs uppercase tracking-wider">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        </motion.div>
        <div className="flex gap-2">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              variant="outline"
              onClick={() => setEditing(!editing)}
              className="font-mono text-xs uppercase tracking-wider border-primary/30 hover:border-primary/60 hover:shadow-[0_0_10px_rgba(0,255,255,0.15)]"
            >
              {editing ? 'Cancel' : 'Edit'}
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              variant="destructive"
              onClick={() => deleteMutation.mutate()}
              className="gap-2 font-mono text-xs uppercase tracking-wider hover:shadow-[0_0_15px_rgba(255,0,0,0.3)]"
            >
              <Trash2 className="h-4 w-4" /> Delete
            </Button>
          </motion.div>
        </div>
      </div>

      {/* ═══ HUD HEADER ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h1 className="text-2xl font-mono font-bold uppercase tracking-wider text-glow text-white flex items-center gap-3">
          <FileText className="h-6 w-6 text-primary" />
          DOSSIER: {caseData.title}
        </h1>
        <p className="text-[10px] font-mono uppercase tracking-widest text-primary/60 mt-1">
          Intelligence Dossier • Case File #{caseData.id?.slice(0, 8)}
        </p>
        <div className="flex gap-2 mt-3">
          <Badge variant={caseData.status === 'open' ? 'default' : 'secondary'} className="text-[10px] uppercase font-mono">
            {caseData.status === 'open' && <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse mr-1.5 inline-block" />}
            {caseData.status}
          </Badge>
          <Badge variant="outline" className={`${priorityColors[caseData.priority] || priorityColors.medium} text-[10px] uppercase font-mono`}>{caseData.priority}</Badge>
        </div>
      </motion.div>

      {/* ═══ DOSSIER CARD ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 30 }}
      >
        <Card className="card-intel relative overflow-hidden">
          {/* Scan line */}
          <div className="absolute left-0 right-0 h-[1px] bg-primary/10 animate-scan top-0 pointer-events-none" />

          {/* Corner telemetry markers */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-primary/40" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-primary/40" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-primary/40" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-primary/40" />

          <CardContent className="pt-6">
            {editing ? (
              <form onSubmit={(e) => { e.preventDefault(); updateMutation.mutate(caseData); }} className="space-y-4 max-w-xl">
                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Title</label>
                  <Input defaultValue={caseData.title} onChange={(e) => caseData.title = e.target.value} className="mt-1 bg-background/50 border-primary/20 focus:border-primary/50 focus:shadow-[0_0_10px_rgba(0,255,255,0.1)]" />
                </div>
                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Description</label>
                  <textarea
                    defaultValue={caseData.description}
                    onChange={(e) => caseData.description = e.target.value}
                    className="mt-1 w-full rounded-md border border-primary/20 bg-background/50 px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50 focus:shadow-[0_0_10px_rgba(0,255,255,0.1)] min-h-[100px] font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Priority</label>
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
                    <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Status</label>
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
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button type="submit" disabled={updateMutation.isPending} className="gap-2 shadow-[0_0_15px_rgba(0,255,255,0.15)] hover:shadow-[0_0_25px_rgba(0,255,255,0.3)] transition-shadow font-mono uppercase tracking-wider text-xs">
                    <Save className="h-4 w-4" /> Save Changes
                  </Button>
                </motion.div>
              </form>
            ) : (
              <div className="space-y-6">
                {/* Description */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="text-xs font-mono uppercase tracking-wider text-primary/60 mb-2 flex items-center gap-2">
                    <FileText className="h-3 w-3" /> Description
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">{caseData.description || 'No description provided.'}</p>
                </motion.div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { icon: User, label: 'Assigned To', value: caseData.assigned_to || 'Unassigned', mono: false },
                    { icon: Calendar, label: 'Created', value: caseData.created_at?.slice(0, 10), mono: true },
                    { icon: Calendar, label: 'Updated', value: caseData.updated_at?.slice(0, 10), mono: true },
                    { icon: Hash, label: 'Case ID', value: caseData.id?.slice(0, 8), mono: true },
                  ].map((field, i) => (
                    <motion.div
                      key={field.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                      className="p-3 rounded-md border border-border/50 bg-muted/20"
                    >
                      <div className="text-xs font-mono uppercase tracking-wider text-primary/60 mb-1.5 flex items-center gap-1.5">
                        <field.icon className="h-3 w-3" /> {field.label}
                      </div>
                      <p className={`text-sm font-medium ${field.mono ? 'font-mono text-primary/80' : 'text-white'}`}>{field.value}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
