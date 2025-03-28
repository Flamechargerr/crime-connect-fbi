
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
  Clock,
  Shield,
  Globe,
  AlertTriangle,
  Search,
  MapPin,
  Radio,
  Eye,
  Lock
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

// Geographic points for map visualization
const geoPoints = [
  { id: 1, x: 20, y: 30, size: 6, pulse: true },
  { id: 2, x: 35, y: 40, size: 4, pulse: false },
  { id: 3, x: 65, y: 25, size: 5, pulse: true },
  { id: 4, x: 78, y: 45, size: 4, pulse: false },
  { id: 5, x: 48, y: 55, size: 5, pulse: true },
  { id: 6, x: 84, y: 65, size: 3, pulse: false },
];

// Security alerts for the dashboard
const securityAlerts = [
  { id: 1, level: 'warning', message: 'Unauthorized access attempt detected in Sector 7', time: '14:22:41' },
  { id: 2, level: 'info', message: 'System security scan completed', time: '13:05:12' },
  { id: 3, level: 'alert', message: 'Multiple login failures for user REDACTED', time: '11:47:28' },
];

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [securityStatus, setSecurityStatus] = useState('NORMAL');

  useEffect(() => {
    // Update time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timeInterval);
  }, []);

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
    
    // Random security status changes
    const securityInterval = setInterval(() => {
      const statuses = ['NORMAL', 'NORMAL', 'NORMAL', 'HEIGHTENED', 'NORMAL', 'CAUTION'];
      setSecurityStatus(statuses[Math.floor(Math.random() * statuses.length)]);
    }, 15000);
    
    return () => clearInterval(securityInterval);
  }, []);

  const StatusBadge: React.FC<{ status: Case['status'] }> = ({ status }) => {
    const statusStyles = {
      open: 'bg-blue-100 text-blue-800 dark:bg-secure-blue/20 dark:text-secure-blue border border-secure-blue/30',
      closed: 'bg-green-100 text-green-800 dark:bg-secure-green/20 dark:text-secure-green border border-secure-green/30',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-secure-yellow/20 dark:text-secure-yellow border border-secure-yellow/30',
      archived: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 border border-gray-500/30'
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
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight inline-flex items-center">
            <span className="animated-text-scan">INTELLIGENCE DASHBOARD</span>
            <span className="ml-3 text-xs bg-primary/10 py-1 px-3 rounded-md border border-primary/20 font-mono">SECURITY LEVEL: {securityStatus}</span>
          </h1>
          <p className="text-muted-foreground mt-1">Federal Bureau of Investigation - Secured Access Terminal</p>
        </div>
        <div className="flex items-center space-x-4 text-muted-foreground text-xs">
          <div className="flex items-center">
            <Clock size={12} className="mr-1.5 text-primary" />
            <span>{currentTime.toLocaleTimeString()}</span>
          </div>
          <div className="flex items-center">
            <Eye size={12} className="mr-1.5 text-primary" />
            <span>ACTIVE AGENTS: 72</span>
          </div>
          <div className="flex items-center">
            <Lock size={12} className="mr-1.5 text-primary" />
            <span>ENCRYPTION: ACTIVE</span>
          </div>
        </div>
      </div>
      
      {/* Global map section */}
      <div className="relative h-[300px] rounded-lg overflow-hidden border border-primary/20 bg-[#061623]">
        <div className="absolute inset-0 opacity-40">
          <img 
            src="/lovable-uploads/0e8f12c1-a3f8-44f9-ae7a-48c73d7f257c.png" 
            alt="Global map"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        
        {/* Geographic points */}
        {geoPoints.map(point => (
          <React.Fragment key={point.id}>
            <div 
              className={`absolute h-${point.size} w-${point.size} rounded-full bg-primary/80 z-30 ${point.pulse ? 'animate-ping-slow' : ''}`}
              style={{ 
                left: `${point.x}%`, 
                top: `${point.y}%`,
                boxShadow: '0 0 10px rgba(0, 156, 255, 0.8)'
              }}
            ></div>
            <div 
              className="absolute h-2 w-2 rounded-full bg-primary z-40"
              style={{ 
                left: `${point.x}%`, 
                top: `${point.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            ></div>
          </React.Fragment>
        ))}
        
        {/* Map connection lines */}
        <svg className="absolute inset-0 z-20" width="100%" height="100%">
          <line x1="20%" y1="30%" x2="35%" y2="40%" stroke="rgba(0, 156, 255, 0.4)" strokeWidth="1" />
          <line x1="35%" y1="40%" x2="65%" y2="25%" stroke="rgba(0, 156, 255, 0.4)" strokeWidth="1" />
          <line x1="65%" y1="25%" x2="78%" y2="45%" stroke="rgba(0, 156, 255, 0.4)" strokeWidth="1" />
          <line x1="78%" y1="45%" x2="48%" y2="55%" stroke="rgba(0, 156, 255, 0.4)" strokeWidth="1" />
          <line x1="48%" y1="55%" x2="84%" y2="65%" stroke="rgba(0, 156, 255, 0.4)" strokeWidth="1" />
        </svg>
        
        {/* Global activity overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/60 backdrop-blur-sm border-t border-primary/30">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-1">
              <Radio size={14} className="text-primary animate-pulse" />
              <span className="text-sm font-semibold">GLOBAL ACTIVITY MONITOR</span>
            </div>
            <div className="flex space-x-4 text-xs">
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-secure-green mr-1.5"></div>
                <span>ACTIVE CASES: {stats.openCases}</span>
              </div>
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-secure-blue mr-1.5"></div>
                <span>TRACKING POINTS: {geoPoints.length}</span>
              </div>
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-secure-yellow mr-1.5"></div>
                <span>ALERTS: {securityAlerts.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card overflow-visible">
          <CardContent className="p-6 relative overflow-visible">
            <div className="absolute -top-3 -right-3 text-xs font-mono bg-black/60 backdrop-blur-md border border-primary/30 rounded-md px-2 py-1 text-primary">
              LEVEL 2 CLEARANCE
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Cases</p>
                <h2 className="text-3xl font-mono mt-1 text-primary">{stats.totalCases}</h2>
              </div>
              <div className="h-12 w-12 rounded-lg flex items-center justify-center holographic-element">
                <FileText className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <div className="flex items-center text-secure-green space-x-1">
                <Activity className="h-4 w-4" />
                <span>+12% this month</span>
              </div>
              <div className="h-1 w-full bg-primary/10 rounded-full ml-3 overflow-hidden">
                <div className="h-full w-2/3 bg-primary/30 rounded-full relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/50 to-primary/10 animate-data-flow"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card overflow-visible">
          <CardContent className="p-6 relative overflow-visible">
            <div className="absolute -top-3 -right-3 text-xs font-mono bg-black/60 backdrop-blur-md border border-secure-blue/30 rounded-md px-2 py-1 text-secure-blue">
              REAL-TIME
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Open Cases</p>
                <h2 className="text-3xl font-mono mt-1 text-secure-blue">{stats.openCases}</h2>
              </div>
              <div className="h-12 w-12 rounded-lg flex items-center justify-center holographic-element">
                <Clock className="h-6 w-6 text-secure-blue" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <div className="flex items-center text-secure-blue space-x-1">
                <BarChart3 className="h-4 w-4" />
                <span>{Math.round((stats.openCases / stats.totalCases) * 100)}% of total</span>
              </div>
              <div className="h-1 w-full bg-secure-blue/10 rounded-full ml-3 overflow-hidden">
                <div 
                  className="h-full bg-secure-blue/30 rounded-full relative"
                  style={{ width: `${Math.round((stats.openCases / stats.totalCases) * 100)}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-secure-blue/10 via-secure-blue/50 to-secure-blue/10 animate-data-flow"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card overflow-visible">
          <CardContent className="p-6 relative overflow-visible">
            <div className="absolute -top-3 -right-3 text-xs font-mono bg-black/60 backdrop-blur-md border border-secure-red/30 rounded-md px-2 py-1 text-secure-red">
              HIGH PRIORITY
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Criminals</p>
                <h2 className="text-3xl font-mono mt-1 text-secure-red">{stats.totalCriminals}</h2>
              </div>
              <div className="h-12 w-12 rounded-lg flex items-center justify-center holographic-element">
                <Database className="h-6 w-6 text-secure-red" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <div className="flex items-center text-secure-red space-x-1">
                <Activity className="h-4 w-4" />
                <span>+5% this month</span>
              </div>
              <div className="h-1 w-full bg-secure-red/10 rounded-full ml-3 overflow-hidden">
                <div className="h-full w-3/4 bg-secure-red/30 rounded-full relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-secure-red/10 via-secure-red/50 to-secure-red/10 animate-data-flow"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card overflow-visible">
          <CardContent className="p-6 relative overflow-visible">
            <div className="absolute -top-3 -right-3 text-xs font-mono bg-black/60 backdrop-blur-md border border-secure-yellow/30 rounded-md px-2 py-1 text-secure-yellow">
              FORENSIC DATA
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Evidence</p>
                <h2 className="text-3xl font-mono mt-1 text-secure-yellow">{stats.totalEvidence}</h2>
              </div>
              <div className="h-12 w-12 rounded-lg flex items-center justify-center holographic-element">
                <FileStack className="h-6 w-6 text-secure-yellow" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <div className="flex items-center text-secure-yellow space-x-1">
                <Activity className="h-4 w-4" />
                <span>+24% this month</span>
              </div>
              <div className="h-1 w-full bg-secure-yellow/10 rounded-full ml-3 overflow-hidden">
                <div className="h-full w-4/5 bg-secure-yellow/30 rounded-full relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-secure-yellow/10 via-secure-yellow/50 to-secure-yellow/10 animate-data-flow"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader className="border-b border-border/40 pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center">
                <FileText size={16} className="mr-2 text-primary" />
                Recent Cases
              </CardTitle>
              <Link 
                to="/cases"
                className="text-sm font-medium text-primary flex items-center hover:underline"
              >
                View all
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <CardDescription>Latest case files with security classification.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/30">
              {stats.recentCases.map((caseItem) => (
                <div key={caseItem.id} className="p-4 hover:bg-primary/5 transition-colors">
                  <div className="flex items-start">
                    <div className="h-10 w-10 flex-shrink-0 rounded holographic-element flex items-center justify-center mr-4">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link to={`/cases/${caseItem.id}`}>
                        <h3 className="text-sm font-medium truncate hover:text-primary transition-colors">{caseItem.title}</h3>
                      </Link>
                      <p className="text-xs text-muted-foreground mt-1 truncate">{caseItem.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <StatusBadge status={caseItem.status} />
                        <div className="flex items-center text-xs text-muted-foreground">
                          <MapPin size={10} className="mr-1" />
                          <span>Station {caseItem.policeStationId}</span>
                          <span className="mx-2">•</span>
                          <span>{new Date(caseItem.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="glass-card">
            <CardHeader className="border-b border-border/40 pb-3">
              <CardTitle className="flex items-center">
                <Shield size={16} className="mr-2 text-primary" />
                Security Alerts
              </CardTitle>
              <CardDescription>Real-time security monitoring and alerts.</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                {securityAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-start p-3 border border-primary/10 rounded-md bg-primary/5">
                    <div className="mr-3 mt-0.5">
                      {alert.level === 'alert' && <AlertTriangle size={16} className="text-secure-red" />}
                      {alert.level === 'warning' && <AlertTriangle size={16} className="text-secure-yellow" />}
                      {alert.level === 'info' && <Shield size={16} className="text-secure-blue" />}
                    </div>
                    <div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium">{alert.message}</span>
                        <span className="ml-auto text-xs text-muted-foreground font-mono">{alert.time}</span>
                      </div>
                      <div className="h-1 w-full mt-2 bg-black/20 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full relative ${
                          alert.level === 'alert' ? 'bg-secure-red/30' :
                          alert.level === 'warning' ? 'bg-secure-yellow/30' : 'bg-secure-blue/30'
                        }`} style={{ width: '70%' }}>
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-data-flow"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="border-b border-border/40 pb-3">
              <CardTitle className="flex items-center">
                <Activity size={16} className="mr-2 text-primary" />
                Case Distribution
              </CardTitle>
              <CardDescription>Current status of all registered cases.</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex items-center justify-center">
                <div className="relative w-40 h-40">
                  {/* Circular progress for open cases */}
                  <div className="absolute inset-0 rounded-full" style={{
                    background: `conic-gradient(rgba(0, 204, 255, 0.8) 0%, 
                                               rgba(0, 204, 255, 0.8) ${(stats.openCases / stats.totalCases) * 100}%, 
                                               rgba(0, 204, 255, 0.1) ${(stats.openCases / stats.totalCases) * 100}%)`
                  }}></div>
                  
                  {/* Inner circle for data */}
                  <div className="absolute inset-[15%] rounded-full bg-black/60 backdrop-blur-md border border-primary/20 flex flex-col items-center justify-center">
                    <div className="text-2xl font-bold text-secure-blue">{stats.openCases}</div>
                    <div className="text-xs text-muted-foreground">Open Cases</div>
                  </div>
                  
                  {/* Percentage indicator */}
                  <div className="absolute -top-4 -right-4 h-8 w-8 rounded-full bg-black/80 border border-secure-blue flex items-center justify-center text-xs font-bold text-secure-blue">
                    {Math.round((stats.openCases / stats.totalCases) * 100)}%
                  </div>
                </div>
                
                {/* Stats boxes */}
                <div className="flex flex-col ml-6 space-y-3 flex-1">
                  <div className="bg-black/40 backdrop-blur-md border border-secure-green/20 rounded-md p-3 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-2 w-2 bg-secure-green rounded-full mr-2"></div>
                      <span className="text-sm">Closed</span>
                    </div>
                    <div className="text-xl font-bold text-secure-green">{stats.closedCases}</div>
                  </div>
                  
                  <div className="bg-black/40 backdrop-blur-md border border-secure-yellow/20 rounded-md p-3 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-2 w-2 bg-secure-yellow rounded-full mr-2"></div>
                      <span className="text-sm">Pending</span>
                    </div>
                    <div className="text-xl font-bold text-secure-yellow">
                      {stats.totalCases - stats.openCases - stats.closedCases}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Data Grid Section */}
      <div className="relative p-4 border border-primary/20 rounded-lg bg-black/40 backdrop-blur-md overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23009cff\" fill-opacity=\"0.02\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
        <div className="absolute inset-0 overflow-hidden">
          <div className="h-full w-px bg-primary/10 absolute left-1/4"></div>
          <div className="h-full w-px bg-primary/10 absolute left-2/4"></div>
          <div className="h-full w-px bg-primary/10 absolute left-3/4"></div>
          <div className="w-full h-px bg-primary/10 absolute top-1/3"></div>
          <div className="w-full h-px bg-primary/10 absolute top-2/3"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-data-grid-scan"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <Search size={14} className="text-primary mr-2" />
              <h3 className="text-sm font-medium">DATABASE ACTIVITY MONITOR</h3>
            </div>
            <div className="flex items-center space-x-4 text-xs">
              <div className="flex items-center">
                <span className="h-1.5 w-1.5 bg-secure-green rounded-full mr-1.5 animate-pulse"></span>
                <span>DATABASE CONNECTED</span>
              </div>
              <div className="flex items-center">
                <span className="h-1.5 w-1.5 bg-secure-blue rounded-full mr-1.5"></span>
                <span>QUERIES: 2,457/hr</span>
              </div>
              <div className="flex items-center">
                <span className="h-1.5 w-1.5 bg-secure-yellow rounded-full mr-1.5"></span>
                <span>ENCRYPTION: AES-256</span>
              </div>
            </div>
          </div>
          
          <div className="data-grid">
            {Array.from({ length: 48 }).map((_, index) => (
              <div key={index} className="data-cell truncate">
                {Math.random().toString(36).substring(2, 6).toUpperCase()}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
