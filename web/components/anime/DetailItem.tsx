import { cn } from '@/utils/lib/utils';

interface DetailItemProps {
  danger?: boolean;
  label: string;
  value: number | string;
}

export function DetailItem({ label, value, danger }: DetailItemProps) {
  if (!value) return null;

  return (
    <div className='max-xs:whitespace-nowrap relative flex flex-col'>
      <label className='text-muted-foreground text-sm'>{label}</label>
      <span className={cn('text-md whitespace-pre-line', danger && 'font-semibold text-red-500')}>
        {value}
      </span>
    </div>
  );
}
