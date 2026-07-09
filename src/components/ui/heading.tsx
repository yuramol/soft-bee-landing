import { Typography } from '@ui/typography';

interface HeadingProps {
  title: string;
  description: string;
}

export const Heading: React.FC<HeadingProps> = ({ title, description }) => {
  return (
    <div className='flex flex-col gap-2'>
      <Typography variant='h3' className='font-bold tracking-tight'>
        {title}
      </Typography>
      <Typography variant='description' className='text-muted-foreground'>
        {description}
      </Typography>
    </div>
  );
};
