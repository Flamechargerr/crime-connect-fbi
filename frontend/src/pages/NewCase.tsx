import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { createCase } from '@/lib/api';
import { ArrowLeft } from 'lucide-react';

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
      navigate('/cases');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await mutation.mutateAsync({ title, description, priority, assigned_to: assignedTo });
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate('/cases')} className="gap-2">
        <ArrowLeft className="h-4 w-4" /> Back to cases
      </Button>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">New Case</h1>
        <p className="text-muted-foreground text-sm mt-1">Create a new investigation case.</p>
      </div>

      <Card className="card-intel">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Case title" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Case details..."
                className="mt-1 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-[100px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Priority</label>
                <Select
                  value={priority}
                  onValueChange={setPriority}
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
                <label className="text-sm font-medium">Assigned To</label>
                <Input value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} placeholder="Agent name" className="mt-1" />
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Creating...' : 'Create Case'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
