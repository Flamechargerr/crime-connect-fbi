import React, { useState, useEffect } from 'react';
import {
  Scale,
  Search,
  Plus,
  Trash2,
  Eye,
  MapPin,
  User,
  Calendar,
  Building,
  Lock,
  ChevronDown
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
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Court {
  id: string;
  name: string;
  judge_name: string;
  location: string;
  jurisdiction: 'Criminal' | 'Civil' | 'Appeals' | 'Federal';
  status: 'active' | 'recess' | 'closed';
  cases_pending: number;
  next_session?: string;
  created_at: string;
}

const mockCourts: Court[] = [
  {
    id: 'FDC-001',
    name: 'Federal District Court - Central',
    judge_name: 'Hon. Robert Williams',
    location: '450 Golden Gate Ave, San Francisco, CA',
    jurisdiction: 'Federal',
    status: 'active',
    cases_pending: 47,
    next_session: '2025-01-02 09:00',
    created_at: '2023-01-01'
  },
  {
    id: 'SCR-002',
    name: 'Superior Court of California',
    judge_name: 'Hon. Mary Chen',
    location: '123 Main Street, Oakland, CA',
    jurisdiction: 'Criminal',
    status: 'active',
    cases_pending: 32,
    next_session: '2025-01-03 10:00',
    created_at: '2023-02-15'
  },
  {
    id: 'APD-003',
    name: 'Ninth Circuit Court of Appeals',
    judge_name: 'Hon. James Parker',
    location: '95 Seventh Street, San Francisco, CA',
    jurisdiction: 'Appeals',
    status: 'recess',
    cases_pending: 18,
    next_session: '2025-01-15 14:00',
    created_at: '2023-03-20'
  },
  {
    id: 'CIV-004',
    name: 'Civil Division - Eastern District',
    judge_name: 'Hon. Patricia Johnson',
    location: '501 I Street, Sacramento, CA',
    jurisdiction: 'Civil',
    status: 'active',
    cases_pending: 56,
    next_session: '2025-01-02 11:00',
    created_at: '2023-04-10'
  },
];

const Courts: React.FC = () => {
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [jurisdictionFilter, setJurisdictionFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('courts');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Check for new data format
        if (parsed.length > 0 && !parsed[0].cases_pending) {
          setCourts(mockCourts);
          localStorage.setItem('courts', JSON.stringify(mockCourts));
        } else {
          setCourts(parsed);
        }
      } catch {
        setCourts(mockCourts);
        localStorage.setItem('courts', JSON.stringify(mockCourts));
      }
    } else {
      setCourts(mockCourts);
      localStorage.setItem('courts', JSON.stringify(mockCourts));
    }
    setLoading(false);
  }, []);

  const handleDelete = (id: string) => {
    const updated = courts.filter(c => c.id !== id);
    setCourts(updated);
    localStorage.setItem('courts', JSON.stringify(updated));
    toast.success('Court record archived');
  };

  const filteredCourts = courts.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.judge_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesJurisdiction = jurisdictionFilter === 'all' || c.jurisdiction === jurisdictionFilter;
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesJurisdiction && matchesStatus;
  });

  const stats = {
    total: courts.length,
    active: courts.filter(c => c.status === 'active').length,
    pending: courts.reduce((sum, c) => sum + c.cases_pending, 0),
    federal: courts.filter(c => c.jurisdiction === 'Federal').length,
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { class: string; label: string }> = {
      active: { class: 'badge-success', label: 'In Session' },
      recess: { class: 'badge-warning', label: 'Recess' },
      closed: { class: 'badge-muted', label: 'Closed' },
    };
    return config[status] || config.active;
  };

  const getJurisdictionBadge = (jurisdiction: string) => {
    const config: Record<string, string> = {
      Federal: 'bg-primary/10 text-primary border-primary/30',
      Criminal: 'bg-red-500/10 text-red-500 border-red-500/30',
      Civil: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
      Appeals: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
    };
    return config[jurisdiction] || config.Civil;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="fbi-header">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Scale className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-foreground">Federal Court System</h1>
                <span className="classified-badge">JUDICIAL</span>
              </div>
              <p className="text-sm text-muted-foreground">Court registries and case scheduling</p>
            </div>
          </div>
        </div>

        <Button className="btn-pro">
          <Plus className="h-4 w-4 mr-2" />
          Add Court
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card-modern stat-card p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Building className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase">Total Courts</p>
              <p className="text-xl font-bold text-foreground">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="card-modern stat-card p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Scale className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase">Active</p>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">{stats.active}</p>
            </div>
          </div>
        </div>
        <div className="card-modern stat-card p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase">Cases Pending</p>
              <p className="text-xl font-bold text-amber-600 dark:text-amber-400">{stats.pending}</p>
            </div>
          </div>
        </div>
        <div className="card-modern stat-card p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Lock className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase">Federal</p>
              <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{stats.federal}</p>
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
              placeholder="Search courts, judges, or locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <select
              className="input-pro h-10"
              value={jurisdictionFilter}
              onChange={(e) => setJurisdictionFilter(e.target.value)}
            >
              <option value="all">All Jurisdictions</option>
              <option value="Federal">Federal</option>
              <option value="Criminal">Criminal</option>
              <option value="Civil">Civil</option>
              <option value="Appeals">Appeals</option>
            </select>
            <select
              className="input-pro h-10"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">In Session</option>
              <option value="recess">Recess</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Courts Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-48 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filteredCourts.length === 0 ? (
        <div className="card-modern p-12 text-center">
          <Scale className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-muted-foreground">No courts found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCourts.map((court) => {
            const statusConfig = getStatusBadge(court.status);
            return (
              <div key={court.id} className="group card-modern overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Scale className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{court.name}</h3>
                        <p className="text-xs font-mono text-primary">{court.id}</p>
                      </div>
                    </div>
                    <span className={`badge ${statusConfig.class}`}>{statusConfig.label}</span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>{court.judge_name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="truncate">{court.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase border ${getJurisdictionBadge(court.jurisdiction)}`}>
                      {court.jurisdiction}
                    </span>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Pending: </span>
                      <span className="font-bold text-foreground">{court.cases_pending}</span>
                    </div>
                  </div>

                  {court.next_session && (
                    <div className="pt-3 border-t border-border">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Next Session: <span className="text-foreground">{new Date(court.next_session).toLocaleString()}</span></span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="px-5 py-3 border-t border-border bg-muted/20 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Est. {new Date(court.created_at).getFullYear()}</span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedCourt(court)}>
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
                          <AlertDialogTitle>Archive Court Record</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will archive {court.name} from the registry. This action requires administrative approval.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={() => handleDelete(court.id)}>
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

      {/* Court Detail Modal */}
      {selectedCourt && (
        <Dialog open={!!selectedCourt} onOpenChange={() => setSelectedCourt(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                Court Details
                <span className={`badge ${getStatusBadge(selectedCourt.status).class}`}>
                  {getStatusBadge(selectedCourt.status).label}
                </span>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Scale className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedCourt.name}</h3>
                  <p className="text-xs font-mono text-primary">{selectedCourt.id}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-muted-foreground">Presiding Judge</Label>
                  <p className="font-medium">{selectedCourt.judge_name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Jurisdiction</Label>
                  <p className="font-medium">{selectedCourt.jurisdiction}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-muted-foreground">Location</Label>
                  <p className="font-medium">{selectedCourt.location}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Cases Pending</Label>
                  <p className="font-bold text-primary text-lg">{selectedCourt.cases_pending}</p>
                </div>
                {selectedCourt.next_session && (
                  <div>
                    <Label className="text-muted-foreground">Next Session</Label>
                    <p className="font-medium">{new Date(selectedCourt.next_session).toLocaleString()}</p>
                  </div>
                )}
              </div>

              <div className="p-3 rounded-lg bg-muted/50 border border-border text-xs text-muted-foreground">
                <Lock className="h-3.5 w-3.5 inline mr-1" />
                Court schedules require clerk authorization to modify
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Footer */}
      <div className="card-modern p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {filteredCourts.length} of {courts.length} courts displayed
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Lock className="h-3.5 w-3.5" />
            Federal Court System access logged
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courts;
