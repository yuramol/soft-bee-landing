import { cn } from '@/lib/utils';

export function SmartEstimationSkeleton() {
  return (
    <div className='relative z-10 flex w-full flex-col'>
      <div className='mb-10 flex w-full flex-col gap-4.25 md:mb-26'>
        {topLines.map((line, i) => (
          <div
            key={i}
            className={cn('bg-muted h-6 animate-[solidPulse_1.5s_ease-in-out_infinite]', line.width)}
            style={{ animationDelay: line.delay }}
          />
        ))}
      </div>
      <div className='flex w-full gap-10.75'>
        <div className='flex flex-1 flex-col gap-4.25'>
          {col1Lines.map((line, i) => (
            <div
              key={i}
              className={cn('bg-muted h-6 animate-[solidPulse_1.5s_ease-in-out_infinite]', line.width)}
              style={{ animationDelay: line.delay }}
            />
          ))}
        </div>
        <div className='flex flex-1 flex-col gap-4.25'>
          {col2Lines.map((line, i) => (
            <div
              key={i}
              className={cn('bg-muted h-6 animate-[solidPulse_1.5s_ease-in-out_infinite]', line.width)}
              style={{ animationDelay: line.delay }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const topLines = [
  { width: 'w-full', delay: '0ms' },
  { width: 'w-11/12', delay: '150ms' },
  { width: 'w-4/5', delay: '300ms' }
];

const col1Lines = [
  { width: 'w-full', delay: '450ms' },
  { width: 'w-11/12', delay: '600ms' },
  { width: 'w-4/5', delay: '750ms' },
  { width: 'w-[85%]', delay: '900ms' },
  { width: 'w-[90%]', delay: '1050ms' },
  { width: 'w-3/4', delay: '1200ms' }
];

const col2Lines = [
  { width: 'w-11/12', delay: '1350ms' },
  { width: 'w-full', delay: '1500ms' },
  { width: 'w-4/5', delay: '1650ms' },
  { width: 'w-[85%]', delay: '1800ms' },
  { width: 'w-[95%]', delay: '1950ms' },
  { width: 'w-3/4', delay: '2100ms' }
];
