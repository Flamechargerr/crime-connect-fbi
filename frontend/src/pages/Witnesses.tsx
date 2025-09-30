
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, Users, ChevronDown, ChevronUp } from 'lucide-react';
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface Witness {
  id: string;
  name: string;
  statement: string;
  description: string | null;
  case_id: string | null;
  created_at: string;
  image?: string;
}

const mockWitnesses = [
  {
    id: '1',
    name: 'Sarah Lee',
    statement: 'Saw the suspect running from the scene.',
    description: 'Store owner',
    case_id: null,
    created_at: new Date().toISOString(),
    image: 'https://images.unsplash.com/photo-1517363898873-fafc2070293c?q=80&w=400&h=400&fit=facearea&facepad=2&auto=format',
  },
  {
    id: '2',
    name: 'Tom Brown',
    statement: 'Heard loud noises at midnight.',
    description: 'Neighbor',
    case_id: null,
    created_at: new Date().toISOString(),
    image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=400&h=400&fit=facearea&facepad=2&auto=format',
  },
  {
    id: '3',
    name: 'Priya Singh',
    statement: 'Saw a suspicious car parked nearby.',
    description: 'Passerby',
    case_id: null,
    created_at: new Date().toISOString(),
    image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=400&h=400&fit=facearea&facepad=2&auto=format',
  },
];

const addWitnessSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  statement: z.string().min(5, { message: "Statement must be at least 5 characters." }),
  description: z.string().optional(),
});

const Witnesses: React.FC = () => {
  const [witnesses, setWitnesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'date'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // New witness form state (remove old useState)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addWitnessForm = useForm<z.infer<typeof addWitnessSchema>>({
    resolver: zodResolver(addWitnessSchema),
    defaultValues: {
      name: '',
      statement: '',
      description: '',
    },
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', statement: '', description: '' });
  const [visibleCount, setVisibleCount] = useState(10);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  // Helper to get witnesses from localStorage or mock
  const getLocalWitnesses = () => {
    const stored = localStorage.getItem('witnesses');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return mockWitnesses;
      }
    }
    return mockWitnesses;
  };

  const filteredAndSortedWitnesses = witnesses
    .filter(witness => 
      witness.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      witness.statement.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (witness.description && witness.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === 'name') {
        return sortDirection === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else {
        return sortDirection === 'asc'
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  useEffect(() => {
    setLoading(true);
    let local = getLocalWitnesses();
    if (!localStorage.getItem('witnesses')) {
      localStorage.setItem('witnesses', JSON.stringify(mockWitnesses));
    }
    setWitnesses(local);
    setLoading(false);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!listRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = listRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 50 && !isFetchingMore && visibleCount < filteredAndSortedWitnesses.length) {
        setIsFetchingMore(true);
        setTimeout(() => {
          setVisibleCount((prev) => Math.min(prev + 10, filteredAndSortedWitnesses.length));
          setIsFetchingMore(false);
        }, 500);
      }
    };
    const ref = listRef.current;
    if (ref) ref.addEventListener('scroll', handleScroll);
    return () => {
      if (ref) ref.removeEventListener('scroll', handleScroll);
    };
  }, [filteredAndSortedWitnesses.length, isFetchingMore, visibleCount]);

  // Delete handler
  const handleDelete = (id: string) => {
    const updated = witnesses.filter(w => w.id !== id);
    setWitnesses(updated);
    localStorage.setItem('witnesses', JSON.stringify(updated));
    toast.success('Witness record deleted successfully');
  };

  // Add handler
  const handleAddWitness = async (values: z.infer<typeof addWitnessSchema>) => {
    setIsSubmitting(true);
    try {
      const newWitnessObj = {
        ...values,
        id: Date.now().toString(),
        case_id: null,
        created_at: new Date().toISOString(),
        image: 'https://source.unsplash.com/400x400/?portrait,person',
      };
      const updated = [...witnesses, newWitnessObj];
      setWitnesses(updated);
      localStorage.setItem('witnesses', JSON.stringify(updated));
      toast.success('Witness added successfully');
      addWitnessForm.reset();
      setIsDialogOpen(false);
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit handlers
  const handleEditClick = (witness: any) => {
    setEditingId(witness.id);
    setEditForm({
      name: witness.name,
      statement: witness.statement,
      description: witness.description || '',
    });
  };
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };
  const handleEditSave = () => {
    if (!editingId) return;
    const updated = witnesses.map(w => w.id === editingId ? { ...w, ...editForm } : w);
    setWitnesses(updated);
    localStorage.setItem('witnesses', JSON.stringify(updated));
    setEditingId(null);
    toast.success('Witness updated!');
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

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Witnesses</h1>
          <p className="text-muted-foreground">All witnesses in the system</p>
        </div>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Search by name, statement, or description..."
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
          <CardTitle>All Witnesses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search witnesses..."
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
                  <option value="all">All Witnesses</option>
                  <option value="recent">Recently Added</option>
                  <option value="alphabetical">Alphabetical</option>
                </select>
              </div>
            </div>
          </div>
          <div ref={listRef} style={{ maxHeight: '60vh', overflowY: 'auto' }}>
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
                  <div className="w-32 flex">Description</div>
                  <div className="w-32 flex items-center justify-end">
                    <button 
                      className="flex items-center" 
                      onClick={() => handleSort('date')}
                    >
                      Date Added
                      {sortBy === 'date' && (
                        sortDirection === 'asc' ? 
                          <ChevronUp className="ml-1 h-4 w-4" /> : 
                          <ChevronDown className="ml-1 h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <div className="w-16"></div> {/* Space for delete button */}
                </div>
                <div className="divide-y divide-border">
                  {filteredAndSortedWitnesses.length === 0 ? (
                    <div className="py-8 text-center">
                      <Users className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No witnesses found</p>
                    </div>
                  ) : (
                    filteredAndSortedWitnesses.slice(0, visibleCount).map((witness) => (
                      <div key={witness.id} className="flex items-center py-4 px-4 hover:bg-muted/50 transition-colors rounded-lg mb-2">
                        <div className="h-16 w-16 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center mr-4 overflow-hidden border">
                          <img src={witness.image || 'https://source.unsplash.com/400x400/?portrait,person'} alt={witness.name} className="h-full w-full object-cover object-center rounded-full" onError={e => (e.currentTarget.src = 'https://source.unsplash.com/400x400/?portrait,person')} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-foreground text-lg truncate">{witness.name}</div>
                          <div className="text-sm text-muted-foreground truncate">{witness.statement}</div>
                          <div className="text-xs text-muted-foreground mt-1">{witness.description || '-'} | {new Date(witness.created_at).toLocaleDateString()}</div>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={(e) => e.stopPropagation()}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete the witness record for {witness.name}. This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={() => handleDelete(witness.id)}>
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
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Witnesses;
