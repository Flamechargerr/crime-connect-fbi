import { createFileRoute } from "@tanstack/react-router";
import { AuthGuard } from "@/components/AuthGuard";
import { PortalLayout } from "@/components/PortalLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Star, Shield } from "lucide-react";

export const Route = createFileRoute("/agents")({
  head: () => ({
    meta: [
      { title: "Personnel Registry — CrimeConnect" },
      { name: "description", content: "Top FBI agent portfolios and clearance levels." },
    ],
  }),
  component: () => (
    <AuthGuard>
      <PortalLayout>
        <AgentsPage />
      </PortalLayout>
    </AuthGuard>
  ),
});

function AgentsPage() {
  const { data: agents } = useQuery({
    queryKey: ["agents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agents")
        .select("*")
        .order("clearance_level", { ascending: false })
        .order("success_rate", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <header>
        <div className="hud-label">Personnel</div>
        <h1 className="font-serif text-4xl font-bold tracking-tight">AGENT REGISTRY</h1>
        <p className="mt-1 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Top operatives ranked by clearance and field performance
        </p>
      </header>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {agents?.map((a) => (
          <article key={a.id} className="panel panel-bracket p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  <Shield className="h-3 w-3" /> Badge {a.badge_number}
                </div>
                <h3 className="font-serif text-2xl font-bold tracking-wide text-hud">{a.code_name}</h3>
                <div className="font-mono text-xs text-muted-foreground">{a.full_name}</div>
              </div>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < a.clearance_level ? "fill-hud text-hud" : "text-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
            </div>

            <p className="mt-3 line-clamp-2 text-xs text-foreground/80">{a.bio}</p>

            <div className="mt-3 flex flex-wrap gap-1">
              {a.specialties.map((s) => (
                <span key={s} className="border border-border/60 bg-background/40 px-1.5 py-0.5 font-mono text-[10px] uppercase">
                  {s}
                </span>
              ))}
            </div>

            <div className="perforated mt-3 pt-2">
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest">
                <span className="text-muted-foreground">{a.region}</span>
                <span className={a.status === "on_duty" ? "text-success" : "text-muted-foreground"}>
                  ● {a.status.replace("_", " ")}
                </span>
              </div>
              <div className="mt-2">
                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest">
                  <span className="text-muted-foreground">Success Rate</span>
                  <span className="text-hud">{a.success_rate}%</span>
                </div>
                <div className="threat-bar mt-1"><span style={{ width: `${a.success_rate}%`, background: "var(--hud)" }} /></div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
