import { IconCommonProps } from '@/components/ui/icon';

export const ArrowLeft = (style: IconCommonProps) => (
  <svg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg' style={style} className={style.className}>
    <path
      d='M7.9987 3.3335L3.33203 8.00016L7.9987 12.6668M3.33203 8.00016H12.6654'
      stroke={style.color ?? '#1B1C23'}
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);
