
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { User, Search, Filter, ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

const mockCriminals = [
  {
    id: '1',
    first_name: 'John',
    last_name: 'Doe',
    middle_name: 'A',
    date_of_birth: '1985-06-15',
    biometric_data: 'Fingerprint',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&h=400&fit=facearea&facepad=2&auto=format',
  },
  {
    id: '2',
    first_name: 'Jane',
    last_name: 'Smith',
    middle_name: '',
    date_of_birth: '1990-02-20',
    biometric_data: 'DNA',
    image: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=400&h=400&fit=facearea&facepad=2&auto=format',
  },
];

const Criminals: React.FC = () => {
  const [criminals, setCriminals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'date'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ first_name: '', last_name: '', middle_name: '', date_of_birth: '', biometric_data: '' });
  const [visibleCount, setVisibleCount] = useState(10);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const filteredAndSortedCriminals = criminals
    .filter(criminal => 
      criminal.first_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      criminal.last_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'name') {
        const nameA = `${a.last_name} ${a.first_name}`.toLowerCase();
        const nameB = `${b.last_name} ${b.first_name}`.toLowerCase();
        return sortDirection === 'asc' 
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      } else {
        return sortDirection === 'asc'
          ? new Date(a.date_of_birth).getTime() - new Date(b.date_of_birth).getTime()
          : new Date(b.date_of_birth).getTime() - new Date(a.date_of_birth).getTime();
      }
    });

  // Helper to get criminals from localStorage or mock
  const getLocalCriminals = () => {
    const stored = localStorage.getItem('criminals');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return mockCriminals;
      }
    }
    return mockCriminals;
  };

  useEffect(() => {
    setLoading(true);
    let local = getLocalCriminals();
    if (!localStorage.getItem('criminals')) {
      localStorage.setItem('criminals', JSON.stringify(mockCriminals));
    }
    setCriminals(local);
    setLoading(false);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!listRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = listRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 50 && !isFetchingMore && visibleCount < filteredAndSortedCriminals.length) {
        setIsFetchingMore(true);
        setTimeout(() => {
          setVisibleCount((prev) => Math.min(prev + 10, filteredAndSortedCriminals.length));
          setIsFetchingMore(false);
        }, 500);
      }
    };
    const ref = listRef.current;
    if (ref) ref.addEventListener('scroll', handleScroll);
    return () => {
      if (ref) ref.removeEventListener('scroll', handleScroll);
    };
  }, [filteredAndSortedCriminals.length, isFetchingMore, visibleCount]);

  // Delete handler
  const handleDelete = (id: string) => {
    setDeletingId(id);
    setTimeout(() => {
      const updated = criminals.filter(c => c.id !== id);
      setCriminals(updated);
      localStorage.setItem('criminals', JSON.stringify(updated));
      setDeletingId(null);
      toast.success('Criminal record deleted successfully');
    }, 500);
  };

  // Edit handlers
  const handleEditClick = (criminal: any) => {
    setEditingId(criminal.id);
    setEditForm({
      first_name: criminal.first_name,
      last_name: criminal.last_name,
      middle_name: criminal.middle_name,
      date_of_birth: criminal.date_of_birth,
      biometric_data: criminal.biometric_data || '',
    });
  };
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };
  const handleEditSave = () => {
    if (!editingId) return;
    const updated = criminals.map(c => c.id === editingId ? { ...c, ...editForm } : c);
    setCriminals(updated);
    localStorage.setItem('criminals', JSON.stringify(updated));
    setEditingId(null);
    toast.success('Criminal updated!');
  };
  const handleEditCancel = () => {
    setEditingId(null);
  };

  const handleSort = (field: 'name' | 'date') => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateAge = (dob: string) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Criminals</h1>
          <p className="text-muted-foreground">All criminals in the system</p>
        </div>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Search by first or last name..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as 'name' | 'date')}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="name">Sort by Name</option>
            <option value="date">Sort by Date of Birth</option>
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
          <CardTitle>All Criminals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search criminals..."
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
                  defaultValue="all"
                >
                  <option value="all">All Records</option>
                  <option value="recent">Recent</option>
                  <option value="oldest">Oldest</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="space-y-4 py-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-muted rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : (
            <>
              <div className="hidden md:flex py-3 px-4 text-sm font-medium text-muted-foreground">
                <div className="flex-1 flex items-center">
                  <button 
                    className="flex items-center" 
                    onClick={() => handleSort('name')}
                  >
                    Name
                    {sortBy === 'name' && (
                      sortDirection === 'asc' ? 
                        <ChevronUp className="ml-1 h-4 w-4" /> : 
                        <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </button>
                </div>
                <div className="w-32 text-center">Age</div>
                <div className="w-40 flex items-center justify-end">
                  <button 
                    className="flex items-center" 
                    onClick={() => handleSort('date')}
                  >
                    Date of Birth
                    {sortBy === 'date' && (
                      sortDirection === 'asc' ? 
                        <ChevronUp className="ml-1 h-4 w-4" /> : 
                        <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </button>
                </div>
                <div className="w-16"></div> {/* Space for delete button */}
              </div>

              <div ref={listRef} style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                <div className="divide-y divide-border">
                  {filteredAndSortedCriminals.length === 0 ? (
                    <div className="py-8 text-center">
                      <User className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No criminals found</p>
                    </div>
                  ) : (
                    filteredAndSortedCriminals.slice(0, visibleCount).map((criminal) => (
                      <div key={criminal.id} className="flex flex-col md:flex-row md:items-center py-4 px-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-start flex-1 min-w-0">
                          <div className="h-10 w-10 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center mr-4 overflow-hidden">
                            <img
                              src={criminal.image || 'https://source.unsplash.com/400x400/?portrait,person'}
                              alt={criminal.first_name + ' ' + criminal.last_name}
                              className="h-10 w-10 rounded-full object-cover border"
                              onError={e => (e.currentTarget.src = 'https://source.unsplash.com/400x400/?portrait,person')}
                            />
                          </div>
                          <div>
                            <h3 className="font-medium text-foreground leading-tight">
                              <Link to={`/criminals/${criminal.id}`}>
                                {criminal.last_name}, {criminal.first_name}
                              </Link>
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              ID: {criminal.id.substring(0, 8)}...
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 md:mt-0 md:w-32 md:text-center text-sm">
                          {calculateAge(criminal.date_of_birth)} years
                        </div>
                        <div className="mt-2 md:mt-0 md:w-40 md:text-right text-sm text-muted-foreground">
                          {formatDate(criminal.date_of_birth)}
                        </div>
                        <div className="mt-2 md:mt-0 md:w-16 md:text-right flex justify-end">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete the criminal record for {criminal.first_name} {criminal.last_name}. This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  className="bg-destructive hover:bg-destructive/90"
                                  onClick={() => handleDelete(criminal.id)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Criminals;
