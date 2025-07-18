
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, GavelIcon, ChevronDown, ChevronUp } from 'lucide-react';
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

interface Court {
  id: string;
  name: string;
  judge_name: string;
  location: string;
  jurisdiction: string | null;
  created_at: string;
}

const Courts: React.FC = () => {
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'judge'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // New court form state
  const [newCourt, setNewCourt] = useState({
    name: '',
    judge_name: '',
    location: '',
    jurisdiction: '',
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchCourts();
  }, []);

  const fetchCourts = async () => {
    setLoading(true);
    try {
      const storedCourts = localStorage.getItem('courts');
      if (storedCourts) {
        setCourts(JSON.parse(storedCourts));
      } else {
        // Mock data for demonstration
        setCourts([
          { id: '1', name: 'Central District Court', judge_name: 'Hon. Robert Williams', location: '450 Golden Gate Ave, San Francisco', jurisdiction: 'Criminal', created_at: '2023-01-01' },
          { id: '2', name: 'Superior Court of California', judge_name: 'Hon. Jane Doe', location: '123 Main St, Oakland', jurisdiction: 'Civil', created_at: '2023-02-15' },
          { id: '3', name: 'Appellate Division', judge_name: 'Hon. Peter Parker', location: '500 Pine St, Seattle', jurisdiction: 'Appeals', created_at: '2023-03-20' },
        ]);
        toast.info('No court records found in localStorage, seeding mock data.');
      }
    } catch (error) {
      console.error('Error in fetchCourts:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const updatedCourts = courts.filter(court => court.id !== id);
      setCourts(updatedCourts);
      localStorage.setItem('courts', JSON.stringify(updatedCourts));
      toast.success('Court record deleted successfully');
    } catch (error) {
      console.error('Error in handleDelete:', error);
      toast.error('An unexpected error occurred');
    }
  };

  const handleAddCourt = async () => {
    try {
      // Validate form
      if (!newCourt.name || !newCourt.judge_name || !newCourt.location) {
        toast.error('Please fill in all required fields');
        return;
      }

      const newId = Date.now().toString(); // Simple ID generation
      const newCourtWithId = {
        ...newCourt,
        id: newId,
        created_at: new Date().toISOString(),
      };
      const updatedCourts = [...courts, newCourtWithId];
      setCourts(updatedCourts);
      localStorage.setItem('courts', JSON.stringify(updatedCourts));
      toast.success('Court added successfully');
      
      // Reset form
      setNewCourt({
        name: '',
        judge_name: '',
        location: '',
        jurisdiction: '',
      });
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error in handleAddCourt:', error);
      toast.error('An unexpected error occurred');
    }
  };

  const handleSort = (field: 'name' | 'judge') => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewCourt(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredAndSortedCourts = courts
    .filter(court => 
      court.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      court.judge_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (court.jurisdiction && court.jurisdiction.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === 'name') {
        return sortDirection === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else {
        return sortDirection === 'asc'
          ? a.judge_name.localeCompare(b.judge_name)
          : b.judge_name.localeCompare(a.judge_name);
      }
    });

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Courts</h1>
          <p className="text-muted-foreground">All courts in the system</p>
        </div>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Search by court name, judge, or location..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as 'name' | 'judge' | 'location')}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="name">Sort by Name</option>
            <option value="judge">Sort by Judge</option>
            <option value="location">Sort by Location</option>
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
          <CardTitle>All Courts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search courts..."
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
                  <option value="all">All Jurisdictions</option>
                  <option value="criminal">Criminal</option>
                  <option value="civil">Civil</option>
                  <option value="appeals">Appeals</option>
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
                    Court Name
                    {sortBy === 'name' && (
                      sortDirection === 'asc' ? 
                        <ChevronUp className="ml-1 h-4 w-4" /> : 
                        <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </button>
                </div>
                <div className="w-48 flex items-center">
                  <button 
                    className="flex items-center" 
                    onClick={() => handleSort('judge')}
                  >
                    Judge
                    {sortBy === 'judge' && (
                      sortDirection === 'asc' ? 
                        <ChevronUp className="ml-1 h-4 w-4" /> : 
                        <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </button>
                </div>
                <div className="w-32 text-center">Jurisdiction</div>
                <div className="w-16"></div> {/* Space for delete button */}
              </div>

              <div className="divide-y divide-border">
                {filteredAndSortedCourts.length === 0 ? (
                  <div className="py-8 text-center">
                    <GavelIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No courts found</p>
                  </div>
                ) : (
                  filteredAndSortedCourts.map((court) => (
                    <div key={court.id} className="flex flex-col md:flex-row md:items-center py-4 px-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start flex-1 min-w-0">
                        <div className="h-10 w-10 flex-shrink-0 rounded bg-primary/10 flex items-center justify-center mr-4">
                          <GavelIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground leading-tight">
                            {court.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {court.location}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 md:mt-0 md:w-48">
                        {court.judge_name}
                      </div>
                      <div className="mt-2 md:mt-0 md:w-32 md:text-center">
                        {court.jurisdiction || '-'}
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
                                This will permanently delete the court record for {court.name}. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                className="bg-destructive hover:bg-destructive/90"
                                onClick={() => handleDelete(court.id)}
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

export default Courts;
