import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { getReportSummary } from '@/lib/api';
import { FileBarChart, Folder, Target, Shield, Clock } from 'lucide-react';
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

const statIcons = [
  { icon: Folder, label: 'Crimes analyzed' },
  { icon: Target, label: 'Model accuracy' },
  { icon: Shield, label: 'Top crime types' },
  { icon: Clock, label: 'Generated' },
];

export default function Reports() {
  const { data: report, isLoading, refetch } = useQuery({
    queryKey: ['report-summary'],
    queryFn: getReportSummary,
  });

  const handleGenerateReport = async () => {
    const toastId = toast.loading("Compiling intelligence records...");
    try {
      await refetch();
      toast.success("Intelligence summary report compiled.", { id: toastId });
    } catch (err: any) {
      toast.error(`Report generation failed: ${err.message}`, { id: toastId });
    }
  };

  const statValues = report
    ? [
        report.total_crimes_analyzed?.toLocaleString(),
        report.model_accuracy ? `${(report.model_accuracy * 100).toFixed(1)}%` : 'N/A',
        report.top_crime_types?.length,
        new Date().toLocaleDateString(),
      ]
    : [];

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* HUD Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <FileBarChart className="h-6 w-6 text-primary animate-pulse" />
            Intelligence Reports
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Aggregated intelligence summaries and structural data analysis generated from Chicago open records.
          </p>
        </div>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Button
            onClick={handleGenerateReport}
            className="gap-2 shadow-[0_0_15px_rgba(0,255,255,0.15)] hover:shadow-[0_0_25px_rgba(0,255,255,0.3)] transition-shadow duration-300"
          >
            <FileBarChart className="h-4 w-4" /> Generate Report
          </Button>
        </motion.div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : report ? (
        <div className="space-y-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statIcons.map((stat, i) => {
              const IconComponent = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ y: -2, transition: { type: 'spring', stiffness: 300 } }}
                >
                  <Card className="card-intel relative overflow-hidden">
                    <CardContent className="pt-6">
                      <IconComponent className="h-5 w-5 text-primary mb-2" />
                      <div className="text-2xl font-bold font-mono text-glow text-white">
                        {statValues[i]}
                      </div>
                      <div className="text-[10px] font-mono uppercase tracking-widest text-primary/50 mt-1">
                        {stat.label}
                      </div>
                      {/* Pulsing status dot */}
                      <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-success animate-pulse" />
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Top Crime Types Card */}
          <motion.div
            custom={4}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <Card className="card-intel relative overflow-hidden">
              {/* Scan line overlay */}
              <div className="absolute left-0 right-0 h-[1px] bg-primary/10 animate-scan top-0 pointer-events-none" />
              <CardHeader>
                <CardTitle className="text-xs font-mono uppercase tracking-wider text-white flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" /> Top_Crime_Types
                </CardTitle>
                <CardDescription className="text-[10px] font-mono uppercase tracking-widest text-primary/40">
                  Most frequent crime categories in the analyzed dataset
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {report.top_crime_types?.map((t: any, i: number) => (
                    <motion.div
                      key={t.type}
                      className="flex items-center justify-between"
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.06, duration: 0.4 }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-primary/50 w-6">{String(i + 1).padStart(2, '0')}</span>
                        <span className="text-sm font-mono uppercase tracking-wider text-white/90">{t.type}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-32 rounded-full bg-muted/30 overflow-hidden">
                          <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-primary/60 to-primary animate-fill-bar"
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, (t.count / (report.total_crimes_analyzed || 1)) * 500)}%` }}
                            transition={{ delay: 0.6 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                          />
                        </div>
                        <Badge variant="secondary" className="text-xs font-mono bg-primary/10 text-primary border border-primary/20">
                          {t.count}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Report Metadata Card */}
          <motion.div
            custom={5}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <Card className="card-intel relative overflow-hidden">
              <div className="absolute left-0 right-0 h-[1px] bg-primary/10 animate-scan top-0 pointer-events-none" />
              <CardHeader>
                <CardTitle className="text-xs font-mono uppercase tracking-wider text-white flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" /> Report_Metadata
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">Generated_At</div>
                    <div className="font-mono text-white/80">{report.generated_at?.slice(0, 10)}</div>
                  </div>
                  <div>
                    <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">Data_Source</div>
                    <div className="font-mono text-white/80">Chicago Open Data</div>
                  </div>
                  <div>
                    <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">Model_Engine</div>
                    <div className="font-mono text-white/80 flex items-center gap-2">
                      Random Forest
                      <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      ) : null}
    </motion.div>
  );
}
