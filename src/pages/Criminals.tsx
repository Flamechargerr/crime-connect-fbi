import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Search, Filter, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Criminal } from '../types';

const mockCriminals: Criminal[] = [
  {
    id: 201,
    firstName: 'Ravi',
    lastName: 'Kumar',
    dateOfBirth: new Date('1985-07-15'),
    biometricData: 'Fingerprint_201',
    photo: undefined,
    createdAt: new Date('2025-03-20'),
    updatedAt: new Date('2025-03-20')
  },
  {
    id: 202,
    firstName: 'Ajay',
    lastName: 'Singh',
    dateOfBirth: new Date('1990-09-22'),
    biometricData: 'Fingerprint_202',
    photo: undefined,
    createdAt: new Date('2025-03-18'),
    updatedAt: new Date('2025-03-18')
  },
  {
    id: 203,
    firstName: 'Neha',
    lastName: 'Sharma',
    dateOfBirth: new Date('1995-12-10'),
    biometricData: 'Fingerprint_203',
    photo: undefined,
    createdAt: new Date('2025-02-25'),
    updatedAt: new Date('2025-02-25')
  }
];

const Criminals: React.FC = () => {
  const [criminals, setCriminals] = useState<Criminal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'date'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    const fetchCriminals = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setCriminals(mockCriminals);
      } catch (error) {
        console.error('Error fetching criminals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCriminals();
  }, []);

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
      criminal.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      criminal.lastName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'name') {
        const nameA = `${a.lastName} ${a.firstName}`.toLowerCase();
        const nameB = `${b.lastName} ${b.firstName}`.toLowerCase();
        return sortDirection === 'asc' 
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      } else {
        return sortDirection === 'asc'
          ? new Date(a.dateOfBirth).getTime() - new Date(b.dateOfBirth).getTime()
          : new Date(b.dateOfBirth).getTime() - new Date(a.dateOfBirth).getTime();
      }
    });

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateAge = (dob: Date) => {
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
              </div>

              <div className="divide-y divide-border">
                {filteredAndSortedCriminals.length === 0 ? (
                  <div className="py-8 text-center">
                    <User className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No criminals found</p>
                  </div>
                ) : (
                  filteredAndSortedCriminals.map((criminal) => (
                    <Link 
                      key={criminal.id} 
                      to={`/criminals/${criminal.id}`}
                      className="block hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex flex-col md:flex-row md:items-center py-4 px-4">
                        <div className="flex items-start flex-1 min-w-0">
                          <div className="h-10 w-10 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium text-foreground leading-tight">
                              {criminal.lastName}, {criminal.firstName}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              ID: {criminal.id}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 md:mt-0 md:w-32 md:text-center text-sm">
                          {calculateAge(criminal.dateOfBirth)} years
                        </div>
                        <div className="mt-2 md:mt-0 md:w-40 md:text-right text-sm text-muted-foreground">
                          {formatDate(criminal.dateOfBirth)}
                        </div>
                      </div>
                    </Link>
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
