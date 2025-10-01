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
  Lock,
  Lightbulb
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { mockDashboardData } from '../types';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';

const sampleCorkboardItems = [
  { id: '1', position: { x: 20, y: 30 }, type: 'wanted' },
  { id: '2', position: { x: 60, y: 40 }, type: 'photo' },
  { id: '3', position: { x: 40, y: 70 }, type: 'note' },
];

const geoPoints = [
  { id: 1, x: 20, y: 30, size: 6, pulse: true },
  { id: 2, x: 35, y: 40, size: 4, pulse: false },
  { id: 3, x: 65, y: 25, size: 5, pulse: true },
  { id: 4, x: 78, y: 45, size: 4, pulse: false },
  { id: 5, x: 48, y: 55, size: 5, pulse: true },
  { id: 6, x: 84, y: 65, size: 3, pulse: false },
];

const securityAlerts = [
  { id: 1, level: 'warning', message: 'Unauthorized access attempt detected in Sector 7', time: '14:22:41' },
  { id: 2, level: 'info', message: 'System security scan completed', time: '13:05:12' },
  { id: 3, level: 'alert', message: 'Multiple login failures for user REDACTED', time: '11:47:28' },
];

const Dashboard = () => {
  const { isDemo } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [securityStatus, setSecurityStatus] = useState('NORMAL');

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timeInterval);
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setStats(mockDashboardData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    
    const securityInterval = setInterval(() => {
      const statuses = ['NORMAL', 'NORMAL', 'NORMAL', 'HEIGHTENED', 'NORMAL', 'CAUTION'];
      setSecurityStatus(statuses[Math.floor(Math.random() * statuses.length)]);
    }, 15000);
    
    return () => clearInterval(securityInterval);
  }, []);

  const StatusBadge = ({ status }) => {
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

  const CorkboardPreview = () => {
    return (
      <div className="relative w-full h-40 bg-amber-800/90 rounded-lg overflow-hidden border border-primary/30">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'150\' height=\'150\' viewBox=\'0 0 150 150\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.7\' numOctaves=\'2\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%\' height=\'100%\' filter=\'url(%23noise)\' opacity=\'0.1\'/%3E%3C/svg%3E')]">
          {sampleCorkboardItems.map((item) => (
            <div
              key={item.id}
              className={`absolute shadow-md ${
                item.type === 'wanted' 
                  ? 'bg-red-100 border-red-300' 
                  : item.type === 'photo' 
                    ? 'bg-blue-100 border-blue-300' 
                    : 'bg-yellow-100 border-yellow-300'
              } border p-1 w-12 h-12 flex items-center justify-center rounded-sm transform rotate-1`}
              style={{
                left: `${item.position.x}%`,
                top: `${item.position.y}%`,
                transformOrigin: 'center',
              }}
            >
              {item.type === 'wanted' && <Search className="h-6 w-6 text-red-600" />}
              {item.type === 'photo' && <FileText className="h-6 w-6 text-blue-600" />}
              {item.type === 'note' && <Lightbulb className="h-6 w-6 text-yellow-600" />}
            </div>
          ))}
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-xs text-white">
          Investigation Board - Active Case #45B28
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {isDemo && (
        <div className="bg-yellow-200 text-yellow-900 border border-yellow-400 rounded p-3 mb-4 text-center font-semibold">
          Demo Mode: You are logged in as a demo admin. No real authentication or data is used.
        </div>
      )}
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
      
      {/* Global Activity Monitor */}
      <div className="relative h-[300px] rounded-lg overflow-hidden border border-primary/20 bg-[#061623]">
        <div className="absolute inset-0 opacity-40">
          <div className="w-full h-full bg-gradient-to-br from-primary/20 via-transparent to-secure-blue/20"></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        
        {geoPoints.map(point => (
          <div key={point.id} style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
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
          </div>
        ))}
        
        <svg className="absolute inset-0 z-20" width="100%" height="100%">
          <line x1="20%" y1="30%" x2="35%" y2="40%" stroke="rgba(0, 156, 255, 0.4)" strokeWidth="1" />
          <line x1="35%" y1="40%" x2="65%" y2="25%" stroke="rgba(0, 156, 255, 0.4)" strokeWidth="1" />
          <line x1="65%" y1="25%" x2="78%" y2="45%" stroke="rgba(0, 156, 255, 0.4)" strokeWidth="1" />
          <line x1="78%" y1="45%" x2="48%" y2="55%" stroke="rgba(0, 156, 255, 0.4)" strokeWidth="1" />
          <line x1="48%" y1="55%" x2="84%" y2="65%" stroke="rgba(0, 156, 255, 0.4)" strokeWidth="1" />
        </svg>
        
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

      {/* Stats Cards */}
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
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Cases */}
        <Card className="glass-card col-span-1">
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
              {stats.recentCases.slice(0, 3).map((caseItem) => (
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
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Case Distribution */}
        <Card className="glass-card col-span-1">
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
                <div className="absolute inset-0 rounded-full" style={{
                  background: `conic-gradient(rgba(0, 204, 255, 0.8) 0%, 
                                             rgba(0, 204, 255, 0.8) ${(stats.openCases / stats.totalCases) * 100}%, 
                                             rgba(0, 204, 255, 0.1) ${(stats.openCases / stats.totalCases) * 100}%)`
                }}></div>
                
                <div className="absolute inset-[15%] rounded-full bg-black/60 backdrop-blur-md border border-primary/20 flex flex-col items-center justify-center">
                  <div className="text-2xl font-bold text-secure-blue">{stats.openCases}</div>
                  <div className="text-xs text-muted-foreground">Open Cases</div>
                </div>
                
                <div className="absolute -top-4 -right-4 h-8 w-8 rounded-full bg-black/80 border border-secure-blue flex items-center justify-center text-xs font-bold text-secure-blue">
                  {Math.round((stats.openCases / stats.totalCases) * 100)}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Investigation Board */}
        <Card className="glass-card col-span-1">
          <CardHeader className="border-b border-border/40 pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center">
                <MapPin size={16} className="mr-2 text-primary" />
                Investigation Board
              </CardTitle>
              <Link 
                to="/corkboard"
                className="text-sm font-medium text-primary flex items-center hover:underline"
              >
                Open board
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <CardDescription>Case evidence and intelligence mapping.</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <CorkboardPreview />
            <div className="mt-4 flex justify-between items-center">
              <div className="text-xs text-muted-foreground">
                <span className="text-secure-red font-medium">12 evidence items</span> connected with <span className="text-secure-blue font-medium">8 relationships</span>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/corkboard">
                  View full board
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Alerts */}
      <Card className="glass-card">
        <CardHeader className="border-b border-border/40 pb-3">
          <CardTitle className="flex items-center">
            <Shield size={16} className="mr-2 text-primary" />
            Security Alerts
          </CardTitle>
          <CardDescription>Real-time security monitoring and alerts.</CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;