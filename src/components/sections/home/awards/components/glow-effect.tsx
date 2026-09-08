export function GlowEffect() {
  return (
    <div className='pointer-events-none absolute inset-0 overflow-hidden' aria-hidden>
      <div className='awards-glow-item absolute -top-92 -right-94 size-275' style={{ animationDuration: '6s' }}>
        <GlowCircle />
      </div>
      <div className='absolute -bottom-240 -left-160 size-300 -translate-y-1/2'>
        <div className='awards-glow-item size-full' style={{ animationDuration: '8s', animationDelay: '-2.5s' }}>
          <GlowCircle2 />
        </div>
      </div>
      <div
        className='awards-glow-item absolute -right-10 -bottom-48 h-auto w-400'
        style={{ animationDuration: '10s', animationDelay: '-5s' }}
      >
        <GlowFigure />
      </div>
    </div>
  );
}

function GlowCircle() {
  return (
    <svg className='size-full' viewBox='0 0 1768 1701' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <g filter='url(#awards-glow-circle-0)'>
        <ellipse cx='1008.66' cy='1061.27' rx='377.5' ry='223' transform='rotate(46.2092 1008.66 1061.27)' fill='#C3FF00' />
      </g>
      <g filter='url(#awards-glow-circle-1)'>
        <circle cx='704.741' cy='704.741' r='417.295' fill='#007586' />
      </g>
      <g filter='url(#awards-glow-circle-2)'>
        <circle cx='1062.95' cy='996.151' r='417.295' fill='#00A2BB' />
      </g>
      <defs>
        <filter
          id='awards-glow-circle-0'
          x='548.154'
          y='594.441'
          width='921.015'
          height='933.667'
          filterUnits='userSpaceOnUse'
          colorInterpolationFilters='sRGB'
        >
          <feFlood floodOpacity='0' result='BackgroundImageFix' />
          <feBlend mode='normal' in='SourceGraphic' in2='BackgroundImageFix' result='shape' />
          <feGaussianBlur stdDeviation='76.8046' result='effect1_foregroundBlur_2003_3110' />
        </filter>
        <filter
          id='awards-glow-circle-1'
          x='-9.15527e-05'
          y='-0.000335693'
          width='1409.48'
          height='1409.48'
          filterUnits='userSpaceOnUse'
          colorInterpolationFilters='sRGB'
        >
          <feFlood floodOpacity='0' result='BackgroundImageFix' />
          <feBlend mode='normal' in='SourceGraphic' in2='BackgroundImageFix' result='shape' />
          <feGaussianBlur stdDeviation='143.723' result='effect1_foregroundBlur_2003_3111' />
        </filter>
        <filter
          id='awards-glow-circle-2'
          x='358.207'
          y='291.41'
          width='1409.48'
          height='1409.48'
          filterUnits='userSpaceOnUse'
          colorInterpolationFilters='sRGB'
        >
          <feFlood floodOpacity='0' result='BackgroundImageFix' />
          <feBlend mode='normal' in='SourceGraphic' in2='BackgroundImageFix' result='shape' />
          <feGaussianBlur stdDeviation='143.723' result='effect1_foregroundBlur_2003_3112' />
        </filter>
      </defs>
    </svg>
  );
}

function GlowCircle2() {
  return (
    <svg className='size-full' viewBox='0 0 1921 1921' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <g filter='url(#awards-glow-circle2-0)'>
        <circle cx='1040.6' cy='872.6' r='446' fill='#C3FF00' />
      </g>
      <g filter='url(#awards-glow-circle2-1)'>
        <circle cx='960.1' cy='960.1' r='568.5' fill='#007586' />
      </g>
      <defs>
        <filter
          id='awards-glow-circle2-0'
          x='287.382'
          y='119.381'
          width='1506.44'
          height='1506.44'
          filterUnits='userSpaceOnUse'
          colorInterpolationFilters='sRGB'
        >
          <feFlood floodOpacity='0' result='BackgroundImageFix' />
          <feBlend mode='normal' in='SourceGraphic' in2='BackgroundImageFix' result='shape' />
          <feGaussianBlur stdDeviation='153.609' result='effect1_foregroundBlur_2003_3113' />
        </filter>
        <filter
          id='awards-glow-circle2-1'
          x='9.15527e-05'
          y='-0.000396729'
          width='1920.2'
          height='1920.2'
          filterUnits='userSpaceOnUse'
          colorInterpolationFilters='sRGB'
        >
          <feFlood floodOpacity='0' result='BackgroundImageFix' />
          <feBlend mode='normal' in='SourceGraphic' in2='BackgroundImageFix' result='shape' />
          <feGaussianBlur stdDeviation='195.8' result='effect1_foregroundBlur_2003_3114' />
        </filter>
      </defs>
    </svg>
  );
}

function GlowFigure() {
  return (
    <svg className='size-full' viewBox='0 0 2809 1526' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <g filter='url(#awards-glow-figure-0)'>
        <path
          d='M2416.43 669.144C2384.93 855.379 1708.56 1204.16 1220.37 1121.58C732.186 1039 361.968 821.089 393.47 634.853C424.972 448.617 703.909 283.386 1166.43 481.143C1605.41 668.834 1709.43 878.644 2416.43 669.144Z'
          fill='#00A2BB'
        />
      </g>
      <defs>
        <filter
          id='awards-glow-figure-0'
          x='-3.05176e-05'
          y='-0.000396729'
          width='2808.03'
          height='1525.62'
          filterUnits='userSpaceOnUse'
          colorInterpolationFilters='sRGB'
        >
          <feFlood floodOpacity='0' result='BackgroundImageFix' />
          <feBlend mode='normal' in='SourceGraphic' in2='BackgroundImageFix' result='shape' />
          <feGaussianBlur stdDeviation='195.8' result='effect1_foregroundBlur_370_5143' />
        </filter>
      </defs>
    </svg>
  );
}
