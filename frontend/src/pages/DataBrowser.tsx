import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { getCrimes, getCrimeTypes } from '@/lib/api';
import { Search, Filter, Database, ChevronLeft, ChevronRight, Terminal } from 'lucide-react';

export default function DataBrowser() {
  const [search, setSearch] = useState('');
  const [crimeType, setCrimeType] = useState('');
  const [district, setDistrict] = useState('');
  const [offset, setOffset] = useState(0);
  const limit = 50;

  const { data: crimes, isLoading } = useQuery({
    queryKey: ['crimes', offset, crimeType, district],
    queryFn: () => getCrimes({ limit: String(limit), offset: String(offset), ...(crimeType ? { type: crimeType } : {}), ...(district ? { district } : {}) }),
  });
  const { data: crimeTypes } = useQuery({ queryKey: ['crime-types'], queryFn: getCrimeTypes });

  const districts = Array.from({ length: 25 }, (_, i) => String(i + 1));

  const filtered = crimes?.filter((c: any) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (c.primary_type || '').toLowerCase().includes(s) ||
      (c.description || '').toLowerCase().includes(s) ||
      (c.case_number || '').toLowerCase().includes(s);
  }) || [];

  const currentPage = (offset / limit) + 1;

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* ── HUD HEADER ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <div className="flex items-center gap-3">
          <Database className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-mono font-bold uppercase tracking-wider text-glow text-white">
            DATA_INTELLIGENCE <span className="text-primary/50">//</span> CRIME_RECORDS_DB
          </h1>
        </div>
        <p className="text-[10px] font-mono uppercase tracking-widest text-primary/60 mt-1 ml-8">
          ◆ Search, filter, and explore Chicago crime records — Intelligence Database Console
        </p>
      </motion.div>

      {/* ── GLASSMORPHIC FILTER BAR ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="card-intel backdrop-blur-md bg-card/40 border-primary/10">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-3">
              <Terminal className="h-3.5 w-3.5 text-primary/70" />
              <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                Query Parameters
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="flex-1 min-w-[200px] relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-primary/60" />
                <Input
                  placeholder="Search by type, description, case number..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 font-mono text-sm bg-background/50 border-primary/20 focus:border-primary focus:ring-primary/30 focus:ring-2 transition-all placeholder:text-muted-foreground/50"
                />
              </div>
              <Select
                placeholder="All types"
                value={crimeType}
                onValueChange={setCrimeType}
                options={[{ value: '', label: 'All types' }, ...(crimeTypes || []).map((t: string) => ({ value: t, label: t }))]}
                className="w-48 font-mono text-sm"
              />
              <Select
                placeholder="All districts"
                value={district}
                onValueChange={setDistrict}
                options={[{ value: '', label: 'All districts' }, ...districts.map((d) => ({ value: d, label: `District ${d}` }))]}
                className="w-48 font-mono text-sm"
              />
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  variant="outline"
                  onClick={() => { setSearch(''); setCrimeType(''); setDistrict(''); setOffset(0); }}
                  className="border-primary/20 hover:border-primary/50 hover:bg-primary/5 font-mono text-xs uppercase tracking-wider"
                >
                  <Filter className="h-4 w-4 mr-1" /> Reset_Filters
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── DATA TABLE WITH SCAN-LINE ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <Card className="card-intel overflow-hidden relative">
          {/* Scan-line overlay */}
          <div className="absolute left-0 right-0 h-[1px] bg-primary/10 animate-scan top-0 pointer-events-none z-10" />

          <CardContent className="p-0">
            {/* Table header label */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-primary/10">
              <span className="text-xs font-mono uppercase tracking-wider text-white flex items-center gap-2">
                <Database className="h-3.5 w-3.5 text-primary" />
                Records_Output
              </span>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-success/70">
                  {isLoading ? 'QUERYING...' : `${filtered.length} RECORDS`}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-primary/10 hover:bg-transparent">
                    <TableHead className="text-xs font-mono uppercase tracking-wider text-primary/70">Case #</TableHead>
                    <TableHead className="text-xs font-mono uppercase tracking-wider text-primary/70">Type</TableHead>
                    <TableHead className="text-xs font-mono uppercase tracking-wider text-primary/70">Description</TableHead>
                    <TableHead className="text-xs font-mono uppercase tracking-wider text-primary/70">Date</TableHead>
                    <TableHead className="text-xs font-mono uppercase tracking-wider text-primary/70">District</TableHead>
                    <TableHead className="text-xs font-mono uppercase tracking-wider text-primary/70">Arrest</TableHead>
                    <TableHead className="text-xs font-mono uppercase tracking-wider text-primary/70">Location</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading && Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i} className="border-b border-primary/5">
                      {Array.from({ length: 7 }).map((_, j) => <TableCell key={j}><Skeleton className="h-4 w-full bg-primary/5" /></TableCell>)}
                    </TableRow>
                  ))}
                  {filtered.map((c: any, i: number) => (
                    <motion.tr
                      key={c.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.02, duration: 0.25 }}
                      className="border-b border-primary/5 hover:bg-primary/5 transition-colors group"
                    >
                      <TableCell className="font-mono text-xs text-primary/90">{c.case_number || c.id}</TableCell>
                      <TableCell className="font-medium text-white text-sm">{c.primary_type}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{c.description}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{c.date?.slice(0, 10)}</TableCell>
                      <TableCell className="font-mono text-sm">{c.district}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-mono font-medium ${c.arrest ? 'bg-success/15 text-success border border-success/20' : 'bg-muted text-muted-foreground border border-muted'}`}>
                          {c.arrest && <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />}
                          {c.arrest ? 'YES' : 'NO'}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{c.location_description}</TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── CYBER PAGINATION ── */}
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Button
            variant="outline"
            disabled={offset === 0}
            onClick={() => setOffset(Math.max(0, offset - limit))}
            className="font-mono text-xs uppercase tracking-wider border-primary/20 hover:border-primary/50 hover:bg-primary/5 disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Prev_Page
          </Button>
        </motion.div>

        <div className="flex items-center gap-3">
          <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-primary/30" />
          <span className="font-mono text-sm text-primary tracking-widest">
            [ PAGE <span className="text-white font-bold">{String(currentPage).padStart(2, '0')}</span> ]
          </span>
          <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-primary/30" />
        </div>

        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Button
            variant="outline"
            onClick={() => setOffset(offset + limit)}
            className="font-mono text-xs uppercase tracking-wider border-primary/20 hover:border-primary/50 hover:bg-primary/5"
          >
            Next_Page <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
