import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Folder,
  Users,
  ShieldAlert,
  FileSearch,
  Star,
  Pin,
  Globe,
  BarChart3,
  Lock,
  House,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

const investigation = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Cases', url: '/cases', icon: Folder },
  { title: 'Criminals', url: '/criminals', icon: ShieldAlert },
  { title: 'Evidence', url: '/evidence', icon: FileSearch },
  { title: 'Officers', url: '/officers', icon: Users },
];

const intel = [
  { title: 'Most Wanted', url: '/most-wanted', icon: Star },
  { title: 'Corkboard', url: '/corkboard', icon: Pin },
  { title: 'Global Map', url: '/globe', icon: Globe },
  { title: 'Hideouts', url: '/hideouts', icon: House },
  { title: 'Reports', url: '/reports', icon: BarChart3 },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const { pathname } = useLocation();

  const renderItems = (items: typeof investigation) =>
    items.map((item) => {
      const active = pathname === item.url || pathname.startsWith(item.url + '/');
      return (
        <SidebarMenuItem key={item.url}>
          <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
            <NavLink to={item.url} end>
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </NavLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    });

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-3">
          <div className="relative h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-[0_0_20px_-4px_hsl(var(--primary)/0.6)]">
            <Lock className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold tracking-tight">CrimeConnect</span>
              <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
                Classified
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Investigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderItems(investigation)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Intelligence</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderItems(intel)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        {!collapsed && (
          <div className="text-[10px] font-mono text-muted-foreground/70 leading-tight">
            <div className="text-primary/80">SECURE LINE • TLS 1.3</div>
            <div>Build v2.0 • {new Date().getFullYear()}</div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
