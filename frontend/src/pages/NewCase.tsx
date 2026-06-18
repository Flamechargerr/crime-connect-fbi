import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { createCase } from '@/lib/api';
import { ArrowLeft, FilePlus, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function NewCase() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [assignedTo, setAssignedTo] = useState('');
  const [loading, setLoading] = useState(false);

  const mutation = useMutation({
    mutationFn: createCase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cases'] });
      toast.success('Case record initialized successfully.');
      navigate('/cases');
    },
    onError: (err: any) => {
      toast.error(`Failed to initialize case: ${err.message}`);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await mutation.mutateAsync({ title, description, priority, assigned_to: assignedTo });
    setLoading(false);
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* ═══ BACK BUTTON ═══ */}
      <motion.div whileHover={{ x: -3 }} transition={{ type: 'spring', stiffness: 400 }}>
        <Button variant="ghost" onClick={() => navigate('/cases')} className="gap-2 font-mono text-xs uppercase tracking-wider">
          <ArrowLeft className="h-4 w-4" /> Back to cases
        </Button>
      </motion.div>

      {/* ═══ HUD HEADER ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
          <FilePlus className="h-6 w-6 text-primary" />
          Initialize Case File
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Create a new investigation ledger to track incidents and assigned agents.
        </p>
      </motion.div>

      {/* ═══ FORM CARD ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 30 }}
      >
        <Card className="card-intel relative overflow-hidden">
          {/* Scan line */}
          <div className="absolute left-0 right-0 h-[1px] bg-primary/5 animate-scan top-0 pointer-events-none" />

          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
              {/* Title Field */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
              >
                <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-primary/60" /> Title
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="Case title"
                  className="mt-1.5 bg-background/50 border-primary/20 focus:border-primary/50 focus:shadow-[0_0_12px_rgba(0,255,255,0.15)] transition-shadow font-mono"
                />
              </motion.div>

              {/* Description Field */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-primary/60" /> Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Case details..."
                  className="mt-1.5 w-full rounded-md border border-primary/20 bg-background/50 px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50 focus:shadow-[0_0_12px_rgba(0,255,255,0.15)] transition-shadow min-h-[100px] font-mono"
                />
              </motion.div>

              {/* Priority / Assigned Grid */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 }}
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-primary/60" /> Priority
                  </label>
                  <Select
                    value={priority}
                    onValueChange={setPriority}
                    options={[
                      { value: 'low', label: 'Low' },
                      { value: 'medium', label: 'Medium' },
                      { value: 'high', label: 'High' },
                      { value: 'critical', label: 'Critical' },
                    ]}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-primary/60" /> Assigned To
                  </label>
                  <Input
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    placeholder="Agent name"
                    className="mt-1.5 bg-background/50 border-primary/20 focus:border-primary/50 focus:shadow-[0_0_12px_rgba(0,255,255,0.15)] transition-shadow font-mono"
                  />
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full gap-2 font-mono uppercase tracking-wider text-xs shadow-[0_0_20px_rgba(0,255,255,0.15)] hover:shadow-[0_0_30px_rgba(0,255,255,0.3)] transition-shadow"
                >
                  {loading ? (
                    <>
                      <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                      Transmitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" /> Initialize Case File
                    </>
                  )}
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
