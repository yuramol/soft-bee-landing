import { IconCommonProps } from '@/components/ui/icon';

export const Globe = (style: IconCommonProps) => (
  <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' style={style} className={style.className}>
    <circle cx='12' cy='12' r='10' stroke={style.color ?? '#1B1C23'} strokeWidth='1.5' />
    <path
      d='M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z'
      stroke={style.color ?? '#1B1C23'}
      strokeWidth='1.5'
    />
    <path d='M2 12h20' stroke={style.color ?? '#1B1C23'} strokeWidth='1.5' />
  </svg>
);
