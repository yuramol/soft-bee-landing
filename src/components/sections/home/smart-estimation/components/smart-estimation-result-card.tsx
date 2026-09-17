'use client';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { formatEstimateHours, formatEstimatePrice } from '@/lib/estimator/format-estimate';
import type { ProposalEstimate } from '@/lib/estimator/types';

import smartEstimationContent from '../content.json';
import { SmartEstimationSkeleton } from './smart-estimation-skeleton';

interface SmartEstimationResultCardProps {
  isSuccess?: boolean;
  estimate?: ProposalEstimate | null;
  onDownload?: () => void;
}

export function SmartEstimationResultCard({ isSuccess, estimate, onDownload }: SmartEstimationResultCardProps) {
  const { result } = smartEstimationContent;
  const hoursLabel = formatEstimateHours(estimate);
  const priceLabel = formatEstimatePrice(estimate);

  return (
    <div className='relative z-40 min-h-screen w-201.5 max-w-[calc(100vw-32px)] shrink-0 animate-[slideUp_0.5s_ease-out_forwards]'>
      <div className='absolute -inset-2 -z-10 rounded-t-[45px] bg-linear-to-r from-[#C3FF00] to-[#00A2BB] opacity-60 blur-3xl' />

      <div className='bg-gradient-border shadow-smart-result relative h-full w-full overflow-hidden rounded-t-[45px] rounded-b-none border-2 border-b-0 border-transparent'>
        <div className='relative flex w-full flex-col p-10 md:px-16 md:pt-15.25 md:pb-10'>
          <div className='-md:left-23.75 pointer-events-none absolute top-[-10%] left-[-10%] z-0 opacity-[0.03] md:-top-15.25'>
            <Icon icon='LogoMark' className='h-57.5 w-48.5 md:h-115 md:w-97' />
          </div>

          {isSuccess ? (
            <div className='relative z-10 flex flex-col items-start text-left text-black'>
              {hoursLabel && <div className='text-[24px] leading-normal font-medium md:text-[32px]'>Estimate: {hoursLabel}</div>}
              {priceLabel && <div className='mt-6 text-[16px] leading-normal md:text-[20px]'>Price: {priceLabel}</div>}
              {!hoursLabel && !priceLabel && (
                <div className='text-[24px] leading-normal font-medium md:text-[32px]'>Your estimate is ready</div>
              )}

              <Button onClick={onDownload} data-testid='smart-estimation-download' className='shadow-smart-download mt-8 w-42.75'>
                {result.downloadLabel}
              </Button>
            </div>
          ) : (
            <SmartEstimationSkeleton />
          )}
        </div>
      </div>
    </div>
  );
}
