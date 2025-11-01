import React, { useMemo, lazy, Suspense, useState } from 'react';
const SciFiGlobe = lazy(() => import('@/components/globe/SciFiGlobe'));
export type Marker = { lat: number; lon: number; color?: string; size?: number; id?: string; label?: string };
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const dataset: { id: string; name: string; alias?: string; country?: string; lat: number; lon: number; threat: 'low'|'medium'|'high'|'critical'; lastSeen: string; bounty?: string; img?: string }[] = [
  { id: 'victor', name: 'Victor Kozlov', alias: 'The Ghost', country: 'Russia', lat: 55.7558, lon: 37.6173, threat: 'critical', lastSeen: '2025‑06‑18', bounty: '$5,000,000', img: '/placeholder.svg' },
  { id: 'yuki', name: 'Yuki Tanaka', alias: 'Shadow Fox', country: 'Japan', lat: 35.6762, lon: 139.6503, threat: 'high', lastSeen: '2025‑05‑03', bounty: '$1,200,000', img: '/placeholder.svg' },
  { id: 'ahmed', name: 'Ahmed Al‑Rashid', alias: 'The Broker', country: 'UK', lat: 51.5074, lon: -0.1278, threat: 'medium', lastSeen: '2025‑06‑01', bounty: '$850,000', img: '/placeholder.svg' },
  { id: 'carlos', name: 'Carlos M.', country: 'USA', lat: 34.0522, lon: -118.2437, threat: 'high', lastSeen: '2025‑04‑22', bounty: '$900,000', img: '/placeholder.svg' },
];

const toMarker = (d: typeof dataset[number]): Marker => ({ id: d.id, lat: d.lat, lon: d.lon, color: d.threat==='critical'? '#ef4444' : d.threat==='high'? '#f59e0b' : d.threat==='medium'? '#22d3ee' : '#10b981', size: d.threat==='critical'? 1.4 : d.threat==='high'? 1.2 : 1 });

const GlobePage: React.FC = () => {
  const [selected, setSelected] = useState<typeof dataset[number] | null>(dataset[0]);
  const [markers, setMarkers] = useState<Marker[]>(dataset.map(toMarker));

  // Also enrich with corkboard locations if available
  const enriched = useMemo<Marker[]>(() => {
    try {
      const raw = localStorage.getItem('corkboards');
      if (!raw) return markers;
      const boards = JSON.parse(raw) as any[];
      const active = boards[0];
      const items = active?.items || [];
      const locs: Marker[] = items.filter((i: any) => i.type === 'location' && i?.metadata?.coords).map((i: any, idx: number) => ({ id: `cb-${idx}`, lat: i.metadata.coords.lat, lon: i.metadata.coords.lon, color: '#a78bfa', size: 0.9 }));
      return [...markers, ...locs];
    } catch { return markers; }
  }, [markers]);

  const onSelect = (m: Marker) => {
    const match = dataset.find(d => d.id === m.id);
    if (match) setSelected(match);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      <div className="lg:col-span-2 space-y-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Global 3D Map</h1>
          <p className="text-sm text-muted-foreground">Interactive FBI globe with live threat markers and arcs</p>
        </div>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Threat Network</CardTitle>
              <div className="flex gap-2"><Button size="sm" variant="outline" onClick={()=>setMarkers(dataset.map(toMarker))}>Reset</Button></div>
            </div>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div className="h-[65vh] w-full flex items-center justify-center">Loading 3D...</div>}>
              <SciFiGlobe markers={enriched} onSelect={onSelect} />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card shadow-hologram">
        <CardHeader>
          <CardTitle>Target Details</CardTitle>
        </CardHeader>
        <CardContent>
          {selected ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <img src={selected.img || '/placeholder.svg'} alt={selected.name} className="w-20 h-20 rounded-md object-cover border" />
                <div>
                  <div className="text-lg font-semibold">{selected.name}</div>
                  <div className="text-xs text-muted-foreground">AKA: {selected.alias || '—'}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className={`px-2 py-0.5 rounded-full border ${selected.threat==='critical'?'border-red-500 text-red-500':selected.threat==='high'?'border-amber-400 text-amber-400':selected.threat==='medium'?'border-cyan-400 text-cyan-300':'border-emerald-400 text-emerald-300'}`}>{selected.threat.toUpperCase()}</span>
                <span className="px-2 py-0.5 rounded-full border border-purple-400 text-purple-300">Last seen {selected.lastSeen}</span>
                {selected.bounty && <span className="px-2 py-0.5 rounded-full border border-fuchsia-400 text-fuchsia-300">Bounty {selected.bounty}</span>}
              </div>
              <div className="text-sm text-muted-foreground">Country: {selected.country || 'Unknown'}</div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">Select a marker on the globe…</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GlobePage;
