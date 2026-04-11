import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Search,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Trash2,
  ChevronDown,
  ChevronUp,
  Calendar,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { api, extractApiError } from '@/lib/api';
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
} from '@/components/ui/alert-dialog';

type CaseStatus = 'active' | 'backlog' | 'archived';
type CasePriority = 'P1' | 'P2' | 'P3' | 'P4';

interface CaseRecord {
  id: string;
  title: string;
  status: CaseStatus;
  priority: CasePriority;
  owner: string;
  notes: number;
  updated_at: string;
}

const statusMeta: Record<CaseStatus, { className: string; icon: React.ComponentType<{ className?: string }>; label: string }> = {
  active: { className: 'badge-primary', icon: AlertCircle, label: 'Active' },
  backlog: { className: 'badge-warning', icon: Clock, label: 'Backlog' },
  archived: { className: 'badge-success', icon: CheckCircle2, label: 'Archived' },
};

const priorityClass: Record<CasePriority, string> = {
  P1: 'bg-red-500/10 text-red-500 border border-red-500/30',
  P2: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30',
  P3: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30',
  P4: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/30',
};

const Cases: React.FC = () => {
  const [cases, setCases] = useState<CaseRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<CaseStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<CasePriority | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'priority'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const fetchCases = async () => {
    setLoading(true);
    try {
      const response = await api.get('/cases');
      setCases((response.data ?? []) as CaseRecord[]);
    } catch (error: unknown) {
      setCases([]);
      toast.error(extractApiError(error, 'Failed to load cases'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await api.patch(`/cases/${id}`, { status: 'archived' });
      toast.success('Case archived successfully');
      await fetchCases();
    } catch (error: unknown) {
      toast.error(extractApiError(error, 'Failed to archive case'));
    }
  };

  const filteredCases = useMemo(() => {
    return [...cases]
      .filter((item) => {
        const query = searchTerm.toLowerCase();
        const matchesSearch = !query || item.title.toLowerCase().includes(query) || item.owner.toLowerCase().includes(query);
        const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
        const matchesPriority = priorityFilter === 'all' || item.priority === priorityFilter;
        return matchesSearch && matchesStatus && matchesPriority;
      })
      .sort((a, b) => {
        let comparison = 0;
        if (sortBy === 'date') {
          comparison = new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
        } else if (sortBy === 'title') {
          comparison = a.title.localeCompare(b.title);
        } else {
          const order: Record<CasePriority, number> = { P1: 4, P2: 3, P3: 2, P4: 1 };
          comparison = order[a.priority] - order[b.priority];
        }
        return sortDirection === 'desc' ? -comparison : comparison;
      });
  }, [cases, searchTerm, statusFilter, priorityFilter, sortBy, sortDirection]);

  const stats = {
    total: cases.length,
    active: cases.filter((item) => item.status === 'active').length,
    backlog: cases.filter((item) => item.status === 'backlog').length,
    archived: cases.filter((item) => item.status === 'archived').length,
    p1Open: cases.filter((item) => item.priority === 'P1' && item.status !== 'archived').length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
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
              <p className="text-sm text-muted-foreground">Production-backed FBI Criminal Investigation Database</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20">
            <AlertCircle className="h-3.5 w-3.5 text-red-500" />
            <span className="text-xs text-red-600 dark:text-red-400 font-medium">{stats.p1Open} P1 OPEN</span>
          </div>
          <Button asChild className="btn-pro">
            <Link to="/cases/add">
              <Plus className="h-4 w-4 mr-2" />
              New Case
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card-modern stat-card p-4"><p className="text-xs text-muted-foreground uppercase tracking-wider">Total Cases</p><p className="text-2xl font-bold text-foreground mt-1">{stats.total}</p></div>
        <div className="card-modern stat-card p-4"><p className="text-xs text-muted-foreground uppercase tracking-wider">Active</p><p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{stats.active}</p></div>
        <div className="card-modern stat-card p-4"><p className="text-xs text-muted-foreground uppercase tracking-wider">Backlog</p><p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{stats.backlog}</p></div>
        <div className="card-modern stat-card p-4"><p className="text-xs text-muted-foreground uppercase tracking-wider">Archived</p><p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{stats.archived}</p></div>
      </div>

      <div className="card-modern p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by title or owner..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" />
          </div>
          <div className="flex flex-wrap gap-2">
            <select className="input-pro h-10" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as CaseStatus | 'all')}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="backlog">Backlog</option>
              <option value="archived">Archived</option>
            </select>
            <select className="input-pro h-10" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value as CasePriority | 'all')}>
              <option value="all">All Priority</option>
              <option value="P1">P1</option>
              <option value="P2">P2</option>
              <option value="P3">P3</option>
              <option value="P4">P4</option>
            </select>
            <select className="input-pro h-10" value={sortBy} onChange={(e) => setSortBy(e.target.value as 'date' | 'title' | 'priority')}>
              <option value="date">Sort by Date</option>
              <option value="title">Sort by Title</option>
              <option value="priority">Sort by Priority</option>
            </select>
            <Button variant="outline" size="icon" onClick={() => setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'))} className="h-10 w-10">
              {sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      <div className="card-modern overflow-hidden">
        <div className="hidden lg:grid lg:grid-cols-12 gap-4 px-6 py-3 bg-muted/30 border-b border-border text-sm font-medium text-muted-foreground">
          <div className="col-span-4">Case</div>
          <div className="col-span-2">Owner</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1">Priority</div>
          <div className="col-span-2">Last Updated</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        <div className="divide-y divide-border">
          {loading ? (
            <div className="p-6 space-y-4">{[...Array(5)].map((_, i) => <div key={i} className="h-20 bg-muted rounded-lg animate-pulse"></div>)}</div>
          ) : filteredCases.length === 0 ? (
            <div className="py-12 text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground">No cases found</p>
              <p className="text-sm text-muted-foreground/60 mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            filteredCases.map((caseItem) => {
              const meta = statusMeta[caseItem.status];
              const StatusIcon = meta.icon;
              return (
                <div key={caseItem.id} className="group px-6 py-4 hover:bg-muted/30 transition-colors">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                    <div className="col-span-4">
                      <p className="font-medium text-foreground">{caseItem.title}</p>
                      <p className="text-xs text-muted-foreground mt-1 font-mono">{caseItem.id}</p>
                    </div>
                    <div className="col-span-2 text-sm text-muted-foreground">{caseItem.owner}</div>
                    <div className="col-span-2">
                      <span className={`badge ${meta.className} flex items-center gap-1 w-fit`}>
                        <StatusIcon className="h-3 w-3" />
                        {meta.label}
                      </span>
                    </div>
                    <div className="col-span-1">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium uppercase ${priorityClass[caseItem.priority]}`}>{caseItem.priority}</span>
                    </div>
                    <div className="col-span-2 text-sm text-muted-foreground flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(caseItem.updated_at).toLocaleDateString()}
                    </div>
                    <div className="col-span-1 flex gap-1 justify-end">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Archive Case File</AlertDialogTitle>
                            <AlertDialogDescription>
                              This marks case {caseItem.id} as archived and removes it from active operations.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={() => handleDelete(caseItem.id)}>
                              Archive
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {!loading && filteredCases.length > 0 && (
          <div className="px-6 py-3 border-t border-border bg-muted/20 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Showing {filteredCases.length} of {cases.length} cases</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground"><Lock className="h-3.5 w-3.5" /> Access logged</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cases;
