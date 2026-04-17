import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Plus,
  Trash2,
  Eye,
  Calendar,
  FileText,
  MessageSquare,
  Phone,
  MapPin,
  Shield,
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Witness {
  id: string;
  name: string;
  statement: string;
  description: string | null;
  status: 'available' | 'protected' | 'relocated';
  case_id: string | null;
  created_at: string;
  image?: string;
  contact?: string;
  location?: string;
}

const mockWitnesses: Witness[] = [
  {
    id: 'WIT-001',
    name: 'Sarah Lee',
    statement: 'Witnessed the suspect fleeing from the scene on foot, heading east on Main Street. Subject was wearing dark clothing and carrying a duffel bag.',
    description: 'Store owner - First National Bank adjacent business',
    status: 'available',
    case_id: 'FBI-2023-045789',
    created_at: '2023-12-15T10:30:00Z',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&h=400&fit=facearea&facepad=2&auto=format',
    contact: '(555) 123-4567',
    location: 'Chicago, IL',
  },
  {
    id: 'WIT-002',
    name: 'Thomas Brown',
    statement: 'Heard loud noises at approximately midnight. Observed a dark sedan leaving the area at high speed without headlights.',
    description: 'Neighbor - Residential witness',
    status: 'protected',
    case_id: 'FBI-2023-034567',
    created_at: '2023-12-14T14:20:00Z',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&h=400&fit=facearea&facepad=2&auto=format',
    contact: '(555) 234-5678',
    location: 'Miami, FL',
  },
  {
    id: 'WIT-003',
    name: 'Priya Singh',
    statement: 'Noticed a suspicious vehicle parked near the warehouse for approximately 2 hours. Took photo of license plate before leaving.',
    description: 'Delivery driver - Was in area for routine delivery',
    status: 'available',
    case_id: 'FBI-2023-068912',
    created_at: '2023-12-13T09:15:00Z',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&h=400&fit=facearea&facepad=2&auto=format',
    contact: '(555) 345-6789',
    location: 'Seattle, WA',
  },
  {
    id: 'WIT-004',
    name: 'Marcus Johnson',
    statement: 'Identified suspect from photo lineup. Met subject at a coffee shop three days prior to incident where subject discussed financial troubles.',
    description: 'Acquaintance of suspect',
    status: 'relocated',
    case_id: 'FBI-2023-023456',
    created_at: '2023-12-12T16:45:00Z',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&h=400&fit=facearea&facepad=2&auto=format',
    contact: 'PROTECTED',
    location: 'CLASSIFIED',
  },
];

const Witnesses: React.FC = () => {
  const [witnesses, setWitnesses] = useState<Witness[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedWitness, setSelectedWitness] = useState<Witness | null>(null);
  const [newWitness, setNewWitness] = useState({ name: '', statement: '', description: '' });

  useEffect(() => {
    const stored = localStorage.getItem('witnesses');
    if (stored) {
      setWitnesses(JSON.parse(stored));
    } else {
      setWitnesses(mockWitnesses);
      localStorage.setItem('witnesses', JSON.stringify(mockWitnesses));
    }
    setLoading(false);
  }, []);

  const handleDelete = (id: string) => {
    const updated = witnesses.filter(w => w.id !== id);
    setWitnesses(updated);
    localStorage.setItem('witnesses', JSON.stringify(updated));
    toast.success('Witness record removed');
  };

  const handleAddWitness = () => {
    const newItem: Witness = {
      id: `WIT-${Date.now().toString().slice(-6)}`,
      name: newWitness.name,
      statement: newWitness.statement,
      description: newWitness.description || null,
      status: 'available',
      case_id: null,
      created_at: new Date().toISOString(),
    };
    const updated = [newItem, ...witnesses];
    setWitnesses(updated);
    localStorage.setItem('witnesses', JSON.stringify(updated));
    toast.success('Witness added to database', { description: `ID: ${newItem.id}` });
    setIsDialogOpen(false);
    setNewWitness({ name: '', statement: '', description: '' });
  };

  const filteredWitnesses = witnesses.filter(w => {
    const matchesSearch = w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.statement.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || w.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: witnesses.length,
    available: witnesses.filter(w => w.status === 'available').length,
    protected: witnesses.filter(w => w.status === 'protected').length,
    relocated: witnesses.filter(w => w.status === 'relocated').length,
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { class: string; label: string }> = {
      available: { class: 'badge-success', label: 'Available' },
      protected: { class: 'badge-warning', label: 'Under Protection' },
      relocated: { class: 'badge-danger', label: 'Relocated' },
    };
    return config[status] || config.available;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="fbi-header">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-foreground">Witness Database</h1>
                <span className="classified-badge">PROTECTED</span>
              </div>
              <p className="text-sm text-muted-foreground">Witness Protection & Statement Management</p>
            </div>
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-pro">
              <Plus className="h-4 w-4 mr-2" />
              Add Witness
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Register New Witness</DialogTitle>
              <DialogDescription>Add a new witness to the protected database.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>Full Name</Label>
                <Input
                  value={newWitness.name}
                  onChange={(e) => setNewWitness({ ...newWitness, name: e.target.value })}
                  placeholder="Enter witness full name"
                />
              </div>
              <div>
                <Label>Description/Role</Label>
                <Input
                  value={newWitness.description}
                  onChange={(e) => setNewWitness({ ...newWitness, description: e.target.value })}
                  placeholder="e.g., Store owner, Neighbor"
                />
              </div>
              <div>
                <Label>Statement</Label>
                <Textarea
                  value={newWitness.statement}
                  onChange={(e) => setNewWitness({ ...newWitness, statement: e.target.value })}
                  placeholder="Enter witness statement..."
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddWitness} className="btn-pro">Add Witness</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card-modern stat-card p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase">Total</p>
              <p className="text-xl font-bold text-foreground">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="card-modern stat-card p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Eye className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase">Available</p>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">{stats.available}</p>
            </div>
          </div>
        </div>
        <div className="card-modern stat-card p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase">Protected</p>
              <p className="text-xl font-bold text-amber-600 dark:text-amber-400">{stats.protected}</p>
            </div>
          </div>
        </div>
        <div className="card-modern stat-card p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center">
              <Lock className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase">Relocated</p>
              <p className="text-xl font-bold text-red-600 dark:text-red-400">{stats.relocated}</p>
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
              placeholder="Search by name or statement..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <select
            className="input-pro h-10"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="protected">Under Protection</option>
            <option value="relocated">Relocated</option>
          </select>
        </div>
      </div>

      {/* Witnesses Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-48 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filteredWitnesses.length === 0 ? (
        <div className="card-modern p-12 text-center">
          <Users className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-muted-foreground">No witnesses found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredWitnesses.map((witness) => {
            const statusConfig = getStatusBadge(witness.status);
            return (
              <div key={witness.id} className="group card-modern overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="h-14 w-14 rounded-full overflow-hidden flex-shrink-0 border-2 border-border">
                      {witness.image ? (
                        <img src={witness.image} alt={witness.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="h-full w-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-6 w-6 text-primary/50" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-foreground">{witness.name}</h3>
                          <p className="text-sm text-muted-foreground">{witness.description}</p>
                        </div>
                        <span className={`badge ${statusConfig.class}`}>{statusConfig.label}</span>
                      </div>

                      <p className="text-xs font-mono text-primary mt-1">{witness.id}</p>
                    </div>
                  </div>

                  {/* Statement */}
                  <div className="mt-4 p-3 rounded-lg bg-muted/50 border border-border">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                      <MessageSquare className="h-3 w-3" />
                      Statement
                    </div>
                    <p className="text-sm text-foreground line-clamp-2">{witness.statement}</p>
                  </div>

                  {/* Details */}
                  <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted-foreground">
                    {witness.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {witness.location}
                      </div>
                    )}
                    {witness.case_id && (
                      <div className="flex items-center gap-1 font-mono text-xs">
                        <FileText className="h-3.5 w-3.5" />
                        {witness.case_id}
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(witness.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-5 py-3 border-t border-border bg-muted/20 flex items-center justify-between">
                  <Button variant="ghost" size="sm" onClick={() => setSelectedWitness(witness)}>
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remove Witness Record</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will remove {witness.name} ({witness.id}) from the database. This action requires supervisor approval.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={() => handleDelete(witness.id)}>
                          Remove
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Witness Detail Modal */}
      {selectedWitness && (
        <Dialog open={!!selectedWitness} onOpenChange={() => setSelectedWitness(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                Witness Details
                <span className={`badge ${getStatusBadge(selectedWitness.status).class}`}>
                  {getStatusBadge(selectedWitness.status).label}
                </span>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-border">
                  {selectedWitness.image ? (
                    <img src={selectedWitness.image} alt={selectedWitness.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="h-full w-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-8 w-8 text-primary/50" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedWitness.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedWitness.description}</p>
                  <p className="text-xs font-mono text-primary">{selectedWitness.id}</p>
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground">Full Statement</Label>
                <p className="mt-1 p-3 rounded-lg bg-muted/50 border border-border text-sm">
                  {selectedWitness.statement}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-muted-foreground">Location</Label>
                  <p className="font-medium">{selectedWitness.location || 'Not specified'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Contact</Label>
                  <p className="font-medium">{selectedWitness.contact || 'Not available'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Case ID</Label>
                  <p className="font-mono text-primary">{selectedWitness.case_id || 'Unassigned'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Added</Label>
                  <p>{new Date(selectedWitness.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Footer */}
      <div className="card-modern p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {filteredWitnesses.length} of {witnesses.length} witnesses displayed
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-3.5 w-3.5" />
            Witness identity information is protected under federal law
          </div>
        </div>
      </div>
    </div>
  );
};

export default Witnesses;
