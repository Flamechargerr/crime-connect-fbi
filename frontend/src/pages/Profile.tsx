import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { toast } from '../components/ui/sonner';

const getUserFromStorage = () => {
  const user = localStorage.getItem('userProfile');
  return user ? JSON.parse(user) : { name: '', email: '', avatar: '', password: '' };
};

const Profile: React.FC = () => {
  const [user, setUser] = useState(getUserFromStorage());
  const [form, setForm] = useState({ name: user.name, email: user.email, avatar: user.avatar });
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [avatarPreview, setAvatarPreview] = useState(user.avatar);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setForm({ name: user.name, email: user.email, avatar: user.avatar });
    setAvatarPreview(user.avatar);
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result as string);
        setForm(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      localStorage.setItem('userProfile', JSON.stringify({ ...user, ...form }));
      setUser({ ...user, ...form });
      setIsSaving(false);
      toast.success('Profile updated!');
    }, 500);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwords.current !== user.password) {
      toast.error('Current password is incorrect');
      return;
    }
    setIsSaving(true);
    setTimeout(() => {
      localStorage.setItem('userProfile', JSON.stringify({ ...user, password: passwords.new }));
      setUser({ ...user, password: passwords.new });
      setPasswords({ current: '', new: '', confirm: '' });
      setIsSaving(false);
      toast.success('Password changed!');
    }, 500);
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileSave} className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              <label htmlFor="avatar" className="cursor-pointer">
                <img
                  src={avatarPreview || '/placeholder.svg'}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full object-cover border"
                />
                <input
                  id="avatar"
                  name="avatar"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium">Name</label>
              <Input id="name" name="name" value={form.name} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">Email</label>
              <Input id="email" name="email" type="email" value={form.email} onChange={handleInputChange} required />
            </div>
            <Button type="submit" className="w-full" disabled={isSaving}>Save Profile</Button>
          </form>
          <hr className="my-8" />
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="current" className="block text-sm font-medium">Current Password</label>
              <Input id="current" name="current" type="password" value={passwords.current} onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))} required />
            </div>
            <div className="space-y-2">
              <label htmlFor="new" className="block text-sm font-medium">New Password</label>
              <Input id="new" name="new" type="password" value={passwords.new} onChange={e => setPasswords(p => ({ ...p, new: e.target.value }))} required />
            </div>
            <div className="space-y-2">
              <label htmlFor="confirm" className="block text-sm font-medium">Confirm New Password</label>
              <Input id="confirm" name="confirm" type="password" value={passwords.confirm} onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))} required />
            </div>
            <Button type="submit" className="w-full" disabled={isSaving}>Change Password</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile; 