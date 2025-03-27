
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Shield, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
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

interface Officer {
  id: string;
  name: string;
  rank: string;
  badge_number: string;
  department: string | null;
  created_at: string;
}

const Officers: React.FC = () => {
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'rank'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // New officer form state
  const [newOfficer, setNewOfficer] = useState({
    name: '',
    rank: '',
    badge_number: '',
    department: '',
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchOfficers();
  }, []);

  const fetchOfficers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('officers')
        .select('*');
      
      if (error) {
        console.error('Error fetching officers:', error);
        toast.error('Failed to load officer records');
      } else {
        setOfficers(data || []);
      }
    } catch (error) {
      console.error('Error in fetchOfficers:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('officers')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting officer:', error);
        toast.error('Failed to delete officer record');
        return;
      }
      
      setOfficers(officers.filter(officer => officer.id !== id));
      toast.success('Officer record deleted successfully');
    } catch (error) {
      console.error('Error in handleDelete:', error);
      toast.error('An unexpected error occurred');
    }
  };

  const handleAddOfficer = async () => {
    try {
      // Validate form
      if (!newOfficer.name || !newOfficer.rank || !newOfficer.badge_number) {
        toast.error('Please fill in all required fields');
        return;
      }

      const { data, error } = await supabase
        .from('officers')
        .insert([newOfficer])
        .select();
      
      if (error) {
        console.error('Error adding officer:', error);
        toast.error('Failed to add officer');
        return;
      }
      
      if (data && data.length > 0) {
        setOfficers([...officers, data[0]]);
        toast.success('Officer added successfully');
        
        // Reset form
        setNewOfficer({
          name: '',
          rank: '',
          badge_number: '',
          department: '',
        });
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error('Error in handleAddOfficer:', error);
      toast.error('An unexpected error occurred');
    }
  };

  const handleSort = (field: 'name' | 'rank') => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewOfficer(prev => ({
      ...prev,
      [name]: value
    }));
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
          <p className="text-muted-foreground">Manage police officers and their assignments.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Add Officer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Officer</DialogTitle>
              <DialogDescription>
                Fill in the details to add a new officer to the system.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={newOfficer.name} 
                  onChange={handleInputChange} 
                  placeholder="John Doe"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="rank">Rank</Label>
                <Input 
                  id="rank" 
                  name="rank" 
                  value={newOfficer.rank} 
                  onChange={handleInputChange} 
                  placeholder="Detective"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="badge_number">Badge Number</Label>
                <Input 
                  id="badge_number" 
                  name="badge_number" 
                  value={newOfficer.badge_number} 
                  onChange={handleInputChange} 
                  placeholder="BD-1234"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="department">Department</Label>
                <Input 
                  id="department" 
                  name="department" 
                  value={newOfficer.department || ''} 
                  onChange={handleInputChange} 
                  placeholder="Homicide"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddOfficer}>Add Officer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
                    <div key={officer.id} className="flex flex-col md:flex-row md:items-center py-4 px-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start flex-1 min-w-0">
                        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                          <Shield className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground leading-tight">
                            {officer.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            ID: {officer.id.substring(0, 8)}...
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 md:mt-0 md:w-32">
                        {officer.rank}
                      </div>
                      <div className="mt-2 md:mt-0 md:w-32 md:text-center">
                        {officer.badge_number}
                      </div>
                      <div className="mt-2 md:mt-0 md:w-32 md:text-center text-sm text-muted-foreground">
                        {officer.department || '-'}
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
                                This will permanently delete the officer record for {officer.name}. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                className="bg-destructive hover:bg-destructive/90"
                                onClick={() => handleDelete(officer.id)}
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

export default Officers;
