import { IconCommonProps } from '@/components/ui/icon';

export function ButtonHover({ className, style, width = '100%', height = '100%', ...props }: IconCommonProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox='0 0 171 60'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      preserveAspectRatio='xMidYMid slice'
      style={style}
      className={className}
      aria-hidden
      {...props}
    >
      <g filter='url(#button-hover-filter0)'>
        <path
          d='M119.693 -35.9456C158.496 -25.696 214.574 8.37525 209.998 25.6987C205.422 43.0222 138.062 28.728 99.2588 18.4784C60.4559 8.22884 32.7095 -14.1235 37.2854 -31.447C41.8613 -48.7704 80.89 -46.1951 119.693 -35.9456Z'
          fill='#00A2BB'
        />
      </g>
      <g filter='url(#button-hover-filter1)'>
        <path
          d='M126.248 24.8962C131.989 3.16528 155.307 -29.8616 201.815 -17.5765C248.324 -5.29145 300.412 47.6534 294.672 69.3843C288.932 91.1152 250.25 84.8608 203.741 72.5758C157.233 60.2907 120.508 46.6271 126.248 24.8962Z'
          fill='#C3FF00'
        />
      </g>
      <defs>
        <filter
          id='button-hover-filter0'
          x='-26.0825'
          y='-106.924'
          width='299.22'
          height='203.605'
          filterUnits='userSpaceOnUse'
          colorInterpolationFilters='sRGB'
        >
          <feFlood floodOpacity='0' result='BackgroundImageFix' />
          <feBlend mode='normal' in='SourceGraphic' in2='BackgroundImageFix' result='shape' />
          <feGaussianBlur stdDeviation='31.4378' result='effect1_foregroundBlur' />
        </filter>
        <filter
          id='button-hover-filter1'
          x='32.1304'
          y='-113.763'
          width='356.501'
          height='291.051'
          filterUnits='userSpaceOnUse'
          colorInterpolationFilters='sRGB'
        >
          <feFlood floodOpacity='0' result='BackgroundImageFix' />
          <feBlend mode='normal' in='SourceGraphic' in2='BackgroundImageFix' result='shape' />
          <feGaussianBlur stdDeviation='46.7629' result='effect1_foregroundBlur' />
        </filter>
      </defs>
    </svg>
  );
}
