import * as React from "react";

export type ThreatLevel = "low" | "medium" | "high" | "extreme";

const CFG: Record<ThreatLevel, { label: string; color: string; pct: number; ring: string }> = {
  low:     { label: "DEFCON 5", color: "text-success", pct: 25, ring: "border-success/60" },
  medium:  { label: "DEFCON 4", color: "text-warn",    pct: 50, ring: "border-warn/60" },
  high:    { label: "DEFCON 3", color: "text-warn",    pct: 75, ring: "border-warn/80" },
  extreme: { label: "DEFCON 2", color: "text-alert",   pct: 100, ring: "border-alert" },
};

export function ThreatBadge({ level }: { level: string }) {
  const lvl = (level as ThreatLevel) in CFG ? (level as ThreatLevel) : "medium";
  const cfg = CFG[lvl];
  return (
    <span className={`inline-flex items-center gap-1.5 border ${cfg.ring} bg-background/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest ${cfg.color}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${lvl === "extreme" ? "bg-alert animate-pulse" : lvl === "high" ? "bg-warn" : lvl === "medium" ? "bg-warn/70" : "bg-success"}`} />
      {lvl}
    </span>
  );
}

export function ThreatMeter({ level, label }: { level: ThreatLevel; label?: string }) {
  const cfg = CFG[level];
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest">
        <span className="text-muted-foreground">{label ?? "Threat Index"}</span>
        <span className={cfg.color}>{cfg.label}</span>
      </div>
      <div className="threat-bar"><span style={{ width: `${cfg.pct}%` }} /></div>
    </div>
  );
}

export function highestThreat(levels: string[]): ThreatLevel {
  if (levels.includes("extreme")) return "extreme";
  if (levels.includes("high")) return "high";
  if (levels.includes("medium")) return "medium";
  return "low";
}
