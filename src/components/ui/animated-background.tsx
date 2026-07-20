import { cn } from '@/lib/utils';

interface AnimatedBackgroundProps {
  className?: string;
}

export const AnimatedBackground = ({ className }: AnimatedBackgroundProps) => {
  return (
    <div
      className={cn('pointer-events-none absolute inset-x-0 z-0 w-full', className)}
      style={{
        maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)'
      }}
    >
      <div className='absolute inset-0 overflow-hidden'>
        {/* STATIC BASE (Prevents white gaps during animation) */}
        <div className='absolute -top-12.5 left-[-10%] h-75 w-100 rounded-[100%] bg-[#C3FF00] opacity-40 blur-[80px] filter md:-top-37.5 md:h-150 md:w-175 md:opacity-40 md:blur-[120px]'></div>
        <div className='absolute -top-12.5 right-[-10%] h-75 w-100 rounded-[100%] bg-[#C3FF00] opacity-40 blur-[80px] filter md:-top-37.5 md:h-150 md:w-175 md:opacity-40 md:blur-[120px]'></div>
        <div className='absolute top-2.5 left-[calc(50%-150px)] h-75 w-100 rounded-[100%] bg-[#C3FF00] opacity-40 blur-[80px] filter md:top-37.5 md:left-[calc(50%-400px)] md:h-150 md:w-200 md:opacity-40 md:blur-[120px]'></div>

        {/* Main Electric Green - Top Left (forms the left arm of the V) */}
        <div className='absolute -top-12.5 left-[-10%] h-75 w-100 md:-top-37.5 md:h-150 md:w-175'>
          <div
            className='animate-blob h-full w-full rounded-[100%] bg-[#C3FF00] opacity-30 blur-[80px] filter md:opacity-30 md:blur-[120px]'
            style={{ animationDuration: '20s' }}
          ></div>
        </div>

        {/* Main Electric Green - Top Right (forms the right arm of the V) */}
        <div className='absolute -top-12.5 right-[-10%] h-75 w-100 md:-top-37.5 md:h-150 md:w-175'>
          <div
            className='animate-blob h-full w-full rounded-[100%] bg-[#C3FF00] opacity-30 blur-[80px] filter md:opacity-30 md:blur-[120px]'
            style={{ animationDelay: '5s', animationDuration: '22s' }}
          ></div>
        </div>

        {/* Main Electric Green - Center Bottom (forms the tip of the V reaching the button) */}
        <div className='absolute top-2.5 left-[calc(50%-150px)] h-75 w-100 md:top-37.5 md:left-[calc(50%-400px)] md:h-150 md:w-200'>
          <div
            className='animate-blob h-full w-full rounded-[100%] bg-[#C3FF00] opacity-30 blur-[80px] filter md:opacity-30 md:blur-[120px]'
            style={{ animationDelay: '2s', animationDuration: '18s' }}
          ></div>
        </div>

        {/* Moving Yellow - Floats inside the V */}
        <div className='absolute top-0 left-[10%] h-62.5 w-[80%] md:top-12.5 md:left-[20%] md:h-125 md:w-[50%]'>
          <div
            className='animate-blob h-full w-full rounded-[100%] bg-[#EEFCC2] opacity-70 blur-[80px] filter md:opacity-70 md:blur-[100px]'
            style={{ animationDelay: '4s', animationDuration: '16s' }}
          ></div>
        </div>

        {/* Deep Teal Gradient - Right side inside the V */}
        <div className='absolute top-5 right-[5%] h-50 w-50 md:top-25 md:right-[10%] md:h-100 md:w-100'>
          <div
            className='animate-blob h-full w-full rounded-[100%] blur-[60px] filter md:blur-[80px]'
            style={{
              background: 'linear-gradient(0deg, rgba(0, 117, 134, 0) 0%, #007586 100%)',
              opacity: 0.5,
              animationDelay: '6s',
              animationDuration: '16s'
            }}
          ></div>
        </div>

        {/* Ocean Cyan 1 - Very small, Top Left */}
        <div className='absolute top-12.5 left-[10%] h-15 w-15 md:top-25 md:left-[20%] md:h-25 md:w-25'>
          <div
            className='animate-blob h-full w-full rounded-[100%] bg-[#00A2BB] opacity-30 blur-2xl filter md:opacity-30 md:blur-2xl'
            style={{ animationDelay: '1s', animationDuration: '12s' }}
          ></div>
        </div>

        {/* Ocean Cyan 2 - Very small, Center */}
        <div className='absolute top-25 left-[calc(50%-30px)] h-20 w-20 md:top-50 md:left-[calc(50%-50px)] md:h-30 md:w-30'>
          <div
            className='animate-blob h-full w-full rounded-[100%] bg-[#00A2BB] opacity-30 blur-2xl filter md:opacity-30 md:blur-[50px]'
            style={{ animationDelay: '4s', animationDuration: '15s' }}
          ></div>
        </div>

        {/* Ocean Cyan 3 - Very small, Right */}
        <div className='absolute top-20 right-[10%] h-15 w-15 md:top-37.5 md:right-[25%] md:h-25 md:w-25'>
          <div
            className='animate-blob h-full w-full rounded-[100%] bg-[#00A2BB] opacity-30 blur-2xl filter md:opacity-30 md:blur-2xl'
            style={{ animationDelay: '7s', animationDuration: '10s' }}
          ></div>
        </div>
      </div>
    </div>
  );
};
