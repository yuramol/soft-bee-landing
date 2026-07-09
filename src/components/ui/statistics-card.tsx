import { FC } from 'react';

import { cn } from '@/lib/utils';
import { Typography } from '@ui/typography';

interface CardData {
  name: string;
  percent: string;
  percentColor: string;
  currentMonth: string;
  subtitle: string;
  lastMonth: string;
  nameSemibold?: boolean;
}

interface StatisticCardData {
  data: CardData;
}

export const StatisticsCard: FC<StatisticCardData> = ({ data }) => {
  const { name, nameSemibold, percent, percentColor, subtitle, currentMonth, lastMonth } = data;

  return (
    <div className='flex w-full flex-col gap-2.5 rounded-[20px] bg-white px-[22px] py-4'>
      <div className='flex flex-row items-center gap-[9px]'>
        <Typography variant='body2' className={cn('font-medium text-black', nameSemibold ? 'font-semibold' : '')}>
          {name}
        </Typography>
        <Typography variant='body2' className='font-medium' style={{ color: percentColor }}>
          {percent}
        </Typography>
      </div>
      <Typography variant='h2' className='font-bold text-black'>
        {currentMonth}
      </Typography>
      <div className='flex flex-row items-center justify-between'>
        <Typography variant='body3' className='text-subtext font-medium'>
          {subtitle}
        </Typography>
        <Typography variant='body3' className='text-subtext font-medium'>
          {lastMonth}
        </Typography>
      </div>
    </div>
  );
};
