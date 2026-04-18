import * as React from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { LiveClock } from "@/components/LiveClock";
import {
  LayoutDashboard,
  Users,
  Target,
  FileText,
  Package,
  Home,
  MessageSquareText,
  LogOut,
  Radio,
  Shield,
} from "lucide-react";

const NAV = [
  { to: "/dashboard", label: "Command", icon: LayoutDashboard },
  { to: "/criminals", label: "Subjects", icon: Target },
  { to: "/cases", label: "Cases", icon: FileText },
  { to: "/agents", label: "Personnel", icon: Users },
  { to: "/evidence", label: "Evidence", icon: Package },
  { to: "/hideouts", label: "Safehouses", icon: Home },
  { to: "/intel", label: "Intel AI", icon: MessageSquareText },
] as const;

export function PortalLayout({ children }: { children: React.ReactNode }) {
  const { user, role, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen">
      {/* Top alert banner */}
      <div className="banner-classified flex items-center justify-center gap-3">
        <span className="pulse-dot" style={{ width: 6, height: 6 }} />
        // CLASSIFIED // FBI EYES ONLY // SCI/TS-SAP // CRIMECONNECT TERMINAL v2.0 //
      </div>

      {/* Status bar */}
      <div className="border-b border-border/60 bg-card/70 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-1.5 text-[10px]">
          <div className="flex items-center gap-4 font-mono uppercase tracking-widest text-muted-foreground">
            <span className="flex items-center gap-1.5"><Radio className="h-3 w-3 text-success" /> Comms Online</span>
            <span className="hidden sm:inline">Node: HQ-DC-01</span>
            <span className="hidden md:inline">Channel: SECURE-7</span>
          </div>
          <LiveClock />
        </div>
      </div>

      {/* Main header */}
      <header className="border-b border-border/60 bg-card/40 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-3">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center border-2 border-hud bg-background">
              <Shield className="h-5 w-5 text-hud" />
              <span className="pulse-dot success absolute -right-1 -top-1" style={{ width: 8, height: 8 }} />
            </div>
            <div>
              <div className="font-serif text-xl font-bold leading-none tracking-wide text-foreground">
                CRIME<span className="text-hud">CONNECT</span>
              </div>
              <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
                Federal Bureau of Investigation · Operations Terminal
              </div>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                Clearance · {role ?? "—"}
              </div>
              <div className="font-mono text-xs text-hud">{user?.email}</div>
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut} className="border-hud/40 hover:border-hud">
              <LogOut className="h-3.5 w-3.5" /> Logout
            </Button>
          </div>
        </div>

        {/* Nav tabs */}
        <nav className="mx-auto flex max-w-[1400px] gap-0 overflow-x-auto px-4">
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = location.pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={`relative flex items-center gap-2 px-4 py-2.5 font-mono text-[11px] uppercase tracking-widest transition-all ${
                  active
                    ? "border-b-2 border-hud bg-hud/10 text-hud"
                    : "border-b-2 border-transparent text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="mx-auto max-w-[1400px] px-6 py-6">{children}</main>

      <footer className="border-t border-border/60 bg-card/40 py-3 text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        Unauthorized disclosure subject to criminal sanctions · 18 U.S.C. § 798 · Session secured via TLS 1.3
      </footer>
    </div>
  );
}
