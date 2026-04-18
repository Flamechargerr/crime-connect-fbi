import { appEnv } from '@/lib/env';

export default function Health() {
  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <section className="w-full max-w-xl border border-border rounded-lg p-6 bg-card">
        <h1 className="text-xl font-semibold mb-4">ok</h1>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">service</dt>
            <dd>crime-connect-fbi-web</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">status</dt>
            <dd>healthy</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">environment</dt>
            <dd>{appEnv.runtimeEnv}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">timestamp</dt>
            <dd>{new Date().toISOString()}</dd>
          </div>
        </dl>
      </section>
    </main>
  );
}

