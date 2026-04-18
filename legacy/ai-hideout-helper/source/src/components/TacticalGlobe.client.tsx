import * as React from "react";
import Globe, { type GlobeMethods } from "react-globe.gl";
import type { MapMarker } from "./TacticalMap";

interface Props {
  markers: MapMarker[];
  height?: number | string;
  className?: string;
}

const SEVERITY_COLOR: Record<string, string> = {
  extreme: "#ff3b30",
  high: "#ff9500",
  medium: "#ffd60a",
  low: "#34c759",
  info: "#5ac8fa",
  ok: "#34c759",
};

export function TacticalGlobe({ markers, height = 420, className = "" }: Props) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const globeRef = React.useRef<GlobeMethods | undefined>(undefined);
  const [size, setSize] = React.useState({ w: 0, h: 0 });

  // Track container size for responsive globe sizing
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const rect = el.getBoundingClientRect();
      setSize({ w: Math.max(300, rect.width), h: rect.height || 420 });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Auto-rotate + initial POV
  React.useEffect(() => {
    const g = globeRef.current;
    if (!g) return;
    g.controls().autoRotate = true;
    g.controls().autoRotateSpeed = 0.4;
    g.pointOfView({ lat: 25, lng: -40, altitude: 2.2 }, 0);
  }, [size.w, size.h]);

  const points = React.useMemo(
    () =>
      markers.map((m) => ({
        ...m,
        color: SEVERITY_COLOR[m.severity ?? "info"],
        size: m.severity === "extreme" ? 0.55 : m.severity === "high" ? 0.45 : 0.35,
      })),
    [markers],
  );

  // Build arcs from each safehouse (ok / high status) to nearest 2 subject pings,
  // creating "tracking" lines across the globe.
  const arcs = React.useMemo(() => {
    const subjects = markers.filter((m) =>
      ["extreme", "high", "medium", "low"].includes(m.severity ?? ""),
    );
    const safehouses = markers.filter((m) => m.severity === "ok" || m.id.startsWith("hide-"));
    const out: Array<{
      startLat: number;
      startLng: number;
      endLat: number;
      endLng: number;
      color: [string, string];
    }> = [];
    for (const s of safehouses) {
      const ranked = subjects
        .map((t) => ({
          t,
          d: Math.hypot(t.lat - s.lat, t.lng - s.lng),
        }))
        .sort((a, b) => a.d - b.d)
        .slice(0, 2);
      for (const { t } of ranked) {
        out.push({
          startLat: s.lat,
          startLng: s.lng,
          endLat: t.lat,
          endLng: t.lng,
          color: ["#34c759", SEVERITY_COLOR[t.severity ?? "info"]],
        });
      }
    }
    return out;
  }, [markers]);

  const rings = React.useMemo(
    () =>
      points
        .filter((p) => p.severity === "extreme" || p.severity === "high")
        .map((p) => ({
          lat: p.lat,
          lng: p.lng,
          maxR: p.severity === "extreme" ? 6 : 4,
          propagationSpeed: 2,
          repeatPeriod: 1400,
          color: p.color,
        })),
    [points],
  );

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden bg-[#040810] ${className}`}
      style={{ height }}
    >
      {size.w > 0 && (
        <Globe
          ref={globeRef}
          width={size.w}
          height={size.h}
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          atmosphereColor="#ffb000"
          atmosphereAltitude={0.18}
          showGraticules
          /* Points */
          pointsData={points}
          pointLat="lat"
          pointLng="lng"
          pointColor="color"
          pointAltitude={0.02}
          pointRadius="size"
          pointLabel={(d: any) =>
            `<div style="font-family:JetBrains Mono,monospace;background:#0a0f1a;border:1px solid ${d.color};padding:6px 8px;color:#f5e6c8;font-size:11px;">
              <div style="font-weight:700;color:${d.color}">${d.label}</div>
              ${d.sublabel ? `<div style="opacity:.7;font-size:10px;margin-top:2px">${d.sublabel}</div>` : ""}
            </div>`
          }
          /* Arcs (pulsing) */
          arcsData={arcs}
          arcColor={"color" as any}
          arcAltitude={0.18}
          arcStroke={0.45}
          arcDashLength={0.4}
          arcDashGap={2}
          arcDashAnimateTime={2200}
          /* Rings (threat pulses) */
          ringsData={rings}
          ringColor={(d: any) => () => d.color}
          ringMaxRadius="maxR"
          ringPropagationSpeed="propagationSpeed"
          ringRepeatPeriod="repeatPeriod"
        />
      )}
      {/* HUD overlay */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-3 top-3 font-mono text-[10px] uppercase tracking-widest text-hud/80">
          ◉ ORBITAL RECON · LIVE
        </div>
        <div className="absolute bottom-3 right-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {points.length} contacts · {arcs.length} vectors
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <div className="h-px w-16 bg-hud" />
          <div className="absolute h-16 w-px bg-hud" />
        </div>
      </div>
    </div>
  );
}
