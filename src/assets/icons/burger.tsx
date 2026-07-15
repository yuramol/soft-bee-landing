import { IconCommonProps } from '@/components/ui/icon';

export const Burger = (style: IconCommonProps) => (
  <svg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg' style={style} className={style.className}>
    <g clipPath='url(#clip0_471_3370)'>
      <path d='M5 16H27' stroke='black' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
      <path d='M5 8H27' stroke='black' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
      <path d='M5 24H27' stroke='black' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
    </g>
    <defs>
      <clipPath id='clip0_471_3370'>
        <rect width='32' height='32' fill='white' />
      </clipPath>
    </defs>
  </svg>
);
