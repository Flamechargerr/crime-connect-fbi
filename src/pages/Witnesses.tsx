
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
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
  case_id: string | null;
  created_at: string;
}

const Witnesses: React.FC = () => {
  const [witnesses, setWitnesses] = useState<Witness[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'date'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // New witness form state
  const [newWitness, setNewWitness] = useState({
    name: '',
    statement: '',
    description: '',
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchWitnesses();
  }, []);

  const fetchWitnesses = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('witnesses')
        .select('*');
      
      if (error) {
        console.error('Error fetching witnesses:', error);
        toast.error('Failed to load witness records');
      } else {
        setWitnesses(data || []);
      }
    } catch (error) {
      console.error('Error in fetchWitnesses:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('witnesses')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting witness:', error);
        toast.error('Failed to delete witness record');
        return;
      }
      
      setWitnesses(witnesses.filter(witness => witness.id !== id));
      toast.success('Witness record deleted successfully');
    } catch (error) {
      console.error('Error in handleDelete:', error);
      toast.error('An unexpected error occurred');
    }
  };

  const handleAddWitness = async () => {
    try {
      // Validate form
      if (!newWitness.name || !newWitness.statement) {
        toast.error('Please fill in all required fields');
        return;
      }

      const { data, error } = await supabase
        .from('witnesses')
        .insert([newWitness])
        .select();
      
      if (error) {
        console.error('Error adding witness:', error);
        toast.error('Failed to add witness');
        return;
      }
      
      if (data && data.length > 0) {
        setWitnesses([...witnesses, data[0]]);
        toast.success('Witness added successfully');
        
        // Reset form
        setNewWitness({
          name: '',
          statement: '',
          description: '',
        });
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error('Error in handleAddWitness:', error);
      toast.error('An unexpected error occurred');
    }
  };

  const handleSort = (field: 'name' | 'date') => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewWitness(prev => ({
      ...prev,
      [name]: value
    }));
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

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Witnesses</h1>
          <p className="text-muted-foreground">Manage witness records and statements.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Add Witness
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Witness</DialogTitle>
              <DialogDescription>
                Fill in the details to add a new witness to the system.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Witness Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={newWitness.name} 
                  onChange={handleInputChange} 
                  placeholder="John Doe"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="statement">Statement</Label>
                <Textarea 
                  id="statement" 
                  name="statement" 
                  value={newWitness.statement} 
                  onChange={handleInputChange} 
                  placeholder="Witness statement details..."
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input 
                  id="description" 
                  name="description" 
                  value={newWitness.description || ''} 
                  onChange={handleInputChange} 
                  placeholder="Store owner, neighbor, etc."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddWitness}>Add Witness</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
                  filteredAndSortedWitnesses.map((witness) => (
                    <div key={witness.id} className="flex flex-col md:flex-row md:items-center py-4 px-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start flex-1 min-w-0">
                        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground leading-tight">
                            {witness.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                            {witness.statement}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 md:mt-0 md:w-32">
                        {witness.description || '-'}
                      </div>
                      <div className="mt-2 md:mt-0 md:w-32 md:text-right text-sm text-muted-foreground">
                        {new Date(witness.created_at).toLocaleDateString()}
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
                              <AlertDialogAction 
                                className="bg-destructive hover:bg-destructive/90"
                                onClick={() => handleDelete(witness.id)}
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
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Witnesses;
