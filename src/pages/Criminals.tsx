import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  UserSearch,
  Search,
  ChevronDown,
  Plus,
  Trash2,
  Eye,
  Calendar,
  Fingerprint,
  AlertTriangle,
  MapPin,
  Scale,
  Lock,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Criminal {
  id: string;
  first_name: string;
  last_name: string;
  alias?: string;
  date_of_birth: string;
  status: 'incarcerated' | 'wanted' | 'released' | 'deceased';
  threat_level: 'low' | 'medium' | 'high' | 'extreme';
  crimes: string[];
  biometric_data: string;
  last_known_location?: string;
  case_id?: string;
  image?: string;
}

const mockCriminals: Criminal[] = [
  {
    id: 'CRM-2023-001',
    first_name: 'John',
    last_name: 'Doe',
    alias: 'The Ghost',
    date_of_birth: '1985-06-15',
    status: 'wanted',
    threat_level: 'high',
    crimes: ['Armed Robbery', 'Assault'],
    biometric_data: 'Fingerprint + DNA',
    last_known_location: 'Chicago, IL',
    case_id: 'FBI-2023-045789',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&h=400&fit=facearea&facepad=2&auto=format',
  },
  {
    id: 'CRM-2023-002',
    first_name: 'Jane',
    last_name: 'Smith',
    date_of_birth: '1990-02-20',
    status: 'incarcerated',
    threat_level: 'medium',
    crimes: ['Wire Fraud', 'Identity Theft'],
    biometric_data: 'DNA',
    last_known_location: 'Federal Prison - Leavenworth',
    case_id: 'FBI-2023-023456',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&h=400&fit=facearea&facepad=2&auto=format',
  },
  {
    id: 'CRM-2023-003',
    first_name: 'Michael',
    last_name: 'Johnson',
    alias: 'Big Mike',
    date_of_birth: '1978-11-03',
    status: 'wanted',
    threat_level: 'extreme',
    crimes: ['Murder', 'Racketeering', 'Drug Trafficking'],
    biometric_data: 'Fingerprint + DNA + Facial',
    last_known_location: 'Miami, FL',
    case_id: 'FBI-2023-068912',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&h=400&fit=facearea&facepad=2&auto=format',
  },
  {
    id: 'CRM-2023-004',
    first_name: 'Sarah',
    last_name: 'Williams',
    date_of_birth: '1982-03-22',
    status: 'released',
    threat_level: 'low',
    crimes: ['Embezzlement'],
    biometric_data: 'Fingerprint',
    last_known_location: 'Boston, MA',
    case_id: 'FBI-2022-115678',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&h=400&fit=facearea&facepad=2&auto=format',
  },
  {
    id: 'CRM-2023-005',
    first_name: 'Carlos',
    last_name: 'Rivera',
    alias: 'El Fantasma',
    date_of_birth: '1975-08-14',
    status: 'wanted',
    threat_level: 'extreme',
    crimes: ['Kidnapping', 'Extortion', 'Murder'],
    biometric_data: 'Fingerprint + DNA',
    last_known_location: 'Unknown - Last seen Mexico',
    case_id: 'FBI-2023-092345',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&h=400&fit=facearea&facepad=2&auto=format',
  },
];

const Criminals: React.FC = () => {
  const [criminals, setCriminals] = useState<Criminal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [threatFilter, setThreatFilter] = useState<string>('all');
  const [selectedCriminal, setSelectedCriminal] = useState<Criminal | null>(null);

  useEffect(() => {
    // Clear old data format and use new mock data with all required fields
    const stored = localStorage.getItem('criminals');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Check if data has new required fields - if not, replace with fresh mock data
        if (parsed.length > 0 && !parsed[0].threat_level) {
          setCriminals(mockCriminals);
          localStorage.setItem('criminals', JSON.stringify(mockCriminals));
        } else {
          // Add default values to any records missing new fields
          const enhanced = parsed.map((c: any) => ({
            ...c,
            status: c.status || 'wanted',
            threat_level: c.threat_level || 'medium',
            crimes: c.crimes || ['Unknown'],
            biometric_data: c.biometric_data || 'Not Available',
          }));
          setCriminals(enhanced);
        }
      } catch {
        setCriminals(mockCriminals);
        localStorage.setItem('criminals', JSON.stringify(mockCriminals));
      }
    } else {
      setCriminals(mockCriminals);
      localStorage.setItem('criminals', JSON.stringify(mockCriminals));
    }
    setLoading(false);
  }, []);

  const handleDelete = (id: string) => {
    const updated = criminals.filter(c => c.id !== id);
    setCriminals(updated);
    localStorage.setItem('criminals', JSON.stringify(updated));
    toast.success('Criminal record archived');
  };

  const filteredCriminals = criminals.filter(c => {
    const matchesSearch = c.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.alias && c.alias.toLowerCase().includes(searchTerm.toLowerCase())) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesThreat = threatFilter === 'all' || c.threat_level === threatFilter;
    return matchesSearch && matchesStatus && matchesThreat;
  });

  const stats = {
    total: criminals.length,
    wanted: criminals.filter(c => c.status === 'wanted').length,
    incarcerated: criminals.filter(c => c.status === 'incarcerated').length,
    highThreat: criminals.filter(c => c.threat_level === 'extreme' || c.threat_level === 'high').length,
  };

  const calculateAge = (dob: string) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { class: string; label: string }> = {
      wanted: { class: 'bg-red-500/10 text-red-500 border-red-500/30', label: 'WANTED' },
      incarcerated: { class: 'badge-success', label: 'Incarcerated' },
      released: { class: 'badge-muted', label: 'Released' },
      deceased: { class: 'bg-slate-500/10 text-slate-500 border-slate-500/30', label: 'Deceased' },
    };
    return config[status] || config.wanted;
  };

  const getThreatBadge = (level: string) => {
    const config: Record<string, string> = {
      extreme: 'bg-red-600 text-white',
      high: 'bg-orange-500 text-white',
      medium: 'bg-amber-500 text-black',
      low: 'bg-blue-500 text-white',
    };
    return config[level] || config.low;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="fbi-header">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center">
              <UserSearch className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-foreground">Criminal Database</h1>
                <span className="classified-badge">RESTRICTED</span>
              </div>
              <p className="text-sm text-muted-foreground">National Crime Information Center (NCIC)</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 hidden sm:flex items-center gap-2">
            <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
            <span className="text-xs text-red-600 dark:text-red-400 font-medium">{stats.wanted} ACTIVE WARRANTS</span>
          </div>
          <Button asChild className="btn-pro">
            <Link to="/criminals/add">
              <Plus className="h-4 w-4 mr-2" />
              Add Record
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card-modern stat-card p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <UserSearch className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase">Total Records</p>
              <p className="text-xl font-bold text-foreground">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="card-modern stat-card p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase">Wanted</p>
              <p className="text-xl font-bold text-red-600 dark:text-red-400">{stats.wanted}</p>
            </div>
          </div>
        </div>
        <div className="card-modern stat-card p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Lock className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase">Incarcerated</p>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">{stats.incarcerated}</p>
            </div>
          </div>
        </div>
        <div className="card-modern stat-card p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Scale className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase">High Threat</p>
              <p className="text-xl font-bold text-amber-600 dark:text-amber-400">{stats.highThreat}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card-modern p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, alias, or ID..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select
              className="input-pro h-10"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="wanted">Wanted</option>
              <option value="incarcerated">Incarcerated</option>
              <option value="released">Released</option>
            </select>
            <select
              className="input-pro h-10"
              value={threatFilter}
              onChange={(e) => setThreatFilter(e.target.value)}
            >
              <option value="all">All Threat Levels</option>
              <option value="extreme">Extreme</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Criminals Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filteredCriminals.length === 0 ? (
        <div className="card-modern p-12 text-center">
          <UserSearch className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-muted-foreground">No criminals found</p>
          <p className="text-sm text-muted-foreground/60 mt-1">Try adjusting your search criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCriminals.map((criminal) => {
            const statusConfig = getStatusBadge(criminal.status);
            return (
              <div key={criminal.id} className="group card-modern overflow-hidden hover:shadow-xl transition-all duration-300">
                {/* Threat level strip */}
                <div className={`h-1 ${getThreatBadge(criminal.threat_level)}`}></div>

                <div className="p-4 space-y-4">
                  <div className="flex items-start gap-3">
                    {/* Photo */}
                    <div className="h-16 w-16 rounded-lg overflow-hidden flex-shrink-0 border border-border">
                      {criminal.image ? (
                        <img src={criminal.image} alt={`${criminal.first_name} ${criminal.last_name}`} className="w-full h-full object-cover" />
                      ) : (
                        <div className="h-full w-full bg-muted flex items-center justify-center">
                          <UserSearch className="h-8 w-8 text-muted-foreground/50" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {criminal.last_name}, {criminal.first_name}
                          </h3>
                          {criminal.alias && (
                            <p className="text-sm text-muted-foreground italic">"{criminal.alias}"</p>
                          )}
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${statusConfig.class}`}>
                          {statusConfig.label}
                        </span>
                      </div>
                      <p className="text-xs font-mono text-primary mt-1">{criminal.id}</p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Age</span>
                      <span className="font-medium">{calculateAge(criminal.date_of_birth)} years</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Threat Level</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${getThreatBadge(criminal.threat_level)}`}>
                        {criminal.threat_level}
                      </span>
                    </div>
                    {criminal.last_known_location && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="text-xs truncate">{criminal.last_known_location}</span>
                      </div>
                    )}
                  </div>

                  {/* Crimes */}
                  <div className="flex flex-wrap gap-1">
                    {criminal.crimes.slice(0, 3).map((crime, i) => (
                      <span key={i} className="px-2 py-0.5 rounded text-xs bg-muted text-muted-foreground">
                        {crime}
                      </span>
                    ))}
                    {criminal.crimes.length > 3 && (
                      <span className="px-2 py-0.5 rounded text-xs bg-muted text-muted-foreground">
                        +{criminal.crimes.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="px-4 py-3 border-t border-border bg-muted/20 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Fingerprint className="h-3.5 w-3.5" />
                    {criminal.biometric_data}
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedCriminal(criminal)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Archive Criminal Record</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will archive the record for {criminal.first_name} {criminal.last_name} ({criminal.id}). Archive requires supervisor approval.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={() => handleDelete(criminal.id)}>
                            Archive
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Criminal Detail Modal */}
      {selectedCriminal && (
        <Dialog open={!!selectedCriminal} onOpenChange={() => setSelectedCriminal(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                Criminal Record
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getStatusBadge(selectedCriminal.status).class}`}>
                  {getStatusBadge(selectedCriminal.status).label}
                </span>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-lg overflow-hidden border-2 border-border">
                  {selectedCriminal.image ? (
                    <img src={selectedCriminal.image} alt={`${selectedCriminal.first_name} ${selectedCriminal.last_name}`} className="w-full h-full object-cover" />
                  ) : (
                    <div className="h-full w-full bg-muted flex items-center justify-center">
                      <UserSearch className="h-10 w-10 text-muted-foreground/50" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedCriminal.last_name}, {selectedCriminal.first_name}</h3>
                  {selectedCriminal.alias && <p className="text-sm text-muted-foreground italic">"{selectedCriminal.alias}"</p>}
                  <p className="text-xs font-mono text-primary">{selectedCriminal.id}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-muted-foreground">Date of Birth</Label>
                  <p className="font-medium">{new Date(selectedCriminal.date_of_birth).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Age</Label>
                  <p className="font-medium">{calculateAge(selectedCriminal.date_of_birth)} years</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Threat Level</Label>
                  <p className={`font-bold uppercase ${selectedCriminal.threat_level === 'extreme' ? 'text-red-500' : selectedCriminal.threat_level === 'high' ? 'text-orange-500' : 'text-foreground'}`}>
                    {selectedCriminal.threat_level}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Biometric Data</Label>
                  <p className="font-medium">{selectedCriminal.biometric_data}</p>
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground">Criminal Charges</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedCriminal.crimes.map((crime, i) => (
                    <span key={i} className="px-2 py-1 rounded text-sm bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                      {crime}
                    </span>
                  ))}
                </div>
              </div>

              {selectedCriminal.last_known_location && (
                <div>
                  <Label className="text-muted-foreground">Last Known Location</Label>
                  <p className="font-medium flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {selectedCriminal.last_known_location}
                  </p>
                </div>
              )}

              {selectedCriminal.case_id && (
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="text-sm">Associated Case: </span>
                  <span className="font-mono text-primary">{selectedCriminal.case_id}</span>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Footer */}
      <div className="card-modern p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredCriminals.length} of {criminals.length} records
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Lock className="h-3.5 w-3.5" />
            NCIC access logged - Session monitored
          </div>
        </div>
      </div>
    </div>
  );
};

export default Criminals;
