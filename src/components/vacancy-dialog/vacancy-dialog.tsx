import { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Typography } from '@/components/ui/typography';

interface VacancyDialogProps {
  children?: ReactNode;
  triggerButton?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  location?: string;
  type?: string;
  roleDescription?: ReactNode;
  responsibilities?: ReactNode;
}

export function VacancyDialog({
  children,
  triggerButton,
  open,
  onOpenChange,
  title = 'Client director',
  location = 'Kyiv, Ukraine',
  type = 'Full-time',
  roleDescription,
  responsibilities
}: VacancyDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {(triggerButton || children) && <DialogTrigger asChild>{triggerButton || children}</DialogTrigger>}

      <DialogContent className='flex h-[95vh] max-h-[min(884px,95vh)] w-[95vw] max-w-268 flex-col gap-0 overflow-hidden rounded-2xl border-0 px-5 pt-20 pb-5 md:h-auto md:px-10 md:pt-27.75 md:pb-10'>
        <DialogHeader className='mb-10 flex flex-col space-y-0 text-left md:mb-17'>
          <DialogTitle asChild className='text-48 mb-4 leading-[1.24] font-normal'>
            <Typography variant='h2'>{title}</Typography>
          </DialogTitle>
          <div className='flex flex-col justify-between gap-4 sm:flex-row sm:items-end'>
            <div className='flex items-center gap-2'>
              <div className='bg-foreground-secondary/4 rounded-sm px-3.5 py-[12.5px]'>
                <Typography variant='body3' className='font-normal'>
                  {location}
                </Typography>
              </div>
              <div className='bg-foreground-secondary/4 rounded-sm px-3.5 py-[12.5px]'>
                <Typography variant='body3' className='font-normal'>
                  {type}
                </Typography>
              </div>
            </div>

            <Button variant='primary' className='w-42.75'>
              Apply now
            </Button>
          </div>
        </DialogHeader>

        <div className='bg-foreground/50 h-px w-full shrink-0' />

        <div className='custom-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto pt-9 pr-2 sm:pr-4'>
          <div className='flex flex-col gap-4 sm:flex-row sm:justify-between sm:gap-8'>
            <Typography variant='h4' className='text-foreground max-w-42.25 text-[24px] font-medium'>
              The role
            </Typography>
            <Typography variant='h4' className='text-foreground/50 max-w-183.75'>
              {roleDescription}
            </Typography>
          </div>

          <div className='bg-foreground/50 my-9 h-px w-full shrink-0' />

          <div className='flex flex-col gap-4 pb-4 sm:flex-row sm:justify-between sm:gap-8'>
            <Typography variant='h4' className='text-foreground max-w-42.25 text-[24px] font-medium'>
              Your responsibilities
            </Typography>
            <div className='text-foreground/50 flex max-w-183.75 flex-col gap-4 text-[24px] leading-[1.6] font-normal'>
              {responsibilities}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
