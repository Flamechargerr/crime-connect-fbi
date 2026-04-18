import * as React from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Request Clearance — CrimeConnect" },
      { name: "description", content: "Request analyst clearance to CrimeConnect." },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [displayName, setDisplayName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (user) navigate({ to: "/dashboard" });
  }, [user, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: { display_name: displayName },
      },
    });
    setLoading(false);
    if (error) {
      toast.error("Signup failed", { description: error.message });
      return;
    }
    toast.success("Clearance granted", { description: "Welcome, Analyst." });
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen">
      <div className="banner-classified">// CLEARANCE REQUEST //</div>
      <div className="mx-auto max-w-md px-6 py-16">
        <div className="mb-6 text-center">
          <Link to="/" className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            ← Return to HQ
          </Link>
        </div>
        <div className="folder p-8">
          <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Form FD-3 · Clearance Application
          </div>
          <h1 className="font-serif text-3xl font-bold">Request Clearance</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            New personnel default to <span className="font-mono uppercase">analyst</span>.
          </p>
          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <div className="space-y-1.5">
              <Label htmlFor="name" className="font-mono text-xs uppercase tracking-wider">
                Full Name
              </Label>
              <Input
                id="name"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="J. Edgar Hoover"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="font-mono text-xs uppercase tracking-wider">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="font-mono text-xs uppercase tracking-wider">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Processing…" : "Submit Request"}
            </Button>
          </form>
          <div className="perforated mt-6 pt-4 text-center text-sm">
            Already cleared?{" "}
            <Link to="/login" className="font-medium text-classified underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
