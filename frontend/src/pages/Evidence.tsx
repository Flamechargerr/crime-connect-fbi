
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, FileStack, ChevronDown, ChevronUp } from 'lucide-react';
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

interface Evidence {
  id: string;
  description: string;
  storage_location: string;
  case_id: string | null;
  created_at: string;
}

// Add mockEvidence array
const mockEvidence = [
  {
    id: '1',
    description: 'Fingerprint on window',
    storage_location: 'Locker A-101',
    case_id: null,
    created_at: new Date().toISOString(),
    image: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?q=80&w=400&h=400&fit=crop&auto=format',
  },
  {
    id: '2',
    description: 'CCTV footage',
    storage_location: 'Digital Archive',
    case_id: null,
    created_at: new Date().toISOString(),
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?q=80&w=400&h=400&fit=crop&auto=format',
  },
  {
    id: '3',
    description: 'Recovered weapon',
    storage_location: 'Locker B-202',
    case_id: null,
    created_at: new Date().toISOString(),
    image: 'https://images.unsplash.com/photo-1510822736943-1b6a1e1b8a48?q=80&w=400&h=400&fit=crop&auto=format',
  },
  {
    id: '4',
    description: 'Signed document',
    storage_location: 'Evidence Room',
    case_id: null,
    created_at: new Date().toISOString(),
    image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=400&h=400&fit=crop&auto=format',
  },
];

const addEvidenceSchema = z.object({
  description: z.string().min(3, { message: "Description must be at least 3 characters." }),
  storage_location: z.string().min(2, { message: "Storage location must be at least 2 characters." }),
});

const Evidence: React.FC = () => {
  const [evidenceItems, setEvidenceItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'description' | 'date'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // New evidence form state (remove old useState)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addEvidenceForm = useForm<z.infer<typeof addEvidenceSchema>>({
    resolver: zodResolver(addEvidenceSchema),
    defaultValues: {
      description: '',
      storage_location: '',
    },
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ description: '', storage_location: '' });
  const [visibleCount, setVisibleCount] = useState(10);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  // Helper to get evidence from localStorage or mock
  const getLocalEvidence = () => {
    const stored = localStorage.getItem('evidence');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return mockEvidence;
      }
    }
    return mockEvidence;
  };

  useEffect(() => {
    setLoading(true);
    let local = getLocalEvidence();
    if (!localStorage.getItem('evidence')) {
      localStorage.setItem('evidence', JSON.stringify(mockEvidence));
    }
    setEvidenceItems(local);
    setLoading(false);
  }, []);

  // Delete handler
  const handleDelete = (id: string) => {
    const updated = evidenceItems.filter(e => e.id !== id);
    setEvidenceItems(updated);
    localStorage.setItem('evidence', JSON.stringify(updated));
    toast.success('Evidence record deleted successfully');
  };

  // Add handler
  const handleAddEvidence = async (values: z.infer<typeof addEvidenceSchema>) => {
    setIsSubmitting(true);
    try {
      const newEvidenceObj = {
        ...values,
        id: Date.now().toString(),
        case_id: null,
        created_at: new Date().toISOString(),
      };
      const updated = [...evidenceItems, newEvidenceObj];
      setEvidenceItems(updated);
      localStorage.setItem('evidence', JSON.stringify(updated));
      toast.success('Evidence added successfully');
      addEvidenceForm.reset();
      setIsDialogOpen(false);
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit handlers
  const handleEditClick = (evidence: any) => {
    setEditingId(evidence.id);
    setEditForm({
      description: evidence.description,
      storage_location: evidence.storage_location,
    });
  };
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };
  const handleEditSave = () => {
    if (!editingId) return;
    const updated = evidenceItems.map(e => e.id === editingId ? { ...e, ...editForm } : e);
    setEvidenceItems(updated);
    localStorage.setItem('evidence', JSON.stringify(updated));
    setEditingId(null);
    toast.success('Evidence updated!');
  };
  const handleEditCancel = () => {
    setEditingId(null);
  };

  const handleSort = (field: 'description' | 'date') => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    addEvidenceForm.setValue(name as 'description' | 'storage_location', value);
  };

  const filteredAndSortedEvidence = evidenceItems
    .filter(evidence => 
      evidence.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
      evidence.storage_location.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'description') {
        return sortDirection === 'asc' 
          ? a.description.localeCompare(b.description)
          : b.description.localeCompare(a.description);
      } else {
        return sortDirection === 'asc'
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  useEffect(() => {
    const handleScroll = () => {
      if (!listRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = listRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 50 && !isFetchingMore && visibleCount < filteredAndSortedEvidence.length) {
        setIsFetchingMore(true);
        setTimeout(() => {
          setVisibleCount(prev => Math.min(prev + 10, filteredAndSortedEvidence.length));
          setIsFetchingMore(false);
        }, 500);
      }
    };
    const ref = listRef.current;
    if (ref) {
      ref.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (ref) {
        ref.removeEventListener('scroll', handleScroll);
      }
    };
  }, [isFetchingMore, visibleCount, filteredAndSortedEvidence.length]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Evidence</h1>
          <p className="text-muted-foreground">All FBI evidence in the system</p>
        </div>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Search by description or storage location..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as 'description' | 'date')}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="description">Sort by Description</option>
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
      {/* Add Evidence Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="flex items-center">
            <Plus className="mr-2 h-4 w-4" /> Add Evidence
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Evidence</DialogTitle>
            <DialogDescription>Enter evidence details below.</DialogDescription>
          </DialogHeader>
          <form onSubmit={addEvidenceForm.handleSubmit(handleAddEvidence)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Description</Label>
                <Input {...addEvidenceForm.register('description')} placeholder="Description" />
                <p className="text-destructive text-xs mt-1">{addEvidenceForm.formState.errors.description?.message}</p>
              </div>
              <div>
                <Label>Storage Location</Label>
                <Input {...addEvidenceForm.register('storage_location')} placeholder="Storage location" />
                <p className="text-destructive text-xs mt-1">{addEvidenceForm.formState.errors.storage_location?.message}</p>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add Evidence'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Card className="glass-card">
        <CardHeader className="px-6">
          <CardTitle>All Evidence</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search evidence..."
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
                  <option value="all">All Evidence</option>
                  <option value="recent">Recently Added</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>
          </div>

          <div ref={listRef} style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
                ))}
              </div>
            ) : filteredAndSortedEvidence.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <FileStack className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No evidence found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedEvidence.slice(0, visibleCount).map(evidence => (
                  <div key={evidence.id} className="flex items-center py-4 px-4 hover:bg-muted/50 transition-colors rounded-lg mb-2">
                    <div className="h-16 w-16 flex-shrink-0 rounded bg-primary/10 flex items-center justify-center mr-4 overflow-hidden border">
                      <img src={evidence.image} alt={evidence.description} className="h-full w-full object-cover object-center rounded" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-foreground text-lg truncate">{evidence.description}</div>
                      <div className="text-sm text-muted-foreground truncate">{evidence.storage_location}</div>
                      <div className="text-xs text-muted-foreground mt-1">ID: {evidence.id.substring(0, 8)}... | {new Date(evidence.created_at).toLocaleDateString()}</div>
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
                              This will permanently delete the evidence record for {evidence.description}. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={() => handleDelete(evidence.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {isFetchingMore && (
              <div className="flex justify-center py-4">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Evidence;
