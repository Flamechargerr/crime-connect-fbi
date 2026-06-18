import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { getCrimeHotspots, getCrimeTypes } from '@/lib/api';

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
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Crime Map</h1>
          <p className="text-muted-foreground text-sm mt-1">Interactive hotspot visualization of Chicago incidents.</p>
        </div>
        <Select
          placeholder="All crime types"
          value={crimeType}
          onValueChange={setCrimeType}
          options={[{ value: '', label: 'All crime types' }, ...(crimeTypes || []).map((t: string) => ({ value: t, label: t }))]}
          className="w-56"
        />
      </div>

      <Card className="card-intel overflow-hidden">
        <CardContent className="p-0">
          <div id="crime-map" className="w-full h-[600px] bg-muted" />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <Skeleton className="h-8 w-32" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
