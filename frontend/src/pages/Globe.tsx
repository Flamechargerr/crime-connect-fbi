import React, { useMemo, lazy, Suspense, useState } from 'react';
import {
  Globe as GlobeIcon,
  MapPin,
  AlertTriangle,
  Radio,
  Wifi,
  Target,
  Shield,
  Eye,
  RefreshCw,
  Maximize2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const SciFiGlobe = lazy(() => import('@/components/globe/SciFiGlobe'));

export type Marker = { lat: number; lon: number; color?: string; size?: number; id?: string; label?: string };

const dataset: { id: string; name: string; alias?: string; country?: string; lat: number; lon: number; threat: 'low' | 'medium' | 'high' | 'critical'; lastSeen: string; bounty?: string; img?: string }[] = [
  { id: 'victor', name: 'Victor Kozlov', alias: 'The Ghost', country: 'Russia', lat: 55.7558, lon: 37.6173, threat: 'critical', lastSeen: '2025‑06‑18', bounty: '$5,000,000', img: '/placeholder.svg' },
  { id: 'yuki', name: 'Yuki Tanaka', alias: 'Shadow Fox', country: 'Japan', lat: 35.6762, lon: 139.6503, threat: 'high', lastSeen: '2025‑05‑03', bounty: '$1,200,000', img: '/placeholder.svg' },
  { id: 'ahmed', name: 'Ahmed Al‑Rashid', alias: 'The Broker', country: 'UK', lat: 51.5074, lon: -0.1278, threat: 'medium', lastSeen: '2025‑06‑01', bounty: '$850,000', img: '/placeholder.svg' },
  { id: 'carlos', name: 'Carlos Martinez', country: 'USA', lat: 34.0522, lon: -118.2437, threat: 'high', lastSeen: '2025‑04‑22', bounty: '$900,000', img: '/placeholder.svg' },
  { id: 'elena', name: 'Elena Vostok', alias: 'Black Widow', country: 'Ukraine', lat: 50.4501, lon: 30.5234, threat: 'critical', lastSeen: '2025‑06‑15', bounty: '$3,500,000', img: '/placeholder.svg' },
  { id: 'marco', name: 'Marco Silva', country: 'Brazil', lat: -23.5505, lon: -46.6333, threat: 'high', lastSeen: '2025‑05‑28', bounty: '$1,800,000', img: '/placeholder.svg' },
];

const toMarker = (d: typeof dataset[number]): Marker => ({
  id: d.id,
  lat: d.lat,
  lon: d.lon,
  color: d.threat === 'critical' ? '#ef4444' : d.threat === 'high' ? '#f59e0b' : d.threat === 'medium' ? '#22d3ee' : '#10b981',
  size: d.threat === 'critical' ? 1.4 : d.threat === 'high' ? 1.2 : 1,
  label: d.name,
});

const getThreatColor = (threat: string) => {
  switch (threat) {
    case 'critical': return 'text-red-500 bg-red-500/10 border-red-500/30';
    case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500/30';
    case 'medium': return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
    default: return 'text-green-500 bg-green-500/10 border-green-500/30';
  }
};

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
      const locs: Marker[] = items
        .filter((i: any) => i.type === 'location' && i?.metadata?.coords)
        .map((i: any, idx: number) => ({
          id: `cb-${idx}`,
          lat: i.metadata.coords.lat,
          lon: i.metadata.coords.lon,
          color: '#a78bfa',
          size: 0.9,
        }));
      return [...markers, ...locs];
    } catch {
      return markers;
    }
  }, [markers]);

  const onSelect = (m: Marker) => {
    const match = dataset.find(d => d.id === m.id);
    if (match) setSelected(match);
  };

  const stats = {
    critical: dataset.filter(t => t.threat === 'critical').length,
    high: dataset.filter(t => t.threat === 'high').length,
    medium: dataset.filter(t => t.threat === 'medium').length,
    low: dataset.filter(t => t.threat === 'low').length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="fbi-header">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center relative">
              <GlobeIcon className="h-5 w-5 text-primary" />
              <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-foreground">Global 3D Threat Map</h1>
                <span className="classified-badge">LIVE</span>
              </div>
              <p className="text-sm text-muted-foreground">Interactive FBI globe with real-time threat markers</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
            <Radio className="h-3.5 w-3.5 text-green-500 animate-pulse" />
            <span className="text-xs text-green-600 dark:text-green-400 font-medium">LIVE FEED</span>
          </div>
          <Button size="sm" variant="outline" onClick={() => setMarkers(dataset.map(toMarker))}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card-modern stat-card p-4 text-center">
          <div className="text-xs text-muted-foreground uppercase mb-1">Critical</div>
          <div className="text-2xl font-bold text-red-500">{stats.critical}</div>
        </div>
        <div className="card-modern stat-card p-4 text-center">
          <div className="text-xs text-muted-foreground uppercase mb-1">High</div>
          <div className="text-2xl font-bold text-orange-500">{stats.high}</div>
        </div>
        <div className="card-modern stat-card p-4 text-center">
          <div className="text-xs text-muted-foreground uppercase mb-1">Medium</div>
          <div className="text-2xl font-bold text-cyan-400">{stats.medium}</div>
        </div>
        <div className="card-modern stat-card p-4 text-center">
          <div className="text-xs text-muted-foreground uppercase mb-1">Low</div>
          <div className="text-2xl font-bold text-green-500">{stats.low}</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* 3D Globe */}
        <div className="lg:col-span-2">
          <Card className="card-modern overflow-hidden">
            <CardHeader className="border-b border-border">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  Threat Network
                </CardTitle>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-mono">{enriched.length} active nodes</span>
                  <Button size="icon" variant="ghost" className="h-8 w-8">
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Suspense
                fallback={
                  <div className="h-[65vh] w-full flex flex-col items-center justify-center bg-slate-900/50">
                    <div className="h-12 w-12 rounded-full border-2 border-primary border-t-transparent animate-spin mb-4"></div>
                    <p className="text-muted-foreground">Loading 3D Globe...</p>
                  </div>
                }
              >
                <SciFiGlobe markers={enriched} onSelect={onSelect} />
              </Suspense>
            </CardContent>
          </Card>
        </div>

        {/* Target Details Panel */}
        <Card className="card-modern sticky top-20">
          <CardHeader className="border-b border-border">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Target Intelligence
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {selected ? (
              <div className="space-y-4">
                {/* Target Photo & Name */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-muted border border-border overflow-hidden flex-shrink-0">
                    <img
                      src={selected.img || '/placeholder.svg'}
                      alt={selected.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-foreground">{selected.name}</div>
                    <div className="text-sm text-muted-foreground">AKA: {selected.alias || '—'}</div>
                    <div className="text-xs text-muted-foreground mt-1">{selected.country}</div>
                  </div>
                </div>

                {/* Threat Badge */}
                <div className="flex flex-wrap gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${getThreatColor(selected.threat)}`}>
                    {selected.threat} THREAT
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-3 p-3 rounded-lg bg-muted/30 border border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Last Seen</span>
                    <span className="text-foreground">{selected.lastSeen}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Coordinates</span>
                    <span className="font-mono text-xs text-foreground">{selected.lat.toFixed(2)}, {selected.lon.toFixed(2)}</span>
                  </div>
                  {selected.bounty && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Bounty</span>
                      <span className="font-bold text-green-500">{selected.bounty}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <Button className="w-full btn-pro">
                    <Eye className="h-4 w-4 mr-2" />
                    View Full Dossier
                  </Button>
                  <Button variant="outline" className="w-full">
                    <MapPin className="h-4 w-4 mr-2" />
                    Track Location
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <MapPin className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p>Select a marker on the globe…</p>
              </div>
            )}
          </CardContent>

          {/* Target List */}
          <div className="border-t border-border">
            <div className="p-3 bg-muted/20 border-b border-border">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Active Targets</span>
            </div>
            <div className="max-h-48 overflow-y-auto">
              {dataset.map((target) => (
                <button
                  key={target.id}
                  onClick={() => setSelected(target)}
                  className={`w-full p-3 text-left flex items-center justify-between hover:bg-muted/30 transition-colors border-b border-border/50 ${selected?.id === target.id ? 'bg-primary/5 border-l-2 border-l-primary' : ''
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full ${target.threat === 'critical' ? 'bg-red-500 animate-pulse' :
                        target.threat === 'high' ? 'bg-orange-500' :
                          target.threat === 'medium' ? 'bg-cyan-400' : 'bg-green-500'
                      }`}></div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{target.name}</p>
                      <p className="text-xs text-muted-foreground">{target.country}</p>
                    </div>
                  </div>
                  {target.bounty && (
                    <span className="text-xs text-green-500">{target.bounty}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Footer notice */}
      <div className="card-modern p-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Wifi className="h-4 w-4 text-green-500" />
            <span>Connected to FBI Global Threat Intelligence Network</span>
          </div>
          <span className="text-xs text-muted-foreground font-mono">Last sync: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
};

export default GlobePage;
