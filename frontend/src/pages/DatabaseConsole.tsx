import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getCases, getCrimes, getMe } from '@/lib/api';
import { 
  Database, Terminal, Activity, ShieldAlert, HardDrive, 
  Play, RefreshCw, ArrowRight, Clock, 
  Search, Pause, Download, Copy, Check, ChevronDown, ChevronRight, Trash2
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

// Mock Transaction Templates for streaming log
const SIMULATED_TRANS = [
  { sql: 'SELECT * FROM cases ORDER BY created_at DESC', table: 'cases', type: 'READ', duration: '3.8ms' },
  { sql: 'SELECT * FROM users WHERE email = ?', table: 'users', type: 'READ', duration: '1.2ms' },
  { sql: 'INSERT INTO cases (title, description, priority) VALUES (?, ?, ?)', table: 'cases', type: 'WRITE', duration: '12.4ms' },
  { sql: 'SELECT * FROM crimes LIMIT 50', table: 'crimes', type: 'API_READ', duration: '138.2ms' },
  { sql: 'UPDATE cases SET status = ? WHERE id = ?', table: 'cases', type: 'WRITE', duration: '8.9ms' },
  { sql: 'SELECT COUNT(*) FROM crimes WHERE arrest = true', table: 'crimes', type: 'API_READ', duration: '146.5ms' },
  { sql: 'DELETE FROM cases WHERE id = ?', table: 'cases', type: 'WRITE', duration: '14.1ms' },
];

const PRESET_QUERIES = [
  { label: 'High Priority Cases', sql: "SELECT * FROM cases WHERE priority = 'high';" },
  { label: 'Current Users', sql: "SELECT * FROM users;" },
  { label: 'Chicago Crime Data', sql: "SELECT * FROM crimes WHERE type = 'THEFT' LIMIT 5;" },
  { label: 'Show Schemas', sql: "SHOW TABLES;" }
];

// Table Schemas Meta
const SCHEMAS = {
  users: {
    engine: 'SQLite / PostgreSQL (SQLAlchemy)',
    columns: [
      { name: 'id', type: 'VARCHAR(36)', key: 'PRI', desc: 'Primary key (UUIDv4)' },
      { name: 'email', type: 'VARCHAR(255)', key: 'UNI', desc: 'Unique account login email' },
      { name: 'hashed_password', type: 'VARCHAR(512)', key: '', desc: 'Bcrypt hashed credential' },
      { name: 'name', type: 'VARCHAR(128)', key: '', desc: 'Full agent display name' },
      { name: 'role', type: 'VARCHAR(32)', key: '', desc: 'Access role (e.g., administrator, analyst)' },
      { name: 'created_at', type: 'TIMESTAMP', key: '', desc: 'Account registration time (UTC)' }
    ]
  },
  cases: {
    engine: 'SQLite / PostgreSQL (SQLAlchemy)',
    columns: [
      { name: 'id', type: 'VARCHAR(36)', key: 'PRI', desc: 'Primary key (UUIDv4)' },
      { name: 'title', type: 'VARCHAR(256)', key: '', desc: 'Incident case title description' },
      { name: 'description', type: 'TEXT', key: '', desc: 'Detailed case notes and clues log' },
      { name: 'status', type: 'VARCHAR(32)', key: '', desc: 'Current status (open, in_progress, closed)' },
      { name: 'priority', type: 'VARCHAR(32)', key: '', desc: 'Priority rating (low, medium, high, critical)' },
      { name: 'assigned_to', type: 'VARCHAR(128)', key: '', desc: 'Assigned FBI special agent name' },
      { name: 'created_at', type: 'TIMESTAMP', key: '', desc: 'Case creation timestamp (UTC)' },
      { name: 'updated_at', type: 'TIMESTAMP', key: '', desc: 'Last record update timestamp (UTC)' }
    ]
  },
  crimes: {
    engine: 'Socrata Open Data API (Virtual)',
    columns: [
      { name: 'id', type: 'VARCHAR(20)', key: 'PRI', desc: 'Unique Chicago database record identifier' },
      { name: 'case_number', type: 'VARCHAR(12)', key: 'UNI', desc: 'FBI/Chicago Case report index' },
      { name: 'date', type: 'TIMESTAMP', key: '', desc: 'Date of incident occurrence' },
      { name: 'primary_type', type: 'VARCHAR(64)', key: 'MUL', desc: 'Core crime category designation' },
      { name: 'description', type: 'VARCHAR(128)', key: '', desc: 'Detailed sub-classification' },
      { name: 'location_description', type: 'VARCHAR(128)', key: '', desc: 'Physical environment type description' },
      { name: 'arrest', type: 'BOOLEAN', key: '', desc: 'Arrest custody flag' },
      { name: 'domestic', type: 'BOOLEAN', key: '', desc: 'Domestic dispute flag' },
      { name: 'district', type: 'VARCHAR(8)', key: '', desc: 'Chicago police district number' },
      { name: 'latitude', type: 'DOUBLE', key: '', desc: 'Geographic coordinate latitude' },
      { name: 'longitude', type: 'DOUBLE', key: '', desc: 'Geographic coordinate longitude' }
    ]
  }
};

export default function DatabaseConsole() {
  const [activeTab, setActiveTab] = useState<'diagnostics' | 'logs' | 'sql'>('diagnostics');
  
  // SQL Terminal state
  const [queryInput, setQueryInput] = useState("SELECT * FROM cases WHERE priority = 'high';");
  const [queryOutput, setQueryOutput] = useState<any>(null);
  const [executing, setExecuting] = useState(false);
  const [queryError, setQueryError] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([
    "SELECT * FROM cases;",
    "SHOW TABLES;",
    "SELECT * FROM users;"
  ]);
  const [copied, setCopied] = useState(false);

  // Live Transaction Log state
  const [logs, setLogs] = useState<any[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [logSearch, setLogSearch] = useState('');
  const [logTypeFilter, setLogTypeFilter] = useState<string>('ALL');
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Diagnostics Live Chart Telemetry State
  const [telemetryHistory, setTelemetryHistory] = useState<any[]>([]);
  
  // Schema explorer toggle states
  const [expandedTable, setExpandedTable] = useState<string | null>('cases');

  // Fetch real data to bind with query executor
  const { data: realCases } = useQuery({ queryKey: ['cases'], queryFn: getCases });
  const { data: realCrimes } = useQuery({ queryKey: ['crimes'], queryFn: () => getCrimes({ limit: '5' }) });
  const { data: realUser } = useQuery({ queryKey: ['me'], queryFn: getMe });

  // Generate live chart telemetry updates
  useEffect(() => {
    // Initial data points
    const points = Array.from({ length: 15 }).map((_, i) => ({
      time: i * 2,
      latency: parseFloat((Math.random() * 3 + 2).toFixed(1)),
      connections: Math.floor(Math.random() * 4 + 10)
    }));
    setTelemetryHistory(points);

    const interval = setInterval(() => {
      setTelemetryHistory(prev => {
        const nextTime = prev[prev.length - 1].time + 2;
        const newPoint = {
          time: nextTime,
          latency: parseFloat((Math.random() * 3 + 2).toFixed(1)),
          connections: Math.floor(Math.random() * 4 + 10)
        };
        return [...prev.slice(1), newPoint];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Initialize and stream logs
  useEffect(() => {
    // Generate initial logs
    const initialLogs = Array.from({ length: 10 }).map((_, idx) => {
      const template = SIMULATED_TRANS[Math.floor(Math.random() * SIMULATED_TRANS.length)];
      const date = new Date(Date.now() - (10 - idx) * 15000);
      return {
        ...template,
        timestamp: date.toLocaleTimeString(),
        id: Math.random().toString(36).substr(2, 9),
        status: 'SUCCESS'
      };
    });
    setLogs(initialLogs);

    // Dynamic logging stream
    const interval = setInterval(() => {
      if (isPaused) return;

      const template = SIMULATED_TRANS[Math.floor(Math.random() * SIMULATED_TRANS.length)];
      const newLog = {
        ...template,
        timestamp: new Date().toLocaleTimeString(),
        id: Math.random().toString(36).substr(2, 9),
        status: Math.random() > 0.98 ? 'TIMEOUT' : 'SUCCESS'
      };
      setLogs(prev => [...prev.slice(-40), newLog]);
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Auto-scroll logs
  useEffect(() => {
    if (activeTab === 'logs' && logsEndRef.current && !isPaused) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, activeTab, isPaused]);

  // Editor Dynamic Line Numbers calculation
  const lineNumbers = queryInput.split('\n').map((_, idx) => idx + 1);

  // SQL Execution Handler
  const handleExecuteQuery = (customSql?: string) => {
    const targetSql = customSql || queryInput;
    setExecuting(true);
    setQueryError(null);
    setQueryOutput(null);

    // Save to history list
    if (!history.includes(targetSql) && targetSql.trim()) {
      setHistory(prev => [targetSql, ...prev.slice(0, 14)]);
    }

    setTimeout(() => {
      setExecuting(false);
      const cleanQuery = targetSql.trim().toLowerCase().replace(/\s+/g, ' ');

      // Log the action to the streaming logs
      const customLog = {
        sql: targetSql,
        table: cleanQuery.includes('from cases') ? 'cases' : cleanQuery.includes('from users') ? 'users' : cleanQuery.includes('from crimes') ? 'crimes' : 'system',
        type: 'CONSOLE_QUERY',
        duration: `${(Math.random() * 10 + 5).toFixed(1)}ms`,
        timestamp: new Date().toLocaleTimeString(),
        id: Math.random().toString(36).substr(2, 9),
        status: 'SUCCESS'
      };
      setLogs(prev => [...prev, customLog]);

      if (cleanQuery.includes('from cases')) {
        const priorityFilter = cleanQuery.includes("priority = 'high'") || cleanQuery.includes('priority="high"');
        let data = realCases || [];
        if (priorityFilter) {
          data = data.filter((c: any) => c.priority?.toLowerCase() === 'high');
        }
        setQueryOutput({
          columns: ['id', 'title', 'status', 'priority', 'assigned_to'],
          rows: data.map((c: any) => [
            c.id?.slice(0, 8) || 'N/A', 
            c.title || 'Untitled', 
            c.status || 'N/A', 
            c.priority || 'N/A', 
            c.assigned_to || 'Unassigned'
          ]),
          metrics: { count: data.length, time: customLog.duration }
        });
        toast.success(`Query executed successfully: returned ${data.length} records.`);
      } else if (cleanQuery.includes('from users')) {
        const user = realUser || { name: 'Demo Agent', email: 'demo@crimeconnect.fbi', role: 'analyst', id: '1' };
        setQueryOutput({
          columns: ['id', 'name', 'email', 'role', 'clearance'],
          rows: [[
            user.id?.slice(0, 8) || '1', 
            user.name || 'Anonymous', 
            user.email || 'N/A', 
            user.role || 'N/A', 
            'ALPHA'
          ]],
          metrics: { count: 1, time: customLog.duration }
        });
        toast.success(`Query executed successfully: returned 1 record.`);
      } else if (cleanQuery.includes('from crimes')) {
        const data = realCrimes || [];
        setQueryOutput({
          columns: ['id', 'case_number', 'primary_type', 'description', 'arrest', 'district'],
          rows: data.map((c: any) => [
            c.id || 'N/A', 
            c.case_number || 'N/A', 
            c.primary_type || 'N/A', 
            c.description || 'N/A', 
            c.arrest ? 'TRUE' : 'FALSE', 
            c.district || 'N/A'
          ]),
          metrics: { count: data.length, time: customLog.duration }
        });
        toast.success(`Query executed successfully: returned ${data.length} records.`);
      } else if (cleanQuery.includes('show tables') || cleanQuery.includes('show_tables')) {
        setQueryOutput({
          columns: ['table_name', 'engine_type', 'row_count', 'indices'],
          rows: [
            ['users', 'SQLAlchemy / SQLite', String(realUser ? 1 : 1), 'email_idx (UNIQUE)'],
            ['cases', 'SQLAlchemy / SQLite', String(realCases?.length || 4), 'PRIMARY_KEY (id)'],
            ['crimes', 'Chicago Open Data API (Virtual)', '5,000 (buffered)', 'date_idx, primary_type_idx']
          ],
          metrics: { count: 3, time: customLog.duration }
        });
        toast.success('System tables schemas resolved.');
      } else {
        setQueryError('Syntax Error: Unknown schema or syntax pattern. SELECT query is allowed on tables "cases", "users", "crimes" or use "SHOW TABLES".');
        toast.error('Query execution failed. Check console error output.');
      }
    }, 600);
  };

  // Helper to load schema templates directly into SQL console
  const handleLoadSchemaTemplate = (tableName: string) => {
    setQueryInput(`SELECT * FROM ${tableName} LIMIT 10;`);
    setActiveTab('sql');
    toast.info(`Query template for "${tableName}" loaded to terminal.`);
  };

  // Export Output to JSON
  const handleExportJSON = () => {
    if (!queryOutput) return;
    const records = queryOutput.rows.map((row: string[]) => {
      const obj: Record<string, string> = {};
      queryOutput.columns.forEach((col: string, idx: number) => {
        obj[col] = row[idx];
      });
      return obj;
    });

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(records, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `fbi_db_export_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success('Database export downloaded successfully.');
  };

  // Copy output to clipboard
  const handleCopyToClipboard = () => {
    if (!queryOutput) return;
    const headers = queryOutput.columns.join('\t');
    const rows = queryOutput.rows.map((r: string[]) => r.join('\t')).join('\n');
    navigator.clipboard.writeText(`${headers}\n${rows}`);
    setCopied(true);
    toast.success('Query output copied to clipboard.');
    setTimeout(() => setCopied(false), 2000);
  };

  // Clear streaming logs
  const handleClearLogs = () => {
    setLogs([]);
    toast.info('Transaction log memory cleared.');
  };

  // Filtering live transaction logs
  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.sql.toLowerCase().includes(logSearch.toLowerCase()) || 
                          log.table.toLowerCase().includes(logSearch.toLowerCase());
    const matchesType = logTypeFilter === 'ALL' || log.type === logTypeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* ── BREADCRUMB & REALTIME STATE HEADER ── */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-border/40 pb-4">
        <div>
          <h1 className="text-2xl font-bold font-mono tracking-wider text-white uppercase text-glow">
            DATABASE COMMAND CENTER
          </h1>
          <p className="text-muted-foreground text-xs font-mono uppercase mt-1">
            Core diagnostic control board & secure query terminal
          </p>
        </div>

        {/* System telemetry pills */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 bg-success/5 border border-success/30 px-3 py-1.5 rounded-lg text-success text-glow">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            ENGINE: ACTIVE
          </div>
          <div className="bg-primary/5 border border-primary/20 px-3 py-1.5 rounded-lg text-primary/80">
            PING: 4.2ms
          </div>
        </div>
      </div>

      {/* ── CONSOLE TAB SWITCHER ── */}
      <div className="flex border-b border-border/40 font-mono text-xs uppercase tracking-wider bg-black/10 p-0.5 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('diagnostics')}
          className={`px-4 py-2 rounded-md transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'diagnostics' ? 'bg-primary/10 text-primary border border-primary/20 text-glow font-semibold' : 'text-muted-foreground hover:text-white'}`}
        >
          <Activity className="h-3.5 w-3.5" /> DIAGNOSTICS
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2 rounded-md transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'logs' ? 'bg-primary/10 text-primary border border-primary/20 text-glow font-semibold' : 'text-muted-foreground hover:text-white'}`}
        >
          <Clock className="h-3.5 w-3.5" /> TRANSACTION LOGS
        </button>
        <button
          onClick={() => setActiveTab('sql')}
          className={`px-4 py-2 rounded-md transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'sql' ? 'bg-primary/10 text-primary border border-primary/20 text-glow font-semibold' : 'text-muted-foreground hover:text-white'}`}
        >
          <Terminal className="h-3.5 w-3.5" /> SQL CONSOLE
        </button>
      </div>

      {/* ───── TAB 1: DIAGNOSTICS ───── */}
      {activeTab === 'diagnostics' && (
        <div className="space-y-6 animate-fade-in">
          {/* Health Diagnostics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Active Connections', value: '14 / 120', status: 'Healthy', metricColor: 'text-white', icon: Database },
              { label: 'Cache Hit Ratio', value: '98.4%', status: 'Optimal', metricColor: 'text-white', icon: HardDrive },
              { label: 'Ingestion Rate', value: '46.8 req/s', status: 'Synced', metricColor: 'text-white', icon: Clock },
              { label: 'Diagnostics Engine', value: 'SQLAlchemy', status: 'Active', metricColor: 'text-primary', icon: Terminal }
            ].map((diag, idx) => (
              <motion.div
                key={diag.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <Card className="card-intel relative overflow-hidden">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{diag.label}</div>
                      <diag.icon className="h-4 w-4 text-primary/60" />
                    </div>
                    <div className={`text-2xl font-bold font-mono tracking-tight ${diag.metricColor} text-glow`}>
                      {diag.value}
                    </div>
                    <div className="flex items-center gap-1 mt-2 text-[9px] font-mono text-success uppercase">
                      <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                      {diag.status}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Recharts Line Telemetry and schema listings */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Live Chart Telemetry */}
            <Card className="card-intel lg:col-span-2">
              <CardHeader className="border-b border-border/40 pb-3">
                <CardTitle className="text-xs font-mono uppercase tracking-wider text-white flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary animate-pulse" /> DB_ENGINE_LIVE_LATENCY_FEED
                </CardTitle>
                <CardDescription className="text-[10px] font-mono uppercase">
                  Real-time query latency response feed (ms) & active connections stream.
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[280px] pt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={telemetryHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="latencyGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.02}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={9} className="font-mono" tickFormatter={(v) => `${v}s ago`} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={9} className="font-mono" />
                    <Tooltip
                      contentStyle={{
                        background: 'rgba(5, 7, 10, 0.95)',
                        border: '1px solid rgba(0, 255, 255, 0.2)',
                        borderRadius: 10,
                        color: '#FFF',
                        fontFamily: 'monospace',
                        fontSize: 10
                      }}
                      labelFormatter={(l) => `Timeframe: ${l}s`}
                    />
                    <Area type="monotone" dataKey="latency" name="Latency (ms)" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#latencyGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Interactive Schema Navigator */}
            <Card className="card-intel lg:col-span-1">
              <CardHeader className="border-b border-border/40 pb-3">
                <CardTitle className="text-xs font-mono uppercase tracking-wider text-white flex items-center gap-2">
                  <Database className="h-4 w-4 text-primary" /> SCHEMA_EXPLORER
                </CardTitle>
                <CardDescription className="text-[10px] font-mono uppercase">
                  Logical table designs registered with the active database scope.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {Object.entries(SCHEMAS).map(([tableName, meta]) => {
                  const isExpanded = expandedTable === tableName;
                  return (
                    <div key={tableName} className="border border-border/40 rounded-lg overflow-hidden bg-black/10">
                      <button
                        onClick={() => setExpandedTable(isExpanded ? null : tableName)}
                        className="w-full flex items-center justify-between p-3 font-mono text-xs uppercase tracking-wider text-white hover:bg-white/[0.02] transition-colors cursor-pointer text-left"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-primary">{tableName}</span>
                          <span className="text-[9px] text-muted-foreground lowercase">({meta.columns.length} columns)</span>
                        </div>
                        {isExpanded ? <ChevronDown className="h-4 w-4 text-primary" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                      </button>

                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            className="overflow-hidden border-t border-border/30 bg-black/35"
                          >
                            <div className="p-3 space-y-2.5 text-[10px] font-mono">
                              <div className="text-[9px] text-primary/60 uppercase">Engine: {meta.engine}</div>
                              <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
                                {meta.columns.map((col) => (
                                  <div key={col.name} className="flex justify-between border-b border-white/[0.02] pb-1.5 last:border-0 last:pb-0">
                                    <div>
                                      <span className="text-white font-bold">{col.name}</span>
                                      {col.key && <span className="text-[8px] bg-primary/20 text-primary border border-primary/20 rounded px-1 ml-1.5">{col.key}</span>}
                                      <div className="text-muted-foreground text-[9px] leading-relaxed mt-0.5">{col.desc}</div>
                                    </div>
                                    <span className="text-primary/70 text-[9px] shrink-0 ml-4">{col.type}</span>
                                  </div>
                                ))}
                              </div>
                              <Button
                                size="sm"
                                onClick={() => handleLoadSchemaTemplate(tableName)}
                                className="w-full text-[10px] h-7 font-mono uppercase bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 mt-2"
                              >
                                Generate SELECT Query
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ───── TAB 2: TRANSACTION LOGS ───── */}
      {activeTab === 'logs' && (
        <div className="space-y-4 animate-fade-in">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-card/40 border border-border/50 p-4 rounded-xl backdrop-blur-md">
            {/* Filter Buttons */}
            <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase">
              {['ALL', 'READ', 'WRITE', 'API_READ', 'CONSOLE_QUERY'].map((t) => (
                <button
                  key={t}
                  onClick={() => setLogTypeFilter(t)}
                  className={`px-3 py-1.5 rounded border transition-all cursor-pointer ${logTypeFilter === t ? 'bg-primary/15 border-primary/30 text-primary text-glow font-bold' : 'bg-black/20 border-transparent text-muted-foreground hover:text-white'}`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Pause, Search and Clear Actions */}
            <div className="flex items-center gap-3 flex-1 md:flex-initial">
              <div className="relative flex-1 md:flex-initial">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="FILTER LOGS..."
                  value={logSearch}
                  onChange={(e) => setLogSearch(e.target.value)}
                  className="bg-black/45 border border-border/80 outline-none rounded-lg py-1.5 pl-8 pr-3 font-mono text-[10px] text-white placeholder:text-muted-foreground/30 focus:border-primary/50 w-full md:w-48 text-left"
                />
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPaused(!isPaused)}
                className={`h-8 font-mono text-[10px] uppercase tracking-wider gap-1.5 cursor-pointer ${isPaused ? 'border-warning/30 text-warning bg-warning/5 hover:bg-warning/10' : 'border-border'}`}
              >
                {isPaused ? <Play className="h-3 w-3 fill-current" /> : <Pause className="h-3 w-3 fill-current" />}
                {isPaused ? 'Resume' : 'Pause'}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleClearLogs}
                className="h-8 border-destructive/20 text-destructive bg-destructive/5 hover:bg-destructive/10 font-mono text-[10px] uppercase tracking-wider gap-1.5 cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" /> Clear
              </Button>
            </div>
          </div>

          {/* Logs Terminal Block */}
          <Card className="card-intel relative overflow-hidden">
            <div className="absolute left-0 right-0 h-[1px] bg-primary/10 animate-scan top-0 pointer-events-none" />
            <CardContent className="pt-4 bg-black/40">
              <div className="h-[440px] overflow-y-auto font-mono text-[11px] space-y-2.5 pr-2 scrollbar-thin">
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <div key={log.id} className="flex items-start justify-between gap-4 py-2 border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors rounded px-2">
                      <div className="flex items-start gap-3">
                        <span className="text-primary/45 shrink-0 select-none">[{log.timestamp}]</span>
                        <div>
                          <Badge className={`font-bold text-[8px] uppercase ${log.type === 'WRITE' ? 'bg-warning/10 text-warning border-warning/20' : log.type === 'CONSOLE_QUERY' ? 'bg-primary/20 text-primary border-primary/20' : 'bg-secondary/15 text-secondary border-secondary/20'}`}>
                            {log.type}
                          </Badge>
                          <span className="text-muted-foreground font-mono ml-2">on</span>
                          <span className="text-white font-semibold ml-1">[{log.table}]</span>
                          <div className="text-white/70 font-mono mt-1 break-all bg-black/20 p-1.5 rounded border border-border/20">{log.sql}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 mt-1">
                        <span className="text-primary/70">{log.duration}</span>
                        <Badge className={log.status === 'SUCCESS' ? 'bg-success/10 text-success border-success/30 font-bold text-[8px]' : 'bg-destructive/10 text-destructive border-destructive/30 font-bold text-[8px]'}>
                          {log.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-muted-foreground text-[10px] uppercase">
                    <Terminal className="h-8 w-8 text-primary/25 mb-2" />
                    <span>NO_TRANSACTIONS_LOGGED_MATCHING_FILTER</span>
                  </div>
                )}
                <div ref={logsEndRef} />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ───── TAB 3: SQL TERMINAL ───── */}
      {activeTab === 'sql' && (
        <div className="grid lg:grid-cols-3 gap-6 animate-fade-in">
          {/* Query Templates & History Column */}
          <div className="lg:col-span-1 space-y-4">
            {/* Presets Card */}
            <Card className="card-intel">
              <CardHeader className="pb-3 border-b border-border/40">
                <CardTitle className="text-xs font-mono uppercase tracking-wider text-white">QUERY_TEMPLATES</CardTitle>
                <CardDescription className="text-[10px] font-mono uppercase text-muted-foreground">Select a database template to execute.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 pt-4">
                {PRESET_QUERIES.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => {
                      setQueryInput(p.sql);
                      setQueryError(null);
                      setQueryOutput(null);
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-lg border border-border/70 bg-white/[0.01] hover:bg-primary/5 hover:border-primary/20 transition-all font-mono text-[10px] text-white/80 flex items-center justify-between group cursor-pointer"
                  >
                    <span>{p.label}</span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* History Card */}
            <Card className="card-intel">
              <CardHeader className="pb-3 border-b border-border/40">
                <CardTitle className="text-xs font-mono uppercase tracking-wider text-white">QUERY_HISTORY</CardTitle>
                <CardDescription className="text-[10px] font-mono uppercase text-muted-foreground">Recent console queries. Click to re-run.</CardDescription>
              </CardHeader>
              <CardContent className="pt-4 pr-2 max-h-[200px] overflow-y-auto scrollbar-thin space-y-2">
                {history.length > 0 ? (
                  history.map((h, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setQueryInput(h);
                        handleExecuteQuery(h);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded border border-white/[0.03] bg-black/10 hover:bg-white/[0.02] transition-all font-mono text-[9px] text-muted-foreground hover:text-white break-all cursor-pointer"
                    >
                      {h}
                    </button>
                  ))
                ) : (
                  <div className="text-[9px] text-muted-foreground uppercase font-mono py-2">No history logged yet.</div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* IDE-style Code Editor & output results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Custom Code Editor */}
            <Card className="card-intel relative overflow-hidden">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-primary/50">SQL Editor Console</span>
                  <Badge variant="outline" className="text-[8px] font-mono uppercase border-primary/20 text-primary">Mode: SQLite (Active)</Badge>
                </div>
                
                {/* Editor Container with numbers gutter */}
                <div className="relative flex rounded-lg border border-border/80 bg-black/65 overflow-hidden min-h-[160px]">
                  {/* Left Gutter: Line Numbers */}
                  <div className="bg-black/35 py-3.5 px-3 border-r border-border/40 text-right font-mono text-xs select-none text-muted-foreground/45 min-w-[34px] leading-relaxed">
                    {lineNumbers.map(n => <div key={n}>{n}</div>)}
                  </div>
                  {/* Right: Textarea */}
                  <textarea
                    value={queryInput}
                    onChange={(e) => setQueryInput(e.target.value)}
                    className="w-full bg-transparent p-3.5 font-mono text-xs text-white focus:outline-none resize-none leading-relaxed min-h-[160px]"
                    spellCheck="false"
                  />
                  {executing && (
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-[1px] flex items-center justify-center">
                      <div className="flex flex-col items-center gap-2">
                        <RefreshCw className="h-6 w-6 text-primary animate-spin" />
                        <span className="text-[10px] font-mono text-primary uppercase animate-pulse">Parsing SQLite AST...</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end mt-4">
                  <Button
                    onClick={() => handleExecuteQuery()}
                    disabled={executing || !queryInput.trim()}
                    className="gap-2 shadow-[0_0_15px_rgba(0,255,255,0.15)] hover:shadow-[0_0_25px_rgba(0,255,255,0.3)] transition-shadow duration-300"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" /> Run Query
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Results Grid Output */}
            <Card className="card-intel bg-black/30 relative overflow-hidden min-h-[220px]">
              <CardHeader className="border-b border-border/40 py-3 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xs font-mono uppercase tracking-wider text-white flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-primary" /> OUTPUT_GRID
                  </CardTitle>
                </div>
                {queryOutput && (
                  <div className="flex items-center gap-2">
                    {/* Execution metadata */}
                    <span className="text-[9px] font-mono text-primary/50 mr-2">
                      ({queryOutput.metrics.count} rows, {queryOutput.metrics.time})
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCopyToClipboard}
                      className="h-7 px-2 font-mono text-[9px] gap-1 cursor-pointer"
                    >
                      {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
                      Copy
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleExportJSON}
                      className="h-7 px-2 font-mono text-[9px] gap-1 cursor-pointer"
                    >
                      <Download className="h-3 w-3" />
                      JSON Export
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="pt-4 font-mono text-xs">
                {queryError && (
                  <div className="flex items-start gap-3 text-destructive bg-destructive/5 border border-destructive/20 p-3.5 rounded-lg">
                    <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{queryError}</span>
                  </div>
                )}

                {queryOutput && (
                  <div className="overflow-x-auto border border-border/40 rounded-lg">
                    <table className="w-full text-left border-collapse text-[10px]">
                      <thead>
                        <tr className="border-b border-border/50 text-muted-foreground uppercase text-[9px] bg-black/25">
                          {queryOutput.columns.map((col: string) => (
                            <th key={col} className="py-2.5 px-3 font-normal">{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/20 text-white/90">
                        {queryOutput.rows.map((row: string[], rowIdx: number) => (
                          <tr key={rowIdx} className="hover:bg-white/[0.02]">
                            {row.map((cell: string, cellIdx: number) => (
                              <td key={cellIdx} className="py-2 px-3">{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {!queryOutput && !queryError && !executing && (
                  <div className="flex flex-col items-center justify-center py-16 text-muted-foreground text-[10px] uppercase">
                    <Terminal className="h-8 w-8 text-primary/25 mb-2" />
                    <span>NO_QUERY_RESULTS_LOGGED</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
