import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { z } from 'zod';

const criminalFormSchema = z.object({
  full_name: z.string().trim().min(3, 'Full name must be at least 3 characters'),
  alias: z.string().trim().max(120, 'Alias is too long').optional(),
  nationality: z.string().trim().max(80, 'Nationality is too long').optional(),
  threat_level: z.enum(['low', 'medium', 'high', 'extreme']),
  status: z.enum(['at_large', 'in_custody', 'incarcerated', 'deceased']),
  description: z.string().trim().max(5000, 'Description is too long').optional(),
  last_known_location: z.string().trim().max(120, 'Location is too long').optional(),
  most_wanted: z.boolean(),
});
type CriminalThreatLevel = z.infer<typeof criminalFormSchema>['threat_level'];
type CriminalStatus = z.infer<typeof criminalFormSchema>['status'];

export default function AddCriminal() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: '',
    alias: '',
    nationality: '',
    threat_level: 'medium',
    status: 'at_large',
    description: '',
    last_known_location: '',
    most_wanted: false,
  });
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = criminalFormSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? 'Invalid suspect form input');
      return;
    }

    setSubmitting(true);
    const payload = parsed.data;
    const { error } = await supabase.from('criminals').insert({
      ...payload,
      alias: payload.alias || null,
      nationality: payload.nationality || null,
      description: payload.description || null,
      last_known_location: payload.last_known_location || null,
      threat_level: payload.threat_level as CriminalThreatLevel,
      status: payload.status as CriminalStatus,
    });
    setSubmitting(false);
    if (error) toast.error(error.message);
    else { toast.success('Suspect added'); navigate('/criminals'); }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4 mr-2" /> Back
      </Button>
      <Card className="card-intel">
        <CardHeader>
          <CardTitle>Add suspect</CardTitle>
          <CardDescription>Create a new entry in the criminal database.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Full name *</Label>
                <Input required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Alias</Label>
                <Input value={form.alias} onChange={(e) => setForm({ ...form, alias: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Nationality</Label>
                <Input value={form.nationality} onChange={(e) => setForm({ ...form, nationality: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Last known location</Label>
                <Input value={form.last_known_location} onChange={(e) => setForm({ ...form, last_known_location: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Threat level</Label>
                <Select value={form.threat_level} onValueChange={(v) => setForm({ ...form, threat_level: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="extreme">Extreme</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="at_large">At large</SelectItem>
                    <SelectItem value="in_custody">In custody</SelectItem>
                    <SelectItem value="incarcerated">Incarcerated</SelectItem>
                    <SelectItem value="deceased">Deceased</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.most_wanted} onCheckedChange={(v) => setForm({ ...form, most_wanted: v })} />
              <Label>Add to Most Wanted list</Label>
            </div>
            <Button type="submit" disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Add suspect
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
