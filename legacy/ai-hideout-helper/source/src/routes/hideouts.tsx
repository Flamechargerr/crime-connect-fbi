import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AuthGuard } from "@/components/AuthGuard";
import { PortalLayout } from "@/components/PortalLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Brain, Loader2, Shield, Users, Home as HomeIcon } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { recommendHideout } from "@/lib/ai.functions";
import { toast } from "sonner";
import { jitterFromRegion, type MapMarker } from "@/components/TacticalMap";
import { TacticalGlobe } from "@/components/TacticalGlobe";

export const Route = createFileRoute("/hideouts")({
  head: () => ({
    meta: [
      { title: "Safehouse Network — CrimeConnect" },
      { name: "description", content: "FBI safehouse registry with AI recommendation engine." },
    ],
  }),
  component: () => (
    <AuthGuard>
      <PortalLayout>
        <HideoutsPage />
      </PortalLayout>
    </AuthGuard>
  ),
});

const TIER_COLOR: Record<string, string> = {
  tier_1: "border-border text-muted-foreground",
  tier_2: "border-border text-foreground",
  tier_3: "border-warn text-warn",
  tier_4: "border-alert text-alert bg-alert/10",
};

const STATUS_COLOR: Record<string, string> = {
  available: "text-success",
  occupied: "text-warn",
  compromised: "text-alert",
  maintenance: "text-muted-foreground",
};

function HideoutsPage() {
  const { data: hideouts } = useQuery({
    queryKey: ["hideouts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hideouts")
        .select("*, occupants:hideout_occupants(*)")
        .order("security_tier", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const markers = React.useMemo<MapMarker[]>(
    () =>
      (hideouts ?? []).map((h) => {
        const [lat, lng] = jitterFromRegion(h.region, h.id);
        return {
          id: h.id,
          lat, lng,
          label: h.code_name,
          sublabel: `${h.city} · ${h.security_tier.toUpperCase()} · ${h.status}`,
          severity: h.status === "compromised" ? "high" : h.status === "available" ? "ok" : "info",
        };
      }),
    [hideouts],
  );

  return (
    <div className="space-y-6">
      <header>
        <div className="hud-label">Logistics</div>
        <h1 className="font-serif text-4xl font-bold tracking-tight">SAFEHOUSE NETWORK</h1>
      </header>

      <RecommendationCard />

      {/* Map */}
      <div className="panel panel-bracket overflow-hidden">
        <div className="flex items-center justify-between border-b border-border/60 px-4 py-2">
          <div className="flex items-center gap-2">
            <HomeIcon className="h-3.5 w-3.5 text-hud" />
            <span className="hud-label">Network Geolocation</span>
          </div>
        </div>
        <TacticalGlobe markers={markers} height={340} />
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {hideouts?.map((h) => (
          <article key={h.id} className="panel panel-bracket p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {h.region}
                </div>
                <h3 className="font-serif text-2xl font-bold tracking-wide text-hud">{h.code_name}</h3>
                <div className="font-mono text-xs text-muted-foreground">{h.city}</div>
              </div>
              <span className={`border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${TIER_COLOR[h.security_tier]}`}>
                {h.security_tier.replace("_", " ")}
              </span>
            </div>

            <div className="mt-3 flex items-center gap-4 font-mono text-xs">
              <span className="flex items-center gap-1 uppercase">
                <Users className="h-3.5 w-3.5" /> cap {h.capacity}
              </span>
              <span className={`flex items-center gap-1 uppercase ${STATUS_COLOR[h.status]}`}>
                <Shield className="h-3.5 w-3.5" /> {h.status}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-1">
              {h.features.map((f) => (
                <span key={f} className="border border-border/60 bg-background/40 px-1.5 py-0.5 font-mono text-[10px]">
                  {f}
                </span>
              ))}
            </div>

            {h.occupants && h.occupants.length > 0 && (
              <div className="perforated mt-3 pt-2">
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Current occupants
                </div>
                <ul className="mt-1 space-y-0.5 text-xs">
                  {h.occupants.map((o) => (
                    <li key={o.id}>
                      {o.occupant_name} <span className="text-muted-foreground">— {o.occupant_type}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {h.notes && <p className="mt-3 text-xs italic text-muted-foreground">{h.notes}</p>}
          </article>
        ))}
      </div>
    </div>
  );
}

function RecommendationCard() {
  const recommend = useServerFn(recommendHideout);
  const [subject, setSubject] = React.useState("");
  const [threat, setThreat] = React.useState("high");
  const [region, setRegion] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [result, setResult] = React.useState("");

  const onRun = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) return;
    setBusy(true);
    setResult("");
    try {
      const res = await recommend({
        data: { subject, threatLevel: threat, region: region || undefined, notes: notes || undefined },
      });
      setResult(res.content);
    } catch (err) {
      toast.error("Recommendation failed", { description: (err as Error).message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="panel panel-bracket p-5">
      <div className="mb-4 flex items-center gap-2">
        <Brain className="h-5 w-5 text-hud" />
        <h2 className="font-serif text-2xl font-bold tracking-wide">AI Safehouse Recommendation</h2>
      </div>
      <form className="grid gap-3 md:grid-cols-4" onSubmit={onRun}>
        <div className="space-y-1.5 md:col-span-2">
          <Label className="hud-label">Subject / Witness</Label>
          <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Cooperating witness — financial crimes" />
        </div>
        <div className="space-y-1.5">
          <Label className="hud-label">Threat Level</Label>
          <Select value={threat} onValueChange={setThreat}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="extreme">Extreme</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="hud-label">Preferred Region</Label>
          <Input value={region} onChange={(e) => setRegion(e.target.value)} placeholder="any" />
        </div>
        <div className="space-y-1.5 md:col-span-4">
          <Label className="hud-label">Notes</Label>
          <Textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Family of 3, requires no neighbors…" />
        </div>
        <div className="md:col-span-4">
          <Button type="submit" disabled={busy} className="bg-hud text-background hover:bg-hud/90">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Brain className="h-4 w-4" />}
            {busy ? "Cross-referencing registry…" : "Recommend Safehouse"}
          </Button>
        </div>
      </form>
      {result && (
        <div className="mt-4 border border-hud/30 bg-hud/5 p-4">
          <div className="mb-2 hud-label text-hud">// AI Recommendation Memo</div>
          <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed">{result}</pre>
        </div>
      )}
    </div>
  );
}
