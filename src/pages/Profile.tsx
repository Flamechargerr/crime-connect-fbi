import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import {
  User,
  Mail,
  Shield,
  Lock,
  Calendar,
  MapPin,
  Phone,
  Briefcase,
  Award,
  Clock,
  Camera,
  LogOut,
  Save,
  Bell,
  Eye,
  Key
} from 'lucide-react';

const getUserFromStorage = () => {
  try {
    const s = localStorage.getItem('userProfile');
    if (s) return JSON.parse(s);
  } catch { }
  return {
    name: 'Special Agent',
    email: 'agent@fbi.gov',
    avatar: '',
    badge: 'SA-7842-DC',
    division: 'Criminal Investigation',
    office: 'Washington Field Office',
    clearance: 'TOP SECRET',
    joined: '2019-03-15',
    casesCompleted: 47,
    activeCases: 3,
  };
};

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(getUserFromStorage());
  const [form, setForm] = useState({ name: profile.name, email: user?.email || profile.email, avatar: profile.avatar });
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications'>('profile');

  useEffect(() => {
    setForm({ name: profile.name, email: user?.email || profile.email, avatar: profile.avatar });
  }, [profile, user]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const onAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const rd = new FileReader();
    rd.onload = () => setForm(prev => ({ ...prev, avatar: rd.result as string }));
    rd.readAsDataURL(f);
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      localStorage.setItem('userProfile', JSON.stringify({ ...profile, ...form }));
      setProfile({ ...profile, ...form });
      setSaving(false);
      toast.success('Agent profile updated');
    }, 500);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div className="fbi-header">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-foreground">Agent Profile</h1>
              <span className="classified-badge">PERSONNEL FILE</span>
            </div>
            <p className="text-sm text-muted-foreground">Federal Bureau of Investigation - Agent Identity Management</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Agent Card */}
        <div className="space-y-6">
          <div className="card-modern overflow-hidden">
            {/* Agent Photo Section */}
            <div className="relative h-32 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0di00aC0ydjRoLTR2Mmg0djRoMnYtNGg0di0yaC00em0wLTMwVjBoLTJ2NGgtNHYyaDR2NGgyVjZoNFY0aC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                <label htmlFor="avatar" className="cursor-pointer group relative block">
                  <div className="h-24 w-24 rounded-full border-4 border-card overflow-hidden bg-muted shadow-xl">
                    {form.avatar ? (
                      <img src={form.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="h-full w-full bg-primary/10 flex items-center justify-center">
                        <User className="h-10 w-10 text-primary/50" />
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="h-6 w-6 text-white" />
                  </div>
                  <input id="avatar" name="avatar" type="file" accept="image/*" className="hidden" onChange={onAvatar} />
                </label>
              </div>
            </div>

            {/* Agent Info */}
            <div className="pt-16 pb-6 px-6 text-center">
              <h2 className="text-xl font-bold text-foreground">{form.name}</h2>
              <p className="text-sm text-muted-foreground">{form.email}</p>

              <div className="mt-4 flex items-center justify-center gap-2">
                <span className="badge badge-primary">{profile.division}</span>
              </div>

              <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border">
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Badge Number</div>
                <div className="font-mono font-bold text-foreground text-lg">{profile.badge}</div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card-modern p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              Performance Metrics
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Cases Completed</span>
                <span className="font-bold text-green-600 dark:text-green-400">{profile.casesCompleted}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active Cases</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{profile.activeCases}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Years of Service</span>
                <span className="font-bold text-foreground">
                  {new Date().getFullYear() - new Date(profile.joined).getFullYear()}
                </span>
              </div>
              <div className="pt-3 border-t border-border flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Security Clearance</span>
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-500/10 text-red-500 border border-red-500/30">
                  {profile.clearance}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tab Navigation */}
          <div className="flex gap-2 border-b border-border pb-4">
            {[
              { id: 'profile', label: 'Profile', icon: User },
              { id: 'security', label: 'Security', icon: Shield },
              { id: 'notifications', label: 'Notifications', icon: Bell },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <form onSubmit={save} className="card-modern p-6 space-y-6">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Full Name</label>
                  <Input name="name" value={form.name} onChange={onChange} className="input-pro" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Email Address</label>
                  <Input name="email" type="email" value={form.email} onChange={onChange} className="input-pro" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Division</label>
                  <Input value={profile.division} disabled className="input-pro bg-muted/50" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Field Office</label>
                  <Input value={profile.office} disabled className="input-pro bg-muted/50" />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-border">
                <Button type="submit" disabled={saving} className="btn-pro">
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button type="button" variant="outline" onClick={async () => { await logout(); }}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </form>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="card-modern p-6 space-y-6">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Security Settings
              </h3>

              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/30 border border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Key className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground">Change Password</p>
                        <p className="text-sm text-muted-foreground">Last changed 30 days ago</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Update</Button>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-muted/30 border border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Lock className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground">Two-Factor Authentication</p>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                      </div>
                    </div>
                    <span className="badge badge-success">Enabled</span>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-muted/30 border border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Eye className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground">Session Activity</p>
                        <p className="text-sm text-muted-foreground">View active login sessions</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
                <p className="text-sm text-amber-600 dark:text-amber-400">
                  <strong>Security Notice:</strong> All authentication changes are logged and require supervisor approval for Level 5+ agents.
                </p>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="card-modern p-6 space-y-6">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Notification Preferences
              </h3>

              <div className="space-y-4">
                {[
                  { label: 'Case Updates', desc: 'Receive alerts when cases are updated', enabled: true },
                  { label: 'System Alerts', desc: 'Important system notifications', enabled: true },
                  { label: 'New Evidence', desc: 'When new evidence is logged to your cases', enabled: true },
                  { label: 'Weekly Digest', desc: 'Summary of weekly activity', enabled: false },
                ].map((item, i) => (
                  <div key={i} className="p-4 rounded-lg bg-muted/30 border border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">{item.label}</p>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                      <div className={`w-12 h-6 rounded-full transition-colors ${item.enabled ? 'bg-green-500' : 'bg-muted'}`}>
                        <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform mt-0.5 ${item.enabled ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
