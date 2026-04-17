import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function Profile() {
  const { user, roles } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [badge, setBadge] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setDisplayName(data.display_name ?? '');
          setBadge(data.badge_number ?? '');
          setBio(data.bio ?? '');
        }
        setLoading(false);
      });
  }, [user]);

  const save = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .upsert({ user_id: user.id, display_name: displayName, badge_number: badge, bio }, { onConflict: 'user_id' });
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success('Profile updated');
  };

  const initials = (displayName || user?.email || '??').slice(0, 2).toUpperCase();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-muted-foreground text-sm">Manage your agent identity.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="card-intel">
          <CardHeader className="text-center">
            <Avatar className="h-20 w-20 mx-auto">
              <AvatarFallback className="text-xl bg-primary/15 text-primary">{initials}</AvatarFallback>
            </Avatar>
            <CardTitle className="mt-3">{displayName || 'Unnamed Agent'}</CardTitle>
            <CardDescription className="font-mono text-xs">{user?.email}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-1 justify-center">
              {roles.map((r) => <Badge key={r} variant="secondary" className="font-mono uppercase">{r}</Badge>)}
            </div>
            {badge && <div className="text-center text-xs font-mono text-muted-foreground">Badge {badge}</div>}
          </CardContent>
        </Card>

        <Card className="card-intel md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Edit profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            ) : (
              <>
                <div className="space-y-1.5">
                  <Label>Display name</Label>
                  <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Badge number</Label>
                  <Input value={badge} onChange={(e) => setBadge(e.target.value)} className="font-mono" />
                </div>
                <div className="space-y-1.5">
                  <Label>Bio</Label>
                  <Input value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Brief background" />
                </div>
                <Button onClick={save} disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Save changes
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
