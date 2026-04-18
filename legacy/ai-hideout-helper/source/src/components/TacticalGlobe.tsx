import * as React from "react";
import { ClientOnly } from "@tanstack/react-router";
import type { MapMarker } from "./TacticalMap";

interface Props {
  markers: MapMarker[];
  height?: number | string;
  className?: string;
}

function GlobeFallback({ height, className }: { height?: number | string; className?: string }) {
  return (
    <div
      className={`relative overflow-hidden border border-border/40 bg-[#040810] ${className ?? ""}`}
      style={{ height: height ?? 420 }}
    >
      <div className="absolute inset-0 flex items-center justify-center font-mono text-[10px] uppercase tracking-widest text-hud/70">
        ◉ Initializing orbital recon…
      </div>
    </div>
  );
}

function ClientGlobe(props: Props) {
  const [Comp, setComp] = React.useState<React.ComponentType<Props> | null>(null);
  React.useEffect(() => {
    let cancelled = false;
    import("./TacticalGlobe.client").then((m) => {
      if (!cancelled) setComp(() => m.TacticalGlobe);
    });
    return () => {
      cancelled = true;
    };
  }, []);
  if (!Comp) return <GlobeFallback height={props.height} className={props.className} />;
  return <Comp {...props} />;
}

export function TacticalGlobe(props: Props) {
  return (
    <ClientOnly fallback={<GlobeFallback height={props.height} className={props.className} />}>
      <ClientGlobe {...props} />
    </ClientOnly>
  );
}
