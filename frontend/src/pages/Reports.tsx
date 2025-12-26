import React, { useState } from 'react';
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Download,
  Calendar,
  Filter,
  RefreshCw,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Shield,
  Lock,
  Radio,
  AlertTriangle,
  Eye,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';

const Reports: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState('crime-statistics');
  const [selectedRegion, setSelectedRegion] = useState('national');

  const generateReport = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Intelligence report generated', {
        description: 'Report SEC-' + Math.floor(10000 + Math.random() * 90000) + ' added to secure vault'
      });
    }, 2000);
  };

  const downloadReport = () => {
    toast.success('Initiating secure download...');
  };

  // Stats data
  const stats = [
    { label: 'Active Investigations', value: '256', change: '+15%', isPositive: true, icon: FileText },
    { label: 'Persons of Interest', value: '648', change: '+5%', isPositive: true, icon: Eye },
    { label: 'Cases Resolved', value: '124', change: '+23%', isPositive: true, icon: Shield },
    { label: 'Threat Level', value: 'ELEVATED', change: '', isPositive: false, icon: AlertTriangle },
  ];

  const recentReports = [
    { id: 1, name: 'Monthly Crime Statistics - December 2023', type: 'Statistical Analysis', date: '2023-12-15', status: 'completed', classification: 'SECRET' },
    { id: 2, name: 'Q4 Regional Threat Assessment', type: 'Threat Assessment', date: '2023-12-10', status: 'completed', classification: 'TOP SECRET' },
    { id: 3, name: 'Cybercrime Trends Analysis', type: 'Trend Analysis', date: '2023-12-08', status: 'completed', classification: 'CONFIDENTIAL' },
    { id: 4, name: 'Organized Crime Network Mapping', type: 'Network Analysis', date: '2023-12-05', status: 'in-progress', classification: 'TOP SECRET' },
    { id: 5, name: 'White-Collar Crime Report', type: 'Statistical Analysis', date: '2023-12-01', status: 'completed', classification: 'SECRET' },
  ];

  const regionData = [
    { region: 'Northeast', cases: 75, threat: 'HIGH', color: 'bg-red-500' },
    { region: 'Southeast', cases: 58, threat: 'MODERATE', color: 'bg-amber-500' },
    { region: 'Midwest', cases: 42, threat: 'LOW', color: 'bg-green-500' },
    { region: 'Southwest', cases: 36, threat: 'MODERATE', color: 'bg-amber-500' },
    { region: 'Western', cases: 64, threat: 'HIGH', color: 'bg-red-500' },
  ];

  const categoryData = [
    { category: 'Cybercrime', percentage: 78, color: 'from-blue-500 to-blue-400' },
    { category: 'Organized Crime', percentage: 62, color: 'from-red-500 to-red-400' },
    { category: 'White-Collar', percentage: 47, color: 'from-amber-500 to-amber-400' },
    { category: 'Violent Crime', percentage: 53, color: 'from-purple-500 to-purple-400' },
    { category: 'Drug Trafficking', percentage: 41, color: 'from-green-500 to-green-400' },
  ];

  const classificationColors: Record<string, string> = {
    'TOP SECRET': 'bg-red-500/10 text-red-500 border-red-500/30',
    'SECRET': 'bg-amber-500/10 text-amber-500 border-amber-500/30',
    'CONFIDENTIAL': 'bg-blue-500/10 text-blue-500 border-blue-500/30',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="fbi-header">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-foreground">Intelligence Reports</h1>
                <span className="classified-badge">CLASSIFIED</span>
              </div>
              <p className="text-sm text-muted-foreground">FBI Intelligence Analysis Center</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
            <Radio className="h-3 w-3 text-green-500 animate-pulse" />
            <span className="text-xs text-green-600 dark:text-green-400 font-medium">LIVE DATA</span>
          </div>
          <Button variant="outline" onClick={downloadReport}>
            <Download className="h-4 w-4 mr-2" />
            Secure Export
          </Button>
          <Button onClick={generateReport} disabled={loading} className="btn-pro">
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Generate Report
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={stat.label} className="card-modern stat-card p-5 group hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center transition-transform group-hover:scale-110">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              {stat.change && (
                <div className={`flex items-center gap-1 text-sm ${stat.isPositive ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
                  {stat.isPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                  {stat.change}
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className={`text-2xl font-bold mt-1 ${stat.label === 'Threat Level' ? 'text-amber-500' : 'text-foreground'}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Filters Card */}
        <div className="card-modern p-6 scan-effect">
          <div className="section-header mb-4">
            <Filter className="section-header-icon" />
            <span>Intelligence Filters</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Report Classification</label>
              <select
                className="input-pro w-full"
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

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Jurisdictional Scope</label>
              <select
                className="input-pro w-full"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
              >
                <option value="national">National (All Territories)</option>
                <option value="northeast">Northeast Region</option>
                <option value="southeast">Southeast Region</option>
                <option value="midwest">Midwest Region</option>
                <option value="southwest">Southwest Region</option>
                <option value="west">Western Region</option>
                <option value="international">International Operations</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Analysis Timeframe</label>
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="date" className="pl-9" />
                </div>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="date" className="pl-9" />
                </div>
              </div>
            </div>

            <Button className="w-full btn-pro" onClick={generateReport} disabled={loading}>
              {loading ? 'Processing...' : 'Process Intelligence Query'}
            </Button>

            {/* Security notice */}
            <div className="p-3 rounded-lg bg-muted/50 border border-border/50 mt-4">
              <div className="flex items-start gap-2">
                <Lock className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <p className="text-xs text-muted-foreground">
                  All queries are logged and subject to security audit. Unauthorized access attempts will be reported.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <div className="card-modern overflow-hidden">
            <Tabs defaultValue="overview" className="w-full">
              <div className="border-b border-border bg-muted/30">
                <TabsList className="w-full justify-start rounded-none border-0 bg-transparent p-0">
                  <TabsTrigger
                    value="overview"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Regional Analysis
                  </TabsTrigger>
                  <TabsTrigger
                    value="trends"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Threat Vectors
                  </TabsTrigger>
                  <TabsTrigger
                    value="distribution"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
                  >
                    <Globe className="h-4 w-4 mr-2" position={1} />
                    Global View
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="overview" className="p-6 m-0">
                <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Globe className="h-4 w-4 text-primary" />
                  Regional Threat Distribution
                </h4>
                <div className="space-y-4">
                  {regionData.map((item) => (
                    <div key={item.region} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 border border-border/50 group hover:border-primary/30 transition-all">
                      <div className="w-24 text-sm font-medium text-foreground">{item.region}</div>
                      <div className="flex-1">
                        <div className="data-bar">
                          <div
                            className="data-bar-fill"
                            style={{ width: `${item.cases}%` }}
                          />
                        </div>
                      </div>
                      <div className="w-12 text-sm text-right font-medium">{item.cases}%</div>
                      <div className={`px-2 py-0.5 rounded text-xs font-medium border ${item.threat === 'HIGH' ? 'bg-red-500/10 text-red-500 border-red-500/30' :
                          item.threat === 'MODERATE' ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' :
                            'bg-green-500/10 text-green-500 border-green-500/30'
                        }`}>
                        {item.threat}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="trends" className="p-6 m-0">
                <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  Crime Category Analysis
                </h4>
                <div className="space-y-4">
                  {categoryData.map((item) => (
                    <div key={item.category} className="flex items-center gap-4">
                      <div className="w-32 text-sm text-foreground">{item.category}</div>
                      <div className="flex-1">
                        <div className="h-3 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-500`}
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                      <div className="w-12 text-sm text-right font-bold">{item.percentage}%</div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="distribution" className="p-6 m-0">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Globe className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Global Intelligence Map</h4>
                  <p className="text-muted-foreground text-sm max-w-md">
                    Interactive global threat visualization requires elevated security clearance.
                  </p>
                  <Button variant="outline" className="mt-4">
                    <Lock className="h-4 w-4 mr-2" />
                    Request Access
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Recent Reports Table */}
      <div className="card-modern overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Recent Intelligence Reports
            </h3>
            <p className="text-sm text-muted-foreground mt-1">Previously generated classified documents</p>
          </div>
          <span className="text-xs text-muted-foreground font-mono">Showing last 5 reports</span>
        </div>

        <div className="overflow-x-auto">
          <table className="table-modern">
            <thead>
              <tr>
                <th>Report Name</th>
                <th>Classification</th>
                <th>Type</th>
                <th>Date</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentReports.map((report) => (
                <tr key={report.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-medium text-foreground">{report.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${classificationColors[report.classification]}`}>
                      {report.classification}
                    </span>
                  </td>
                  <td className="text-muted-foreground">{report.type}</td>
                  <td className="text-muted-foreground font-mono text-xs">{new Date(report.date).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge ${report.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                      {report.status === 'completed' ? 'Completed' : 'In Progress'}
                    </span>
                  </td>
                  <td className="text-right">
                    <Button variant="ghost" size="sm" className="h-8">
                      <Download className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
