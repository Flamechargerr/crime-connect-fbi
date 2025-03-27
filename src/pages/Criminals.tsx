
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Search, Filter, ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { DbCriminal } from "@/types/supabase";
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

const Criminals: React.FC = () => {
  const [criminals, setCriminals] = useState<DbCriminal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'date'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchCriminals();
  }, []);

  const fetchCriminals = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('criminals')
        .select('*');
      
      if (error) {
        console.error('Error fetching criminals:', error);
        toast.error('Failed to load criminal records');
      } else {
        setCriminals(data || []);
      }
    } catch (error) {
      console.error('Error in fetchCriminals:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('criminals')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting criminal:', error);
        toast.error('Failed to delete criminal record');
        return;
      }
      
      setCriminals(criminals.filter(criminal => criminal.id !== id));
      toast.success('Criminal record deleted successfully');
    } catch (error) {
      console.error('Error in handleDelete:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setDeletingId(null);
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
          <p className="text-muted-foreground">Manage and view criminal records.</p>
        </div>
        <div className="flex space-x-3">
          <Button className="flex items-center">
            <Link to="/criminals/add" className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Add Criminal
            </Link>
          </Button>
          <Button variant="outline" className="flex items-center">
            <Link to="/cases" className="flex items-center">
              View Cases
            </Link>
          </Button>
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

              <div className="divide-y divide-border">
                {filteredAndSortedCriminals.length === 0 ? (
                  <div className="py-8 text-center">
                    <User className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No criminals found</p>
                  </div>
                ) : (
                  filteredAndSortedCriminals.map((criminal) => (
                    <div key={criminal.id} className="flex flex-col md:flex-row md:items-center py-4 px-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start flex-1 min-w-0">
                        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                          <User className="h-5 w-5 text-primary" />
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
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Criminals;
