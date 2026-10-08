import { IconCommonProps } from '@/components/ui/icon';

export const LogoNextJs = (style: IconCommonProps) => (
  <svg width='128' height='128' viewBox='0 0 128 128' style={style} className={style.className} xmlns='http://www.w3.org/2000/svg'>
    <mask id='next-n-mask'>
      <rect width='128' height='128' fill='white' />
      <path fill='black' d='M106.317 112.014 49.167 38.4H38.4v51.179h8.614v-40.24l52.54 67.884a64.216 64.216 0 0 0 6.763-5.209z' />
      <path fill='black' d='M81.778 38.4h8.533v51.2h-8.533z' />
    </mask>
    <circle cx='64' cy='64' r='64' fill='currentColor' mask='url(#next-n-mask)' />
  </svg>
);
