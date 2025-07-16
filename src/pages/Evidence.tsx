
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, FileStack, ChevronDown, ChevronUp } from 'lucide-react';
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

interface Evidence {
  id: string;
  description: string;
  storage_location: string;
  case_id: string | null;
  created_at: string;
}

const Evidence: React.FC = () => {
  const [evidenceItems, setEvidenceItems] = useState<Evidence[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'description' | 'date'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // New evidence form state
  const [newEvidence, setNewEvidence] = useState({
    description: '',
    storage_location: '',
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchEvidence();
  }, []);

  const fetchEvidence = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('evidence')
        .select('*');
      
      if (error) {
        console.error('Error fetching evidence:', error);
        toast.error('Failed to load evidence records');
      } else {
        setEvidenceItems(data || []);
      }
    } catch (error) {
      console.error('Error in fetchEvidence:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('evidence')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting evidence:', error);
        toast.error('Failed to delete evidence record');
        return;
      }
      
      setEvidenceItems(evidenceItems.filter(evidence => evidence.id !== id));
      toast.success('Evidence record deleted successfully');
    } catch (error) {
      console.error('Error in handleDelete:', error);
      toast.error('An unexpected error occurred');
    }
  };

  const handleAddEvidence = async () => {
    try {
      // Validate form
      if (!newEvidence.description || !newEvidence.storage_location) {
        toast.error('Please fill in all required fields');
        return;
      }

      const { data, error } = await supabase
        .from('evidence')
        .insert([newEvidence])
        .select();
      
      if (error) {
        console.error('Error adding evidence:', error);
        toast.error('Failed to add evidence');
        return;
      }
      
      if (data && data.length > 0) {
        setEvidenceItems([...evidenceItems, data[0]]);
        toast.success('Evidence added successfully');
        
        // Reset form
        setNewEvidence({
          description: '',
          storage_location: '',
        });
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error('Error in handleAddEvidence:', error);
      toast.error('An unexpected error occurred');
    }
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
    setNewEvidence(prev => ({
      ...prev,
      [name]: value
    }));
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

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Evidence</h1>
          <p className="text-muted-foreground">Manage case evidence and storage locations.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Add Evidence
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Evidence</DialogTitle>
              <DialogDescription>
                Fill in the details to add new evidence to the system.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  value={newEvidence.description} 
                  onChange={handleInputChange} 
                  placeholder="Fingerprints from door handle"
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="storage_location">Storage Location</Label>
                <Input 
                  id="storage_location" 
                  name="storage_location" 
                  value={newEvidence.storage_location} 
                  onChange={handleInputChange} 
                  placeholder="Locker A-123"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddEvidence}>Add Evidence</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

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
                    onClick={() => handleSort('description')}
                  >
                    Description
                    {sortBy === 'description' && (
                      sortDirection === 'asc' ? 
                        <ChevronUp className="ml-1 h-4 w-4" /> : 
                        <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </button>
                </div>
                <div className="w-48 flex">Storage Location</div>
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
                {filteredAndSortedEvidence.length === 0 ? (
                  <div className="py-8 text-center">
                    <FileStack className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No evidence found</p>
                  </div>
                ) : (
                  filteredAndSortedEvidence.map((evidence) => (
                    <div key={evidence.id} className="flex flex-col md:flex-row md:items-center py-4 px-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start flex-1 min-w-0">
                        <div className="h-10 w-10 flex-shrink-0 rounded bg-primary/10 flex items-center justify-center mr-4">
                          <FileStack className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground leading-tight">
                            {evidence.description}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            ID: {evidence.id.substring(0, 8)}...
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 md:mt-0 md:w-48">
                        {evidence.storage_location}
                      </div>
                      <div className="mt-2 md:mt-0 md:w-32 md:text-right text-sm text-muted-foreground">
                        {new Date(evidence.created_at).toLocaleDateString()}
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
                                This will permanently delete this evidence record. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                className="bg-destructive hover:bg-destructive/90"
                                onClick={() => handleDelete(evidence.id)}
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

export default Evidence;
