import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { getCrimeHotspots, getCrimeTypes } from '@/lib/api';
import { MapPin, Radar, Shield, Activity } from 'lucide-react';

// Leaflet is loaded dynamically to avoid SSR issues
let L: any = null;

export default function MapPage() {
  const [crimeType, setCrimeType] = useState('');
  const [mapReady, setMapReady] = useState(false);

  const { data: hotspots, isLoading } = useQuery({
    queryKey: ['hotspots', crimeType],
    queryFn: () => getCrimeHotspots(500, crimeType || undefined),
  });
  const { data: crimeTypes } = useQuery({ queryKey: ['crime-types'], queryFn: getCrimeTypes });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    import('leaflet').then((leaflet) => {
      L = leaflet;
      setMapReady(true);
    });
  }, []);

  useEffect(() => {
    if (!mapReady || !L || !hotspots) return;

    const container = document.getElementById('crime-map');
    if (!container) return;
    container.innerHTML = '';

    const map = L.map('crime-map').setView([41.8781, -87.6298], 11);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; CARTO',
    }).addTo(map);

    const crimeColors: Record<string, string> = {
      THEFT: '#0ea5e9', BATTERY: '#f59e0b', 'CRIMINAL DAMAGE': '#dc2626',
      NARCOTICS: '#16a34a', ASSAULT: '#f59e0b', BURGLARY: '#dc2626',
      'MOTOR VEHICLE THEFT': '#dc2626', ROBBERY: '#dc2626', 'DECEPTIVE PRACTICE': '#0ea5e9',
    };

    hotspots.forEach((h: any) => {
      const color = crimeColors[h.type] || '#0ea5e9';
      L.circleMarker([h.latitude, h.longitude], {
        radius: 4,
        fillColor: color,
        color: color,
        weight: 1,
        opacity: 0.8,
        fillOpacity: 0.6,
      }).addTo(map).bindPopup(`<strong>${h.type}</strong><br/>${h.date?.slice(0, 10) || ''}`);
    });

    return () => { map.remove(); };
  }, [mapReady, hotspots]);

  const hotspotCount = hotspots?.length || 0;
  const threatLevel = hotspotCount > 400 ? 'HIGH' : hotspotCount > 200 ? 'ELEVATED' : 'MODERATE';
  const threatColor = hotspotCount > 400 ? 'text-destructive' : hotspotCount > 200 ? 'text-warning' : 'text-success';
  const threatDotColor = hotspotCount > 400 ? 'bg-destructive' : hotspotCount > 200 ? 'bg-warning' : 'bg-success';

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* ── TITLE & TELEMETRY HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <div className="flex items-center gap-3">
            <Radar className="h-5 w-5 text-primary animate-pulse" />
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Geospatial Threat Map
            </h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1 ml-8">
            Interactive metropolitan hotspot visualizer and security parameter telemetry logs.
          </p>

          {/* Threat status indicator */}
          <motion.div
            className="flex items-center gap-3 mt-2 ml-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-primary/15 bg-card/50 backdrop-blur-sm">
              <Shield className="h-3 w-3 text-primary/70" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Threat Level:</span>
              <span className={`h-2 w-2 rounded-full ${threatDotColor} animate-pulse`} />
              <span className={`text-[10px] font-mono font-bold uppercase tracking-widest ${threatColor}`}>
                {threatLevel}
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-primary/15 bg-card/50 backdrop-blur-sm">
              <Activity className="h-3 w-3 text-primary/70" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Incidents:</span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-white">
                {hotspotCount}
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* HUD-styled Select */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col items-end gap-1"
        >
          <span className="text-[10px] font-mono uppercase tracking-widest text-primary/60 mr-1">
            ◆ Filter_By_Type
          </span>
          <Select
            placeholder="All crime types"
            value={crimeType}
            onValueChange={setCrimeType}
            options={[{ value: '', label: 'All crime types' }, ...(crimeTypes || []).map((t: string) => ({ value: t, label: t }))]}
            className="w-56 font-mono text-sm bg-background/50 border-primary/20"
          />
        </motion.div>
      </div>

      {/* ── MAP CARD WITH NEON BORDER ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        whileHover={{ y: -2 }}
      >
        <Card className="card-intel neon-border-glow overflow-hidden relative">
          {/* Scan-line overlay */}
          <div className="absolute left-0 right-0 h-[1px] bg-primary/10 animate-scan top-0 pointer-events-none z-20" />

          {/* Map header bar */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-primary/10 relative z-10">
            <span className="text-xs font-mono uppercase tracking-wider text-white flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              Geo_Visualization
            </span>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-success/70">
                {isLoading ? 'SCANNING...' : 'LIVE'}
              </span>
            </div>
          </div>

          <CardContent className="p-0 relative">
            {/* Dark vignette over the map */}
            <div id="crime-map" className="w-full h-[600px] bg-dark-vignette" />

            {/* Loading overlay with scanning animation */}
            {isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-30">
                <motion.div
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="flex flex-col items-center gap-3"
                >
                  <Radar className="h-10 w-10 text-primary animate-spin" />
                  <span className="text-sm font-mono uppercase tracking-widest text-primary text-glow">
                    Scanning Threat Zones...
                  </span>
                  <div className="flex items-center gap-1 mt-1">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <motion.span
                        key={i}
                        className="h-1 w-6 bg-primary/60 rounded-full"
                        animate={{ opacity: [0.2, 1, 0.2] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </motion.div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
