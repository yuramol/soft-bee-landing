import { IconCommonProps } from '@/components/ui/icon';

export const Layout = (style: IconCommonProps) => (
  <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' style={style} className={style.className}>
    <rect x='3' y='3' width='18' height='18' rx='2' ry='2' stroke={style.color ?? '#1B1C23'} strokeWidth='1.5' />
    <path d='M3 9h18M9 21V9' stroke={style.color ?? '#1B1C23'} strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
  </svg>
);
