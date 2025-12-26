import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Package,
  Trash2,
  MapPin,
  Calendar,
  FileText,
  Camera,
  Fingerprint,
  Shield,
  Lock,
  Eye,
  ChevronDown,
  Filter
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

interface Evidence {
  id: string;
  description: string;
  storage_location: string;
  type: string;
  status: 'secured' | 'processing' | 'released';
  case_id: string | null;
  created_at: string;
  image?: string;
}

const mockEvidence: Evidence[] = [
  {
    id: 'EV-2023-001',
    description: 'Latent fingerprints recovered from window frame',
    storage_location: 'Vault A-101',
    type: 'Biometric',
    status: 'secured',
    case_id: 'FBI-2023-045789',
    created_at: '2023-12-15T10:30:00Z',
    image: 'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?q=80&w=400&h=300&fit=crop',
  },
  {
    id: 'EV-2023-002',
    description: 'CCTV surveillance footage - Bank robbery',
    storage_location: 'Digital Archive D-05',
    type: 'Digital',
    status: 'processing',
    case_id: 'FBI-2023-045789',
    created_at: '2023-12-14T14:20:00Z',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=400&h=300&fit=crop',
  },
  {
    id: 'EV-2023-003',
    description: 'Recovered firearm - 9mm Glock',
    storage_location: 'Weapons Locker W-12',
    type: 'Physical',
    status: 'secured',
    case_id: 'FBI-2023-068912',
    created_at: '2023-12-13T09:15:00Z',
    image: 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?q=80&w=400&h=300&fit=crop',
  },
  {
    id: 'EV-2023-004',
    description: 'DNA samples from crime scene',
    storage_location: 'Biohazard Lab B-03',
    type: 'Biological',
    status: 'processing',
    case_id: 'FBI-2023-034567',
    created_at: '2023-12-12T16:45:00Z',
    image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=400&h=300&fit=crop',
  },
  {
    id: 'EV-2023-005',
    description: 'Forged identification documents',
    storage_location: 'Document Storage C-08',
    type: 'Document',
    status: 'secured',
    case_id: 'FBI-2023-023456',
    created_at: '2023-12-11T11:00:00Z',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=400&h=300&fit=crop',
  },
  {
    id: 'EV-2023-006',
    description: 'Encrypted hard drive - Financial records',
    storage_location: 'Cyber Lab CY-02',
    type: 'Digital',
    status: 'processing',
    case_id: 'FBI-2023-023456',
    created_at: '2023-12-10T08:30:00Z',
    image: 'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?q=80&w=400&h=300&fit=crop',
  },
];

const Evidence: React.FC = () => {
  const [evidenceItems, setEvidenceItems] = useState<Evidence[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEvidence, setNewEvidence] = useState({ description: '', storage_location: '', type: 'Physical' });

  useEffect(() => {
    const stored = localStorage.getItem('evidence');
    if (stored) {
      setEvidenceItems(JSON.parse(stored));
    } else {
      setEvidenceItems(mockEvidence);
      localStorage.setItem('evidence', JSON.stringify(mockEvidence));
    }
    setLoading(false);
  }, []);

  const handleDelete = (id: string) => {
    const updated = evidenceItems.filter(e => e.id !== id);
    setEvidenceItems(updated);
    localStorage.setItem('evidence', JSON.stringify(updated));
    toast.success('Evidence record deleted');
  };

  const handleAddEvidence = () => {
    const newItem: Evidence = {
      id: `EV-${Date.now()}`,
      description: newEvidence.description,
      storage_location: newEvidence.storage_location,
      type: newEvidence.type,
      status: 'processing',
      case_id: null,
      created_at: new Date().toISOString(),
    };
    const updated = [newItem, ...evidenceItems];
    setEvidenceItems(updated);
    localStorage.setItem('evidence', JSON.stringify(updated));
    toast.success('Evidence logged successfully', { description: `ID: ${newItem.id}` });
    setIsDialogOpen(false);
    setNewEvidence({ description: '', storage_location: '', type: 'Physical' });
  };

  const filteredEvidence = evidenceItems.filter(item => {
    const matchesSearch = item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.storage_location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = {
    total: evidenceItems.length,
    secured: evidenceItems.filter(e => e.status === 'secured').length,
    processing: evidenceItems.filter(e => e.status === 'processing').length,
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      secured: 'badge-success',
      processing: 'badge-warning',
      released: 'badge-primary',
    };
    return styles[status] || 'badge-primary';
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      Biometric: <Fingerprint className="h-4 w-4" />,
      Digital: <Camera className="h-4 w-4" />,
      Physical: <Package className="h-4 w-4" />,
      Document: <FileText className="h-4 w-4" />,
      Biological: <Shield className="h-4 w-4" />,
    };
    return icons[type] || <Package className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="fbi-header">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-foreground">Evidence Vault</h1>
                <span className="classified-badge">SECURE</span>
              </div>
              <p className="text-sm text-muted-foreground">Chain of Custody Management System</p>
            </div>
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-pro">
              <Plus className="h-4 w-4 mr-2" />
              Log Evidence
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log New Evidence</DialogTitle>
              <DialogDescription>Enter evidence details for chain of custody.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>Description</Label>
                <Input
                  value={newEvidence.description}
                  onChange={(e) => setNewEvidence({ ...newEvidence, description: e.target.value })}
                  placeholder="Describe the evidence..."
                />
              </div>
              <div>
                <Label>Storage Location</Label>
                <Input
                  value={newEvidence.storage_location}
                  onChange={(e) => setNewEvidence({ ...newEvidence, storage_location: e.target.value })}
                  placeholder="e.g., Vault A-101"
                />
              </div>
              <div>
                <Label>Type</Label>
                <select
                  className="input-pro w-full"
                  value={newEvidence.type}
                  onChange={(e) => setNewEvidence({ ...newEvidence, type: e.target.value })}
                >
                  <option value="Physical">Physical</option>
                  <option value="Digital">Digital</option>
                  <option value="Biometric">Biometric</option>
                  <option value="Document">Document</option>
                  <option value="Biological">Biological</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddEvidence} className="btn-pro">Log Evidence</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card-modern stat-card p-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Evidence</p>
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="card-modern stat-card p-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Lock className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Secured</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.secured}</p>
            </div>
          </div>
        </div>
        <div className="card-modern stat-card p-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Eye className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Processing</p>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.processing}</p>
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
              placeholder="Search by description, location, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <select
              className="input-pro h-10"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="Physical">Physical</option>
              <option value="Digital">Digital</option>
              <option value="Biometric">Biometric</option>
              <option value="Document">Document</option>
              <option value="Biological">Biological</option>
            </select>
            <select
              className="input-pro h-10"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="secured">Secured</option>
              <option value="processing">Processing</option>
              <option value="released">Released</option>
            </select>
          </div>
        </div>
      </div>

      {/* Evidence Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filteredEvidence.length === 0 ? (
        <div className="card-modern p-12 text-center">
          <Package className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-muted-foreground">No evidence found matching your criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvidence.map((item) => (
            <div key={item.id} className="group card-modern overflow-hidden hover:shadow-xl transition-all duration-300">
              {/* Image */}
              {item.image && (
                <div className="h-36 overflow-hidden relative">
                  <img
                    src={item.image}
                    alt={item.description}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
                  <div className="absolute bottom-2 left-2">
                    <span className={`badge ${getStatusBadge(item.status)} capitalize`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-mono text-primary">{item.id}</span>
                    <h3 className="font-medium text-foreground line-clamp-2 mt-0.5">{item.description}</h3>
                  </div>
                  <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    {getTypeIcon(item.type)}
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{item.storage_location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{new Date(item.created_at).toLocaleDateString()}</span>
                  </div>
                  {item.case_id && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <FileText className="h-3.5 w-3.5" />
                      <span className="font-mono text-xs">{item.case_id}</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between">
                  <span className="badge badge-primary">{item.type}</span>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Evidence Record</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently remove evidence {item.id} from the system. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={() => handleDelete(item.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="card-modern p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredEvidence.length} of {evidenceItems.length} evidence items
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Lock className="h-3.5 w-3.5" />
            All evidence access is logged and monitored
          </div>
        </div>
      </div>
    </div>
  );
};

export default Evidence;
