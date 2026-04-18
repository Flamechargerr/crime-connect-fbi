import * as React from "react";
import { ClientOnly } from "@tanstack/react-router";

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  label: string;
  sublabel?: string;
  severity?: "low" | "medium" | "high" | "extreme" | "info" | "ok";
}

interface Props {
  markers: MapMarker[];
  height?: number | string;
  center?: [number, number];
  zoom?: number;
  className?: string;
}

function MapFallback({ height, className }: { height?: number | string; className?: string }) {
  return (
    <div
      className={`relative overflow-hidden border border-border/40 bg-background/40 ${className ?? ""}`}
      style={{ height: height ?? 380 }}
    >
      <div className="absolute inset-0 flex items-center justify-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        Initializing tactical map…
      </div>
    </div>
  );
}

// Inner client-only loader. Dynamic import keeps Leaflet out of the server bundle.
function ClientMap(props: Props) {
  const [Comp, setComp] = React.useState<React.ComponentType<Props> | null>(null);
  React.useEffect(() => {
    let cancelled = false;
    import("./TacticalMap.client").then((m) => {
      if (!cancelled) setComp(() => m.TacticalMap);
    });
    return () => {
      cancelled = true;
    };
  }, []);
  if (!Comp) return <MapFallback height={props.height} className={props.className} />;
  return <Comp {...props} />;
}

export function TacticalMap(props: Props) {
  return (
    <ClientOnly fallback={<MapFallback height={props.height} className={props.className} />}>
      <ClientMap {...props} />
    </ClientOnly>
  );
}

/* Region centroid lookup for synthetic positioning */
export const REGION_COORDS: Record<string, [number, number]> = {
  Northeast: [42.4, -73.5],
  Midwest: [41.7, -89.3],
  South: [33.7, -84.3],
  Southwest: [33.4, -111.9],
  "West Coast": [37.7, -122.4],
  International: [51.5, -0.1],
  Unknown: [25.0, -40.0],
};

export function jitterFromRegion(region: string | null | undefined, seed: string): [number, number] {
  const center = REGION_COORDS[region ?? "Unknown"] ?? REGION_COORDS.Unknown;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const dx = (((h & 0xffff) / 0xffff) - 0.5) * 5;
  const dy = ((((h >>> 16) & 0xffff) / 0xffff) - 0.5) * 5;
  return [center[0] + dy, center[1] + dx];
}
