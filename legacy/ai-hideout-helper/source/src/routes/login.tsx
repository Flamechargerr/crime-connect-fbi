import * as React from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Authenticate — CrimeConnect" },
      { name: "description", content: "Agent authentication portal." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (user) navigate({ to: "/dashboard" });
  }, [user, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error("Authentication failed", { description: error.message });
      return;
    }
    toast.success("Clearance verified");
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen">
      <div className="banner-classified">// RESTRICTED ACCESS //</div>
      <div className="mx-auto max-w-md px-6 py-16">
        <div className="mb-6 text-center">
          <Link to="/" className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            ← Return to HQ
          </Link>
        </div>
        <div className="folder p-8">
          <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Form FD-7 · Authentication
          </div>
          <h1 className="font-serif text-3xl font-bold">Agent Sign-In</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Identify yourself to access classified materials.
          </p>
          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
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
                placeholder="agent@fbi.gov"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Verifying…" : "Authenticate"}
            </Button>
          </form>
          <div className="perforated mt-6 pt-4 text-center text-sm">
            No clearance?{" "}
            <Link to="/signup" className="font-medium text-classified underline">
              Request access
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
