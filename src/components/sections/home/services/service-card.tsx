import { Icon } from '@/components/ui/icon';
import { Typography } from '@/components/ui/typography';

interface ServiceCardProps {
  title: string;
  description: string;
}

export const ServiceCard = ({ title, description }: ServiceCardProps) => {
  return (
    <div className='bg-muted flex h-93.75 w-full shrink-0 flex-col rounded-lg p-8 md:h-auto md:max-w-100 md:min-w-112.75'>
      <div className='mb-34.75 flex size-12.5 items-center justify-center rounded-[8px] bg-[#8A8A8A17] shadow-[0px_1.39px_2.78px_0px_rgba(0,0,0,0.1)] md:bg-white'>
        <Icon icon='SidebarTop' />
      </div>

      <Typography variant='h4' className='mb-4.25 text-[24px] leading-[1.24] font-medium'>
        {title}
      </Typography>

      <Typography variant='body3' className='text-foreground-secondary text-[18px] leading-snug'>
        {description}
      </Typography>
    </div>
  );
};
