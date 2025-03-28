
import React, { useState, useEffect } from 'react';
import { 
  BarChart2, 
  PieChart, 
  LineChart, 
  Download, 
  Calendar, 
  Filter, 
  RefreshCw, 
  Shield, 
  AlertTriangle, 
  FileText,
  Eye,
  Lock,
  Share2,
  Check,
  MapPin,
  Database,
  Terminal,
  Scan,
  Fingerprint,
  FileDigit,
  ServerCrash,
  Satellite,
  Radio
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';

const Reports: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState('crime-statistics');
  const [selectedRegion, setSelectedRegion] = useState('national');
  const [activeAlerts, setActiveAlerts] = useState(3);
  const [securityLevel, setSecurityLevel] = useState('alpha-4');
  const [dataRefreshInterval, setDataRefreshInterval] = useState(60);
  const [isLiveData, setIsLiveData] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    // Update time every second for the real-time clock
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    // Simulate data refresh
    const dataRefreshId = setInterval(() => {
      if (isLiveData) {
        const timestamp = format(new Date(), 'HH:mm:ss');
        console.log(`[DATA_REFRESH] Polling secure database at ${timestamp}`);
      }
    }, dataRefreshInterval * 1000);
    
    // Simulate occasional security alerts
    const alertId = setTimeout(() => {
      toast.warning('Potential security anomaly detected', {
        description: 'System performing automated countermeasure protocol',
        duration: 5000,
      });
    }, 45000);
    
    return () => {
      clearInterval(intervalId);
      clearInterval(dataRefreshId);
      clearTimeout(alertId);
    };
  }, [isLiveData, dataRefreshInterval]);
  
  const generateReport = () => {
    setLoading(true);
    // Simulate API call with typing effect in console
    console.log('[REPORT_GEN] Initializing secure connection to FBI database...');
    setTimeout(() => {
      console.log('[REPORT_GEN] Authenticating credentials...');
    }, 500);
    setTimeout(() => {
      console.log('[REPORT_GEN] Access granted. Decrypting data streams...');
    }, 1200);
    setTimeout(() => {
      console.log('[REPORT_GEN] Compiling intelligence report...');
    }, 1800);
    
    setTimeout(() => {
      setLoading(false);
      toast.success('Intelligence report generated', {
        description: 'Report SEC-' + Math.floor(10000 + Math.random() * 90000) + ' added to secure vault',
        duration: 5000,
      });
      console.log('[REPORT_GEN] Report generation complete. Classification: TOP SECRET');
    }, 2500);
  };
  
  const downloadReport = () => {
    console.log('[SECURITY] Initiating biometric verification sequence...');
    toast.info('Biometric verification required', {
      description: 'Place your fingerprint on the scanner to proceed with download',
      duration: 5000,
    });
    
    setTimeout(() => {
      console.log('[SECURITY] Biometric match confirmed. Preparing encrypted payload...');
      toast.success('Identity verified', {
        description: 'Preparing AES-256 encrypted document for secure transfer',
        duration: 5000,
      });
    }, 3000);
  };
  
  const handleDataRefreshChange = (value: string) => {
    setDataRefreshInterval(parseInt(value));
    toast.success(`Data refresh interval updated to ${value} seconds`);
  };
  
  const toggleLiveData = () => {
    setIsLiveData(!isLiveData);
    toast(isLiveData ? 'Live data feed paused' : 'Live data feed activated', {
      description: isLiveData ? 'Manual refresh only' : 'Auto-refreshing every ' + dataRefreshInterval + ' seconds',
    });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-6">
      {/* System status bar */}
      <div className="flex justify-between items-center sticky top-0 bg-black/40 backdrop-blur-md z-10 -mt-6 -mx-6 px-6 py-2 border-b border-primary/30 text-xs">
        <div className="flex items-center space-x-3">
          <div className="flex items-center">
            <div className="h-2 w-2 bg-secure-green rounded-full animate-pulse mr-1.5"></div>
            <span>SYSTEM ACTIVE</span>
          </div>
          <div className="flex items-center">
            <Terminal size={10} className="mr-1 text-secure-blue" />
            <span>TERMINAL ID: TRM-{Math.floor(10000 + Math.random() * 90000)}</span>
          </div>
          <div className="flex items-center">
            <Database size={10} className="mr-1 text-primary" />
            <span>DB STATUS: CONNECTED</span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center">
            <Satellite size={10} className="mr-1 text-secure-yellow" />
            <span>SIGNAL: ENCRYPTED</span>
          </div>
          <div className="flex items-center">
            <Fingerprint size={10} className="mr-1 text-secure-green" />
            <span>USER: VERIFIED</span>
          </div>
          <div className="font-mono bg-black/30 px-2 py-0.5 rounded border border-primary/20">
            {format(currentTime, 'HH:mm:ss')}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center">
            <div className="mr-3 relative">
              <div className="text-3xl font-bold tracking-tight inline-block bg-gradient-to-r from-white via-primary/70 to-white bg-clip-text text-transparent">
                Intelligence Reports
              </div>
              <div className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
            </div>
            <HoverCard>
              <HoverCardTrigger>
                <span className="secure-badge-red cursor-help">TOP SECRET</span>
              </HoverCardTrigger>
              <HoverCardContent className="w-80 bg-black/80 border border-fbi-red/50 text-xs">
                <div className="flex items-start">
                  <AlertTriangle className="h-4 w-4 text-fbi-red mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-bold mb-1">RESTRICTED ACCESS</p>
                    <p className="text-muted-foreground">This intelligence data is classified TOP SECRET under Executive Order 13526. Unauthorized access or disclosure may result in severe criminal penalties.</p>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
          <p className="text-muted-foreground mt-1 max-w-3xl">
            Comprehensive intelligence analytics and threat assessment reports derived from multi-source classified data networks.
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button className="flex items-center relative overflow-hidden group" onClick={generateReport} disabled={loading}>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-data-flow"></div>
            {loading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                <span className="relative z-10">Processing...</span>
              </>
            ) : (
              <>
                <BarChart2 className="mr-2 h-4 w-4" />
                <span className="relative z-10">Generate Report</span>
              </>
            )}
          </Button>
          <Button variant="outline" className="flex items-center relative overflow-hidden group" onClick={downloadReport}>
            <div className="absolute inset-0 bg-gradient-to-r from-secure-blue/0 via-secure-blue/20 to-secure-blue/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-data-flow"></div>
            <Download className="mr-2 h-4 w-4" />
            <span className="relative z-10">Secure Export</span>
          </Button>
        </div>
      </div>
      
      <Alert variant="destructive" className="border-fbi-red/40 bg-black/40 backdrop-blur-md border-l-4 border-l-fbi-red">
        <AlertTriangle className="h-4 w-4 text-fbi-red" />
        <AlertTitle className="text-fbi-red font-bold tracking-wide">SECURITY ADVISORY</AlertTitle>
        <AlertDescription className="text-foreground/90">
          All data accessed through this terminal is subject to continuous monitoring and audit. 
          Unauthorized access, use, or distribution is strictly prohibited by federal law.
        </AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-3 space-y-6">
          <Card className="glass-card border-primary/20 bg-black/40 backdrop-blur-xl shadow-[0_0_15px_rgba(0,87,184,0.15)]">
            <CardHeader className="border-b border-primary/10 bg-gradient-to-r from-black/60 to-transparent pb-3">
              <CardTitle className="flex items-center text-lg text-white">
                <Shield className="mr-2 h-5 w-5 text-secure-green" />
                Security Clearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Clearance Level:</span>
                  <span className="secure-badge-green">ALPHA-{securityLevel.split('-')[1]}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Authentication:</span>
                  <span className="secure-badge-green flex items-center">
                    <Check size={10} className="mr-1" /> VERIFIED
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Data Access:</span>
                  <span className="secure-badge-yellow">COMPARTMENTALIZED</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Network Status:</span>
                  <span className="secure-badge-green flex items-center">
                    <Radio size={10} className="mr-1 animate-pulse" /> SECURE
                  </span>
                </div>
              </div>
              
              <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent my-3"></div>
              
              <div className="terminal-box text-xs relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-secure-green/5 to-transparent pointer-events-none"></div>
                <div className="relative z-10">
                  <div className="flex justify-between">
                    <span>INTEL_ACCESS:</span>
                    <span className="text-secure-green"><Check size={12} className="inline" /> GRANTED</span>
                  </div>
                  <div className="flex justify-between">
                    <span>FIELD_OPS:</span>
                    <span className="text-secure-yellow">⚠ LIMITED</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SPEC_CLEARANCE:</span>
                    <span className="text-secure-red">⛔ DENIED</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SESSION_TIMEOUT:</span>
                    <span className="text-secure-green">30:00</span>
                  </div>
                  <div className="h-px w-full bg-secure-green/30 my-1.5"></div>
                  <div className="text-xs text-secure-green/70 typing-effect">
                    System monitoring active...
                  </div>
                </div>
              </div>
              
              <div className="mt-3 space-y-3">
                <div className="space-y-1.5">
                  <div className="text-xs font-medium flex items-center">
                    <Database size={12} className="inline mr-1.5 text-secure-blue" />
                    Data Refresh Interval
                  </div>
                  <ToggleGroup type="single" value={dataRefreshInterval.toString()} onValueChange={handleDataRefreshChange} className="justify-between bg-black/50 p-1 rounded border border-primary/10">
                    <ToggleGroupItem value="30" size="sm" className="text-xs">30s</ToggleGroupItem>
                    <ToggleGroupItem value="60" size="sm" className="text-xs">60s</ToggleGroupItem>
                    <ToggleGroupItem value="120" size="sm" className="text-xs">120s</ToggleGroupItem>
                  </ToggleGroup>
                </div>
                
                <div className="space-y-1.5">
                  <div className="text-xs font-medium flex items-center">
                    <Radio size={12} className="inline mr-1.5 text-secure-blue" />
                    Live Data Feed
                  </div>
                  <div className="flex items-center justify-between bg-black/50 px-3 py-2 rounded border border-primary/10">
                    <span className="text-xs text-muted-foreground">Auto-Refresh</span>
                    <Switch 
                      checked={isLiveData} 
                      onCheckedChange={toggleLiveData}
                      className="data-[state=checked]:bg-secure-green"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card border-primary/20 bg-black/40 backdrop-blur-xl shadow-[0_0_15px_rgba(0,87,184,0.15)]">
            <CardHeader className="border-b border-primary/10 bg-gradient-to-r from-black/60 to-transparent pb-3">
              <CardTitle className="flex items-center text-lg text-white">
                <Filter className="mr-2 h-5 w-5 text-secure-blue" />
                Intelligence Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Report Classification</label>
                  <select 
                    className="w-full bg-black/60 border border-input rounded-md px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                  >
                    <option value="crime-statistics">Crime Statistical Analysis</option>
                    <option value="criminal-profiling">Subject Psychological Profiling</option>
                    <option value="case-analytics">Case Progression Analytics</option>
                    <option value="geographic-analysis">Geo-Spatial Intelligence</option>
                    <option value="temporal-patterns">Temporal Pattern Recognition</option>
                    <option value="network-analysis">Criminal Network Mapping</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Jurisdictional Scope</label>
                  <select 
                    className="w-full bg-black/60 border border-input rounded-md px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                  >
                    <option value="national">National (All Territories)</option>
                    <option value="northeast">Northeast Region (Field Office 03)</option>
                    <option value="southeast">Southeast Region (Field Office 06)</option>
                    <option value="midwest">Midwest Region (Field Office 09)</option>
                    <option value="southwest">Southwest Region (Field Office 12)</option>
                    <option value="west">Western Region (Field Office 15)</option>
                    <option value="international">International Operations</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Analysis Timeframe</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="From"
                        className="w-full pl-10 pr-3 py-2 text-sm bg-black/60 border border-input rounded-md focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                      />
                    </div>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="To"
                        className="w-full pl-10 pr-3 py-2 text-sm bg-black/60 border border-input rounded-md focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Additional Criteria</label>
                  <Textarea 
                    placeholder="Enter search parameters..."
                    className="resize-none h-20 bg-black/60 focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  />
                </div>
                
                <Button className="w-full bg-gradient-to-r from-secure-blue/80 to-primary/80 hover:from-secure-blue hover:to-primary transition-all duration-300">
                  <Scan className="mr-2 h-4 w-4" />
                  Process Intelligence Query
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="xl:col-span-9 space-y-6">
          <Card className="glass-card border-primary/20 bg-black/40 backdrop-blur-xl shadow-[0_0_15px_rgba(0,87,184,0.15)] relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-30"></div>
              <div className="absolute top-1 bottom-1 left-0 w-1 bg-gradient-to-b from-transparent via-primary to-transparent opacity-30"></div>
              <div className="absolute top-1 bottom-1 right-0 w-1 bg-gradient-to-b from-transparent via-primary to-transparent opacity-30"></div>
            </div>
            
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-primary/10 bg-gradient-to-r from-black/70 to-black/40 relative z-10">
              <div>
                <CardTitle className="text-xl flex items-center">
                  <FileDigit className="mr-2 h-5 w-5 text-secure-blue" />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-primary/90">
                    FBI Intelligence Report #{Math.floor(10000 + Math.random() * 90000)}
                  </span>
                </CardTitle>
                <CardDescription>
                  Advanced analysis of criminal activity patterns with multi-source intelligence integration
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs border border-secure-red/50 bg-secure-red/10 px-2 py-1 rounded-md flex items-center">
                  <Lock size={10} className="inline mr-1.5" /> CLASSIFIED
                </span>
                <span className="text-xs border border-primary/40 bg-primary/10 px-2 py-1 rounded-md flex items-center animate-pulse">
                  <Radio size={10} className="mr-1.5" /> LIVE DATA
                </span>
                <span className="text-xs border border-primary/40 bg-primary/10 px-2 py-1 rounded-md flex items-center">
                  <MapPin size={10} className="mr-1.5" /> {selectedRegion.toUpperCase()}
                </span>
              </div>
            </CardHeader>
            <div className="relative z-10">
              <Tabs defaultValue="statistics" className="w-full">
                <TabsList className="w-full bg-gradient-to-r from-black/70 via-black/60 to-black/70 border border-primary/20 p-0 h-auto">
                  <TabsTrigger value="statistics" className="flex-1 data-[state=active]:bg-primary/20 data-[state=active]:text-white py-1.5">
                    <BarChart2 size={14} className="mr-2" /> Analytics
                  </TabsTrigger>
                  <TabsTrigger value="trends" className="flex-1 data-[state=active]:bg-primary/20 data-[state=active]:text-white py-1.5">
                    <LineChart size={14} className="mr-2" /> Trends
                  </TabsTrigger>
                  <TabsTrigger value="demographics" className="flex-1 data-[state=active]:bg-primary/20 data-[state=active]:text-white py-1.5">
                    <PieChart size={14} className="mr-2" /> Demographics
                  </TabsTrigger>
                  <TabsTrigger value="analysis" className="flex-1 data-[state=active]:bg-primary/20 data-[state=active]:text-white py-1.5">
                    <Eye size={14} className="mr-2" /> Threat Assessment
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="statistics" className="p-4 bg-black/60 border border-primary/20 mt-4 rounded-md scanner-effect">
                  <div className="confidential-stamp opacity-20 rotate-[-12deg] z-10">TOP SECRET</div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg px-3 py-1 bg-gradient-to-r from-black/80 to-transparent border-l-4 border-secure-blue text-white flex items-center">
                      <FileText size={16} className="mr-2 text-secure-blue" />
                      Criminal Activity Statistical Analysis
                    </h3>
                    <div className="text-xs text-muted-foreground">
                      Reference: INT-{Math.floor(10000 + Math.random() * 90000)}
                    </div>
                  </div>
                  
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-gradient-to-br from-black/80 via-black/60 to-black/80 p-4 rounded-md border border-primary/30 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-r from-secure-blue/0 via-secure-blue/5 to-secure-blue/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="text-2xl font-bold text-white mb-1">256</div>
                        <div className="text-sm text-muted-foreground">Active Investigations</div>
                        <div className="text-xs text-secure-green mt-2 flex items-center">
                          <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7 17L17 7M17 7H8M17 7V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          15% increase from previous period
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-secure-blue to-transparent opacity-30"></div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-black/80 via-black/60 to-black/80 p-4 rounded-md border border-primary/30 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-r from-secure-blue/0 via-secure-blue/5 to-secure-blue/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="text-2xl font-bold text-white mb-1">648</div>
                        <div className="text-sm text-muted-foreground">Persons of Interest</div>
                        <div className="text-xs text-secure-yellow mt-2 flex items-center">
                          <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7 17L17 7M17 7H8M17 7V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          5% increase from previous period
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-secure-yellow to-transparent opacity-30"></div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-black/80 via-black/60 to-black/80 p-4 rounded-md border border-primary/30 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-r from-secure-blue/0 via-secure-blue/5 to-secure-blue/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="text-2xl font-bold text-white mb-1">124</div>
                        <div className="text-sm text-muted-foreground">Cases Resolved</div>
                        <div className="text-xs text-secure-green mt-2 flex items-center">
                          <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7 17L17 7M17 7H8M17 7V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          23% increase from previous period
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-secure-green to-transparent opacity-30"></div>
                      </div>
                    </div>
                    
                    <div className="bg-black/70 rounded-md border border-primary/20 p-5 mb-6 relative overflow-hidden">
                      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDU3YjgiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0di00aC0ydjRoLTR2Mmg0djRoMnYtNGg0di0yaC00em0wLTMwVjBoLTJ2NGgtNHYyaDR2NGgyVjZoNFY0aC00ek02IDM0di00SDR2NGgwdjJoNHY0aDJ2LTRoNHYtMkg2ek02IDRWMEg0djRIMHYyaDR2NGgyVjZoNFY0SDZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-5"></div>
                      <div className="mb-4 flex justify-between items-center">
                        <h4 className="font-semibold text-white">Intelligence Visualization</h4>
                        <div className="text-xs bg-secure-blue/20 border border-secure-blue/30 px-2 py-0.5 rounded text-secure-blue">
                          REAL-TIME DATA
                        </div>
                      </div>
                      <div className="relative h-60 rounded bg-black/40 border border-primary/10 flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0">
                          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
                          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
                          <div className="grid grid-cols-6 h-full w-full">
                            {Array.from({ length: 6 }).map((_, i) => (
                              <div key={i} className="border-r border-primary/10 h-full" />
                            ))}
                          </div>
                          <div className="grid grid-rows-6 h-full w-full">
                            {Array.from({ length: 6 }).map((_, i) => (
                              <div key={i} className="border-b border-primary/10 w-full" />
                            ))}
                          </div>
                        </div>
                        <div className="text-center text-muted-foreground z-10">
                          <BarChart2 size={48} className="mx-auto mb-3 opacity-40 text-primary" />
                          <p>Advanced visualization requires ALPHA-6 clearance</p>
                          <p className="text-xs mt-1 text-primary/70">Contact your security officer for access</p>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-right text-muted-foreground">
                        Source: Integrated Criminal Intelligence System (ICIS)
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-black/70 p-4 rounded-md border border-primary/20 space-y-3">
                        <h4 className="text-sm font-semibold text-white">Geographic Distribution</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs">Northeast Region</span>
                            <div className="flex items-center">
                              <div className="h-2 w-32 bg-black/40 rounded-full overflow-hidden mr-2">
                                <div className="h-full bg-gradient-to-r from-secure-blue to-primary rounded-full" style={{ width: '75%' }}></div>
                              </div>
                              <span className="text-xs">75%</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs">Southeast Region</span>
                            <div className="flex items-center">
                              <div className="h-2 w-32 bg-black/40 rounded-full overflow-hidden mr-2">
                                <div className="h-full bg-gradient-to-r from-secure-blue to-primary rounded-full" style={{ width: '58%' }}></div>
                              </div>
                              <span className="text-xs">58%</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs">Midwest Region</span>
                            <div className="flex items-center">
                              <div className="h-2 w-32 bg-black/40 rounded-full overflow-hidden mr-2">
                                <div className="h-full bg-gradient-to-r from-secure-blue to-primary rounded-full" style={{ width: '42%' }}></div>
                              </div>
                              <span className="text-xs">42%</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs">Southwest Region</span>
                            <div className="flex items-center">
                              <div className="h-2 w-32 bg-black/40 rounded-full overflow-hidden mr-2">
                                <div className="h-full bg-gradient-to-r from-secure-blue to-primary rounded-full" style={{ width: '36%' }}></div>
                              </div>
                              <span className="text-xs">36%</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs">Western Region</span>
                            <div className="flex items-center">
                              <div className="h-2 w-32 bg-black/40 rounded-full overflow-hidden mr-2">
                                <div className="h-full bg-gradient-to-r from-secure-blue to-primary rounded-full" style={{ width: '64%' }}></div>
                              </div>
                              <span className="text-xs">64%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-black/70 p-4 rounded-md border border-primary/20 space-y-3">
                        <h4 className="text-sm font-semibold text-white">Case Classification</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs">Organized Crime</span>
                            <div className="flex items-center">
                              <div className="h-2 w-32 bg-black/40 rounded-full overflow-hidden mr-2">
                                <div className="h-full bg-gradient-to-r from-secure-red to-fbi-red rounded-full" style={{ width: '62%' }}></div>
                              </div>
                              <span className="text-xs">62%</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs">White-Collar</span>
                            <div className="flex items-center">
                              <div className="h-2 w-32 bg-black/40 rounded-full overflow-hidden mr-2">
                                <div className="h-full bg-gradient-to-r from-secure-blue to-primary rounded-full" style={{ width: '47%' }}></div>
                              </div>
                              <span className="text-xs">47%</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs">Terrorism</span>
                            <div className="flex items-center">
                              <div className="h-2 w-32 bg-black/40 rounded-full overflow-hidden mr-2">
                                <div className="h-full bg-gradient-to-r from-secure-red to-fbi-red rounded-full" style={{ width: '31%' }}></div>
                              </div>
                              <span className="text-xs">31%</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs">Cybercrimes</span>
                            <div className="flex items-center">
                              <div className="h-2 w-32 bg-black/40 rounded-full overflow-hidden mr-2">
                                <div className="h-full bg-gradient-to-r from-secure-yellow to-fbi-gold rounded-full" style={{ width: '78%' }}></div>
                              </div>
                              <span className="text-xs">78%</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs">Violent Crimes</span>
                            <div className="flex items-center">
                              <div className="h-2 w-32 bg-black/40 rounded-full overflow-hidden mr-2">
                                <div className="h-full bg-gradient-to-r from-secure-blue to-primary rounded-full" style={{ width: '53%' }}></div>
                              </div>
                              <span className="text-xs">53%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                  
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button variant="outline" size="sm" className="text-xs">
                      <Eye size={12} className="mr-1" /> Access Complete Dataset
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs">
                      <Share2 size={12} className="mr-1" /> Distribute Report
                    </Button>
                    <Button size="sm" className="text-xs bg-gradient-to-r from-secure-blue/80 to-primary/80 hover:from-secure-blue hover:to-primary border-none">
                      <Download size={12} className="mr-1" /> Secure Download
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="trends" className="p-4 bg-black/60 border border-primary/20 mt-4 rounded-md scanner-effect">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg px-3 py-1 bg-gradient-to-r from-black/80 to-transparent border-l-4 border-secure-blue text-white flex items-center">
                      <LineChart size={16} className="mr-2 text-secure-blue" />
                      Temporal Pattern Analysis
                    </h3>
                    <div className="text-xs text-muted-foreground">
                      Data Refresh: {format(new Date(), 'HH:mm:ss')}
                    </div>
                  </div>
                  <div className="text-muted-foreground text-sm mb-6">
                    Advanced time-series analysis of criminal activity patterns with predictive modeling.
                  </div>
                  
                  <div className="relative h-60 rounded bg-black/40 border border-primary/10 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0">
                      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
                      <div className="grid grid-cols-6 h-full w-full">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <div key={i} className="border-r border-primary/10 h-full" />
                        ))}
                      </div>
                      <div className="grid grid-rows-6 h-full w-full">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <div key={i} className="border-b border-primary/10 w-full" />
                        ))}
                      </div>
                    </div>
                    <div className="text-center text-muted-foreground z-10">
                      <LineChart size={48} className="mx-auto mb-3 opacity-40 text-primary" />
                      <p>Temporal analysis visualization</p>
                      <p className="text-xs mt-1">(Decrypting secure data...)</p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="demographics" className="mt-4 text-center text-muted-foreground py-6 bg-black/60 border border-primary/20 rounded-md">
                  <div className="relative">
                    <PieChart size={48} className="mx-auto mb-4 opacity-40" />
                    <div className="bg-secure-yellow/80 text-black font-bold px-4 py-2 rounded-md inline-block transform -rotate-3">
                      CLEARANCE LEVEL INSUFFICIENT
                    </div>
                    <p className="text-xs mt-4 max-w-md mx-auto">
                      Demographic analysis requires ALPHA-6 clearance. Your current clearance level is ALPHA-{securityLevel.split('-')[1]}.
                      Please contact your supervisor to request elevated access privileges.
                    </p>
                    <div className="mt-4">
                      <Button variant="outline" size="sm" className="text-xs border-secure-yellow text-secure-yellow hover:bg-secure-yellow/10">
                        Request Access Elevation
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="analysis" className="mt-4 text-center text-muted-foreground py-6 bg-black/60 border border-primary/20 rounded-md">
                  <div className="relative">
                    <div className="absolute inset-0 bg-fbi-red/5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-fbi-red/20 via-transparent to-transparent opacity-50"></div>
                    <div className="relative z-10">
                      <Lock size={48} className="mx-auto mb-4 opacity-60 text-fbi-red" />
                      <div className="bg-fbi-red/90 text-white font-bold px-4 py-2 rounded-md inline-block transform -rotate-3">
                        ACCESS DENIED
                      </div>
                      <p className="text-xs mt-4 max-w-md mx-auto text-fbi-red">
                        This section contains TOP SECRET intelligence data. Access is restricted to personnel with ALPHA-7 clearance and above.
                      </p>
                      <p className="text-xs mt-2 max-w-md mx-auto text-muted-foreground">
                        NOTICE: All access attempts are logged and monitored. Unauthorized access attempts may result in administrative action.
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            <CardContent className="pt-4 relative z-10">
              <Accordion type="single" collapsible className="bg-black/60 rounded-md shadow-inner">
                <AccordionItem value="item-1" className="border-b border-primary/10">
                  <AccordionTrigger className="px-4 hover:no-underline">
                    <div className="flex items-center text-sm font-medium">
                      <Shield className="mr-2 h-4 w-4 text-secure-green" />
                      Security Protocols
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 text-sm">
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start">
                        <AlertTriangle size={14} className="mr-2 mt-0.5 text-secure-yellow" />
                        <span>This intelligence report contains sensitive law enforcement information (LEI).</span>
                      </li>
                      <li className="flex items-start">
                        <AlertTriangle size={14} className="mr-2 mt-0.5 text-secure-yellow" />
                        <span>Distribution restricted to personnel with minimum ALPHA-4 clearance.</span>
                      </li>
                      <li className="flex items-start">
                        <AlertTriangle size={14} className="mr-2 mt-0.5 text-secure-yellow" />
                        <span>All system interactions are cryptographically logged in accordance with CFR 28.543.</span>
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2" className="border-b border-primary/10">
                  <AccordionTrigger className="px-4 hover:no-underline">
                    <div className="flex items-center text-sm font-medium">
                      <FileText className="mr-2 h-4 w-4 text-primary" />
                      Analytical Methodology
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 text-sm text-muted-foreground">
                    <p>
                      This intelligence report leverages advanced machine learning algorithms and predictive analytics to identify patterns across multiple federal criminal databases. Data sources include the FBI's National Crime Information Center (NCIC), Uniform Crime Reporting (UCR) program, Terrorist Screening Database (TSDB), and classified internal repositories.
                    </p>
                    <div className="mt-2 px-3 py-2 bg-black/40 border border-primary/10 rounded text-xs">
                      <div className="font-mono text-primary/80">Algorithm: ADA-ML59 (Adaptive Decision Architecture)</div>
                      <div className="font-mono text-primary/80">Confidence Level: 94.7%</div>
                      <div className="font-mono text-primary/80">Margin of Error: ±2.3%</div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger className="px-4 hover:no-underline">
                    <div className="flex items-center text-sm font-medium">
                      <Calendar className="mr-2 h-4 w-4 text-primary" />
                      Data Lifecycle
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 text-sm text-muted-foreground">
                    <p>
                      This intelligence report is automatically updated every {dataRefreshInterval} seconds with the latest data from field offices nationwide. Tactical intelligence has a 4-hour refresh cycle, while strategic intelligence is updated every 24 hours. Manual refreshes may be initiated by personnel with appropriate authorization.
                    </p>
                    <div className="mt-2 flex justify-between text-xs">
                      <span>Last Full Update: {format(new Date(Date.now() - 1000 * 60 * 30), 'yyyy-MM-dd HH:mm:ss')} UTC</span>
                      <span>Next Scheduled Update: {format(new Date(Date.now() + 1000 * 60 * 60 * 4), 'yyyy-MM-dd HH:mm:ss')} UTC</span>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-card border-primary/20 bg-black/40 backdrop-blur-xl shadow-[0_0_15px_rgba(0,87,184,0.15)]">
              <CardHeader className="border-b border-primary/10 bg-gradient-to-r from-black/60 to-transparent pb-3">
                <CardTitle className="text-lg flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5 text-secure-yellow" />
                  Priority Intelligence Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ScrollArea className="h-[250px] pr-4">
                  <div className="space-y-4">
                    <div className="bg-black/70 p-3 rounded-md border-l-4 border-secure-yellow relative group animate-pulse hover:animate-none">
                      <div className="absolute inset-0 bg-gradient-to-r from-secure-yellow/0 via-secure-yellow/5 to-secure-yellow/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-md"></div>
                      <div className="flex justify-between items-start">
                        <div className="flex items-start">
                          <AlertTriangle size={16} className="mr-2 mt-0.5 text-secure-yellow flex-shrink-0" />
                          <div className="relative z-10">
                            <p className="text-sm font-medium flex items-center">
                              Facial Recognition Alert
                              <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] bg-secure-yellow/20 text-secure-yellow">ACTIVE</span>
                            </p>
                            <p className="text-xs text-muted-foreground">Subject match detected for case #FBI-45B28 (87% confidence)</p>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">15m ago</span>
                      </div>
                    </div>
                    
                    <div className="bg-black/70 p-3 rounded-md border-l-4 border-secure-red relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-secure-red/0 via-secure-red/5 to-secure-red/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-md"></div>
                      <div className="flex justify-between items-start">
                        <div className="flex items-start">
                          <ServerCrash size={16} className="mr-2 mt-0.5 text-secure-red flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium">Security Breach Attempt</p>
                            <p className="text-xs text-muted-foreground">Unauthorized access attempt from 192.168.14.23</p>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">2h ago</span>
                      </div>
                    </div>
                    
                    <div className="bg-black/70 p-3 rounded-md border-l-4 border-secure-blue relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-secure-blue/0 via-secure-blue/5 to-secure-blue/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-md"></div>
                      <div className="flex justify-between items-start">
                        <div className="flex items-start">
                          <Database size={16} className="mr-2 mt-0.5 text-secure-blue flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium">Database Synchronization Complete</p>
                            <p className="text-xs text-muted-foreground">Criminal records updated with latest NCIC data</p>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">5h ago</span>
                      </div>
                    </div>
                    
                    <div className="bg-black/70 p-3 rounded-md border-l-4 border-primary relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-md"></div>
                      <div className="flex justify-between items-start">
                        <div className="flex items-start">
                          <Eye size={16} className="mr-2 mt-0.5 text-primary flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium">Surveillance System Update</p>
                            <p className="text-xs text-muted-foreground">Citywide CCTV integration completed for Boston area</p>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">8h ago</span>
                      </div>
                    </div>
                    
                    <div className="bg-black/70 p-3 rounded-md border-l-4 border-secure-green relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-secure-green/0 via-secure-green/5 to-secure-green/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-md"></div>
                      <div className="flex justify-between items-start">
                        <div className="flex items-start">
                          <Shield size={16} className="mr-2 mt-0.5 text-secure-green flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium">System Security Update</p>
                            <p className="text-xs text-muted-foreground">Cryptographic protocols upgraded to AES-512</p>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">12h ago</span>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
                
                <Button variant="outline" size="sm" className="w-full mt-4 text-xs bg-black/60 border-primary/20 hover:bg-primary/10 hover:text-white transition-colors">
                  <Eye className="mr-2 h-4 w-4" />
                  View All Intelligence Alerts ({activeAlerts} Active)
                </Button>
              </CardContent>
            </Card>
            
            <Card className="glass-card border-primary/20 bg-black/40 backdrop-blur-xl shadow-[0_0_15px_rgba(0,87,184,0.15)]">
              <CardHeader className="border-b border-primary/10 bg-gradient-to-r from-black/60 to-transparent pb-3">
                <CardTitle className="text-lg flex items-center">
                  <FileDigit className="mr-2 h-5 w-5 text-primary" />
                  Recent Intelligence Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ScrollArea className="h-[250px] pr-4">
                  <div className="space-y-3">
                    {[
                      { user: "SA Johnson", action: "Generated Statistical Analysis Report", time: "10:45 AM", avatar: "J", color: "bg-secure-blue/30 text-secure-blue" },
                      { user: "Director Martinez", action: "Accessed Classified Subject Profile", time: "Yesterday", avatar: "M", color: "bg-secure-red/30 text-secure-red" },
                      { user: "SA Thompson", action: "Downloaded Geographic Analysis", time: "2 days ago", avatar: "T", color: "bg-primary/30 text-primary" },
                      { user: "Analyst Wilson", action: "Updated Case Analytics", time: "3 days ago", avatar: "W", color: "bg-secure-green/30 text-secure-green" },
                      { user: "SA Rodriguez", action: "Initiated Cross-Reference Search", time: "4 days ago", avatar: "R", color: "bg-secure-yellow/30 text-secure-yellow" },
                      { user: "Tech Chen", action: "Updated Analysis Algorithm", time: "5 days ago", avatar: "C", color: "bg-primary/30 text-primary" }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-start pb-3 border-b border-primary/10 last:border-0 last:pb-0 group">
                        <div className={`h-8 w-8 rounded-full ${activity.color} flex items-center justify-center mr-3 group-hover:ring-2 group-hover:ring-primary/30 transition-all`}>
                          <span className="text-xs font-medium">
                            {activity.avatar}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <p className="text-sm font-medium">{activity.user}</p>
                            <span className="text-xs text-muted-foreground">{activity.time}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{activity.action}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                
                <Button variant="outline" size="sm" className="w-full mt-4 text-xs bg-black/60 border-primary/20 hover:bg-primary/10 hover:text-white transition-colors">
                  <FileText className="mr-2 h-4 w-4" />
                  Access Complete Activity Logs
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Bottom status bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/50 backdrop-blur-md py-1 px-6 z-10 border-t border-primary/30 flex justify-between items-center text-xs">
        <div className="flex items-center space-x-3">
          <div className="flex items-center">
            <div className="h-1.5 w-1.5 bg-secure-green rounded-full animate-pulse mr-1"></div>
            <span>SECURE CONNECTION</span>
          </div>
          <div>
            SESSION ID: {Math.random().toString(36).substring(2, 15).toUpperCase()}
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div>
            <span className="text-muted-foreground mr-1">API:</span>
            <span className="text-secure-green">ONLINE</span>
          </div>
          <div>
            <span className="text-muted-foreground mr-1">ENCRYPTION:</span>
            <span className="text-secure-green">AES-256</span>
          </div>
          <div className="font-mono text-primary/80">
            {format(currentTime, 'HH:mm:ss')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;

