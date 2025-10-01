import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

const getUserFromStorage = () => {
  try { const s = localStorage.getItem('userProfile'); if (s) return JSON.parse(s); } catch {}
  return { name: 'Agent', email: 'agent@fbi.gov', avatar: '', password: 'password' };
};

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(getUserFromStorage());
  const [form, setForm] = useState({ name: profile.name, email: user?.email || profile.email, avatar: profile.avatar });
  const [saving, setSaving] = useState(false);

  useEffect(()=>{ setForm({ name: profile.name, email: user?.email || profile.email, avatar: profile.avatar }); }, [profile, user]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const onAvatar = (e: React.ChangeEvent<HTMLInputElement>) => { const f = e.target.files?.[0]; if (!f) return; const rd = new FileReader(); rd.onload = ()=> setForm(prev => ({ ...prev, avatar: rd.result as string })); rd.readAsDataURL(f); };

  const save = (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    setTimeout(()=>{ localStorage.setItem('userProfile', JSON.stringify({ ...profile, ...form })); setProfile({ ...profile, ...form }); setSaving(false); toast.success('Profile updated'); }, 400);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Agent Profile</h1>
        <p className="text-sm text-muted-foreground">Update your avatar and details. Stored locally for demo.</p>
      </div>
      <Card className="glass-card">
        <CardHeader><CardTitle>Identity</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={save} className="space-y-4">
            <div className="flex items-center gap-4">
              <label htmlFor="avatar" className="cursor-pointer">
                <img src={form.avatar || '/placeholder.svg'} alt="Avatar" className="w-20 h-20 rounded-full border object-cover" />
                <input id="avatar" name="avatar" type="file" accept="image/*" className="hidden" onChange={onAvatar} />
              </label>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs">Name</label>
                  <Input name="name" value={form.name} onChange={onChange} />
                </div>
                <div>
                  <label className="text-xs">Email</label>
                  <Input name="email" type="email" value={form.email} onChange={onChange} />
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={saving}>{saving? 'Saving…' : 'Save'}</Button>
              <Button type="button" variant="destructive" onClick={async ()=>{ await logout(); }}>Sign out</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
