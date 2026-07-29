import { Typography } from '@/components/ui/typography';

export interface TeamMemberCardProps {
  name: string;
  role: string;
  description: string;
}

export const TeamMemberCard = ({ name, role, description }: TeamMemberCardProps) => {
  return (
    <div className='relative z-20 mb-10.75 flex w-full shrink-0 flex-col space-y-12.25 rounded-xl bg-white p-8 xl:h-87 xl:w-112.75'>
      <div className='space-y-1.5'>
        <Typography variant='body1' className='font-medium'>
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
};
