import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import {
  Button,
} from "./components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "./components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "./components/ui/tabs";
import { Separator } from "./components/ui/separator";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import { Badge } from "./components/ui/badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "./components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Progress } from "./components/ui/progress";
import { Toaster } from "./components/ui/toaster";
import { useToast } from "./hooks/use-toast";

import {
  Shield,
  Activity,
  FileText,
  AlertTriangle,
  Radar,
  Terminal,
  FileSearch,
  CheckCircle2,
  Send,
} from "lucide-react";

import { api } from "./lib/api";

const Accent = ({ children }) => (
  <span className="text-emerald-400 tracking-wider">{children}</span>
);

const NavBar = () => (
  <div className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/70 border-b border-neutral-800">
    <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Shield className="w-5 h-5 text-emerald-400" />
        <div className="text-sm text-neutral-400 tracking-widest">CRIME CONNECT</div>
        <span className="mx-2 text-neutral-700">|</span>
        <div className="text-sm font-semibold" style={{ fontFamily: "IBM Plex Mono, monospace" }}>
          FBI MISSION CONTROL
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button className="bg-emerald-500/10 text-emerald-400 border border-emerald-400/30 hover:bg-emerald-500/20">
          <Terminal className="w-4 h-4 mr-2" />
          Launch Command
        </Button>
      </div>
    </div>
  </div>
);

const Hero = () => (
  <section className="relative overflow-hidden">
    <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.15),transparent_60%)]" />
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-start justify-between">
        <div className="max-w-2xl">
          <h1
            className="text-3xl md:text-4xl font-semibold leading-tight text-neutral-100"
            style={{ fontFamily: "IBM Plex Mono, monospace" }}
          >
            <Accent>FBI</Accent> Tactical Hub
          </h1>
          <p className="mt-3 text-neutral-400 max-w-xl">
            Orchestrate operations, monitor intel, and manage case files in one cohesive command dashboard. Minimal noise, maximum signal.
          </p>
          <div className="mt-5 flex gap-3">
            <Button className="bg-emerald-500 text-neutral-900 hover:bg-emerald-400">
              <Radar className="w-4 h-4 mr-2" />
              Start Briefing
            </Button>
            <Button variant="outline" className="border-neutral-700 text-neutral-200 hover:bg-neutral-800">
              <FileText className="w-4 h-4 mr-2" />
              View Dossier
            </Button>
          </div>
        </div>
        <div className="hidden md:flex flex-col gap-2 text-right">
          <span className="text-xs text-neutral-500 tracking-widest">STATUS</span>
          <span className="text-sm text-emerald-400">SECURE • LINK ACTIVE</span>
        </div>
      </div>
    </div>
  </section>
);

const MetricCard = ({ icon: Icon, label, value, delta, isPercent }) => (
  <Card className="bg-neutral-900/70 border-neutral-800 hover:border-neutral-700 transition-colors">
    <CardHeader className="pb-2">
      <CardTitle className="text-xs text-neutral-400 tracking-widest flex items-center gap-2" style={{ fontFamily: "IBM Plex Mono, monospace" }}>
        <Icon className="w-4 h-4 text-emerald-400" /> {label}
      </CardTitle>
    </CardHeader>
    <CardContent className="pt-0">
      <div className="flex items-end justify-between">
        <div className="text-3xl font-semibold text-neutral-50" style={{ fontFamily: "IBM Plex Mono, monospace" }}>
          {isPercent ? `${value}%` : value}
        </div>
        <Badge className={`${delta >= 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"} border border-neutral-700`}>{delta > 0 ? `+${delta}` : delta}</Badge>
      </div>
    </CardContent>
  </Card>
);

const IntelFeed = ({ data }) => (
  <Card className="bg-neutral-900/70 border-neutral-800">
    <CardHeader className="pb-2">
      <CardTitle className="flex items-center gap-2 text-neutral-200" style={{ fontFamily: "IBM Plex Mono, monospace" }}>
        <Activity className="w-5 h-5 text-emerald-400" /> Intel Feed
      </CardTitle>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow className="border-neutral-800">
            <TableHead className="text-neutral-400">Time</TableHead>
            <TableHead className="text-neutral-400">Event</TableHead>
            <TableHead className="text-neutral-400">Severity</TableHead>
            <TableHead className="text-neutral-400">Tags</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((i) => {
            const t = new Date(i.created_at);
            const hh = t.getHours().toString().padStart(2, "0");
            const mm = t.getMinutes().toString().padStart(2, "0");
            return (
              <TableRow key={i.id} className="border-neutral-800 hover:bg-neutral-800/50">
                <TableCell className="text-neutral-300" style={{ fontFamily: "IBM Plex Mono, monospace" }}>{`${hh}:${mm}`}</TableCell>
                <TableCell className="text-neutral-200">{i.title}</TableCell>
                <TableCell>
                  <Badge className={`${i.severity === "critical" ? "bg-red-500/10 text-red-400" : i.severity === "high" ? "bg-orange-500/10 text-orange-400" : i.severity === "medium" ? "bg-yellow-500/10 text-yellow-400" : "bg-neutral-700 text-neutral-200"} border border-neutral-700`}>{i.severity.toUpperCase()}</Badge>
                </TableCell>
                <TableCell className="space-x-1">
                  {i.tags.map((t) => (
                    <Badge key={t} variant="outline" className="border-neutral-700 text-neutral-400">
                      #{t}
                    </Badge>
                  ))}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

const CaseFiles = ({ data }) => {
  const groups = useMemo(() => ({
    active: data.filter((c) => c.status === "active"),
    backlog: data.filter((c) => c.status === "backlog"),
    archived: data.filter((c) => c.status === "archived"),
  }), [data]);

  const CaseCard = ({ c }) => (
    <Card key={c.id} className="bg-neutral-900/70 border-neutral-800 hover:border-neutral-700 transition-colors">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-neutral-200" style={{ fontFamily: "IBM Plex Mono, monospace" }}>
          <span className="truncate">{c.title}</span>
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/10 text-emerald-400 border border-neutral-700">{c.priority}</Badge>
            <Badge variant="outline" className="border-neutral-700 text-neutral-400">{c.id}</Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-neutral-400">
        <div className="flex items-center gap-3">
          <FileSearch className="w-4 h-4 text-neutral-500" /> Owner: <span className="text-neutral-300">{c.owner}</span>
        </div>
        <div className="mt-1 text-xs">Updated {new Date(c.updated_at).toLocaleString()}</div>
      </CardContent>
    </Card>
  );

  return (
    <Card className="bg-neutral-900/70 border-neutral-800">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-neutral-200" style={{ fontFamily: "IBM Plex Mono, monospace" }}>
          <FileText className="w-5 h-5 text-emerald-400" /> Case Files
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="active">
          <TabsList className="bg-neutral-900 border border-neutral-800">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="backlog">Backlog</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>
          <TabsContent value="active" className="mt-4 grid md:grid-cols-2 gap-3">
            {groups.active.map((c) => <CaseCard key={c.id} c={c} />)}
          </TabsContent>
          <TabsContent value="backlog" className="mt-4 grid md:grid-cols-2 gap-3">
            {groups.backlog.map((c) => <CaseCard key={c.id} c={c} />)}
          </TabsContent>
          <TabsContent value="archived" className="mt-4 grid md:grid-cols-2 gap-3">
            {groups.archived.map((c) => <CaseCard key={c.id} c={c} />)}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

const Timeline = ({ data }) => (
  <Card className="bg-neutral-900/70 border-neutral-800">
    <CardHeader className="pb-2">
      <CardTitle className="flex items-center gap-2 text-neutral-200" style={{ fontFamily: "IBM Plex Mono, monospace" }}>
        <Radar className="w-5 h-5 text-emerald-400" /> Timeline
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="relative">
        <div className="absolute left-3 top-0 bottom-0 w-px bg-neutral-800" />
        <div className="space-y-4">
          {data.map((t) => (
            <div key={t.id} className="relative pl-8">
              <div className="absolute left-0 top-1 w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <div className="text-xs text-neutral-500" style={{ fontFamily: "IBM Plex Mono, monospace" }}>{new Date(t.created_at).toLocaleTimeString()}</div>
              <div className="text-neutral-200">{t.text}</div>
            </div>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
);

const CommandForm = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({
    codename: "",
    agent: "",
    channel: "",
    message: "",
  });
  const [transmitting, setTransmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("command_form");
    if (saved) setForm(JSON.parse(saved));
  }, []);

  const onChange = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    localStorage.setItem("command_form", JSON.stringify(form));
    setTransmitting(true);
    setProgress(0);

    // Simulate progress locally for UX
    const id = setInterval(() => {
      setProgress((p) => Math.min(100, p + Math.random() * 25));
    }, 350);

    try {
      await api.post("/command", form);
      toast({ title: "Transmission sent", description: "Command logged to server." });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      toast({ title: "Transmission failed", description: "Saved locally (mock)", variant: "destructive" });
    } finally {
      setTimeout(() => {
        clearInterval(id);
        setTransmitting(false);
      }, 900);
    }
  };

  return (
    <Card className="bg-neutral-900/70 border-neutral-800">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-neutral-200" style={{ fontFamily: "IBM Plex Mono, monospace" }}>
          <Terminal className="w-5 h-5 text-emerald-400" /> Command Center
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid md:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-neutral-400">Codename</label>
              <Input
                placeholder="e.g. Nightwatch"
                value={form.codename}
                onChange={(e) => onChange("codename", e.target.value)}
                className="bg-neutral-950 border-neutral-800 focus-visible:ring-emerald-500"
              />
            </div>
            <div>
              <label className="text-xs text-neutral-400">Agent</label>
              <Select value={form.agent} onValueChange={(v) => onChange("agent", v)}>
                <SelectTrigger className="bg-neutral-950 border-neutral-800">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="bg-neutral-900 border-neutral-800">
                  {[
                    { code: "A1", name: "Alpha" },
                    { code: "B2", name: "Bravo" },
                    { code: "C3", name: "Charlie" },
                    { code: "D4", name: "Delta" },
                  ].map((a) => (
                    <SelectItem key={a.code} value={a.code}>{a.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-neutral-400">Channel</label>
              <Input
                placeholder="#alpha-ops"
                value={form.channel}
                onChange={(e) => onChange("channel", e.target.value)}
                className="bg-neutral-950 border-neutral-800 focus-visible:ring-emerald-500"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-neutral-400">Message</label>
            <Textarea
              placeholder="Type secure instruction..."
              value={form.message}
              onChange={(e) => onChange("message", e.target.value)}
              className="bg-neutral-950 border-neutral-800 focus-visible:ring-emerald-500 min-h-[120px]"
            />
          </div>
          {transmitting ? (
            <div className="flex items-center gap-3">
              <Progress className="bg-neutral-800" value={progress} />
              <span className="text-xs text-neutral-400" style={{ fontFamily: "IBM Plex Mono, monospace" }}>TRANSMITTING…</span>
            </div>
          ) : (
            <Button type="submit" className="bg-emerald-500 text-neutral-900 hover:bg-emerald-400">
              <Send className="w-4 h-4 mr-2" /> Send Command
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

const MetricsGrid = ({ metrics }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
    <MetricCard icon={Shield} label="Open Cases" value={metrics.open_cases ?? 0} delta={0} />
    <MetricCard icon={Activity} label="Active Ops" value={metrics.active_ops ?? 0} delta={0} />
    <MetricCard icon={AlertTriangle} label="Alerts Today" value={metrics.alerts_today ?? 0} delta={0} />
    <MetricCard icon={CheckCircle2} label="Resolution Rate" value={metrics.resolution_rate ?? 0} delta={0} isPercent />
  </div>
);

const Footer = () => (
  <div className="mt-10 border-t border-neutral-800">
    <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-neutral-500 flex items-center justify-between">
      <div>© {new Date().getFullYear()} Crime Connect</div>
      <div className="flex items-center gap-3">
        <span className="text-xs tracking-widest">BUILD</span>
        <Badge variant="outline" className="border-neutral-700 text-neutral-400">v0.1</Badge>
      </div>
    </div>
  </div>
);

const Home = () => {
  const [metrics, setMetrics] = useState({});
  const [intel, setIntel] = useState([]);
  const [cases, setCases] = useState([]);
  const [timeline, setTimeline] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [m, i, c, t] = await Promise.all([
          api.get("/metrics"),
          api.get("/intel"),
          api.get("/cases"),
          api.get("/timeline"),
        ]);
        if (!mounted) return;
        setMetrics(m.data);
        setIntel(i.data);
        setCases(c.data);
        setTimeline(t.data);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("API load failed; UI will show empty state.", err);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100" style={{ fontFamily: "Inter, ui-sans-serif" }}>
      <NavBar />
      <Hero />
      <main className="max-w-6xl mx-auto px-4">
        <MetricsGrid metrics={metrics} />
        <div className="mt-4 grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-4">
            <IntelFeed data={intel} />
            <CaseFiles data={cases} />
          </div>
          <div className="space-y-4">
            <Timeline data={timeline} />
            <CommandForm />
          </div>
        </div>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}>
            <Route index element={<Home />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;