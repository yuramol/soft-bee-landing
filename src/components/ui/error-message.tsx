import { FC } from 'react';

import { Typography } from '@ui/typography';

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage: FC<ErrorMessageProps> = ({ message }) => (
  <Typography variant='body3' className='text-orange-bold font-medium'>
    {message}
  </Typography>
);
