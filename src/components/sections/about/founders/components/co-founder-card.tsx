import { Typography } from '@/components/ui/typography';

export interface CoFounderCardProps {
  name: string;
  role: string;
  description: string;
}

export const CoFounderCard = ({ name, role, description }: CoFounderCardProps) => (
  <div className='bg-muted relative z-20 flex w-full shrink-0 flex-col space-y-8.25 rounded-xl p-8 xl:w-112.75 xl:bg-white'>
    <div className='space-y-1.5'>
      <Typography variant='body1' className='text-[24px] font-medium'>
        {name}
      </Typography>
      <Typography variant='body3' className='text-foreground-secondary font-normal'>
        {role}
      </Typography>
    </div>
    <Typography variant='body3' className='text-foreground-secondary mt-auto max-w-200 font-normal'>
      {description}
    </Typography>
  </div>
);
