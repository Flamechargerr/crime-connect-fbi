import * as React from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  label: string;
  sublabel?: string;
  severity?: "low" | "medium" | "high" | "extreme" | "info" | "ok";
}

const SEVERITY_COLOR: Record<string, string> = {
  extreme: "#ff3b30",
  high: "#ff9500",
  medium: "#ffd60a",
  low: "#34c759",
  info: "#5ac8fa",
  ok: "#34c759",
};

interface Props {
  markers: MapMarker[];
  height?: number | string;
  center?: [number, number];
  zoom?: number;
  className?: string;
}

export function TacticalMap({
  markers,
  height = 380,
  center = [39.5, -98.35],
  zoom = 4,
  className = "",
}: Props) {
  // Stable key prevents "Map container is already initialized" on StrictMode/HMR remounts.
  const mapKey = React.useMemo(
    () => markers.map((m) => m.id).join("|") || "empty",
    [markers],
  );
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ height }}>
      <MapContainer
        key={mapKey}
        center={center}
        zoom={zoom}
        scrollWheelZoom
        style={{ height: "100%", width: "100%" }}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OSM'
        />
        {markers.map((m) => {
          const color = SEVERITY_COLOR[m.severity ?? "info"];
          return (
            <CircleMarker
              key={m.id}
              center={[m.lat, m.lng]}
              radius={9}
              pathOptions={{
                color,
                fillColor: color,
                fillOpacity: 0.7,
                weight: 2,
              }}
            >
              <Tooltip direction="top" offset={[0, -8]} opacity={1}>
                <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11 }}>
                  {m.label}
                </span>
              </Tooltip>
              <Popup>
                <div style={{ fontFamily: "JetBrains Mono, monospace" }}>
                  <div style={{ fontWeight: 700, fontSize: 12 }}>{m.label}</div>
                  {m.sublabel && (
                    <div style={{ fontSize: 10, opacity: 0.7, marginTop: 2 }}>
                      {m.sublabel}
                    </div>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
      {/* Crosshair overlay */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-20">
        <div className="h-px w-16 bg-hud" />
        <div className="absolute h-16 w-px bg-hud" />
      </div>
    </div>
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

/**
 * Spread N points around a region centroid with deterministic jitter
 * so each entity gets a stable position.
 */
export function jitterFromRegion(region: string | null | undefined, seed: string): [number, number] {
  const center = REGION_COORDS[region ?? "Unknown"] ?? REGION_COORDS.Unknown;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const dx = (((h & 0xffff) / 0xffff) - 0.5) * 5;
  const dy = ((((h >>> 16) & 0xffff) / 0xffff) - 0.5) * 5;
  return [center[0] + dy, center[1] + dx];
}
