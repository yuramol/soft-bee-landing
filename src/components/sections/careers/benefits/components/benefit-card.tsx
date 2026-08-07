import Image from 'next/image';

import { Icon } from '@/components/ui/icon';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

export type BenefitType = 'cyan' | 'white' | 'image' | 'lime';
export type BenefitLayout = 'bottom' | 'split' | 'top';

interface BenefitCardProps {
  title: string;
  description: string;
  type: BenefitType;
  layout?: BenefitLayout;
  image?: string;
  className?: string;
}

export const BenefitCard = ({ title, description, type, layout = 'bottom', image, className }: BenefitCardProps) => {
  const isDarkBg = type === 'cyan' || type === 'image';

  return (
    <div
      className={cn(
        'relative flex w-full shrink-0 flex-col overflow-hidden rounded-[16px] p-8',
        'h-93.75 xl:h-126.25',
        {
          'bg-accent': type === 'cyan',
          'bg-background': type === 'white',
          'bg-primary-light': type === 'lime'
        },
        className
      )}
    >
      {type === 'image' && image && (
        <>
          <div className='absolute inset-0 z-0'>
            <Image src={image} alt={title} fill className='object-cover' quality={100} />
          </div>
          <div className='absolute inset-0 z-0 backdrop-blur-[20px]' />
        </>
      )}

      {type === 'cyan' && (
        <div className='bg-accent-dark shadow-icon relative z-10 flex size-12.5 items-center justify-center rounded-[8px]'>
          <Icon icon='SidebarTop' color='#fff' className='text-white' />
        </div>
      )}

      {(layout === 'split' || layout === 'top') && (
        <div className='relative z-10 flex flex-col'>
          <Typography
            variant='h4'
            className={cn('text-28 leading-[1.24] font-medium', isDarkBg ? 'text-foreground-inverse' : 'text-foreground', {
              'mb-4.25': layout === 'top'
            })}
          >
            {title}
          </Typography>
          {layout === 'top' && (
            <Typography
              variant='body3'
              className={cn('text-[14px] leading-snug md:text-[16px]', isDarkBg ? 'text-foreground-inverse/50' : 'text-foreground/50')}
            >
              {description}
            </Typography>
          )}
        </div>
      )}

      {(layout === 'bottom' || layout === 'split') && (
        <div className='relative z-10 mt-auto flex flex-col'>
          {layout === 'bottom' && (
            <Typography
              variant='h4'
              className={cn('text-28 mb-4.25 leading-[1.24] font-medium', isDarkBg ? 'text-foreground-inverse' : 'text-foreground')}
            >
              {title}
            </Typography>
          )}
          <Typography
            variant='body3'
            className={cn('text-[14px] leading-snug md:text-[16px]', isDarkBg ? 'text-foreground-inverse/50' : 'text-foreground/50')}
          >
            {description}
          </Typography>
        </div>
      )}
    </div>
  );
};
