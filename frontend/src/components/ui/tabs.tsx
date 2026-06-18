import { cn } from '@/lib/utils';

interface TabsProps {
  tabs: { value: string; label: string }[];
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}

export function Tabs({ tabs, value, onValueChange, children }: TabsProps) {
  return (
    <div>
      <div className="flex border-b border-border mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onValueChange(tab.value)}
            className={cn(
              'px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px',
              value === tab.value
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {children}
    </div>
  );
}

export function TabsContent({ value, activeValue, children }: { value: string; activeValue: string; children: React.ReactNode }) {
  if (value !== activeValue) return null;
  return <div>{children}</div>;
}
