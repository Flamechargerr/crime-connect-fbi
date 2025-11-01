
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Shield, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
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

interface Officer {
  id: string;
  name: string;
  rank: string;
  badge_number: string;
  department: string | null;
  created_at: string;
}

const mockOfficers = [
  {
    id: '1',
    name: 'Alice Johnson',
    rank: 'Detective',
    badge_number: 'BD-1001',
    department: 'Homicide',
    created_at: new Date().toISOString(),
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&h=400&fit=facearea&facepad=2&auto=format',
  },
  {
    id: '2',
    name: 'Bob Smith',
    rank: 'Sergeant',
    badge_number: 'BD-1002',
    department: 'Robbery',
    created_at: new Date().toISOString(),
    image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=400&h=400&fit=facearea&facepad=2&auto=format',
  },
  {
    id: '3',
    name: 'Maria Lopez',
    rank: 'Officer',
    badge_number: 'BD-1003',
    department: 'Narcotics',
    created_at: new Date().toISOString(),
    image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=400&h=400&fit=facearea&facepad=2&auto=format',
  },
];

const addOfficerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  rank: z.string().min(2, { message: "Rank must be at least 2 characters." }),
  badge_number: z.string().min(2, { message: "Badge number must be at least 2 characters." }),
  department: z.string().optional(),
});

const Officers: React.FC = () => {
  const [officers, setOfficers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'rank'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // New officer form state (remove old useState)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addOfficerForm = useForm<z.infer<typeof addOfficerSchema>>({
    resolver: zodResolver(addOfficerSchema),
    defaultValues: {
      name: '',
      rank: '',
      badge_number: '',
      department: '',
    },
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', rank: '', badge_number: '', department: '' });

  // Helper to get officers from localStorage or mock
  const getLocalOfficers = () => {
    const stored = localStorage.getItem('officers');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return mockOfficers;
      }
    }
    return mockOfficers;
  };

  useEffect(() => {
    setLoading(true);
    let local = getLocalOfficers();
    if (!localStorage.getItem('officers')) {
      localStorage.setItem('officers', JSON.stringify(mockOfficers));
    }
    setOfficers(local);
    setLoading(false);
  }, []);

  // Delete handler
  const handleDelete = (id: string) => {
    const updated = officers.filter(o => o.id !== id);
    setOfficers(updated);
    localStorage.setItem('officers', JSON.stringify(updated));
    toast.success('Officer record deleted successfully');
  };

  // Add handler
  const handleAddOfficer = async (values: z.infer<typeof addOfficerSchema>) => {
    setIsSubmitting(true);
    try {
      const newOfficerObj = {
        ...values,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
      };
      const updated = [...officers, newOfficerObj];
      setOfficers(updated);
      localStorage.setItem('officers', JSON.stringify(updated));
      toast.success('Officer added successfully');
      addOfficerForm.reset();
      setIsDialogOpen(false);
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit handlers
  const handleEditClick = (officer: any) => {
    setEditingId(officer.id);
    setEditForm({
      name: officer.name,
      rank: officer.rank,
      badge_number: officer.badge_number,
      department: officer.department || '',
    });
  };
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };
  const handleEditSave = () => {
    if (!editingId) return;
    const updated = officers.map(o => o.id === editingId ? { ...o, ...editForm } : o);
    setOfficers(updated);
    localStorage.setItem('officers', JSON.stringify(updated));
    setEditingId(null);
    toast.success('Officer updated!');
  };
  const handleEditCancel = () => {
    setEditingId(null);
  };

  const handleSort = (field: 'name' | 'rank') => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedOfficers = officers
    .filter(officer => 
      officer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      officer.rank.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (officer.department && officer.department.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === 'name') {
        return sortDirection === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else {
        return sortDirection === 'asc'
          ? a.rank.localeCompare(b.rank)
          : b.rank.localeCompare(a.rank);
      }
    });

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Officers</h1>
          <p className="text-muted-foreground">All FBI officers in the system</p>
        </div>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Search by name, rank, or badge number..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as 'name' | 'rank' | 'badge_number')}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="name">Sort by Name</option>
            <option value="rank">Sort by Rank</option>
            <option value="badge_number">Sort by Badge Number</option>
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
          <CardTitle>All Officers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search officers..."
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
                  <option value="all">All Ranks</option>
                  <option value="detective">Detective</option>
                  <option value="sergeant">Sergeant</option>
                  <option value="officer">Officer</option>
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
                <div className="w-32 flex items-center">
                  <button 
                    className="flex items-center" 
                    onClick={() => handleSort('rank')}
                  >
                    Rank
                    {sortBy === 'rank' && (
                      sortDirection === 'asc' ? 
                        <ChevronUp className="ml-1 h-4 w-4" /> : 
                        <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </button>
                </div>
                <div className="w-32 text-center">Badge Number</div>
                <div className="w-32 text-center">Department</div>
                <div className="w-16"></div> {/* Space for delete button */}
              </div>

              <div className="divide-y divide-border">
                {filteredAndSortedOfficers.length === 0 ? (
                  <div className="py-8 text-center">
                    <Shield className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No officers found</p>
                  </div>
                ) : (
                  filteredAndSortedOfficers.map((officer) => (
                    <div key={officer.id} className="flex items-center py-4 px-4 hover:bg-muted/50 transition-colors rounded-lg mb-2">
                      <div className="h-16 w-16 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center mr-4 overflow-hidden border">
                        <img src={officer.image} alt={officer.name} className="h-full w-full object-cover object-center rounded-full" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-foreground text-lg truncate">{officer.name}</div>
                        <div className="text-sm text-muted-foreground truncate">Rank: {officer.rank} | Badge: {officer.badge_number} | Dept: {officer.department || '-'}</div>
                        <div className="text-xs text-muted-foreground mt-1">ID: {officer.id.substring(0, 8)}...</div>
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
                                This will permanently delete the officer record for {officer.name}. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={() => handleDelete(officer.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Officers;
