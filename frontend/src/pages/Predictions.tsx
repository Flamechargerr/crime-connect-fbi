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
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] } as any,
  }),
};

const resultSlideUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 + i * 0.1, duration: 0.5, type: 'spring', stiffness: 120 } as any,
  }),
};

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
    onSuccess: (data) => {
      setResult(data);
      toast.success("Threat classification prediction completed successfully.");
    },
    onError: (err: any) => {
      toast.error(`Prediction failed: ${err.message}`);
    }
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

  const glassTooltipStyle = {
    background: 'rgba(5, 7, 10, 0.9)',
    border: '1px solid rgba(0, 255, 255, 0.2)',
    borderRadius: 10,
    backdropFilter: 'blur(8px)',
    color: '#FFF',
    fontFamily: 'monospace',
    fontSize: 10,
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* HUD Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
          <Brain className="h-6 w-6 text-primary" />
          Threat Assessment Engine
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Machine Learning prediction console for incident priority classification and parameter simulation.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Prediction Console Card */}
        <motion.div
          custom={0}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <Card className="card-intel relative overflow-hidden">
            <div className="absolute left-0 right-0 h-[1px] bg-primary/10 animate-scan top-0 pointer-events-none" />
            <CardHeader>
              <CardTitle className="text-xs font-mono uppercase tracking-wider text-white flex items-center gap-2">
                <Brain className="h-4 w-4 text-primary" /> Prediction_Console
              </CardTitle>
              <CardDescription className="text-[10px] font-mono uppercase tracking-widest text-primary/40">
                Input incident parameters to receive a priority assessment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Hour (0-23)</label>
                    <Input type="number" min={0} max={23} value={hour} onChange={(e) => setHour(Number(e.target.value))} className="mt-1" />
                  </div>
                  <div>
                    <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">District (1-25)</label>
                    <Input type="number" min={1} max={25} value={district} onChange={(e) => setDistrict(Number(e.target.value))} className="mt-1" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Crime Type</label>
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
                  <label htmlFor="arrest" className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Prior arrest history</label>
                </div>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button
                    type="submit"
                    disabled={predictMutation.isPending}
                    className="w-full gap-2 relative overflow-hidden shadow-[0_0_15px_rgba(0,255,255,0.15)] hover:shadow-[0_0_25px_rgba(0,255,255,0.3)] transition-shadow duration-300"
                  >
                    <Zap className="h-4 w-4 animate-pulse" />
                    {predictMutation.isPending ? 'Analyzing...' : 'Run Prediction'}
                  </Button>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Model Performance Card */}
        <motion.div
          custom={1}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <Card className="card-intel relative overflow-hidden">
            <div className="absolute left-0 right-0 h-[1px] bg-primary/10 animate-scan top-0 pointer-events-none" />
            <CardHeader>
              <CardTitle className="text-xs font-mono uppercase tracking-wider text-white flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" /> Model_Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {statsLoading ? (
                <Skeleton className="h-8 w-full" />
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Accuracy</span>
                    <span className="text-lg font-bold font-mono text-glow text-white">{(stats?.accuracy * 100).toFixed(1)}%</span>
                  </div>
                  <div className="h-px bg-primary/10" />
                  <div className="space-y-3">
                    {stats?.feature_importances && Object.entries(stats.feature_importances).map(([name, value]: [string, any], i: number) => (
                      <motion.div
                        key={name}
                        className="flex items-center justify-between"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
                      >
                        <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground capitalize">{name}</span>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-24 rounded-full bg-muted/30 overflow-hidden">
                            <motion.div
                              className="h-full rounded-full bg-gradient-to-r from-primary/60 to-primary"
                              initial={{ width: 0 }}
                              animate={{ width: `${value * 100}%` }}
                              transition={{ delay: 0.5 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                            />
                          </div>
                          <span className="text-xs font-mono w-12 text-right text-primary/80">{(value * 100).toFixed(1)}%</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Result Cards */}
      {result && (
        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div
            custom={0}
            variants={resultSlideUp}
            initial="hidden"
            animate="visible"
          >
            <Card className="card-intel relative overflow-hidden">
              <div className="absolute left-0 right-0 h-[1px] bg-primary/10 animate-scan top-0 pointer-events-none" />
              <CardHeader>
                <CardTitle className="text-xs font-mono uppercase tracking-wider text-white flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" /> Prediction_Result
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Predicted Priority</span>
                  <Badge variant="outline" className={`${priorityColor[result.priority] || ''} text-sm uppercase px-3 py-1 font-mono`}>
                    <span className="h-2 w-2 rounded-full bg-current animate-pulse mr-2 inline-block" />
                    {result.priority}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Confidence</span>
                  <span className="text-lg font-bold font-mono text-glow text-white">{(result.confidence * 100).toFixed(1)}%</span>
                </div>
                <div className="h-px bg-primary/10" />
                <div className="space-y-2">
                  {Object.entries(result.probabilities).map(([name, value]: [string, any], i: number) => (
                    <motion.div
                      key={name}
                      className="flex items-center justify-between"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.06, duration: 0.35 }}
                    >
                      <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">{name}</span>
                      <span className="text-sm font-mono text-primary/90">{(value * 100).toFixed(1)}%</span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            custom={1}
            variants={resultSlideUp}
            initial="hidden"
            animate="visible"
          >
            <Card className="card-intel relative overflow-hidden">
              <div className="absolute left-0 right-0 h-[1px] bg-primary/10 animate-scan top-0 pointer-events-none" />
              <CardHeader>
                <CardTitle className="text-xs font-mono uppercase tracking-wider text-white flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-primary" /> Probability_Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={probData}>
                    <defs>
                      <linearGradient id="predBarGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.9} />
                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 255, 255, 0.06)" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} fontFamily="monospace" tickLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} fontFamily="monospace" tickLine={false} />
                    <Tooltip contentStyle={glassTooltipStyle} cursor={{ fill: 'rgba(0, 255, 255, 0.04)' }} />
                    <Bar dataKey="value" fill="url(#predBarGrad)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
