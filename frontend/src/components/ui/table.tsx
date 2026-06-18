import { cn } from '@/lib/utils';

export function Table({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) {
  return <div className="w-full overflow-auto"><table className={cn('w-full caption-bottom text-sm', className)} {...props} /></div>;
}

export function TableHeader({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn('[&_tr]:border-b', className)} {...props} />;
}

export function TableBody({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn('[&_tr:last-child]:border-0', className)} {...props} />;
}

export function TableRow({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={cn('border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted', className)} {...props} />;
}

export function TableHead({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) {
  return <th className={cn('h-10 px-2 text-left align-middle font-medium text-muted-foreground text-xs uppercase tracking-wider', className)} {...props} />;
}

export function TableCell({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn('p-2 align-middle', className)} {...props} />;
}
