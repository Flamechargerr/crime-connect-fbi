
import React, { useState } from 'react';
import { 
  BarChart2, 
  PieChart, 
  LineChart, 
  Download, 
  Calendar, 
  Filter, 
  ChevronDown, 
  RefreshCw, 
  Shield, 
  AlertTriangle, 
  FileText,
  Eye,
  Lock,
  Share2,
  Check,
  MapPin
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

const Reports: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState('crime-statistics');
  const [selectedRegion, setSelectedRegion] = useState('national');
  
  const generateReport = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success('Report generated successfully', {
        description: 'The report has been added to your secure document vault.',
      });
    }, 2000);
  };
  
  const downloadReport = () => {
    toast.info('Preparing encrypted document for download', {
      description: 'Please verify your identity to continue.',
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center">
            <h1 className="text-3xl font-bold tracking-tight">Intelligence Reports</h1>
            <span className="secure-badge-red ml-3">TOP SECRET</span>
          </div>
          <p className="text-muted-foreground mt-1">Comprehensive analysis and data intelligence reports.</p>
        </div>
        
        <div className="flex space-x-2">
          <Button className="flex items-center" onClick={generateReport} disabled={loading}>
            {loading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <BarChart2 className="mr-2 h-4 w-4" />}
            Generate Report
          </Button>
          <Button variant="outline" className="flex items-center" onClick={downloadReport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      <Alert variant="destructive" className="border-fbi-red/40 bg-fbi-red/5">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Security Advisory</AlertTitle>
        <AlertDescription>
          These reports contain classified information. Unauthorized access or distribution is a federal offense.
        </AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-3 space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Shield className="mr-2 h-5 w-5 text-primary" />
                Security Clearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Clearance Level:</span>
                  <span className="secure-badge-green">ALPHA</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Authority:</span>
                  <span className="secure-badge-green">GRANTED</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Access:</span>
                  <span className="secure-badge-yellow">PARTIAL</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Biometric:</span>
                  <span className="secure-badge-green">VERIFIED</span>
                </div>
              </div>
              
              <div className="digital-divider"></div>
              
              <div className="terminal-box text-xs">
                <div className="flex justify-between">
                  <span>28C-6:</span>
                  <span className="text-secure-green"><Check size={12} className="inline" /> APPROVED</span>
                </div>
                <div className="flex justify-between">
                  <span>45A-9:</span>
                  <span className="text-secure-yellow">⚠ LIMITED</span>
                </div>
                <div className="flex justify-between">
                  <span>112F-2:</span>
                  <span className="text-secure-red">⛔ RESTRICTED</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Filter className="mr-2 h-5 w-5 text-primary" />
                Report Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Report Type</label>
                  <select 
                    className="w-full bg-black/30 border border-input rounded-md px-3 py-2 text-sm"
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                  >
                    <option value="crime-statistics">Crime Statistics</option>
                    <option value="criminal-profiling">Criminal Profiling</option>
                    <option value="case-analytics">Case Analytics</option>
                    <option value="geographic-analysis">Geographic Analysis</option>
                    <option value="temporal-patterns">Temporal Patterns</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Region</label>
                  <select 
                    className="w-full bg-black/30 border border-input rounded-md px-3 py-2 text-sm"
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                  >
                    <option value="national">National</option>
                    <option value="northeast">Northeast Region</option>
                    <option value="southeast">Southeast Region</option>
                    <option value="midwest">Midwest Region</option>
                    <option value="southwest">Southwest Region</option>
                    <option value="west">Western Region</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Time Period</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="From"
                        className="w-full pl-10 pr-3 py-2 text-sm bg-black/30 border border-input rounded-md"
                      />
                    </div>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="To"
                        className="w-full pl-10 pr-3 py-2 text-sm bg-black/30 border border-input rounded-md"
                      />
                    </div>
                  </div>
                </div>
                
                <Button className="w-full">Apply Filters</Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="xl:col-span-9 space-y-6">
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-xl flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-primary" />
                  FBI Intelligence Report
                </CardTitle>
                <CardDescription>
                  Comprehensive analysis of crime patterns and statistical data
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs border border-input bg-black/30 px-2 py-1 rounded-full">
                  <Lock size={12} className="inline mr-1" /> EYES ONLY
                </span>
                <span className="text-xs border border-input bg-black/30 px-2 py-1 rounded-full flex items-center">
                  <MapPin size={12} className="mr-1" /> {selectedRegion.toUpperCase()}
                </span>
              </div>
            </CardHeader>
            <div className="px-6">
              <Tabs defaultValue="statistics" className="w-full">
                <TabsList className="w-full bg-black/40 border border-border">
                  <TabsTrigger value="statistics" className="flex-1">
                    <BarChart2 size={16} className="mr-2" /> Statistics
                  </TabsTrigger>
                  <TabsTrigger value="trends" className="flex-1">
                    <LineChart size={16} className="mr-2" /> Trends
                  </TabsTrigger>
                  <TabsTrigger value="demographics" className="flex-1">
                    <PieChart size={16} className="mr-2" /> Demographics
                  </TabsTrigger>
                  <TabsTrigger value="analysis" className="flex-1">
                    <Eye size={16} className="mr-2" /> Analysis
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="statistics" className="p-4 bg-black/20 border border-border mt-4 rounded-md scanner-effect">
                  <div className="confidential-stamp opacity-20">CONFIDENTIAL</div>
                  <h3 className="classified-heading mb-4">Crime Statistics Report</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-black/40 p-4 rounded-md border border-border">
                      <div className="text-lg font-bold text-primary">256</div>
                      <div className="text-sm text-muted-foreground">Active Cases</div>
                      <div className="text-xs text-secure-green mt-2">+15% from last month</div>
                    </div>
                    <div className="bg-black/40 p-4 rounded-md border border-border">
                      <div className="text-lg font-bold text-primary">648</div>
                      <div className="text-sm text-muted-foreground">Suspects Identified</div>
                      <div className="text-xs text-secure-yellow mt-2">+5% from last month</div>
                    </div>
                    <div className="bg-black/40 p-4 rounded-md border border-border">
                      <div className="text-lg font-bold text-primary">124</div>
                      <div className="text-sm text-muted-foreground">Cases Closed</div>
                      <div className="text-xs text-secure-green mt-2">+23% from last month</div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-black/60 via-black/40 to-black/60 h-60 p-4 rounded-md border border-border flex items-center justify-center mb-4">
                    <div className="text-center text-muted-foreground">
                      <BarChart2 size={48} className="mx-auto mb-2 opacity-40" />
                      <p>Interactive crime statistics visualization</p>
                      <p className="text-xs">(Requires security level ALPHA-4 clearance)</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm" className="text-xs">
                      <Eye size={12} className="mr-1" /> View Full Data
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs">
                      <Share2 size={12} className="mr-1" /> Share Report
                    </Button>
                    <Button size="sm" className="text-xs">
                      <Download size={12} className="mr-1" /> Download
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="trends" className="p-4 bg-black/20 border border-border mt-4 rounded-md">
                  <h3 className="classified-heading mb-4">Criminal Activity Trends</h3>
                  <div className="text-muted-foreground text-sm mb-6">
                    Analysis of crime patterns over time, showing seasonal variations and long-term trends.
                  </div>
                  
                  <div className="bg-gradient-to-r from-black/60 via-black/40 to-black/60 h-60 p-4 rounded-md border border-border flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <LineChart size={48} className="mx-auto mb-2 opacity-40" />
                      <p>Trend analysis visualization</p>
                      <p className="text-xs">(Loading secure data...)</p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="demographics" className="space-y-4">
                  <div className="mt-4 text-center text-muted-foreground py-8">
                    <PieChart size={48} className="mx-auto mb-4 opacity-40" />
                    <p>Demographic analysis requires additional clearance.</p>
                    <p className="text-xs mt-2">Please contact your supervisor for access.</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="analysis" className="space-y-4">
                  <div className="mt-4 text-center text-muted-foreground py-8">
                    <Lock size={48} className="mx-auto mb-4 opacity-40" />
                    <p className="text-secure-red">ACCESS DENIED</p>
                    <p className="text-xs mt-2">This section requires TOP SECRET clearance.</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            <CardContent className="pt-4">
              <Accordion type="single" collapsible className="bg-black/30 rounded-md">
                <AccordionItem value="item-1" className="border-b border-border/50">
                  <AccordionTrigger className="px-4 hover:no-underline">
                    <div className="flex items-center text-sm font-medium">
                      <Shield className="mr-2 h-4 w-4 text-primary" />
                      Security Notes
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 text-sm">
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start">
                        <AlertTriangle size={14} className="mr-2 mt-0.5 text-secure-yellow" />
                        <span>This report contains sensitive law enforcement information.</span>
                      </li>
                      <li className="flex items-start">
                        <AlertTriangle size={14} className="mr-2 mt-0.5 text-secure-yellow" />
                        <span>Do not share or distribute without proper authorization.</span>
                      </li>
                      <li className="flex items-start">
                        <AlertTriangle size={14} className="mr-2 mt-0.5 text-secure-yellow" />
                        <span>All access to this data is logged and monitored.</span>
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2" className="border-b border-border/50">
                  <AccordionTrigger className="px-4 hover:no-underline">
                    <div className="flex items-center text-sm font-medium">
                      <FileText className="mr-2 h-4 w-4 text-primary" />
                      Methodology
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 text-sm text-muted-foreground">
                    This report utilizes advanced statistical models and machine learning algorithms to analyze crime patterns across multiple jurisdictions. Data is sourced from the FBI's National Crime Information Center (NCIC), Uniform Crime Reporting (UCR) program, and classified internal databases.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger className="px-4 hover:no-underline">
                    <div className="flex items-center text-sm font-medium">
                      <Calendar className="mr-2 h-4 w-4 text-primary" />
                      Update Schedule
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 text-sm text-muted-foreground">
                    This intelligence report is automatically updated every 24 hours with the latest data from field offices. Manual updates may be performed by authorized personnel with Level 2 clearance or higher.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5 text-secure-yellow" />
                  High Priority Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-black/40 p-3 rounded-md border border-secure-yellow/30">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start">
                        <AlertTriangle size={16} className="mr-2 mt-0.5 text-secure-yellow" />
                        <div>
                          <p className="text-sm font-medium">Potential Suspect Match</p>
                          <p className="text-xs text-muted-foreground">Facial recognition alert for Case #45B28</p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">15m ago</span>
                    </div>
                  </div>
                  
                  <div className="bg-black/40 p-3 rounded-md border border-secure-red/30">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start">
                        <AlertTriangle size={16} className="mr-2 mt-0.5 text-secure-red" />
                        <div>
                          <p className="text-sm font-medium">Security Breach Attempt</p>
                          <p className="text-xs text-muted-foreground">Multiple failed login attempts detected</p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">2h ago</span>
                    </div>
                  </div>
                  
                  <div className="bg-black/40 p-3 rounded-md border border-secure-blue/30">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start">
                        <AlertTriangle size={16} className="mr-2 mt-0.5 text-secure-blue" />
                        <div>
                          <p className="text-sm font-medium">Database Update</p>
                          <p className="text-xs text-muted-foreground">Criminal records synchronized with NCIC</p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">5h ago</span>
                    </div>
                  </div>
                </div>
                
                <Button variant="outline" size="sm" className="w-full mt-4 text-xs">
                  View All Alerts
                </Button>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <BarChart2 className="mr-2 h-5 w-5 text-primary" />
                  Recent Report Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { user: "Agent Johnson", action: "Generated Crime Statistics Report", time: "10:45 AM" },
                    { user: "Director Martinez", action: "Accessed Classified Suspect Profile", time: "Yesterday" },
                    { user: "Agent Thompson", action: "Downloaded Geographic Analysis", time: "2 days ago" },
                    { user: "Agent Wilson", action: "Updated Case Analytics", time: "3 days ago" }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-start pb-3 border-b border-border/50 last:border-0 last:pb-0">
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                        <span className="text-xs font-medium text-primary">
                          {activity.user.charAt(0)}
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
                
                <Button variant="outline" size="sm" className="w-full mt-4 text-xs">
                  View Full Activity Log
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
