import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import SciFiGlobe, { type Marker } from '@/components/globe/SciFiGlobe';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, House, Users, Sparkles } from 'lucide-react';

type CaseRow = Database['public']['Tables']['cases']['Row'];
type CriminalRow = Database['public']['Tables']['criminals']['Row'];
type ThreatLevel = Database['public']['Enums']['threat_level'];

type Safehouse = {
  id: string;
  codeName: string;
  city: string;
  region: string;
  securityTier: 'tier_1' | 'tier_2' | 'tier_3' | 'tier_4';
  status: 'available' | 'occupied' | 'compromised' | 'maintenance';
  capacity: number;
  occupants: number;
  notes: string;
  lat: number;
  lon: number;
};

const REGION_CENTROIDS: Record<string, { lat: number; lon: number }> = {
  Northeast: { lat: 42.36, lon: -71.06 },
  South: { lat: 33.75, lon: -84.39 },
  Midwest: { lat: 41.88, lon: -87.63 },
  Southwest: { lat: 33.45, lon: -112.07 },
  'West Coast': { lat: 34.05, lon: -118.24 },
  International: { lat: 51.51, lon: -0.13 },
  Unknown: { lat: 39.83, lon: -98.58 },
};

const TIER_STYLE: Record<Safehouse['securityTier'], string> = {
  tier_1: 'border-muted text-muted-foreground',
  tier_2: 'border-primary/40 text-primary',
  tier_3: 'border-warning/40 text-warning',
  tier_4: 'border-destructive/40 text-destructive',
};

const STATUS_STYLE: Record<Safehouse['status'], string> = {
  available: 'text-success',
  occupied: 'text-warning',
  compromised: 'text-destructive',
  maintenance: 'text-muted-foreground',
};

const THREAT_WEIGHT: Record<ThreatLevel, number> = {
  low: 1,
  medium: 2,
  high: 3,
  extreme: 4,
};

function determineRegionFromLocation(location: string | null): string {
  if (!location) return 'Unknown';
  const value = location.toLowerCase();
  if (value.includes('ny') || value.includes('new york') || value.includes('boston') || value.includes('dc') || value.includes('washington')) return 'Northeast';
  if (value.includes('miami') || value.includes('atlanta') || value.includes('new orleans') || value.includes('houston')) return 'South';
  if (value.includes('chicago') || value.includes('detroit') || value.includes('minneapolis') || value.includes('ohio')) return 'Midwest';
  if (value.includes('phoenix') || value.includes('vegas') || value.includes('denver') || value.includes('new mexico')) return 'Southwest';
  if (value.includes('la') || value.includes('los angeles') || value.includes('san francisco') || value.includes('seattle') || value.includes('california')) return 'West Coast';
  if (value.includes('uk') || value.includes('london') || value.includes('paris') || value.includes('berlin') || value.includes('tokyo')) return 'International';
  return 'Unknown';
}

/**
 * Creates deterministic coordinate jitter for synthetic map points.
 * Uses a lightweight string hash and scales the normalized offset by `scale`.
 */
function stableOffset(seed: string, scale: number): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return (((hash % 1000) / 1000) - 0.5) * scale;
}

function synthesizeSafehouseData(cases: CaseRow[], criminals: CriminalRow[]): Safehouse[] {
  const hotspots = cases
    .filter((item) => item.location && (item.status === 'open' || item.status === 'investigating'))
    .slice(0, 8);

  const baseCities = hotspots.length > 0
    ? hotspots.map((item) => item.location ?? 'Undisclosed')
    : ['Boston, MA', 'Atlanta, GA', 'Chicago, IL', 'Phoenix, AZ', 'Los Angeles, CA'];

  return baseCities.map((location, index) => {
    const region = determineRegionFromLocation(location);
    const city = location.split(',')[0]?.trim() || location;
    const centroid = REGION_CENTROIDS[region] ?? REGION_CENTROIDS.Unknown;
    const lat = centroid.lat + stableOffset(`${location}-lat-${index}`, 2.8);
    const lon = centroid.lon + stableOffset(`${location}-lon-${index}`, 3.2);

    const regionThreat = criminals
      .filter((c) => determineRegionFromLocation(c.last_known_location) === region && c.status === 'at_large')
      .reduce((sum, c) => sum + THREAT_WEIGHT[c.threat_level], 0);

    const capacity = 4 + (index % 4) * 2;
    const occupants = Math.min(capacity, Math.floor(regionThreat / 2) + (index % 3));

    const securityTier: Safehouse['securityTier'] =
      regionThreat >= 8 ? 'tier_4' : regionThreat >= 5 ? 'tier_3' : regionThreat >= 2 ? 'tier_2' : 'tier_1';

    const status: Safehouse['status'] =
      regionThreat >= 10 ? 'compromised' : occupants >= capacity ? 'occupied' : index % 6 === 0 ? 'maintenance' : 'available';

    return {
      id: `hide-${index + 1}`,
      codeName: `SAFEHOUSE-${String(index + 1).padStart(2, '0')}`,
      city,
      region,
      securityTier,
      status,
      capacity,
      occupants,
      notes: regionThreat >= 8
        ? 'Increased counter-surveillance and rotating entry windows required.'
        : 'Operational and ready for witness relocation.',
      lat,
      lon,
    };
  });
}

export default function Hideouts() {
  const [subject, setSubject] = useState('');
  const [threatLevel, setThreatLevel] = useState<ThreatLevel>('high');
  const [preferredRegion, setPreferredRegion] = useState('');
  const [recommendation, setRecommendation] = useState<string>('');

  const { data, isLoading } = useQuery({
    queryKey: ['hideouts-domain'],
    queryFn: async () => {
      const [casesRes, criminalsRes] = await Promise.all([
        supabase.from('cases').select('*').order('opened_at', { ascending: false }).limit(12),
        supabase.from('criminals').select('*').limit(50),
      ]);
      return {
        cases: casesRes.data ?? [],
        criminals: criminalsRes.data ?? [],
      };
    },
  });

  const safehouses = useMemo(
    () => synthesizeSafehouseData(data?.cases ?? [], data?.criminals ?? []),
    [data?.cases, data?.criminals],
  );

  const markers = useMemo<Marker[]>(() => {
    const houseMarkers = safehouses.map((house) => ({
      id: house.id,
      label: `${house.codeName} · ${house.city}`,
      lat: house.lat,
      lon: house.lon,
      color: house.status === 'compromised' ? '#f43f5e' : '#22c55e',
      size: house.status === 'compromised' ? 1.2 : 1,
    }));

    const criminalMarkers = (data?.criminals ?? [])
      .filter((c) => c.status === 'at_large')
      .slice(0, 8)
      .map((criminal) => {
        const region = determineRegionFromLocation(criminal.last_known_location);
        const centroid = REGION_CENTROIDS[region] ?? REGION_CENTROIDS.Unknown;
        return {
          id: `criminal-${criminal.id}`,
          label: criminal.full_name,
          lat: centroid.lat + stableOffset(`c-lat-${criminal.id}`, 4),
          lon: centroid.lon + stableOffset(`c-lon-${criminal.id}`, 4),
          color: criminal.threat_level === 'extreme' ? '#f43f5e' : '#f59e0b',
          size: criminal.threat_level === 'extreme' ? 1.1 : 0.9,
        };
      });

    return [...houseMarkers, ...criminalMarkers];
  }, [safehouses, data?.criminals]);

  const runRecommendation = () => {
    if (!subject.trim()) return;

    const candidates = safehouses.filter((s) => s.status !== 'compromised');
    if (candidates.length === 0) {
      setRecommendation('No viable safehouse candidates are available at this time.');
      return;
    }

    const targetThreat = THREAT_WEIGHT[threatLevel];
    const best = candidates
      .map((house) => {
        const tierWeight = Number(house.securityTier.replace('tier_', ''));
        const availabilityWeight = house.capacity - house.occupants;
        const regionWeight = preferredRegion && house.region.toLowerCase() === preferredRegion.toLowerCase() ? 2 : 0;
        const score = (tierWeight * targetThreat) + availabilityWeight + regionWeight;
        return { house, score };
      })
      .sort((a, b) => b.score - a.score)[0];

    setRecommendation(
      `Recommended: ${best.house.codeName} (${best.house.city}, ${best.house.region}) · ${best.house.securityTier.toUpperCase()} · ${best.house.status.toUpperCase()} · capacity ${best.house.occupants}/${best.house.capacity}.`,
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="classified-tag mb-2 inline-block">Logistics</span>
        <h1 className="text-2xl font-bold">Safehouse Network</h1>
        <p className="text-muted-foreground text-sm">
          First-wave hideouts domain integration adapted to current schema.
        </p>
      </div>

      <Card className="card-intel">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" /> Safehouse recommendation
          </CardTitle>
          <CardDescription>Local scoring model using current case/criminal telemetry.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-4">
          <div className="md:col-span-2 space-y-1.5">
            <Label htmlFor="subject">Subject / Witness</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Cooperating witness — organized crime"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="threat-level">Threat level</Label>
            <select
              id="threat-level"
              value={threatLevel}
              onChange={(e) => setThreatLevel(e.target.value as ThreatLevel)}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="extreme">Extreme</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="preferred-region">Preferred region</Label>
            <Input
              id="preferred-region"
              value={preferredRegion}
              onChange={(e) => setPreferredRegion(e.target.value)}
              placeholder="Optional"
            />
          </div>
          <div className="md:col-span-4">
            <Button onClick={runRecommendation} disabled={!subject.trim()}>
              <Sparkles className="h-4 w-4 mr-1" /> Recommend Safehouse
            </Button>
          </div>
          {recommendation && (
            <div className="md:col-span-4 rounded-md border border-primary/30 bg-primary/5 p-3 text-sm">
              {recommendation}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="card-intel">
        <CardHeader>
          <CardTitle className="text-base">Network geospatial view</CardTitle>
          <CardDescription>
            {isLoading ? 'Loading tactical map…' : `${markers.length} markers currently rendered.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SciFiGlobe markers={markers} />
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {safehouses.map((house) => (
          <Card key={house.id} className="card-intel">
            <CardContent className="pt-5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground font-mono uppercase tracking-wider">{house.region}</div>
                  <div className="font-semibold">{house.codeName}</div>
                  <div className="text-sm text-muted-foreground">{house.city}</div>
                </div>
                <Badge variant="outline" className={`${TIER_STYLE[house.securityTier]} text-[10px] uppercase`}>
                  {house.securityTier.replace('_', ' ')}
                </Badge>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <span className={`flex items-center gap-1 ${STATUS_STYLE[house.status]}`}>
                  <Shield className="h-3.5 w-3.5" />
                  {house.status}
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Users className="h-3.5 w-3.5" />
                  {house.occupants}/{house.capacity}
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <House className="h-3.5 w-3.5" />
                  active
                </span>
              </div>

              <p className="text-xs text-muted-foreground">{house.notes}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
