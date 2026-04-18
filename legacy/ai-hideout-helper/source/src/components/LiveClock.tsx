import * as React from "react";

export function LiveClock() {
  const [now, setNow] = React.useState<Date | null>(null);
  React.useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const utc = now ? now.toISOString().replace("T", " ").slice(0, 19) + "Z" : "---------- --:--:--Z";
  return (
    <div className="font-mono text-[10px] uppercase tracking-widest text-hud" suppressHydrationWarning>
      {utc}
    </div>
  );
}
