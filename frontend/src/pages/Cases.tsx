import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Search,
  Plus,
  Filter,
  Clock,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Pencil,
  ChevronDown,
  ChevronUp,
  MapPin,
  Calendar,
  Shield,
  Eye,
  Lock,
  Radio,
  ArrowUpRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
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

interface Case {
  id: number;
  title: string;
  description: string;
  status: 'open' | 'closed' | 'pending';
  priority: 'high' | 'medium' | 'low';
  policeStationId: number;
  createdAt: Date;
  updatedAt: Date;
}

const mockCases: Case[] = [
  { id: 1, title: 'Armed Robbery - Downtown Bank', status: 'open', priority: 'high', description: 'Armed robbery at First National Bank on Main Street with three armed suspects', policeStationId: 1, createdAt: new Date('2023-05-15'), updatedAt: new Date('2023-12-18') },
  { id: 2, title: 'Vehicle Theft - Highland Park', status: 'pending', priority: 'medium', description: 'Luxury vehicle stolen from Highland Park residential area', policeStationId: 2, createdAt: new Date('2023-06-02'), updatedAt: new Date('2023-12-17') },
  { id: 3, title: 'Residential Burglary - Westside', status: 'closed', priority: 'low', description: 'Break-in and theft at residential property in Westside neighborhood', policeStationId: 1, createdAt: new Date('2023-04-10'), updatedAt: new Date('2023-11-29') },
  { id: 4, title: 'Assault - Downtown Bar District', status: 'open', priority: 'high', description: 'Physical assault reported outside The Blue Note Bar', policeStationId: 3, createdAt: new Date('2023-06-10'), updatedAt: new Date('2023-12-15') },
  { id: 5, title: 'Corporate Fraud Investigation', status: 'open', priority: 'high', description: 'Financial irregularities detected at major corporation totaling $2.5M', policeStationId: 4, createdAt: new Date('2023-06-12'), updatedAt: new Date('2023-12-20') },
  { id: 6, title: 'Missing Person - Sarah Mitchell', status: 'pending', priority: 'high', description: '32-year-old female last seen near Central Park on December 10th', policeStationId: 2, createdAt: new Date('2023-12-11'), updatedAt: new Date('2023-12-19') },
  { id: 7, title: 'Cyber Crime - Data Breach', status: 'open', priority: 'high', description: 'Large-scale data breach affecting government contractor systems', policeStationId: 5, createdAt: new Date('2023-12-01'), updatedAt: new Date('2023-12-18') },
  { id: 8, title: 'Drug Trafficking - Port District', status: 'open', priority: 'high', description: 'Suspected drug operation at warehouse district near the port', policeStationId: 1, createdAt: new Date('2023-11-20'), updatedAt: new Date('2023-12-16') },
];

const Cases: React.FC = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'priority'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    const stored = localStorage.getItem('cases');
    if (stored) {
      const parsed = JSON.parse(stored);
      setCases(parsed.map((c: any) => ({
        ...c,
        createdAt: new Date(c.createdAt),
        updatedAt: new Date(c.updatedAt)
      })));
    } else {
      setCases(mockCases);
      localStorage.setItem('cases', JSON.stringify(mockCases));
    }
    setLoading(false);
  }, []);

  const handleDelete = (id: number) => {
    const updated = cases.filter(c => c.id !== id);
    setCases(updated);
    localStorage.setItem('cases', JSON.stringify(updated));
    toast.success('Case deleted successfully');
  };

  const filteredCases = cases
    .filter(c => {
      const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || c.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'date') {
        comparison = a.updatedAt.getTime() - b.updatedAt.getTime();
      } else if (sortBy === 'title') {
        comparison = a.title.localeCompare(b.title);
      } else if (sortBy === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return sortDirection === 'desc' ? -comparison : comparison;
    });

  const stats = {
    total: cases.length,
    open: cases.filter(c => c.status === 'open').length,
    pending: cases.filter(c => c.status === 'pending').length,
    closed: cases.filter(c => c.status === 'closed').length,
    highPriority: cases.filter(c => c.priority === 'high' && c.status !== 'closed').length,
  };

  const StatusBadge: React.FC<{ status: Case['status'] }> = ({ status }) => {
    const config = {
      open: { class: 'badge-primary', icon: AlertCircle, label: 'Open' },
      closed: { class: 'badge-success', icon: CheckCircle2, label: 'Closed' },
      pending: { class: 'badge-warning', icon: Clock, label: 'Pending' },
    };
    const { class: className, icon: Icon, label } = config[status];
    return (
      <span className={`badge ${className} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {label}
      </span>
    );
  };

  const PriorityBadge: React.FC<{ priority: Case['priority'] }> = ({ priority }) => {
    const config = {
      high: 'bg-red-500/10 text-red-500 border border-red-500/30',
      medium: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30',
      low: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/30',
    };
    return (
      <span className={`px-2 py-0.5 rounded text-xs font-medium uppercase ${config[priority]}`}>
        {priority}
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="fbi-header">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-foreground">Case Files</h1>
                <span className="classified-badge">CLASSIFIED</span>
              </div>
              <p className="text-sm text-muted-foreground">FBI Criminal Investigation Database</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20">
            <AlertCircle className="h-3.5 w-3.5 text-red-500" />
            <span className="text-xs text-red-600 dark:text-red-400 font-medium">{stats.highPriority} HIGH PRIORITY</span>
          </div>
          <Button asChild className="btn-pro">
            <Link to="/cases/add">
              <Plus className="h-4 w-4 mr-2" />
              New Case
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card-modern stat-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Cases</p>
              <p className="text-2xl font-bold text-foreground mt-1">{stats.total}</p>
            </div>
            <FileText className="h-8 w-8 text-primary/30" />
          </div>
        </div>
        <div className="card-modern stat-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Active</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{stats.open}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-blue-500/30" />
          </div>
        </div>
        <div className="card-modern stat-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Pending</p>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{stats.pending}</p>
            </div>
            <Clock className="h-8 w-8 text-amber-500/30" />
          </div>
        </div>
        <div className="card-modern stat-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Resolved</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{stats.closed}</p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-500/30" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card-modern p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search cases by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              className="input-pro h-10"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="pending">Pending</option>
              <option value="closed">Closed</option>
            </select>
            <select
              className="input-pro h-10"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="all">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select
              className="input-pro h-10"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="date">Sort by Date</option>
              <option value="title">Sort by Title</option>
              <option value="priority">Sort by Priority</option>
            </select>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSortDirection(d => d === 'asc' ? 'desc' : 'asc')}
              className="h-10 w-10"
            >
              {sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Cases Table */}
      <div className="card-modern overflow-hidden">
        {/* Table Header */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-4 px-6 py-3 bg-muted/30 border-b border-border text-sm font-medium text-muted-foreground">
          <div className="col-span-5">Case Details</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Priority</div>
          <div className="col-span-2">Last Updated</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-border">
          {loading ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-muted rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : filteredCases.length === 0 ? (
            <div className="py-12 text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground">No cases found</p>
              <p className="text-sm text-muted-foreground/60 mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            filteredCases.map((caseItem) => (
              <div
                key={caseItem.id}
                className="group px-6 py-4 hover:bg-muted/30 transition-colors"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                  {/* Case Details */}
                  <div className="col-span-5">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <Link
                          to={`/cases/${caseItem.id}`}
                          className="font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1"
                        >
                          {caseItem.title}
                          <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                        <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">{caseItem.description}</p>
                        <p className="text-xs text-muted-foreground mt-1 font-mono">CASE-{caseItem.id.toString().padStart(6, '0')}</p>
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="col-span-2">
                    <StatusBadge status={caseItem.status} />
                  </div>

                  {/* Priority */}
                  <div className="col-span-2">
                    <PriorityBadge priority={caseItem.priority} />
                  </div>

                  {/* Updated */}
                  <div className="col-span-2 text-sm text-muted-foreground flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {caseItem.updatedAt.toLocaleDateString()}
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 flex gap-1 justify-end">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
                      <Link to={`/cases/${caseItem.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Case File</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently remove case CASE-{caseItem.id.toString().padStart(6, '0')} from the system. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-500 hover:bg-red-600"
                            onClick={() => handleDelete(caseItem.id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {!loading && filteredCases.length > 0 && (
          <div className="px-6 py-3 border-t border-border bg-muted/20 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredCases.length} of {cases.length} cases
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Lock className="h-3.5 w-3.5" />
              Access logged
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cases;
