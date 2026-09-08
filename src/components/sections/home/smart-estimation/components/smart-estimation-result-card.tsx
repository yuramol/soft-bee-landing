'use client';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';

import smartEstimationContent from '../content.json';
import { SmartEstimationSkeleton } from './smart-estimation-skeleton';

export function SmartEstimationResultCard({ isSuccess, onDownload }: { isSuccess?: boolean; onDownload?: () => void }) {
  const { result } = smartEstimationContent;

  return (
    <div className='relative z-40 min-h-screen w-201.5 max-w-[calc(100vw-32px)] shrink-0 animate-[slideUp_0.5s_ease-out_forwards]'>
      <div className='absolute -inset-2 -z-10 rounded-t-[45px] bg-linear-to-r from-[#C3FF00] to-[#00A2BB] opacity-60 blur-3xl' />

      <div className='bg-gradient-border shadow-smart-result relative h-full w-full overflow-hidden rounded-t-[45px] rounded-b-none border-2 border-b-0 border-transparent'>
        <div className='relative flex w-full flex-col p-10 md:px-16 md:pt-15.25 md:pb-10'>
          <div className='-md:left-23.75 pointer-events-none absolute top-[-10%] left-[-10%] z-20 opacity-[0.03] md:-top-15.25'>
            <Icon icon='LogoMark' className='h-57.5 w-48.5 md:h-115 md:w-97' />
          </div>

          {isSuccess && (
            <div className='pointer-events-none absolute top-10 left-10 z-10 flex flex-col text-left text-black md:top-15 md:left-16'>
              <div className='text-[24px] leading-normal font-medium md:text-[32px]'>Estimate: 20-25 hours</div>
              <div className='mt-6 text-[16px] leading-normal md:text-[20px]'>Price: $350,000 - $450,000 approximately for the work</div>
            </div>
          )}

          {isSuccess && (
            <div className='absolute top-29.25 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2'>
              <Button onClick={onDownload} className='shadow-smart-download w-42.75'>
                {result.downloadLabel}
              </Button>
            </div>
          )}

          {!isSuccess && <SmartEstimationSkeleton />}
        </div>
      </div>
    </div>
  );
}
