import { IconCommonProps } from '@/components/ui/icon';

export const Check = (style: IconCommonProps) => (
  <svg
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    style={style}
    className={style.className}
  >
    <polyline points='20 6 9 17 4 12' />
  </svg>
);
