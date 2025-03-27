
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Users, 
  Database, 
  FileStack, 
  ArrowRight,
  BarChart3,
  Activity,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardStats, Case } from '../types';

// Mock data for initial render
const mockDashboardData: DashboardStats = {
  totalCases: 256,
  openCases: 87,
  closedCases: 169,
  totalCriminals: 324,
  totalEvidence: 512,
  totalWitnesses: 189,
  recentCases: [
    {
      id: 1,
      title: 'Armed Robbery - Downtown Bank',
      status: 'open',
      description: 'Armed robbery at First National Bank on Main Street',
      policeStationId: 1,
      createdAt: new Date('2023-05-15'),
      updatedAt: new Date('2023-05-18')
    },
    {
      id: 2,
      title: 'Vehicle Theft - Highland Park',
      status: 'pending',
      description: 'Luxury vehicle stolen from Highland Park residential area',
      policeStationId: 2,
      createdAt: new Date('2023-06-02'),
      updatedAt: new Date('2023-06-05')
    },
    {
      id: 3,
      title: 'Residential Burglary - Westside',
      status: 'closed',
      description: 'Break-in and theft at residential property in Westside neighborhood',
      policeStationId: 1,
      createdAt: new Date('2023-04-10'),
      updatedAt: new Date('2023-04-29')
    },
    {
      id: 4,
      title: 'Assault - Downtown Bar',
      status: 'open',
      description: 'Physical assault reported outside The Blue Note Bar',
      policeStationId: 3,
      createdAt: new Date('2023-06-10'),
      updatedAt: new Date('2023-06-10')
    }
  ]
};

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch dashboard data
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setStats(mockDashboardData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const StatusBadge: React.FC<{ status: Case['status'] }> = ({ status }) => {
    const statusStyles = {
      open: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      closed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      archived: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
    };

    return (
      <span className={`text-xs px-2 py-1 rounded-full uppercase font-medium ${statusStyles[status]}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 rounded-lg bg-muted animate-pulse"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-96 rounded-lg bg-muted animate-pulse"></div>
          <div className="h-96 rounded-lg bg-muted animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return <div>Error loading dashboard data</div>;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the CrimeConnect dashboard.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Cases</p>
                <h2 className="text-3xl font-bold">{stats.totalCases}</h2>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <div className="flex items-center text-green-600">
                <Activity className="h-4 w-4 mr-1" />
                <span>+12% this month</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Open Cases</p>
                <h2 className="text-3xl font-bold">{stats.openCases}</h2>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <div className="flex items-center text-blue-600">
                <BarChart3 className="h-4 w-4 mr-1" />
                <span>{Math.round((stats.openCases / stats.totalCases) * 100)}% of total</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Criminals</p>
                <h2 className="text-3xl font-bold">{stats.totalCriminals}</h2>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Database className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <div className="flex items-center text-red-600">
                <Activity className="h-4 w-4 mr-1" />
                <span>+5% this month</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Evidence</p>
                <h2 className="text-3xl font-bold">{stats.totalEvidence}</h2>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FileStack className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <div className="flex items-center text-yellow-600">
                <Activity className="h-4 w-4 mr-1" />
                <span>+24% this month</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Recent Cases</CardTitle>
              <Link 
                to="/cases"
                className="text-sm font-medium text-primary flex items-center hover:underline"
              >
                View all
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <CardDescription>Overview of the latest case files.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentCases.map((caseItem) => (
                <div key={caseItem.id} className="flex items-start p-3 rounded-lg hover:bg-muted transition-colors">
                  <div className="h-10 w-10 flex-shrink-0 rounded bg-primary/10 flex items-center justify-center mr-4">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link to={`/cases/${caseItem.id}`}>
                      <h3 className="text-sm font-medium truncate hover:text-primary transition-colors">{caseItem.title}</h3>
                    </Link>
                    <p className="text-xs text-muted-foreground mt-1 truncate">{caseItem.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <StatusBadge status={caseItem.status} />
                      <p className="text-xs text-muted-foreground">
                        {new Date(caseItem.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Case Status Distribution</CardTitle>
            <CardDescription>Current status of all registered cases.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <div className="w-full aspect-square flex flex-col items-center justify-center p-6 space-y-4">
              <div className="w-48 h-48 rounded-full border-8 border-primary relative flex items-center justify-center">
                <div className="absolute -top-1 -right-1 w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                  {Math.round((stats.openCases / stats.totalCases) * 100)}%
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{stats.openCases}</div>
                  <div className="text-sm text-muted-foreground">Open Cases</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 w-full">
                <div className="bg-muted rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold">{stats.closedCases}</div>
                  <div className="text-xs text-muted-foreground">Closed</div>
                </div>
                <div className="bg-muted rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold">
                    {stats.totalCases - stats.openCases - stats.closedCases}
                  </div>
                  <div className="text-xs text-muted-foreground">Pending</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
