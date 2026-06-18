import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { getReportSummary } from '@/lib/api';
import { FileBarChart, BarChart3 } from 'lucide-react';

export default function Reports() {
  const { data: report, isLoading, refetch } = useQuery({
    queryKey: ['report-summary'],
    queryFn: getReportSummary,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground text-sm mt-1">Generated intelligence summaries.</p>
        </div>
        <Button onClick={() => refetch()} className="gap-2">
          <FileBarChart className="h-4 w-4" /> Generate Report
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : report ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="card-intel">
              <CardContent className="pt-6">
                <BarChart3 className="h-5 w-5 text-primary mb-2" />
                <div className="text-2xl font-bold">{report.total_crimes_analyzed?.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Crimes analyzed</div>
              </CardContent>
            </Card>
            <Card className="card-intel">
              <CardContent className="pt-6">
                <BarChart3 className="h-5 w-5 text-primary mb-2" />
                <div className="text-2xl font-bold">
                  {report.model_accuracy ? `${(report.model_accuracy * 100).toFixed(1)}%` : 'N/A'}
                </div>
                <div className="text-xs text-muted-foreground">Model accuracy</div>
              </CardContent>
            </Card>
            <Card className="card-intel">
              <CardContent className="pt-6">
                <BarChart3 className="h-5 w-5 text-primary mb-2" />
                <div className="text-2xl font-bold">{report.top_crime_types?.length}</div>
                <div className="text-xs text-muted-foreground">Top crime types</div>
              </CardContent>
            </Card>
            <Card className="card-intel">
              <CardContent className="pt-6">
                <BarChart3 className="h-5 w-5 text-primary mb-2" />
                <div className="text-2xl font-bold">{new Date().toLocaleDateString()}</div>
                <div className="text-xs text-muted-foreground">Generated</div>
              </CardContent>
            </Card>
          </div>

          <Card className="card-intel">
            <CardHeader>
              <CardTitle>Top Crime Types</CardTitle>
              <CardDescription>Most frequent crime categories in the analyzed dataset.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {report.top_crime_types?.map((t: any, i: number) => (
                  <div key={t.type} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-muted-foreground w-6">{String(i + 1).padStart(2, '0')}</span>
                      <span className="font-medium">{t.type}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-32 rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${Math.min(100, (t.count / (report.total_crimes_analyzed || 1)) * 500)}%` }} />
                      </div>
                      <Badge variant="secondary" className="text-xs">{t.count}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="card-intel">
            <CardHeader>
              <CardTitle>Report Metadata</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-xs font-mono uppercase text-muted-foreground mb-1">Generated At</div>
                  <div className="font-mono">{report.generated_at?.slice(0, 10)}</div>
                </div>
                <div>
                  <div className="text-xs font-mono uppercase text-muted-foreground mb-1">Data Source</div>
                  <div>Chicago Open Data</div>
                </div>
                <div>
                  <div className="text-xs font-mono uppercase text-muted-foreground mb-1">Model</div>
                  <div>Random Forest</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
