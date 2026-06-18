import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getCases, getCrimes, getMe } from '@/lib/api';
import { 
  Database, Terminal, Activity, ShieldAlert, HardDrive, 
  Play, RefreshCw, AlertCircle, ArrowRight, Clock 
} from 'lucide-react';
import { motion } from 'framer-motion';

// Mock Transaction Templates for streaming log
const SIMULATED_TRANS = [
  { sql: 'SELECT * FROM cases ORDER BY created_at DESC', table: 'cases', type: 'READ', duration: '3.8ms' },
  { sql: 'SELECT * FROM users WHERE email = ?', table: 'users', type: 'READ', duration: '1.2ms' },
  { sql: 'INSERT INTO cases (title, description, priority) VALUES (?, ?, ?)', table: 'cases', type: 'WRITE', duration: '12.4ms' },
  { sql: 'SELECT * FROM crimes LIMIT 50', table: 'crimes (virtual)', type: 'API_READ', duration: '138.2ms' },
  { sql: 'UPDATE cases SET status = ? WHERE id = ?', table: 'cases', type: 'WRITE', duration: '8.9ms' },
  { sql: 'SELECT COUNT(*) FROM crimes WHERE arrest = true', table: 'crimes (virtual)', type: 'API_READ', duration: '146.5ms' },
  { sql: 'DELETE FROM cases WHERE id = ?', table: 'cases', type: 'WRITE', duration: '14.1ms' },
];

export default function DatabaseConsole() {
  const [activeTab, setActiveTab] = useState<'diagnostics' | 'logs' | 'sql'>('diagnostics');
  
  // SQL Terminal Simulator state
  const [queryInput, setQueryInput] = useState('SELECT * FROM cases WHERE priority = \'high\';');
  const [queryOutput, setQueryOutput] = useState<any>(null);
  const [executing, setExecuting] = useState(false);
  const [queryError, setQueryError] = useState<string | null>(null);

  // Live Transaction Log state
  const [logs, setLogs] = useState<any[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Fetch real data to bind with query executor
  const { data: realCases } = useQuery({ queryKey: ['cases'], queryFn: getCases });
  const { data: realCrimes } = useQuery({ queryKey: ['crimes'], queryFn: () => getCrimes({ limit: '5' }) });
  const { data: realUser } = useQuery({ queryKey: ['me'], queryFn: getMe });

  // Initialize and stream logs
  useEffect(() => {
    // Generate initial logs
    const initialLogs = Array.from({ length: 8 }).map((_, idx) => {
      const template = SIMULATED_TRANS[Math.floor(Math.random() * SIMULATED_TRANS.length)];
      const date = new Date(Date.now() - (8 - idx) * 30000);
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
      const template = SIMULATED_TRANS[Math.floor(Math.random() * SIMULATED_TRANS.length)];
      const newLog = {
        ...template,
        timestamp: new Date().toLocaleTimeString(),
        id: Math.random().toString(36).substr(2, 9),
        status: Math.random() > 0.98 ? 'TIMEOUT' : 'SUCCESS'
      };
      setLogs(prev => [...prev.slice(-30), newLog]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll logs
  useEffect(() => {
    if (activeTab === 'logs' && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, activeTab]);

  // Query Execution Handler
  const handleExecuteQuery = () => {
    setExecuting(true);
    setQueryError(null);
    setQueryOutput(null);

    setTimeout(() => {
      setExecuting(false);
      const cleanQuery = queryInput.trim().toLowerCase().replace(/\s+/g, ' ');

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
          ])
        });
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
          ]]
        });
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
          ])
        });
      } else if (cleanQuery.includes('show tables') || cleanQuery.includes('show_tables')) {
        setQueryOutput({
          columns: ['table_name', 'engine_type', 'row_count', 'indices'],
          rows: [
            ['users', 'SQLAlchemy / SQLite', String(realUser ? 1 : 1), 'email_idx (UNIQUE)'],
            ['cases', 'SQLAlchemy / SQLite', String(realCases?.length || 4), 'PRIMARY_KEY (id)'],
            ['crimes', 'Chicago Open Data API (Virtual)', '5,000 (buffered)', 'date_idx, primary_type_idx']
          ]
        });
      } else {
        setQueryError('Syntax Error: Unknown table source or syntax pattern. Only SELECT on table "cases", "users", "crimes" or "SHOW TABLES" is allowed in demo terminal mode.');
      }
    }, 900);
  };

  // Preset queries
  const PRESET_QUERIES = [
    { label: 'High Priority Cases', sql: "SELECT * FROM cases WHERE priority = 'high';" },
    { label: 'Current Users', sql: "SELECT * FROM users;" },
    { label: 'Chicago Crime Data', sql: "SELECT * FROM crimes WHERE type = 'THEFT' LIMIT 5;" },
    { label: 'Show Schemas', sql: "SHOW TABLES;" }
  ];

  return (
    <motion.div
      className="space-y-6 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* HUD Scanner Accent */}
      <div className="absolute left-0 right-0 h-[1px] bg-primary/10 animate-scan top-0 pointer-events-none" />

      {/* Header section */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-border/40 pb-4">
        <div>
          <div className="flex items-center gap-3">
            <Database className="h-5 w-5 text-primary animate-pulse" />
            <h1 className="text-2xl font-mono font-bold uppercase tracking-wider text-glow text-white">
              DATABASE_CONSOLE <span className="text-primary/50">//</span> CORE_DIAGNOSTICS
            </h1>
          </div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-primary/60 mt-1 ml-8">
            ◆ Core Database Engine Management & SQL Query Console Terminal
          </p>
        </div>

        {/* Live connectivity telemetry */}
        <div className="flex items-center gap-4 text-[10px] font-mono">
          <div className="flex items-center gap-1.5 text-success">
            <span className="h-2 w-2 rounded-full bg-success animate-pulse border-glow" />
            SQL_ENGINE: ONLINE
          </div>
          <div className="text-primary/70 bg-primary/5 px-2.5 py-1 rounded border border-primary/20">
            LATENCY: 4.2ms
          </div>
        </div>
      </div>

      {/* Tab Selectors */}
      <div className="flex border-b border-border/40 font-mono text-xs uppercase tracking-wider">
        <button
          onClick={() => setActiveTab('diagnostics')}
          className={`px-4 py-2 border-b-2 transition-all ${activeTab === 'diagnostics' ? 'border-primary text-primary font-bold text-glow' : 'border-transparent text-muted-foreground hover:text-white'}`}
        >
          ◆ System Diagnostics
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2 border-b-2 transition-all ${activeTab === 'logs' ? 'border-primary text-primary font-bold text-glow' : 'border-transparent text-muted-foreground hover:text-white'}`}
        >
          ◆ Transaction Logs
        </button>
        <button
          onClick={() => setActiveTab('sql')}
          className={`px-4 py-2 border-b-2 transition-all ${activeTab === 'sql' ? 'border-primary text-primary font-bold text-glow' : 'border-transparent text-muted-foreground hover:text-white'}`}
        >
          ◆ SQL Terminal
        </button>
      </div>

      {/* ───── TAB 1: DIAGNOSTICS ───── */}
      {activeTab === 'diagnostics' && (
        <div className="space-y-6">
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="card-intel relative overflow-hidden">
              <CardContent className="pt-6">
                <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
                  Active Connections
                </div>
                <div className="text-2xl font-bold font-mono text-white text-glow">
                  12 <span className="text-xs text-primary/50">/ 100 max</span>
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <Activity className="h-3 w-3 text-success animate-pulse" />
                  <span className="text-[9px] font-mono text-success uppercase">Pool Health Optimal</span>
                </div>
              </CardContent>
            </Card>

            <Card className="card-intel relative overflow-hidden">
              <CardContent className="pt-6">
                <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
                  Total Cache Hits
                </div>
                <div className="text-2xl font-bold font-mono text-white text-glow">
                  98.42%
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  <span className="text-[9px] font-mono text-success uppercase">Index Hits High</span>
                </div>
              </CardContent>
            </Card>

            <Card className="card-intel relative overflow-hidden">
              <CardContent className="pt-6">
                <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
                  Memory Allocation
                </div>
                <div className="text-2xl font-bold font-mono text-white text-glow">
                  34.8 MB <span className="text-xs text-primary/50">/ RAM</span>
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <HardDrive className="h-3 w-3 text-primary" />
                  <span className="text-[9px] font-mono text-primary/80 uppercase">Garbage Collector Idle</span>
                </div>
              </CardContent>
            </Card>

            <Card className="card-intel relative overflow-hidden">
              <CardContent className="pt-6">
                <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
                  Ingestion Rate
                </div>
                <div className="text-2xl font-bold font-mono text-white text-glow">
                  48.1 req/s
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <Clock className="h-3 w-3 text-warning animate-spin-slow" />
                  <span className="text-[9px] font-mono text-warning uppercase">Chicago API Synced</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Database Schema Model lists */}
          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="card-intel lg:col-span-2">
              <CardHeader className="border-b border-border/40 pb-3">
                <CardTitle className="text-xs font-mono uppercase tracking-wider text-white flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-primary" /> ACTIVE_TABLE_SCHEMAS
                </CardTitle>
                <CardDescription className="text-[10px] font-mono uppercase">
                  Logical table relational designs registered with SQLAlchemy database engine.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs font-mono">
                    <thead>
                      <tr className="border-b border-border/50 text-muted-foreground uppercase text-[10px] bg-black/10">
                        <th className="py-2.5 px-4 font-normal">Table</th>
                        <th className="py-2.5 px-4 font-normal">Column Name</th>
                        <th className="py-2.5 px-4 font-normal">Type</th>
                        <th className="py-2.5 px-4 font-normal">Attributes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20 text-white/80">
                      <tr>
                        <td className="py-2.5 px-4 font-bold text-primary">users</td>
                        <td className="py-2.5 px-4">id</td>
                        <td className="py-2.5 px-4">VARCHAR (UUID)</td>
                        <td className="py-2.5 px-4"><Badge className="bg-primary/20 text-primary border-primary/30 uppercase text-[8px]">PRIMARY KEY</Badge></td>
                      </tr>
                      <tr className="bg-white/[0.01]">
                        <td className="py-2.5 px-4"></td>
                        <td className="py-2.5 px-4">email</td>
                        <td className="py-2.5 px-4">VARCHAR (255)</td>
                        <td className="py-2.5 px-4"><Badge variant="outline" className="text-[8px] uppercase border-warning/30 text-warning">UNIQUE, INDEXED</Badge></td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4"></td>
                        <td className="py-2.5 px-4">hashed_password</td>
                        <td className="py-2.5 px-4">VARCHAR (512)</td>
                        <td className="py-2.5 px-4 text-primary/40">NULLABLE: FALSE</td>
                      </tr>
                      <tr className="bg-white/[0.01]">
                        <td className="py-2.5 px-4"></td>
                        <td className="py-2.5 px-4">name</td>
                        <td className="py-2.5 px-4">VARCHAR (128)</td>
                        <td className="py-2.5 px-4 text-primary/40">-</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4"></td>
                        <td className="py-2.5 px-4">role</td>
                        <td className="py-2.5 px-4">VARCHAR (32)</td>
                        <td className="py-2.5 px-4 text-primary/40">DEFAULT: "analyst"</td>
                      </tr>

                      <tr className="border-t border-border/50">
                        <td className="py-2.5 px-4 font-bold text-primary">cases</td>
                        <td className="py-2.5 px-4">id</td>
                        <td className="py-2.5 px-4">VARCHAR (UUID)</td>
                        <td className="py-2.5 px-4"><Badge className="bg-primary/20 text-primary border-primary/30 uppercase text-[8px]">PRIMARY KEY</Badge></td>
                      </tr>
                      <tr className="bg-white/[0.01]">
                        <td className="py-2.5 px-4"></td>
                        <td className="py-2.5 px-4">title</td>
                        <td className="py-2.5 px-4">VARCHAR (256)</td>
                        <td className="py-2.5 px-4 text-primary/40">NULLABLE: FALSE</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4"></td>
                        <td className="py-2.5 px-4">description</td>
                        <td className="py-2.5 px-4">TEXT</td>
                        <td className="py-2.5 px-4 text-primary/40">NULLABLE: TRUE</td>
                      </tr>
                      <tr className="bg-white/[0.01]">
                        <td className="py-2.5 px-4"></td>
                        <td className="py-2.5 px-4">status</td>
                        <td className="py-2.5 px-4">VARCHAR (32)</td>
                        <td className="py-2.5 px-4 text-primary/40">DEFAULT: "open"</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4"></td>
                        <td className="py-2.5 px-4">priority</td>
                        <td className="py-2.5 px-4">VARCHAR (32)</td>
                        <td className="py-2.5 px-4 text-primary/40">DEFAULT: "medium"</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card className="card-intel">
              <CardHeader className="border-b border-border/40 pb-3">
                <CardTitle className="text-xs font-mono uppercase tracking-wider text-white flex items-center gap-2">
                  <Activity className="h-4 w-4 text-warning" /> ENGINE_LOGS
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6 text-[10px] font-mono">
                <div className="space-y-2.5">
                  <div className="flex items-start gap-2">
                    <span className="text-success">[OK]</span>
                    <div>
                      <div className="text-white">DB_INIT: Success</div>
                      <div className="text-muted-foreground">Schemas compiled on startup</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-success">[OK]</span>
                    <div>
                      <div className="text-white">POOL: Allocation ready</div>
                      <div className="text-muted-foreground">Async connection pool allocated</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-success">[OK]</span>
                    <div>
                      <div className="text-white">API_SYNC: established</div>
                      <div className="text-muted-foreground">Socrata endpoint connection ok</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-warning">[WARN]</span>
                    <div>
                      <div className="text-white">VIRTUAL: Query high size</div>
                      <div className="text-muted-foreground">Limit exceeded 2000, clipped.</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ───── TAB 2: TRANSACTION LOGS ───── */}
      {activeTab === 'logs' && (
        <Card className="card-intel relative overflow-hidden">
          <div className="absolute left-0 right-0 h-[1px] bg-primary/10 animate-scan top-0 pointer-events-none" />
          <CardHeader className="border-b border-border/40 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xs font-mono uppercase tracking-wider text-white flex items-center gap-2">
                <Terminal className="h-4 w-4 text-success" /> LIVE_TRANSACTION_AUDIT_LOG
              </CardTitle>
              <CardDescription className="text-[10px] font-mono uppercase text-muted-foreground">
                Streaming active SQL transactions, API connections, and query operations.
              </CardDescription>
            </div>
            <div className="text-[9px] font-mono text-muted-foreground flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-ping" />
              STREAMING
            </div>
          </CardHeader>
          <CardContent className="pt-4 bg-black/40">
            {/* Terminal Container */}
            <div className="h-[400px] overflow-y-auto font-mono text-[11px] space-y-2.5 pr-2 scrollbar-thin">
              {logs.map((log) => (
                <div key={log.id} className="flex items-start justify-between gap-4 py-1 border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors rounded px-2">
                  <div className="flex items-start gap-3">
                    <span className="text-primary/45 shrink-0 select-none">[{log.timestamp}]</span>
                    <div>
                      <span className={log.type === 'WRITE' ? 'text-warning font-semibold' : 'text-primary'}>
                        {log.type}
                      </span>
                      <span className="text-muted-foreground font-mono ml-2">on</span>
                      <span className="text-white font-semibold ml-1.5">[{log.table}]</span>
                      <div className="text-white/60 font-mono mt-0.5 break-all">{log.sql}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-primary/70">{log.duration}</span>
                    <Badge className={log.status === 'SUCCESS' ? 'bg-success/10 text-success border-success/30 font-bold text-[8px]' : 'bg-destructive/10 text-destructive border-destructive/30 font-bold text-[8px]'}>
                      {log.status}
                    </Badge>
                  </div>
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* ───── TAB 3: SQL TERMINAL ───── */}
      {activeTab === 'sql' && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Query Editor & Presets */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="card-intel">
              <CardHeader>
                <CardTitle className="text-xs font-mono uppercase tracking-wider text-white">QUERY_TEMPLATES</CardTitle>
                <CardDescription className="text-[10px] font-mono uppercase text-muted-foreground">Select a preset command to populate the query editor.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {PRESET_QUERIES.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => {
                      setQueryInput(p.sql);
                      setQueryError(null);
                      setQueryOutput(null);
                    }}
                    className="w-full text-left px-3 py-2 rounded border border-border bg-white/[0.02] hover:bg-primary/5 hover:border-primary/30 transition-all font-mono text-[10px] text-white/80 flex items-center justify-between group cursor-pointer"
                  >
                    <span>{p.label}</span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card className="card-intel">
              <CardContent className="pt-6 text-[10px] font-mono text-muted-foreground uppercase leading-relaxed">
                <div className="flex items-center gap-2 text-warning mb-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>Terminal Warning</span>
                </div>
                Write query statements in the editor panel. Click execute to run the parser. Direct data mutation commands (UPDATE/DELETE/INSERT) are restricted to cases and authentication logs in demo mode.
              </CardContent>
            </Card>
          </div>

          {/* Editor & Console Output */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="card-intel relative overflow-hidden">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-primary/50">SQL Editor</span>
                  <Badge variant="outline" className="text-[8px] font-mono uppercase border-primary/20 text-primary">Mode: SQLite (Local)</Badge>
                </div>
                <div className="relative">
                  <textarea
                    value={queryInput}
                    onChange={(e) => setQueryInput(e.target.value)}
                    className="w-full h-32 bg-black/55 border border-border rounded p-3 font-mono text-xs text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 resize-y"
                  />
                  {executing && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center">
                      <div className="flex flex-col items-center gap-2">
                        <RefreshCw className="h-6 w-6 text-primary animate-spin" />
                        <span className="text-[10px] font-mono text-primary uppercase animate-pulse">Running Parser...</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex justify-end mt-4">
                  <Button
                    onClick={handleExecuteQuery}
                    disabled={executing || !queryInput.trim()}
                    className="gap-2 shadow-[0_0_15px_rgba(0,255,255,0.15)] hover:shadow-[0_0_25px_rgba(0,255,255,0.3)] transition-shadow duration-300"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" /> Execute Query
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Output Panel */}
            <Card className="card-intel bg-black/30 relative overflow-hidden min-h-[200px]">
              <CardHeader className="border-b border-border/40 py-3">
                <CardTitle className="text-xs font-mono uppercase tracking-wider text-white flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-primary" /> CONSOLE_OUTPUT
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 font-mono text-xs">
                {queryError && (
                  <div className="flex items-start gap-3 text-destructive bg-destructive/5 border border-destructive/20 p-3.5 rounded">
                    <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{queryError}</span>
                  </div>
                )}

                {queryOutput && (
                  <div className="overflow-x-auto border border-border/40 rounded">
                    <table className="w-full text-left border-collapse text-[10px]">
                      <thead>
                        <tr className="border-b border-border/50 text-muted-foreground uppercase text-[9px] bg-black/25">
                          {queryOutput.columns.map((col: string) => (
                            <th key={col} className="py-2 px-3 font-normal">{col}</th>
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
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground text-[10px] uppercase">
                    <Terminal className="h-8 w-8 text-primary/25 mb-2" />
                    <span>NO_QUERY_EXECUTED // WAIT_FOR_INPUT</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </motion.div>
  );
}
