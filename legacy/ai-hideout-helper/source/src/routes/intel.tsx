import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AuthGuard } from "@/components/AuthGuard";
import { PortalLayout } from "@/components/PortalLayout";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Brain, Loader2, Send, Trash2 } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { intelChat, clearIntelHistory } from "@/lib/ai.functions";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/intel")({
  head: () => ({
    meta: [
      { title: "Intel AI — CrimeConnect" },
      { name: "description", content: "AI briefing assistant for case Q&A and tactical guidance." },
    ],
  }),
  component: () => (
    <AuthGuard>
      <PortalLayout>
        <IntelPage />
      </PortalLayout>
    </AuthGuard>
  ),
});

function IntelPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const send = useServerFn(intelChat);
  const clear = useServerFn(clearIntelHistory);
  const [input, setInput] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const endRef = React.useRef<HTMLDivElement>(null);

  const { data: messages } = useQuery({
    queryKey: ["intel", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("intel_messages")
        .select("*")
        .order("created_at");
      return data ?? [];
    },
  });

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || busy) return;
    const message = input.trim();
    setInput("");
    setBusy(true);
    try {
      await send({ data: { message } });
      qc.invalidateQueries({ queryKey: ["intel"] });
    } catch (err) {
      toast.error("Intel AI error", { description: (err as Error).message });
    } finally {
      setBusy(false);
    }
  };

  const onClear = async () => {
    await clear();
    qc.invalidateQueries({ queryKey: ["intel"] });
    toast.success("Intel history purged");
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="hud-label">Tactical Briefing Channel</div>
          <h1 className="font-serif text-4xl font-bold tracking-tight">INTEL AI</h1>
          <p className="mt-1 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Scoped to your accessible cases and at-large fugitives
          </p>
        </div>
        {messages && messages.length > 0 && (
          <Button variant="outline" size="sm" onClick={onClear} className="border-border">
            <Trash2 className="h-4 w-4" /> Purge channel
          </Button>
        )}
      </header>

      <div className="panel panel-bracket flex h-[65vh] flex-col">
        <div className="flex items-center justify-between border-b border-border/60 px-4 py-2">
          <div className="flex items-center gap-2">
            <span className="pulse-dot success" style={{ width: 6, height: 6 }} />
            <span className="hud-label">SECURE CHANNEL · ENCRYPTED</span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {messages?.length ?? 0} msg
          </span>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {(!messages || messages.length === 0) && (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <Brain className="mb-3 h-10 w-10 text-hud" />
              <div className="font-serif text-xl tracking-wide">Awaiting your query, agent.</div>
              <div className="mt-2 max-w-md font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Try: &quot;Brief me on OP-CRIMSON-VEIL&quot; · &quot;Which fugitives are in the Northeast?&quot; · &quot;Suggest priorities for this week&quot;
              </div>
            </div>
          )}
          <div className="space-y-3">
            {messages?.map((m) => (
              <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] border p-3 text-sm ${
                    m.role === "user"
                      ? "border-hud/40 bg-hud/10"
                      : "border-border bg-card/60"
                  }`}
                >
                  <div className={`mb-1 font-mono text-[9px] uppercase tracking-widest ${m.role === "user" ? "text-hud" : "text-muted-foreground"}`}>
                    {m.role === "user" ? "// AGENT" : "// INTEL_AI"}
                  </div>
                  <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed">{m.content}</pre>
                </div>
              </div>
            ))}
            {busy && (
              <div className="flex items-center gap-2 font-mono text-xs uppercase text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Compiling briefing…
              </div>
            )}
            <div ref={endRef} />
          </div>
        </div>
        <form onSubmit={onSend} className="flex gap-2 border-t border-border/60 p-3">
          <Textarea
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSend(e as unknown as React.FormEvent);
              }
            }}
            placeholder="Type your intel query… (Enter to send)"
            className="resize-none font-mono text-sm"
          />
          <Button type="submit" disabled={busy || !input.trim()} className="self-stretch bg-hud text-background hover:bg-hud/90">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </div>
    </div>
  );
}
