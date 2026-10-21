'use client';

import nextDynamic from 'next/dynamic';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Typography } from '@/components/ui/typography';

const VacancyDialog = nextDynamic(() => import('@/components/vacancy-dialog').then((module) => module.VacancyDialog), {
  ssr: false
});

interface VacancyCardProps {
  badge: string;
  title: string;
  description: string;
  roleDescription: string;
}

export function VacancyCard({ badge, title, description, roleDescription }: VacancyCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDialogLoaded, setIsDialogLoaded] = useState(false);

  function handleOpen() {
    setIsDialogLoaded(true);
    setIsOpen(true);
  }

  function handleOpenChange(nextOpen: boolean) {
    setIsOpen(nextOpen);
  }

  return (
    <>
      <button
        type='button'
        onClick={handleOpen}
        className='group bg-muted relative flex h-auto min-h-77.75 w-full cursor-pointer flex-col gap-6 overflow-hidden rounded-lg p-4 text-left md:min-h-93.75 md:gap-10 md:p-8'
      >
        <div className='card-hover-gradient pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100' />

        <div className='relative z-10 flex w-full items-start justify-between gap-4'>
          <div className='bg-foreground-secondary/4 w-fit rounded-sm px-3.5 py-[12.5px]'>
            <Typography variant='h6' className='font-medium md:font-normal'>
              {badge}
            </Typography>
          </div>

          <Button variant='icon' size='icon-md' className='pointer-events-none shrink-0 rounded-full' asChild>
            <span>
              <Icon icon='ArrowUpRight' width={23} height={23} />
            </span>
          </Button>
        </div>

        <div className='relative z-10 space-y-4.25'>
          <Typography variant='h4' className='text-[24px] leading-[1.24] font-medium md:min-h-15'>
            {title}
          </Typography>
          <Typography variant='body3' className='text-foreground-secondary'>
            {description}
          </Typography>
        </div>
      </button>
      {isDialogLoaded ? (
        <VacancyDialog open={isOpen} onOpenChange={handleOpenChange} title={title} roleDescription={roleDescription} />
      ) : null}
    </>
  );
}
