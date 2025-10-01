import React, { useMemo } from 'react';
import SciFiGlobe, { Marker } from '@/components/globe/SciFiGlobe';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const sampleMarkers: Marker[] = [
  { lat: 55.7558, lon: 37.6173, color: '#f43f5e' }, // Moscow
  { lat: 34.0522, lon: -118.2437, color: '#f59e0b' }, // LA
  { lat: 35.6762, lon: 139.6503, color: '#22d3ee' }, // Tokyo
  { lat: 51.5074, lon: -0.1278, color: '#10b981' }, // London
];

const GlobePage: React.FC = () => {
  const markers = useMemo<Marker[]>(() => {
    try {
      const raw = localStorage.getItem('corkboards');
      if (!raw) return sampleMarkers;
      const boards = JSON.parse(raw) as any[];
      const active = boards[0];
      const items = active?.items || [];
      const locs: Marker[] = items
        .filter((i: any) => i.type === 'location' && i?.metadata?.coords)
        .map((i: any) => ({ lat: i.metadata.coords.lat, lon: i.metadata.coords.lon, color: '#a78bfa' }));
      return locs.length ? locs : sampleMarkers;
    } catch {
      return sampleMarkers;
    }
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Global 3D Map</h1>
        <p className="text-sm text-muted-foreground">Sci‑fi globe with tracked locations</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Threat Markers</CardTitle>
        </CardHeader>
        <CardContent>
          <SciFiGlobe markers={markers} />
        </CardContent>
      </Card>
    </div>
  );
};

export default GlobePage;
