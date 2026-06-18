import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { predict, getPredictStats } from '@/lib/api';
import { Brain, Activity, AlertTriangle, Shield, Zap } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function Predictions() {
  const [hour, setHour] = useState(12);
  const [district, setDistrict] = useState(1);
  const [crimeType, setCrimeType] = useState('THEFT');
  const [arrestHistory, setArrestHistory] = useState(false);
  const [result, setResult] = useState<any>(null);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['predict-stats'],
    queryFn: getPredictStats,
  });

  const predictMutation = useMutation({
    mutationFn: predict,
    onSuccess: (data) => setResult(data),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    predictMutation.mutate({ hour, district, crime_type: crimeType, arrest_history: arrestHistory });
  };

  const crimeTypes = [
    'THEFT', 'BATTERY', 'CRIMINAL DAMAGE', 'NARCOTICS', 'ASSAULT',
    'BURGLARY', 'MOTOR VEHICLE THEFT', 'ROBBERY', 'DECEPTIVE PRACTICE'
  ];

  const priorityColor: Record<string, string> = {
    Low: 'bg-success/15 text-success border-success/30',
    Medium: 'bg-primary/15 text-primary border-primary/30',
    High: 'bg-warning/15 text-warning border-warning/30',
    Critical: 'bg-destructive/15 text-destructive border-destructive/30',
  };

  const probData = result?.probabilities
    ? Object.entries(result.probabilities).map(([name, value]) => ({ name, value: (value as number) * 100 }))
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Predictive Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">ML-powered threat assessment and priority prediction.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="card-intel">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Brain className="h-4 w-4 text-primary" /> Prediction Console
            </CardTitle>
            <CardDescription>Input incident parameters to receive a priority assessment.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Hour (0-23)</label>
                  <Input type="number" min={0} max={23} value={hour} onChange={(e) => setHour(Number(e.target.value))} className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">District (1-25)</label>
                  <Input type="number" min={1} max={25} value={district} onChange={(e) => setDistrict(Number(e.target.value))} className="mt-1" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Crime Type</label>
                <Select
                  value={crimeType}
                  onValueChange={setCrimeType}
                  options={crimeTypes.map((t) => ({ value: t, label: t }))}
                  className="mt-1"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="arrest"
                  checked={arrestHistory}
                  onChange={(e) => setArrestHistory(e.target.checked)}
                  className="h-4 w-4 rounded border-border"
                />
                <label htmlFor="arrest" className="text-sm">Prior arrest history</label>
              </div>
              <Button type="submit" disabled={predictMutation.isPending} className="w-full gap-2">
                <Zap className="h-4 w-4" />
                {predictMutation.isPending ? 'Analyzing...' : 'Run Prediction'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="card-intel">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" /> Model Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {statsLoading ? (
              <Skeleton className="h-8 w-full" />
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Accuracy</span>
                  <span className="text-lg font-bold">{(stats?.accuracy * 100).toFixed(1)}%</span>
                </div>
                <div className="h-px bg-border" />
                <div className="space-y-2">
                  {stats?.feature_importances && Object.entries(stats.feature_importances).map(([name, value]: [string, any]) => (
                    <div key={name} className="flex items-center justify-between">
                      <span className="text-sm capitalize">{name}</span>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 rounded-full bg-muted overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${value * 100}%` }} />
                        </div>
                        <span className="text-xs font-mono w-12 text-right">{(value * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {result && (
        <div className="grid lg:grid-cols-2 gap-6 animate-fade-in">
          <Card className="card-intel">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" /> Prediction Result
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Predicted Priority</span>
                <Badge variant="outline" className={`${priorityColor[result.priority] || ''} text-sm uppercase px-3 py-1`}>
                  {result.priority}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Confidence</span>
                <span className="text-lg font-bold">{(result.confidence * 100).toFixed(1)}%</span>
              </div>
              <div className="h-px bg-border" />
              <div className="space-y-2">
                {Object.entries(result.probabilities).map(([name, value]: [string, any]) => (
                  <div key={name} className="flex items-center justify-between">
                    <span className="text-sm">{name}</span>
                    <span className="text-sm font-mono">{(value * 100).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="card-intel">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-primary" /> Probability Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={probData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
