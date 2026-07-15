import { IconCommonProps } from '@/components/ui/icon';

export const MagnifyingGlass = (style: IconCommonProps) => (
  <svg width='22' height='22' viewBox='0 0 22 22' fill='none' xmlns='http://www.w3.org/2000/svg' style={style} className={style.className}>
    <g clipPath='url(#clip0_702_1973)'>
      <path
        d='M14.4865 14.4865L19.25 19.25M16.5 9.625C16.5 13.422 13.422 16.5 9.625 16.5C5.82804 16.5 2.75 13.422 2.75 9.625C2.75 5.82804 5.82804 2.75 9.625 2.75C13.422 2.75 16.5 5.82804 16.5 9.625Z'
        stroke={style.color ?? '#1B1C23'}
        strokeOpacity='0.5'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </g>
    <defs>
      <clipPath id='clip0_702_1973'>
        <rect width='22' height='22' fill='white' />
      </clipPath>
    </defs>
  </svg>
);
