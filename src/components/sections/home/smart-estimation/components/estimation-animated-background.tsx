import { cn } from '@/lib/utils';

interface AnimatedBackgroundProps {
  className?: string;
}

export const EstimationAnimatedBackground = ({ className }: AnimatedBackgroundProps) => {
  return (
    <div
      className={cn(
        'pointer-events-none absolute -bottom-75 -left-1.25 z-1 w-[calc(100%+10px)] md:-bottom-125 md:-left-2.5 md:w-[calc(100%+20px)]',
        className
      )}
      style={{
        maskImage: 'linear-gradient(to top, transparent 0%, black 20%, black 80%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 20%, black 80%, transparent 100%)'
      }}
    >
      <div className='absolute inset-0 overflow-hidden'>
        {/* NEW ELEMENTS for upward dissipating blur */}
        <div className='absolute bottom-10 left-[0%] h-50 w-full rounded-[100%] bg-[#C3FF00] opacity-30 blur-[100px] filter md:bottom-20 md:h-75 md:blur-[150px]' />
        <div className='absolute bottom-20 left-[20%] h-50 w-[60%] rounded-[100%] bg-[#EEFCC2] opacity-40 blur-[80px] filter md:bottom-37.5 md:h-62.5 md:blur-[120px]' />

        <div className='absolute inset-0 mb-62.5'>
          {/* STATIC BASE (Prevents white gaps during animation) */}
          <div className='absolute -bottom-12.5 left-[15%] h-75 w-100 rounded-[100%] bg-[#C3FF00] opacity-40 blur-[80px] filter md:bottom-[5%] md:h-150 md:w-175 md:opacity-40 md:blur-[120px]' />
          <div className='absolute right-[-10%] -bottom-12.5 h-75 w-100 rounded-[100%] bg-[#C3FF00] opacity-40 blur-[80px] filter md:-bottom-37.5 md:h-150 md:w-175 md:opacity-40 md:blur-[120px]' />
          <div className='absolute bottom-2.5 left-[calc(50%-150px)] h-75 w-100 rounded-[100%] bg-[#C3FF00] opacity-40 blur-[80px] filter md:bottom-[25%] md:left-[calc(50%-400px)] md:h-150 md:w-200 md:opacity-40 md:blur-[120px]' />

          {/* Main Electric Green - Top Left (forms the left arm of the V) */}
          <div className='absolute -bottom-12.5 left-[-10%] h-75 w-100 md:-bottom-37.5 md:h-150 md:w-175'>
            <div
              className='animate-blob h-full w-full rounded-[100%] bg-[#C3FF00] opacity-30 blur-[80px] filter md:opacity-30 md:blur-[120px]'
              style={{ animationDuration: '20s' }}
            />
          </div>

          {/* Main Electric Green - Top Right (forms the right arm of the V) */}
          <div className='absolute right-[-10%] -bottom-12.5 h-75 w-100 md:-bottom-37.5 md:h-150 md:w-175'>
            <div
              className='animate-blob h-full w-full rounded-[100%] bg-[#C3FF00] opacity-30 blur-[80px] filter md:opacity-30 md:blur-[120px]'
              style={{ animationDelay: '5s', animationDuration: '22s' }}
            />
          </div>

          {/* Main Electric Green - Center Bottom (forms the tip of the V reaching the button) */}
          <div className='absolute bottom-2.5 left-[calc(50%-150px)] h-75 w-100 md:bottom-37.5 md:left-[calc(50%-400px)] md:h-150 md:w-200'>
            <div
              className='animate-blob h-full w-full rounded-[100%] bg-[#C3FF00] opacity-30 blur-[80px] filter md:opacity-30 md:blur-[120px]'
              style={{ animationDelay: '2s', animationDuration: '18s' }}
            />
          </div>

          {/* Moving Yellow - Floats inside the V */}
          <div className='absolute bottom-0 left-[10%] h-62.5 w-[80%] md:bottom-12.5 md:left-[20%] md:h-125 md:w-[50%]'>
            <div
              className='animate-blob h-full w-full rounded-[100%] bg-[#EEFCC2] opacity-70 blur-[80px] filter md:opacity-70 md:blur-[100px]'
              style={{ animationDelay: '4s', animationDuration: '16s' }}
            />
          </div>

          {/* Deep Teal Gradient - Right side inside the V */}
          <div className='absolute right-[5%] bottom-5 h-50 w-50 md:right-[17%] md:bottom-25 md:h-100 md:w-100'>
            <div
              className='animate-blob h-full w-full rounded-[100%] blur-[60px] filter md:blur-[80px]'
              style={{
                background: 'linear-gradient(0deg, rgba(0, 117, 134, 0) 0%, #007586 100%)',
                opacity: 0.5,
                animationDelay: '6s',
                animationDuration: '16s'
              }}
            />
          </div>
          {/* Deep Teal Gradient - Left side inside the V */}
          <div className='absolute bottom-5 left-[5%] h-50 w-50 md:bottom-[-2%] md:left-[17%] md:h-100 md:w-100'>
            <div
              className='animate-blob h-full w-full rounded-[100%] blur-[60px] filter md:blur-[80px]'
              style={{
                background: 'linear-gradient(0deg, rgba(0, 117, 134, 0) 0%, #007586 100%)',
                opacity: 0.5,
                animationDelay: '8s',
                animationDuration: '20s'
              }}
            />
          </div>

          {/* Ocean Cyan 1 - Very small, Top Left */}
          <div className='absolute bottom-12.5 left-[10%] h-15 w-15 md:bottom-25 md:left-[20%] md:h-25 md:w-25'>
            <div
              className='animate-blob h-full w-full rounded-[100%] bg-[#00A2BB] opacity-30 blur-2xl filter md:opacity-30 md:blur-2xl'
              style={{ animationDelay: '1s', animationDuration: '12s' }}
            />
          </div>

          {/* Ocean Cyan 2 - Very small, Center */}
          <div className='absolute bottom-25 left-[calc(50%-30px)] h-20 w-20 md:bottom-50 md:left-[calc(50%-50px)] md:h-30 md:w-30'>
            <div
              className='animate-blob h-full w-full rounded-[100%] bg-[#00A2BB] opacity-30 blur-2xl filter md:opacity-30 md:blur-[50px]'
              style={{ animationDelay: '4s', animationDuration: '15s' }}
            />
          </div>

          {/* Ocean Cyan 3 - Very small, Right */}
          <div className='absolute right-[10%] bottom-20 h-15 w-15 md:right-[25%] md:bottom-37.5 md:h-25 md:w-25'>
            <div
              className='animate-blob h-full w-full rounded-[100%] bg-[#00A2BB] opacity-30 blur-2xl filter md:opacity-30 md:blur-2xl'
              style={{ animationDelay: '7s', animationDuration: '10s' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
