import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const SmartEstimationSkeleton = () => {
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
};

export const SmartEstimationResultCard = ({ isSuccess, onDownload }: { isSuccess?: boolean; onDownload?: () => void }) => {
  return (
    <div className='relative z-40 min-h-screen w-201.5 max-w-[calc(100vw-32px)] shrink-0 animate-[slideUp_0.5s_ease-out_forwards]'>
      <div className='absolute -inset-2 -z-10 rounded-t-[45px] bg-linear-to-r from-[#C3FF00] to-[#00A2BB] opacity-60 blur-3xl' />

      <div className='bg-gradient-border shadow-smart-result relative h-full w-full overflow-hidden rounded-t-[45px] rounded-b-none border-2 border-b-0 border-transparent'>
        <div className='relative flex w-full flex-col p-10 md:px-16 md:pt-15.25 md:pb-10'>
          <div className='-md:left-23.75 pointer-events-none absolute top-[-10%] left-[-10%] z-20 opacity-[0.03] md:-top-15.25'>
            <Icon icon='LogoMark' className='h-57.5 w-48.5 md:h-115 md:w-97' />
          </div>

          {isSuccess && (
            <div
              className='absolute top-13.75 left-13.75 z-10'
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: 200, fontStyle: 'italic', color: '#FF0000' }}
            >
              Real content PDF
            </div>
          )}

          <div className='absolute top-29.25 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2'>
            {isSuccess ? (
              <Button onClick={onDownload} className='shadow-smart-download w-42.75'>
                Download PDF
              </Button>
            ) : (
              <div className='shadow-smart-assessing flex h-15 w-55 items-center justify-center gap-2.5 rounded-[200px] bg-[#C3FF00] font-medium text-black'>
                <Icon icon='LogoMark' width={24} height={28} />
                <span className='text-[16px]'>Assessing tech stack</span>
              </div>
            )}
          </div>

          {!isSuccess && <SmartEstimationSkeleton />}
        </div>
      </div>
    </div>
  );
};
