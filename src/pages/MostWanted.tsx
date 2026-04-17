import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  AlertTriangle,
  FileWarning,
  DollarSign,
  Search,
  MapPin,
  Eye,
  UserCheck,
  Calendar,
  Award,
  Download,
  ChevronLeft,
  ChevronRight,
  Skull,
  Target,
  Shield,
  AlertCircle,
  Radio,
  X
} from 'lucide-react';

interface MostWantedCriminal {
  id: string;
  name: string;
  image: string;
  status: 'active' | 'captured' | 'deceased';
  dangerLevel: 'low' | 'moderate' | 'high' | 'extreme';
  crimes: string[];
  lastSeen: string;
  reward: number;
  description: string;
  caution: string;
  dateAdded: string;
  caseNumber: string;
  category: string;
}

const MOST_WANTED_DATA: MostWantedCriminal[] = [
  {
    id: '1',
    name: 'Robert Thompson',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&h=400&fit=facearea&facepad=2&auto=format',
    status: 'active',
    dangerLevel: 'extreme',
    crimes: ['Armed Robbery', 'Murder', 'Escape from Custody'],
    lastSeen: 'Chicago, Illinois',
    reward: 100000,
    description: 'Thompson is wanted for a series of armed bank robberies resulting in multiple fatalities. He escaped from federal custody in March 2023.',
    caution: 'Subject has violent tendencies and extensive weapons training. Do not approach.',
    dateAdded: '2023-04-15',
    caseNumber: 'FBI-2023-045789',
    category: 'Violent Crimes',
  },
  {
    id: '2',
    name: 'Sarah Blackwell',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&h=400&fit=facearea&facepad=2&auto=format',
    status: 'active',
    dangerLevel: 'high',
    crimes: ['Espionage', 'Terrorism', 'Computer Fraud'],
    lastSeen: 'Seattle, Washington',
    reward: 75000,
    description: 'Blackwell is wanted for involvement in espionage activities against the United States government and major technology companies.',
    caution: 'Subject may have altered appearance and is known to use multiple aliases.',
    dateAdded: '2023-06-22',
    caseNumber: 'FBI-2023-068912',
    category: 'Cyber Crimes',
  },
  {
    id: '3',
    name: 'Miguel Sanchez',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&h=400&fit=facearea&facepad=2&auto=format',
    status: 'active',
    dangerLevel: 'high',
    crimes: ['Drug Trafficking', 'Money Laundering', 'Murder'],
    lastSeen: 'Miami, Florida',
    reward: 50000,
    description: 'Sanchez is a high-ranking member of an international drug cartel with operations across North and South America.',
    caution: 'Subject has extensive connections and resources to evade capture.',
    dateAdded: '2023-01-30',
    caseNumber: 'FBI-2023-012345',
    category: 'Organized Crime',
  },
  {
    id: '4',
    name: 'Elena Vostok',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=400&h=400&fit=facearea&facepad=2&auto=format',
    status: 'active',
    dangerLevel: 'extreme',
    crimes: ['International Terrorism', 'Assassination', 'Weapons Trafficking'],
    lastSeen: 'Istanbul, Turkey',
    reward: 150000,
    description: 'Vostok is wanted for orchestrating several terrorist attacks across Europe and Asia. Former intelligence operative.',
    caution: 'Subject is highly trained in counter-surveillance and evasion tactics.',
    dateAdded: '2023-03-10',
    caseNumber: 'FBI-2023-034567',
    category: 'Terrorism',
  },
  {
    id: '5',
    name: 'David Chen',
    image: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?q=80&w=400&h=400&fit=facearea&facepad=2&auto=format',
    status: 'active',
    dangerLevel: 'moderate',
    crimes: ['Financial Fraud', 'Identity Theft', 'Money Laundering'],
    lastSeen: 'Vancouver, Canada',
    reward: 25000,
    description: 'Chen is the mastermind behind a sophisticated financial fraud scheme that has defrauded investors of over $200 million.',
    caution: 'Subject frequently changes identity and may have undergone cosmetic surgery.',
    dateAdded: '2023-02-18',
    caseNumber: 'FBI-2023-023456',
    category: 'Financial Crimes',
  },
  {
    id: '6',
    name: 'Carlos Rivera',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&h=400&fit=facearea&facepad=2&auto=format',
    status: 'active',
    dangerLevel: 'extreme',
    crimes: ['Kidnapping', 'Ransom', 'Extortion'],
    lastSeen: 'Monterrey, Mexico',
    reward: 200000,
    description: 'Rivera is the leader of an international kidnapping ring that has targeted wealthy families across multiple countries.',
    caution: 'Subject is extremely violent and has ordered the deaths of several victims.',
    dateAdded: '2023-09-05',
    caseNumber: 'FBI-2023-092345',
    category: 'Violent Crimes',
  },
];

const MostWanted: React.FC = () => {
  const [criminals, setCriminals] = useState<MostWantedCriminal[]>(MOST_WANTED_DATA);
  const [searchTerm, setSearchTerm] = useState('');
  const [dangerFilter, setDangerFilter] = useState<'all' | 'extreme' | 'high' | 'moderate'>('all');
  const [selectedCriminal, setSelectedCriminal] = useState<MostWantedCriminal | null>(null);

  const filteredCriminals = useMemo(() => {
    return criminals.filter(criminal => {
      const matchesSearch = criminal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        criminal.crimes.some(crime => crime.toLowerCase().includes(searchTerm.toLowerCase())) ||
        criminal.lastSeen.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDanger = dangerFilter === 'all' || criminal.dangerLevel === dangerFilter;
      return matchesSearch && matchesDanger && criminal.status === 'active';
    });
  }, [criminals, searchTerm, dangerFilter]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getDangerBadge = (level: string) => {
    const styles: Record<string, string> = {
      extreme: 'bg-red-600 text-white border-red-500 animate-pulse',
      high: 'bg-orange-500 text-white border-orange-400',
      moderate: 'bg-amber-500 text-black border-amber-400',
      low: 'bg-blue-500 text-white border-blue-400',
    };
    return styles[level] || styles.moderate;
  };

  const totalReward = filteredCriminals.reduce((sum, c) => sum + c.reward, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="relative">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="fbi-header">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-red-500/20 flex items-center justify-center relative">
                <Target className="h-6 w-6 text-red-500" />
                <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 animate-ping"></div>
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-foreground">Most Wanted Fugitives</h1>
                  <span className="classified-badge">PRIORITY ALERT</span>
                </div>
                <p className="text-sm text-muted-foreground">FBI Ten Most Wanted Fugitives Program</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30">
              <div className="text-xs text-red-400 uppercase tracking-wider mb-0.5">Combined Rewards</div>
              <div className="text-xl font-bold text-red-500">{formatCurrency(totalReward)}</div>
            </div>
            <Button variant="outline" className="border-red-500/30 text-red-500 hover:bg-red-500/10">
              <Download className="h-4 w-4 mr-2" />
              Export List
            </Button>
          </div>
        </div>
      </div>

      {/* Alert Banner */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-red-950/80 via-red-900/60 to-red-950/80 border border-red-500/30 p-4">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0di00aC0ydjRoLTR2Mmg0djRoMnYtNGg0di0yaC00em0wLTMwVjBoLTJ2NGgtNHYyaDR2NGgyVjZoNFY0aC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
        <div className="relative flex items-center gap-4">
          <div className="p-2 rounded-lg bg-red-500/20">
            <AlertTriangle className="h-6 w-6 text-red-400" />
          </div>
          <div className="flex-1">
            <div className="text-red-300 font-semibold mb-0.5">WARNING: ARMED AND DANGEROUS</div>
            <p className="text-red-300/70 text-sm">
              These individuals are considered extremely dangerous. Do not attempt to apprehend. If you have information, contact the FBI immediately at 1-800-CALL-FBI.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Radio className="h-4 w-4 text-red-400 animate-pulse" />
            <span className="text-red-400 text-sm font-mono">LIVE UPDATES</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card-modern p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name, crime, or location..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'extreme', 'high', 'moderate'].map((level) => (
              <Button
                key={level}
                variant={dangerFilter === level ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDangerFilter(level as any)}
                className={dangerFilter === level && level !== 'all' ? getDangerBadge(level) : ''}
              >
                {level === 'all' ? 'All Threats' : level.charAt(0).toUpperCase() + level.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{filteredCriminals.length}</span> active fugitives
        </p>
      </div>

      {/* Criminal Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCriminals.map((criminal) => (
          <div
            key={criminal.id}
            onClick={() => setSelectedCriminal(criminal)}
            className="group relative card-modern overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/10 hover:-translate-y-1"
          >
            {/* Danger indicator strip */}
            <div className={`absolute top-0 left-0 right-0 h-1 ${criminal.dangerLevel === 'extreme' ? 'bg-red-500' :
                criminal.dangerLevel === 'high' ? 'bg-orange-500' :
                  'bg-amber-500'
              }`}></div>

            {/* Image section */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={criminal.image}
                alt={criminal.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

              {/* Badges */}
              <div className="absolute top-3 right-3 flex gap-2">
                <span className={`px-2 py-1 rounded text-xs font-bold uppercase border ${getDangerBadge(criminal.dangerLevel)}`}>
                  {criminal.dangerLevel}
                </span>
              </div>

              {/* Name overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-xl font-bold text-white mb-1">{criminal.name}</h3>
                <div className="flex items-center gap-1 text-white/80 text-sm">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>Last seen: {criminal.lastSeen}</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              {/* Category & Case Number */}
              <div className="flex items-center justify-between">
                <span className="badge badge-primary">{criminal.category}</span>
                <span className="text-xs font-mono text-muted-foreground">{criminal.caseNumber}</span>
              </div>

              {/* Crimes */}
              <div className="flex flex-wrap gap-1.5">
                {criminal.crimes.slice(0, 3).map((crime, i) => (
                  <span key={i} className="px-2 py-0.5 rounded text-xs bg-muted text-muted-foreground">
                    {crime}
                  </span>
                ))}
              </div>

              {/* Reward */}
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-muted-foreground">Reward</span>
                </div>
                <span className="text-lg font-bold text-green-500">{formatCurrency(criminal.reward)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedCriminal && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedCriminal(null)}
        >
          <div
            className="relative w-full max-w-3xl max-h-[90vh] overflow-auto card-modern"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedCriminal(null)}
              className="absolute top-4 right-4 z-10 h-10 w-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header image */}
            <div className="relative h-64">
              <img
                src={selectedCriminal.image}
                alt={selectedCriminal.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>

              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-3 py-1 rounded text-sm font-bold uppercase border ${getDangerBadge(selectedCriminal.dangerLevel)}`}>
                    {selectedCriminal.dangerLevel} RISK
                  </span>
                  <span className="classified-badge">WANTED</span>
                </div>
                <h2 className="text-3xl font-bold text-foreground">{selectedCriminal.name}</h2>
                <div className="flex items-center gap-2 text-muted-foreground mt-1">
                  <MapPin className="h-4 w-4" />
                  <span>Last seen: {selectedCriminal.lastSeen}</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Caution Box */}
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-red-500 mb-1">⚠️ CAUTION</div>
                    <p className="text-sm text-red-300/80">{selectedCriminal.caution}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-semibold text-foreground mb-2">Description</h4>
                <p className="text-muted-foreground">{selectedCriminal.description}</p>
              </div>

              {/* Crimes */}
              <div>
                <h4 className="font-semibold text-foreground mb-2">Wanted For</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCriminal.crimes.map((crime, i) => (
                    <span key={i} className="px-3 py-1 rounded-full text-sm bg-muted text-foreground border border-border">
                      <FileWarning className="h-3 w-3 inline mr-1" />
                      {crime}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-muted/50 border border-border text-center">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Case Number</div>
                  <div className="font-mono font-semibold text-foreground">{selectedCriminal.caseNumber}</div>
                </div>
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-center">
                  <div className="text-xs text-green-600 dark:text-green-400 uppercase tracking-wider mb-1">Reward</div>
                  <div className="font-bold text-xl text-green-600 dark:text-green-400">{formatCurrency(selectedCriminal.reward)}</div>
                </div>
                <div className="p-4 rounded-lg bg-muted/50 border border-border text-center">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Date Added</div>
                  <div className="font-semibold text-foreground">{new Date(selectedCriminal.dateAdded).toLocaleDateString()}</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-border">
                <Button className="flex-1 btn-pro">
                  <UserCheck className="h-4 w-4 mr-2" />
                  Report Sighting
                </Button>
                <Button variant="outline" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download Poster
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MostWanted;