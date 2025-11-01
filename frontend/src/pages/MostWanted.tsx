import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { AlertCircle, FileWarning, Skull, DollarSign, Filter, Search, MapPin, Eye, UserCheck, Calendar, Hash, Award } from 'lucide-react';
import { Input } from '@/components/ui/input';

// Types for our Most Wanted entries
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
}

// Mock data for the Most Wanted criminals - strictly typed to match MostWantedCriminal interface
const MOST_WANTED_DATA: MostWantedCriminal[] = [
  {
    id: '1',
    name: 'Robert Thompson',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3',
    status: 'active',
    dangerLevel: 'extreme',
    crimes: ['Armed Robbery', 'Murder', 'Escape from Custody'],
    lastSeen: 'Chicago, Illinois',
    reward: 100000,
    description: 'Thompson is wanted for a series of armed bank robberies resulting in multiple fatalities. He escaped from federal custody in March 2023 and is considered armed and extremely dangerous.',
    caution: 'Subject has violent tendencies and extensive weapons training. Do not approach.',
    dateAdded: '2023-04-15',
    caseNumber: 'FBI-2023-045789',
  },
  {
    id: '2',
    name: 'Sarah Blackwell',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3',
    status: 'active',
    dangerLevel: 'high',
    crimes: ['Espionage', 'Terrorism', 'Computer Fraud'],
    lastSeen: 'Seattle, Washington',
    reward: 75000,
    description: 'Blackwell is wanted for involvement in espionage activities against the United States government and major technology companies. She has expertise in cybersecurity and has orchestrated several high-profile data breaches.',
    caution: 'Subject may have altered appearance and is known to use multiple aliases.',
    dateAdded: '2023-06-22',
    caseNumber: 'FBI-2023-068912',
  },
  {
    id: '3',
    name: 'Miguel Sanchez',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3',
    status: 'active',
    dangerLevel: 'high',
    crimes: ['Drug Trafficking', 'Money Laundering', 'Murder'],
    lastSeen: 'Miami, Florida',
    reward: 50000,
    description: 'Sanchez is a high-ranking member of an international drug cartel with operations across North and South America. He is responsible for coordinating large-scale trafficking operations and eliminating competition.',
    caution: 'Subject has extensive connections and resources to evade capture. May be traveling with armed associates.',
    dateAdded: '2023-01-30',
    caseNumber: 'FBI-2023-012345',
  },
  {
    id: '4',
    name: 'James Wilson',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3',
    status: 'captured',
    dangerLevel: 'high',
    crimes: ['Serial Murder', 'Kidnapping'],
    lastSeen: 'Portland, Oregon',
    reward: 30000,
    description: 'Wilson was wanted in connection with a series of disappearances and murders along the Pacific Northwest. He was apprehended in a remote cabin outside Portland after a citizen tip.',
    caution: 'Subject was found with extensive collection of weapons and survivalist equipment.',
    dateAdded: '2022-11-15',
    caseNumber: 'FBI-2022-115678',
  },
  {
    id: '5',
    name: 'Elena Vostok',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3',
    status: 'active',
    dangerLevel: 'extreme',
    crimes: ['International Terrorism', 'Assassination', 'Weapons Trafficking'],
    lastSeen: 'Istanbul, Turkey',
    reward: 150000,
    description: 'Vostok is wanted for orchestrating several terrorist attacks across Europe and Asia. Former intelligence operative with specialized training in explosives and infiltration techniques.',
    caution: 'Subject is highly trained in counter-surveillance and evasion tactics. Considered extremely dangerous.',
    dateAdded: '2023-03-10',
    caseNumber: 'FBI-2023-034567',
  },
  {
    id: '6',
    name: 'David Chen',
    image: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3',
    status: 'active',
    dangerLevel: 'moderate',
    crimes: ['Financial Fraud', 'Identity Theft', 'Money Laundering'],
    lastSeen: 'Vancouver, Canada',
    reward: 25000,
    description: 'Chen is the mastermind behind a sophisticated financial fraud scheme that has defrauded investors of over $200 million through fake investment opportunities and Ponzi schemes.',
    caution: 'Subject frequently changes identity and may have undergone cosmetic surgery to alter appearance.',
    dateAdded: '2023-02-18',
    caseNumber: 'FBI-2023-023456',
  },
  // Adding 5 new criminals to increase data set
  {
    id: '7',
    name: 'Derek Mills',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3',
    status: 'active',
    dangerLevel: 'high',
    crimes: ['Money Laundering', 'Tax Evasion', 'Racketeering'],
    lastSeen: 'Las Vegas, Nevada',
    reward: 75000,
    description: 'Mills is the head of a major money laundering operation that has moved over $500 million through shell companies and casinos. He has connections with multiple organized crime families.',
    caution: 'Subject is known to be violent when confronted and carries concealed weapons. Do not approach without proper backup.',
    dateAdded: '2023-08-15',
    caseNumber: 'FBI-2023-084567',
  },
  {
    id: '8',
    name: 'Rachel Hoffman',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3',
    status: 'active',
    dangerLevel: 'extreme',
    crimes: ['Cyber Terrorism', 'Data Breach', 'Identity Theft'],
    lastSeen: 'Berlin, Germany',
    reward: 150000,
    description: 'Hoffman is a cyber terrorist who has compromised the networks of several government agencies and critical infrastructure systems. She has expertise in advanced persistent threats and zero-day exploits.',
    caution: 'Subject is extremely dangerous in digital environments and may attempt to hack into law enforcement systems. Monitor all digital communications.',
    dateAdded: '2023-08-20',
    caseNumber: 'FBI-2023-086789',
  },
  {
    id: '9',
    name: 'Marcus Webb',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3',
    status: 'active',
    dangerLevel: 'high',
    crimes: ['Arms Trafficking', 'Murder', 'Conspiracy'],
    lastSeen: 'Bogotá, Colombia',
    reward: 125000,
    description: 'Webb is a major arms dealer who has supplied weapons to terrorist organizations and criminal cartels across South America. He has been linked to multiple assassinations.',
    caution: 'Subject has extensive weapons cache and is known to be heavily armed. Approach with extreme caution.',
    dateAdded: '2023-08-25',
    caseNumber: 'FBI-2023-088901',
  },
  {
    id: '10',
    name: 'Jennifer Walsh',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3',
    status: 'active',
    dangerLevel: 'moderate',
    crimes: ['Embezzlement', 'Wire Fraud', 'Bank Fraud'],
    lastSeen: 'Miami, Florida',
    reward: 25000,
    description: 'Walsh embezzled over $20 million from her position as a senior executive at a major financial institution. She used complex offshore accounts to hide the stolen funds.',
    caution: 'Subject may have fled the country and could be using false documents. Monitor international travel.',
    dateAdded: '2023-08-30',
    caseNumber: 'FBI-2023-080123',
  },
  {
    id: '11',
    name: 'Carlos Rivera',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3',
    status: 'active',
    dangerLevel: 'extreme',
    crimes: ['Kidnapping', 'Ransom', 'Extortion'],
    lastSeen: 'Monterrey, Mexico',
    reward: 200000,
    description: 'Rivera is the leader of an international kidnapping ring that has targeted wealthy families and business executives. He has been responsible for over 50 kidnappings across multiple countries.',
    caution: 'Subject is extremely violent and has ordered the deaths of several victims. Do not approach without proper backup and negotiation team.',
    dateAdded: '2023-09-05',
    caseNumber: 'FBI-2023-092345',
  },
];

// 1. Add localStorage utility functions for most wanted criminals
const getMostWantedFromStorage = (): MostWantedCriminal[] => {
  const stored = localStorage.getItem('mostWantedCriminals');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse most wanted criminals from localStorage:', e);
      return [];
    }
  }
  return [];
};

const saveMostWantedToStorage = (criminals: MostWantedCriminal[]) => {
  localStorage.setItem('mostWantedCriminals', JSON.stringify(criminals));
};

const MostWanted: React.FC = () => {
  const [criminals, setCriminals] = useState<MostWantedCriminal[]>(getMostWantedFromStorage());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'captured'>('all');
  const [dangerFilter, setDangerFilter] = useState<'all' | 'extreme' | 'high' | 'moderate' | 'low'>('all');
  const [sortByState, setSortByState] = useState<'name' | 'bounty' | 'lastSeen' | 'dateAdded'>('dateAdded');
  const [sortDirectionState, setSortDirectionState] = useState<'asc' | 'desc'>('asc');
  const [selectedCriminal, setSelectedCriminal] = useState<MostWantedCriminal | null>(null);
  
  // 2. On mount, seed with mock data if localStorage is empty
  useEffect(() => {
    if (criminals.length === 0) {
      setCriminals(MOST_WANTED_DATA);
      saveMostWantedToStorage(MOST_WANTED_DATA);
    }
  }, [criminals]);

  // Create a safe getter function for sortBy
  const getSortBy = useCallback(() => {
    return sortByState || 'dateAdded';
  }, [sortByState]);

  // Create a safe getter function for sortDirection
  const getSortDirection = useCallback(() => {
    return sortDirectionState || 'asc';
  }, [sortDirectionState]);

  const filteredCriminals = useMemo(() => {
    return criminals
      .filter(criminal => {
        const matchesSearch = criminal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             criminal.crimes.some(crime => crime.toLowerCase().includes(searchTerm.toLowerCase())) ||
                             criminal.lastSeen.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             criminal.caseNumber.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === 'all' || criminal.status === statusFilter;
        const matchesDanger = dangerFilter === 'all' || criminal.dangerLevel === dangerFilter;
        
        return matchesSearch && matchesStatus && matchesDanger;
      })
      .sort((a, b) => {
        let comparison = 0;
        
        // Use getter functions to ensure we always have valid values
        const sortByValue = getSortBy();
        const sortDirectionValue = getSortDirection();
        
        // Validate sortBy value
        const sortField = ['name', 'bounty', 'lastSeen', 'dateAdded'].includes(sortByValue) ? sortByValue : 'dateAdded';
        
        // Validate sortDirection value
        const direction = sortDirectionValue === 'asc' || sortDirectionValue === 'desc' ? sortDirectionValue : 'asc';
        
        switch (sortField) {
          case 'name':
            comparison = a.name.localeCompare(b.name);
            break;
          case 'bounty':
            comparison = a.reward - b.reward;
            break;
          case 'lastSeen':
            comparison = a.lastSeen.localeCompare(b.lastSeen);
            break;
          case 'dateAdded':
            comparison = new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
            break;
          default:
            comparison = 0;
        }
        
        return direction === 'asc' ? comparison : -comparison;
      });
  }, [criminals, searchTerm, statusFilter, dangerFilter, sortByState, sortDirectionState, getSortBy, getSortDirection]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDangerBadgeClass = (level: string) => {
    switch(level) {
      case 'extreme':
        return 'bg-red-600 text-white hover:bg-red-700';
      case 'high':
        return 'bg-orange-500 text-white hover:bg-orange-600';
      case 'moderate':
        return 'bg-yellow-500 text-black hover:bg-yellow-600';
      case 'low':
        return 'bg-blue-500 text-white hover:bg-blue-600';
      default:
        return 'bg-gray-500 text-white hover:bg-gray-600';
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch(status) {
      case 'active':
        return 'bg-green-600 text-white hover:bg-green-700';
      case 'captured':
        return 'bg-blue-600 text-white hover:bg-blue-700';
      case 'deceased':
        return 'bg-gray-600 text-white hover:bg-gray-700';
      default:
        return 'bg-gray-500 text-white hover:bg-gray-600';
    }
  };

  const renderDetailedView = () => {
    if (!selectedCriminal) return null;
    
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm p-4">
        <Card className="max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-scale-in">
          <CardHeader className="border-b border-border/40 p-0">
            <div className="relative h-48 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
              <img 
                src={selectedCriminal.image} 
                alt={selectedCriminal.name} 
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute top-4 right-4 z-20 flex space-x-2">
                <Badge className={getDangerBadgeClass(selectedCriminal.dangerLevel)}>
                  {selectedCriminal.dangerLevel.toUpperCase()} RISK
                </Badge>
                <Badge className={getStatusBadgeClass(selectedCriminal.status)}>
                  {selectedCriminal.status.toUpperCase()}
                </Badge>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-4 left-4 z-20 bg-black/50 hover:bg-black/70 text-white"
                onClick={() => setSelectedCriminal(null)}
              >
                ✕
              </Button>
              <div className="absolute bottom-0 left-0 right-0 z-20 p-4">
                <h2 className="text-2xl font-bold text-white">{selectedCriminal.name}</h2>
                <div className="flex items-center text-white/80 text-sm">
                  <MapPin size={14} className="mr-1" />
                  <span>Last seen: {selectedCriminal.lastSeen}</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-2/3 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p>{selectedCriminal.description}</p>
                </div>
                
                <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-md">
                  <div className="flex items-start">
                    <AlertCircle className="text-red-500 mr-2 mt-0.5" size={16} />
                    <div>
                      <h4 className="font-semibold text-red-500">CAUTION</h4>
                      <p className="text-sm">{selectedCriminal.caution}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Wanted For</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCriminal.crimes.map((crime, index) => (
                      <Badge key={index} variant="outline" className="bg-background">
                        <FileWarning size={12} className="mr-1" />
                        {crime}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border border-border rounded-md p-4">
                    <h4 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                      <Hash size={14} className="mr-1" />
                      Case ID
                    </h4>
                    <p className="font-mono text-lg">{selectedCriminal.caseNumber}</p>
                  </div>
                  <div className="border border-border rounded-md p-4 bg-green-500/5">
                    <h4 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                      <Award size={14} className="mr-1" />
                      Reward
                    </h4>
                    <p className="font-mono text-lg text-green-500">{formatCurrency(selectedCriminal.reward)}</p>
                  </div>
                  <div className="border border-border rounded-md p-4 bg-blue-500/5">
                    <h4 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                      <Calendar size={14} className="mr-1" />
                      Added
                    </h4>
                    <p className="font-mono text-lg text-blue-500">{formatDate(selectedCriminal.dateAdded)}</p>
                  </div>
                </div>
              </div>
              
              <div className="w-full md:w-1/3 space-y-4">
                <div className="border border-border rounded-md overflow-hidden">
                  <div className="bg-muted p-3 font-medium">Physical Description</div>
                  <div className="p-4 space-y-3">
                    <div>
                      <div className="text-sm text-muted-foreground">Height</div>
                      <div>5'11" - 6'2"</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Weight</div>
                      <div>170-190 lbs</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Hair</div>
                      <div>Brown, may be dyed</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Eyes</div>
                      <div>Blue</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Distinguishing Marks</div>
                      <div>Scar on left cheek, tattoo on right forearm</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-fbi-navy/80 text-white p-4 rounded-md border border-primary/30">
                  <h4 className="font-medium mb-2 flex items-center">
                    <Eye size={14} className="mr-1" />
                    Sightings
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Chicago, IL</span>
                      <span>3 days ago</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Detroit, MI</span>
                      <span>1 week ago</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cleveland, OH</span>
                      <span>2 weeks ago</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <Button className="w-full">
                    <UserCheck size={16} className="mr-2" />
                    Report Sighting
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Most Wanted</h1>
          <p className="text-muted-foreground">FBI's most wanted criminals</p>
        </div>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Search by name, crime, or last seen..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="captured">Captured</option>
          </select>
          <select
            value={dangerFilter}
            onChange={e => setDangerFilter(e.target.value as any)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="all">All Danger Levels</option>
            <option value="extreme">Extreme</option>
            <option value="high">High</option>
            <option value="moderate">Moderate</option>
            <option value="low">Low</option>
          </select>
          <select
            value={sortByState || 'dateAdded'}
            onChange={e => setSortByState(e.target.value as 'name' | 'bounty' | 'lastSeen' | 'dateAdded')}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="dateAdded">Sort by Date Added</option>
            <option value="name">Sort by Name</option>
            <option value="bounty">Sort by Bounty</option>
            <option value="lastSeen">Sort by Last Seen</option>
          </select>
          <select
            value={sortDirectionState || 'asc'}
            onChange={e => setSortDirectionState(e.target.value as 'asc' | 'desc')}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>
      
      <Tabs defaultValue="grid">
        <TabsList className="mb-4">
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="grid" className="animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCriminals.map((criminal) => (
              <Card 
                key={criminal.id} 
                className="overflow-hidden glass-card cursor-pointer hover:shadow-glass-hover transition-shadow duration-300"
                onClick={() => setSelectedCriminal(criminal)}
              >
                <div className="relative h-60 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10"></div>
                  <img 
                    src={criminal.image} 
                    alt={criminal.name} 
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute top-3 right-3 z-20 flex flex-col space-y-2">
                    <Badge className={getDangerBadgeClass(criminal.dangerLevel)}>
                      {criminal.dangerLevel.toUpperCase()}
                    </Badge>
                    <Badge className={getStatusBadgeClass(criminal.status)}>
                      {criminal.status.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 z-20 p-4">
                    <h2 className="text-xl font-bold text-white">{criminal.name}</h2>
                    <div className="flex items-center text-white/80 text-sm">
                      <MapPin size={14} className="mr-1" />
                      <span>Last seen: {criminal.lastSeen}</span>
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Wanted For</h3>
                    <div className="flex items-center text-green-500">
                      <DollarSign size={14} className="mr-0.5" />
                      <span>{formatCurrency(criminal.reward)}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {criminal.crimes.slice(0, 2).map((crime, index) => (
                      <Badge key={index} variant="outline" className="bg-muted/50">
                        {crime}
                      </Badge>
                    ))}
                    {criminal.crimes.length > 2 && (
                      <Badge variant="outline" className="bg-muted/50">
                        +{criminal.crimes.length - 2} more
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {criminal.description}
                  </p>
                  <div className="mt-2 text-xs text-muted-foreground flex items-center">
                    <Calendar size={12} className="mr-1" />
                    Added: {formatDate(criminal.dateAdded)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="list" className="animate-fade-in">
          <Card className="glass-card overflow-hidden">
            <CardContent className="p-0">
              <div className="divide-y divide-border/30">
                {filteredCriminals.map((criminal) => (
                  <div 
                    key={criminal.id} 
                    className="flex items-center gap-4 p-4 hover:bg-primary/5 cursor-pointer transition-colors"
                    onClick={() => setSelectedCriminal(criminal)}
                  >
                    <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-muted flex-shrink-0">
                      <img 
                        src={criminal.image} 
                        alt={criminal.name} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium">{criminal.name}</h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin size={12} className="mr-1" />
                        <span>{criminal.lastSeen}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {criminal.crimes.slice(0, 1).map((crime, index) => (
                          <Badge key={index} variant="outline" className="text-xs bg-muted/50">
                            {crime}
                          </Badge>
                        ))}
                        {criminal.crimes.length > 1 && (
                          <Badge variant="outline" className="text-xs bg-muted/50">
                            +{criminal.crimes.length - 1} more
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 flex items-center">
                        <Calendar size={10} className="mr-1" />
                        Added: {formatDate(criminal.dateAdded)}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={getDangerBadgeClass(criminal.dangerLevel)}>
                        {criminal.dangerLevel.toUpperCase()}
                      </Badge>
                      <div className="flex items-center text-green-500 text-sm">
                        <DollarSign size={12} className="mr-0.5" />
                        <span>{formatCurrency(criminal.reward)}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {criminal.caseNumber}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {selectedCriminal && renderDetailedView()}
    </div>
  );
};

export default MostWanted;
