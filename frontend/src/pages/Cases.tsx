import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Plus, Search, Filter, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Case } from '../types';
import { toast } from "sonner";

// Restore mockCases
const mockCases: Case[] = [
  {
    id: 1,
    title: 'Armed Robbery - Downtown Bank',
    status: 'open',
    description: 'Armed robbery at First National Bank on Main Street',
    policeStationId: 1,
    createdAt: new Date('2023-05-15'),
    updatedAt: new Date('2023-05-18')
  },
  {
    id: 2,
    title: 'Vehicle Theft - Highland Park',
    status: 'pending',
    description: 'Luxury vehicle stolen from Highland Park residential area',
    policeStationId: 2,
    createdAt: new Date('2023-06-02'),
    updatedAt: new Date('2023-06-05')
  },
  {
    id: 3,
    title: 'Residential Burglary - Westside',
    status: 'closed',
    description: 'Break-in and theft at residential property in Westside neighborhood',
    policeStationId: 1,
    createdAt: new Date('2023-04-10'),
    updatedAt: new Date('2023-04-29')
  },
  {
    id: 4,
    title: 'Assault - Downtown Bar',
    status: 'open',
    description: 'Physical assault reported outside The Blue Note Bar',
    policeStationId: 3,
    createdAt: new Date('2023-06-10'),
    updatedAt: new Date('2023-06-10')
  },
  {
    id: 5,
    title: 'Drug Trafficking - Harbor Area',
    status: 'pending',
    description: 'Suspected drug trafficking operation near the harbor warehouses',
    policeStationId: 2,
    createdAt: new Date('2023-05-28'),
    updatedAt: new Date('2023-06-03')
  },
  {
    id: 6,
    title: 'Corporate Fraud - Meridian Corp',
    status: 'open',
    description: 'Investigation into financial irregularities at Meridian Corporation',
    policeStationId: 4,
    createdAt: new Date('2023-06-05'),
    updatedAt: new Date('2023-06-08')
  },
  {
    id: 7,
    title: 'Missing Person - Emily Chen',
    status: 'closed',
    description: '24-year-old female reported missing from university campus',
    policeStationId: 1,
    createdAt: new Date('2023-03-14'),
    updatedAt: new Date('2023-03-28')
  },
  {
    id: 8,
    title: 'Vandalism - City Park',
    status: 'closed',
    description: 'Extensive property damage at City Park central fountain',
    policeStationId: 3,
    createdAt: new Date('2023-05-01'),
    updatedAt: new Date('2023-05-15')
  }
];

const Cases: React.FC = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Case['status'] | 'all'>('all');
  const [sortBy, setSortBy] = useState<'title' | 'date'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [editingCase, setEditingCase] = useState<Case | null>(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', status: 'open', policeStationId: 1 });
  const [visibleCount, setVisibleCount] = useState(10);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  // Helper to get cases from localStorage or mock
  const getLocalCases = () => {
    const stored = localStorage.getItem('cases');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        return parsed.map((c: any) => ({ ...c, createdAt: new Date(c.createdAt), updatedAt: new Date(c.updatedAt) }));
      } catch {
        return mockCases;
      }
    }
    return mockCases;
  };

  // On mount, load from localStorage or mock
  useEffect(() => {
    setLoading(true);
    let local = getLocalCases();
    // If nothing in localStorage, seed it
    if (!localStorage.getItem('cases')) {
      localStorage.setItem('cases', JSON.stringify(mockCases));
    }
    setCases(local);
    setLoading(false);
  }, []);

  // Delete handler
  const handleDelete = (id: number) => {
    setDeletingId(id);
    setTimeout(() => {
      const updated = cases.filter(c => c.id !== id);
      setCases(updated);
      localStorage.setItem('cases', JSON.stringify(updated));
      setDeletingId(null);
      toast.success('Case deleted!');
    }, 500);
  };

  // Edit handler
  const handleEditClick = (caseItem: Case) => {
    setEditingCase(caseItem);
    setEditForm({
      title: caseItem.title,
      description: caseItem.description,
      status: caseItem.status,
      policeStationId: caseItem.policeStationId,
    });
  };
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: name === 'policeStationId' ? Number(value) : value }));
  };
  const handleEditSave = () => {
    if (!editingCase) return;
    const updated = cases.map(c => c.id === editingCase.id ? { ...c, ...editForm, updatedAt: new Date().toISOString() } : c);
    setCases(updated);
    localStorage.setItem('cases', JSON.stringify(updated));
    setEditingCase(null);
    toast.success('Case updated!');
  };
  const handleEditCancel = () => {
    setEditingCase(null);
  };

  const handleSort = (field: 'title' | 'date') => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedCases = cases
    .filter(caseItem => 
      (statusFilter === 'all' || caseItem.status === statusFilter) &&
      (caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
       caseItem.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === 'title') {
        return sortDirection === 'asc' 
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else {
        return sortDirection === 'asc'
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  useEffect(() => {
    const handleScroll = () => {
      if (!listRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = listRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 50 && !isFetchingMore && visibleCount < filteredAndSortedCases.length) {
        setIsFetchingMore(true);
        setTimeout(() => {
          setVisibleCount((prev) => Math.min(prev + 10, filteredAndSortedCases.length));
          setIsFetchingMore(false);
        }, 500);
      }
    };
    const ref = listRef.current;
    if (ref) ref.addEventListener('scroll', handleScroll);
    return () => {
      if (ref) ref.removeEventListener('scroll', handleScroll);
    };
  }, [filteredAndSortedCases.length, isFetchingMore, visibleCount]);

  const StatusBadge: React.FC<{ status: Case['status'] }> = ({ status }) => {
    const statusStyles = {
      open: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      closed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      archived: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
    };

    return (
      <span className={`text-xs px-2 py-1 rounded-full uppercase font-medium ${statusStyles[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cases</h1>
          <p className="text-muted-foreground">All cases in the system</p>
        </div>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Search by title or description..."
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
            <option value="open">Open</option>
            <option value="pending">Pending</option>
            <option value="closed">Closed</option>
          </select>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as 'title' | 'date')}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="title">Sort by Title</option>
            <option value="date">Sort by Date</option>
          </select>
          <select
            value={sortDirection}
            onChange={e => setSortDirection(e.target.value as 'asc' | 'desc')}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      <Card className="glass-card">
        <CardHeader className="px-6">
          <CardTitle>All Cases</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search cases..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <div className="flex items-center bg-muted rounded-md">
                <div className="px-3">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                </div>
                <select 
                  className="bg-transparent py-2 pr-3 border-0 focus:ring-0 text-sm focus:outline-none"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as Case['status'] | 'all')}
                >
                  <option value="all">All Status</option>
                  <option value="open">Open</option>
                  <option value="pending">Pending</option>
                  <option value="closed">Closed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </div>

          <div ref={listRef} style={{ maxHeight: '60vh', overflowY: 'auto' }}>
            {loading ? (
              <div className="space-y-4 py-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-24 bg-muted rounded-lg animate-pulse"></div>
                ))}
              </div>
            ) : (
              <>
                <div className="hidden md:flex py-3 px-4 text-sm font-medium text-muted-foreground">
                  <div className="flex-1 flex items-center">
                    <button 
                      className="flex items-center" 
                      onClick={() => handleSort('title')}
                    >
                      Title
                      {sortBy === 'title' && (
                        sortDirection === 'asc' ? 
                          <ChevronUp className="ml-1 h-4 w-4" /> : 
                          <ChevronDown className="ml-1 h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <div className="w-24 text-center">Status</div>
                  <div className="w-32 flex items-center justify-end">
                    <button 
                      className="flex items-center" 
                      onClick={() => handleSort('date')}
                    >
                      Date
                      {sortBy === 'date' && (
                        sortDirection === 'asc' ? 
                          <ChevronUp className="ml-1 h-4 w-4" /> : 
                          <ChevronDown className="ml-1 h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-border">
                  {filteredAndSortedCases.length === 0 ? (
                    <div className="py-8 text-center">
                      <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No cases found</p>
                    </div>
                  ) : (
                    filteredAndSortedCases.slice(0, visibleCount).map((caseItem) => (
                      <div key={caseItem.id} className="block hover:bg-muted/50 transition-colors">
                        <div className="flex flex-col md:flex-row md:items-center py-4 px-4">
                          <div className="flex items-start flex-1 min-w-0">
                            <div className="h-10 w-10 flex-shrink-0 rounded bg-primary/10 flex items-center justify-center mr-4">
                              <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              {editingCase && editingCase.id === caseItem.id ? (
                                <form className="space-y-2" onSubmit={e => { e.preventDefault(); handleEditSave(); }}>
                                  <input
                                    className="block w-full border rounded px-2 py-1 mb-1"
                                    name="title"
                                    value={editForm.title}
                                    onChange={handleEditChange}
                                    required
                                  />
                                  <textarea
                                    className="block w-full border rounded px-2 py-1 mb-1"
                                    name="description"
                                    value={editForm.description}
                                    onChange={handleEditChange}
                                    required
                                  />
                                  <select
                                    className="block w-full border rounded px-2 py-1 mb-1"
                                    name="status"
                                    value={editForm.status}
                                    onChange={handleEditChange}
                                  >
                                    <option value="open">Open</option>
                                    <option value="pending">Pending</option>
                                    <option value="closed">Closed</option>
                                    <option value="archived">Archived</option>
                                  </select>
                                  <input
                                    className="block w-full border rounded px-2 py-1 mb-1"
                                    name="policeStationId"
                                    type="number"
                                    min="1"
                                    value={editForm.policeStationId}
                                    onChange={handleEditChange}
                                    required
                                  />
                                  <div className="flex space-x-2 mt-2">
                                    <Button size="sm" type="submit">Save</Button>
                                    <Button size="sm" variant="outline" type="button" onClick={handleEditCancel}>Cancel</Button>
                                  </div>
                                </form>
                              ) : (
                                <>
                                  <h3 className="font-medium text-foreground leading-tight">{caseItem.title}</h3>
                                  <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{caseItem.description}</p>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="mt-2 md:mt-0 md:w-24 md:text-center">
                            <StatusBadge status={caseItem.status} />
                          </div>
                          <div className="mt-2 md:mt-0 md:w-32 md:text-right text-sm text-muted-foreground">
                            {new Date(caseItem.createdAt).toLocaleDateString()}
                          </div>
                          <div className="mt-2 md:mt-0 md:w-32 md:text-right flex space-x-2 justify-end">
                            {editingCase && editingCase.id === caseItem.id ? null : (
                              <>
                                <Button size="sm" variant="outline" onClick={() => handleEditClick(caseItem)}>
                                  Edit
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => handleDelete(caseItem.id)} disabled={deletingId === caseItem.id}>
                                  {deletingId === caseItem.id ? 'Deleting...' : 'Delete'}
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  {isFetchingMore && (
                    <div className="flex justify-center py-4">
                      <div className="h-6 w-6 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Cases;
