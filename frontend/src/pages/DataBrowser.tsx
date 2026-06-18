import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { getCrimes, getCrimeTypes } from '@/lib/api';
import { Search, Filter } from 'lucide-react';

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Data Browser</h1>
        <p className="text-muted-foreground text-sm mt-1">Search, filter, and explore Chicago crime records.</p>
      </div>

      <Card className="card-intel">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by type, description, case number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              placeholder="All types"
              value={crimeType}
              onValueChange={setCrimeType}
              options={[{ value: '', label: 'All types' }, ...(crimeTypes || []).map((t: string) => ({ value: t, label: t }))]}
              className="w-48"
            />
            <Select
              placeholder="All districts"
              value={district}
              onValueChange={setDistrict}
              options={[{ value: '', label: 'All districts' }, ...districts.map((d) => ({ value: d, label: `District ${d}` }))]}
              className="w-48"
            />
            <Button variant="outline" onClick={() => { setSearch(''); setCrimeType(''); setDistrict(''); setOffset(0); }}>
              <Filter className="h-4 w-4 mr-1" /> Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="card-intel overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Case #</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>District</TableHead>
                  <TableHead>Arrest</TableHead>
                  <TableHead>Location</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 7 }).map((_, j) => <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>)}
                  </TableRow>
                ))}
                {filtered.map((c: any) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-mono text-xs">{c.case_number || c.id}</TableCell>
                    <TableCell className="font-medium">{c.primary_type}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{c.description}</TableCell>
                    <TableCell className="font-mono text-xs">{c.date?.slice(0, 10)}</TableCell>
                    <TableCell>{c.district}</TableCell>
                    <TableCell>
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${c.arrest ? 'bg-success/15 text-success' : 'bg-muted text-muted-foreground'}`}>
                        {c.arrest ? 'Yes' : 'No'}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{c.location_description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <Button variant="outline" disabled={offset === 0} onClick={() => setOffset(Math.max(0, offset - limit))}>
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">Page {(offset / limit) + 1}</span>
        <Button variant="outline" onClick={() => setOffset(offset + limit)}>
          Next
        </Button>
      </div>
    </div>
  );
}
