import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Search,
  Plus,
  Trash2,
  Eye,
  Calendar,
  Badge,
  MapPin,
  Phone,
  Star,
  Lock,
  ChevronDown,
  Award,
  Users
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Officer {
  id: string;
  name: string;
  rank: string;
  badge_number: string;
  department: string;
  status: 'active' | 'on-leave' | 'undercover';
  clearance: string;
  cases_solved: number;
  years_service: number;
  created_at: string;
  image?: string;
}

const mockOfficers: Officer[] = [
  {
    id: 'SA-7842-DC',
    name: 'Alice Johnson',
    rank: 'Special Agent',
    badge_number: 'SA-7842-DC',
    department: 'Criminal Investigation',
    status: 'active',
    clearance: 'TOP SECRET',
    cases_solved: 47,
    years_service: 8,
    created_at: '2016-03-15T00:00:00Z',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&h=400&fit=facearea&facepad=2&auto=format',
  },
  {
    id: 'SA-6521-NY',
    name: 'Robert Chen',
    rank: 'Supervisory Special Agent',
    badge_number: 'SA-6521-NY',
    department: 'Cyber Division',
    status: 'active',
    clearance: 'TOP SECRET/SCI',
    cases_solved: 82,
    years_service: 12,
    created_at: '2012-06-20T00:00:00Z',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&h=400&fit=facearea&facepad=2&auto=format',
  },
  {
    id: 'SA-4193-LA',
    name: 'Maria Lopez',
    rank: 'Special Agent',
    badge_number: 'SA-4193-LA',
    department: 'Counterterrorism',
    status: 'undercover',
    clearance: 'TOP SECRET',
    cases_solved: 31,
    years_service: 5,
    created_at: '2019-09-10T00:00:00Z',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&h=400&fit=facearea&facepad=2&auto=format',
  },
  {
    id: 'SA-8274-MI',
    name: 'James Wilson',
    rank: 'Assistant Special Agent in Charge',
    badge_number: 'SA-8274-MI',
    department: 'Organized Crime',
    status: 'active',
    clearance: 'TOP SECRET/SCI',
    cases_solved: 124,
    years_service: 18,
    created_at: '2006-01-05T00:00:00Z',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&h=400&fit=facearea&facepad=2&auto=format',
  },
  {
    id: 'SA-3847-TX',
    name: 'Sarah Martinez',
    rank: 'Special Agent',
    badge_number: 'SA-3847-TX',
    department: 'Intelligence',
    status: 'on-leave',
    clearance: 'SECRET',
    cases_solved: 22,
    years_service: 3,
    created_at: '2021-04-18T00:00:00Z',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&h=400&fit=facearea&facepad=2&auto=format',
  },
];

const Officers: React.FC = () => {
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedOfficer, setSelectedOfficer] = useState<Officer | null>(null);

  useEffect(() => {
    // Clear old data format and use new mock data with all required fields
    const stored = localStorage.getItem('officers');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Check if data has new required fields - if not, replace with fresh mock data
        if (parsed.length > 0 && !parsed[0].clearance) {
          setOfficers(mockOfficers);
          localStorage.setItem('officers', JSON.stringify(mockOfficers));
        } else {
          // Add default values to any records missing new fields
          const enhanced = parsed.map((o: any) => ({
            ...o,
            status: o.status || 'active',
            clearance: o.clearance || 'SECRET',
            cases_solved: o.cases_solved || 0,
            years_service: o.years_service || 1,
            department: o.department || 'General',
          }));
          setOfficers(enhanced);
        }
      } catch {
        setOfficers(mockOfficers);
        localStorage.setItem('officers', JSON.stringify(mockOfficers));
      }
    } else {
      setOfficers(mockOfficers);
      localStorage.setItem('officers', JSON.stringify(mockOfficers));
    }
    setLoading(false);
  }, []);

  const handleDelete = (id: string) => {
    const updated = officers.filter(o => o.id !== id);
    setOfficers(updated);
    localStorage.setItem('officers', JSON.stringify(updated));
    toast.success('Officer record removed');
  };

  const filteredOfficers = officers.filter(o => {
    const matchesSearch = o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.badge_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = departmentFilter === 'all' || o.department === departmentFilter;
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const stats = {
    total: officers.length,
    active: officers.filter(o => o.status === 'active').length,
    undercover: officers.filter(o => o.status === 'undercover').length,
    onLeave: officers.filter(o => o.status === 'on-leave').length,
  };

  const departments = [...new Set(officers.map(o => o.department))];

  const getStatusBadge = (status: string) => {
    const config: Record<string, { class: string; label: string }> = {
      active: { class: 'badge-success', label: 'Active Duty' },
      undercover: { class: 'badge-warning', label: 'Undercover' },
      'on-leave': { class: 'badge-muted', label: 'On Leave' },
    };
    return config[status] || config.active;
  };

  const getClearanceBadge = (level: string | undefined) => {
    if (!level) return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30';
    if (level.includes('SCI')) return 'bg-red-500/10 text-red-500 border-red-500/30';
    if (level.includes('TOP SECRET')) return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30';
    return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="fbi-header">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-foreground">Agent Directory</h1>
                <span className="classified-badge">PERSONNEL</span>
              </div>
              <p className="text-sm text-muted-foreground">FBI Special Agents & Field Personnel</p>
            </div>
          </div>
        </div>

        <Button className="btn-pro">
          <Plus className="h-4 w-4 mr-2" />
          Add Agent
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card-modern stat-card p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase">Total Agents</p>
              <p className="text-xl font-bold text-foreground">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="card-modern stat-card p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-green-500" />
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
              <Eye className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase">Undercover</p>
              <p className="text-xl font-bold text-amber-600 dark:text-amber-400">{stats.undercover}</p>
            </div>
          </div>
        </div>
        <div className="card-modern stat-card p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-slate-500/10 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-slate-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase">On Leave</p>
              <p className="text-xl font-bold text-slate-600 dark:text-slate-400">{stats.onLeave}</p>
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
              placeholder="Search by name, badge number, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <select
              className="input-pro h-10"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <select
              className="input-pro h-10"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="undercover">Undercover</option>
              <option value="on-leave">On Leave</option>
            </select>
          </div>
        </div>
      </div>

      {/* Officers Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filteredOfficers.length === 0 ? (
        <div className="card-modern p-12 text-center">
          <Shield className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-muted-foreground">No agents found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOfficers.map((officer) => {
            const statusConfig = getStatusBadge(officer.status);
            return (
              <div key={officer.id} className="group card-modern overflow-hidden hover:shadow-xl transition-all duration-300">
                {/* Header with photo */}
                <div className="relative h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent">
                  <div className="absolute -bottom-10 left-4">
                    <div className="h-20 w-20 rounded-xl overflow-hidden border-4 border-card shadow-lg">
                      {officer.image ? (
                        <img src={officer.image} alt={officer.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="h-full w-full bg-primary/10 flex items-center justify-center">
                          <Shield className="h-8 w-8 text-primary/50" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className={`badge ${statusConfig.class}`}>{statusConfig.label}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="pt-12 pb-4 px-4 space-y-4">
                  <div>
                    <h3 className="font-semibold text-foreground">{officer.name}</h3>
                    <p className="text-sm text-muted-foreground">{officer.rank}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">Badge</p>
                      <p className="font-mono text-foreground">{officer.badge_number}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Division</p>
                      <p className="text-foreground truncate">{officer.department}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getClearanceBadge(officer.clearance)}`}>
                      {officer.clearance}
                    </span>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Award className="h-3.5 w-3.5" />
                      {officer.cases_solved} solved
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-4 py-3 border-t border-border bg-muted/20 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{officer.years_service} years service</span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedOfficer(officer)}>
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
                          <AlertDialogTitle>Remove Agent Record</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will remove {officer.name}'s record from the directory. This action requires HR approval.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={() => handleDelete(officer.id)}>
                            Remove
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

      {/* Officer Detail Modal */}
      {selectedOfficer && (
        <Dialog open={!!selectedOfficer} onOpenChange={() => setSelectedOfficer(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                Agent Profile
                <span className={`badge ${getStatusBadge(selectedOfficer.status).class}`}>
                  {getStatusBadge(selectedOfficer.status).label}
                </span>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-xl overflow-hidden border-2 border-border">
                  {selectedOfficer.image ? (
                    <img src={selectedOfficer.image} alt={selectedOfficer.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="h-full w-full bg-primary/10 flex items-center justify-center">
                      <Shield className="h-8 w-8 text-primary/50" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedOfficer.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedOfficer.rank}</p>
                  <p className="text-xs font-mono text-primary">{selectedOfficer.badge_number}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-muted-foreground">Division</Label>
                  <p className="font-medium">{selectedOfficer.department}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Clearance</Label>
                  <p className={`font-medium ${selectedOfficer.clearance.includes('SCI') ? 'text-red-500' : 'text-amber-500'}`}>
                    {selectedOfficer.clearance}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Cases Solved</Label>
                  <p className="font-medium text-green-600 dark:text-green-400">{selectedOfficer.cases_solved}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Years of Service</Label>
                  <p className="font-medium">{selectedOfficer.years_service}</p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-muted/50 border border-border text-xs text-muted-foreground">
                <Lock className="h-3.5 w-3.5 inline mr-1" />
                Additional personnel information requires Level 4+ access
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Footer */}
      <div className="card-modern p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {filteredOfficers.length} of {officers.length} agents displayed
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Lock className="h-3.5 w-3.5" />
            Personnel information is classified
          </div>
        </div>
      </div>
    </div>
  );
};

export default Officers;
