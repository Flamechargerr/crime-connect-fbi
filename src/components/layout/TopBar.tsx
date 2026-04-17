import { Bell, LogOut, User as UserIcon, Search } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

export default function TopBar() {
  const { user, roles, signOut } = useAuth();
  const navigate = useNavigate();

  const initials = (user?.email ?? '??')
    .split('@')[0]
    .slice(0, 2)
    .toUpperCase();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/80 backdrop-blur-xl px-4">
      <SidebarTrigger />

      <div className="hidden md:flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
        <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
        <span>Secure</span>
        <span className="text-border">•</span>
        <span>Operations Console</span>
      </div>

      <div className="flex-1 max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search cases, criminals, evidence…"
            className="pl-9 h-9 bg-muted/40 border-border/60 font-mono text-xs"
          />
        </div>
      </div>

      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-4 w-4" />
        <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-destructive" />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="gap-2 px-2">
            <Avatar className="h-7 w-7">
              <AvatarFallback className="bg-primary/15 text-primary text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:flex flex-col items-start leading-tight">
              <span className="text-xs font-medium">{user?.email}</span>
              <span className="text-[10px] text-muted-foreground font-mono uppercase">
                {roles[0] ?? 'agent'}
              </span>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="flex flex-col gap-1">
            <span>{user?.email}</span>
            <div className="flex gap-1">
              {roles.map((r) => (
                <Badge key={r} variant="secondary" className="text-[10px] uppercase font-mono">
                  {r}
                </Badge>
              ))}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate('/profile')}>
            <UserIcon className="h-4 w-4 mr-2" /> Profile
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
            <LogOut className="h-4 w-4 mr-2" /> Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
