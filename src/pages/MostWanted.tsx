
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { AlertCircle, FileWarning, Skull, DollarSign, Filter, Search, MapPin, Eye, UserCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';

// Mock data for the Most Wanted criminals
const MOST_WANTED_DATA = [
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
  },
];

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
}

const MostWanted: React.FC = () => {
  const [criminals, setCriminals] = useState<MostWantedCriminal[]>(MOST_WANTED_DATA);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'captured'>('all');
  const [dangerFilter, setDangerFilter] = useState<'all' | 'extreme' | 'high' | 'moderate' | 'low'>('all');
  const [selectedCriminal, setSelectedCriminal] = useState<MostWantedCriminal | null>(null);
  
  // Filter the criminals based on search term and filters
  const filteredCriminals = criminals.filter(criminal => {
    const matchesSearch = criminal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         criminal.crimes.some(crime => crime.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         criminal.lastSeen.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || criminal.status === statusFilter;
    const matchesDanger = dangerFilter === 'all' || criminal.dangerLevel === dangerFilter;
    
    return matchesSearch && matchesStatus && matchesDanger;
  });

  // Helper function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Helper to get badge color based on danger level
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

  // Helper to get badge color based on status
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

  // Show detailed view when a criminal is selected
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
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-border rounded-md p-4">
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Case ID</h4>
                    <p className="font-mono text-lg">FBI-{selectedCriminal.id.padStart(6, '0')}</p>
                  </div>
                  <div className="border border-border rounded-md p-4 bg-green-500/5">
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Reward</h4>
                    <p className="font-mono text-lg text-green-500">{formatCurrency(selectedCriminal.reward)}</p>
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
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight inline-flex items-center">
            <span className="animated-text-scan">MOST WANTED</span>
            <span className="ml-3 text-xs bg-red-500/10 py-1 px-3 rounded-md border border-red-500/20 font-mono text-red-500">HIGH PRIORITY</span>
          </h1>
          <p className="text-muted-foreground mt-1">FBI's most dangerous and sought-after fugitives.</p>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, crime, or location..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-muted-foreground" />
            <select 
              className="bg-muted rounded-md py-2 px-3 text-sm focus:outline-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="captured">Captured</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Skull size={16} className="text-muted-foreground" />
            <select 
              className="bg-muted rounded-md py-2 px-3 text-sm focus:outline-none"
              value={dangerFilter}
              onChange={(e) => setDangerFilter(e.target.value as any)}
            >
              <option value="all">All Danger Levels</option>
              <option value="extreme">Extreme</option>
              <option value="high">High</option>
              <option value="moderate">Moderate</option>
              <option value="low">Low</option>
            </select>
          </div>
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
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={getDangerBadgeClass(criminal.dangerLevel)}>
                        {criminal.dangerLevel.toUpperCase()}
                      </Badge>
                      <div className="flex items-center text-green-500 text-sm">
                        <DollarSign size={12} className="mr-0.5" />
                        <span>{formatCurrency(criminal.reward)}</span>
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
