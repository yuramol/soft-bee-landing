'use client';

import Link from 'next/link';

import { DiscussProjectButton } from '@/components/discuss-project-button';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { ROUTES } from '@/constants/routes';
import { formatEstimateHours, formatEstimatePrice } from '@/lib/estimator/format-estimate';
import type { ProposalEstimate } from '@/lib/estimator/types';

import smartEstimationContent from '../content.json';
import { SmartEstimationSkeleton } from './smart-estimation-skeleton';

interface SmartEstimationResultCardProps {
  isSuccess?: boolean;
  estimate?: ProposalEstimate | null;
  onDownload?: () => void;
  onEdit?: () => void;
  onClose?: () => void;
}

export function SmartEstimationResultCard({ isSuccess, estimate, onDownload, onEdit, onClose }: SmartEstimationResultCardProps) {
  const { result } = smartEstimationContent;
  const hoursLabel = formatEstimateHours(estimate);
  const priceLabel = formatEstimatePrice(estimate);

  return (
    <div className='relative z-40 w-201.5 max-w-[calc(100vw-32px)] shrink-0 animate-[slideUp_0.5s_ease-out_forwards]'>
      <div className='absolute -inset-2 -z-10 rounded-t-[45px] bg-linear-to-r from-[#C3FF00] to-[#00A2BB] opacity-60 blur-3xl' />

      <div className='bg-gradient-border shadow-smart-result relative w-full overflow-hidden rounded-t-[45px] rounded-b-none border-2 border-b-0 border-transparent'>
        <div className='pointer-events-none absolute inset-0 overflow-hidden rounded-t-[45px]'>
          <div className='absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#C3FF00] opacity-30 blur-[100px]' />
          <div className='absolute -right-32 -bottom-32 h-96 w-96 rounded-full bg-[#00A2BB] opacity-20 blur-[100px]' />
          <div className='absolute top-[-10%] left-[-10%] z-0 opacity-[0.04] md:-top-15.25 md:left-[-15%]'>
            <Icon icon='LogoMark' className='h-57.5 w-48.5 md:h-115 md:w-97' />
          </div>
        </div>

        <div className='relative flex w-full flex-col p-10 md:px-16 md:pt-15.25 md:pb-10'>
          {isSuccess && onClose && (
            <div className='absolute top-6 right-6 z-50 md:top-10 md:right-10'>
              <button
                onClick={onClose}
                className='flex size-10 cursor-pointer items-center justify-center rounded-full bg-black/2 transition-colors hover:bg-black/4'
                aria-label='Close'
              >
                <Icon icon='X' fill='#000' className='size-5 text-black' />
              </button>
            </div>
          )}

          {isSuccess && onEdit && (
            <div className='absolute top-6 left-6 z-50 md:top-10 md:left-10'>
              <Button
                onClick={onEdit}
                className='bg-accent hover:bg-accent/90 border-accent-dark h-10.5 gap-2.5 border px-4 py-1.5 pr-4 pl-6 text-[14px] text-white shadow'
                rightIcon={<Icon icon='PencilSimple' className='opacity-50' width={22} height={22} />}
              >
                {smartEstimationContent.editLabel}
              </Button>
            </div>
          )}

          {isSuccess ? (
            <div className='relative z-10 flex flex-col items-center text-center text-black'>
              {hoursLabel && <div className='text-[24px] leading-normal font-medium md:text-[32px]'>Estimate: {hoursLabel}</div>}

              <div className='mt-6 max-w-2xl text-[16px] leading-normal md:text-[20px]'>
                This sounds like a fantastic project! We&apos;d love to collaborate on it, especially since we&apos;ve worked on similar{' '}
                <Link href={ROUTES.CASE_STUDIES} className='text-accent hover:underline'>
                  cases
                </Link>
                .
              </div>

              {!hoursLabel && !priceLabel && (
                <div className='text-[24px] leading-normal font-medium md:text-[32px]'>Your estimate is ready</div>
              )}

              <div className='mt-16 flex w-full flex-col items-center justify-between gap-4 md:flex-row'>
                <div className='flex flex-1 justify-start'>
                  <Button onClick={onDownload} data-testid='smart-estimation-download' className='shadow-smart-download w-full md:w-64'>
                    {result.downloadLabel}
                  </Button>
                </div>
                <div className='flex flex-1 justify-end'>
                  <DiscussProjectButton text='Contact Soft Bee' className='w-full md:w-fit' />
                </div>
              </div>
            </div>
          ) : (
            <SmartEstimationSkeleton />
          )}
        </div>
      </div>
    </div>
  );
}
