import { cn } from '@/lib/utils';

interface TeamAnimatedBackgroundProps {
  className?: string;
}

export const TeamAnimatedBackground = ({ className }: TeamAnimatedBackgroundProps) => {
  return (
    <div
      className={cn('pointer-events-none absolute inset-x-0 z-0 w-full', className)}
      style={{
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)'
      }}
    >
      <div className='absolute inset-0 overflow-hidden'>
        {/* NEW ELEMENTS for upward dissipating blur */}
        <div className='absolute top-[5%] left-[0%] h-[30%] w-full rounded-[100%] bg-[#C3FF00] opacity-30 blur-[100px] filter md:top-[65%] md:h-100 md:blur-[150px]' />
        <div className='absolute top-[15%] left-[10%] h-[30%] w-[80%] rounded-[100%] bg-[#EEFCC2] opacity-40 blur-[80px] filter md:top-[40%] md:h-100 md:blur-[120px]' />

        <div className='absolute inset-0 mt-[10%]'>
          {/* STATIC BASE (Prevents white gaps during animation) */}
          <div className='absolute top-[25%] left-[-10%] h-[30%] w-full rounded-[100%] bg-[#C3FF00] opacity-40 blur-[80px] filter md:top-[35%] md:h-200 md:w-200 md:blur-[120px]' />
          <div className='absolute top-[45%] right-[-10%] h-[30%] w-full rounded-[100%] bg-[#C3FF00] opacity-40 blur-[80px] filter md:top-[-17%] md:h-200 md:w-200 md:blur-[120px]' />
          <div className='absolute top-[65%] right-[20%] h-[30%] w-[80%] rounded-[100%] bg-[#C3FF00] opacity-40 blur-[80px] filter md:top-[45%] md:h-200 md:w-200 md:blur-[120px]' />

          <div className='absolute top-[85%] left-[0%] h-[30%] w-full rounded-[100%] bg-[#C3FF00] opacity-40 blur-[80px] filter md:top-[20%] md:left-[calc(50%-400px)] md:h-200 md:w-300 md:blur-[120px]' />

          {/* Main Electric Green - Top Left */}
          <div className='absolute top-[10%] left-[10%] h-150 w-150 md:top-[55%] md:h-200 md:w-200'>
            <div
              className='animate-blob h-full w-full rounded-[100%] bg-[#C3FF00] opacity-30 blur-[80px] filter md:blur-[120px]'
              style={{ animationDuration: '20s' }}
            />
          </div>

          {/* Main Electric Green - Top Right */}
          <div className='absolute top-[30%] right-[-10%] h-150 w-150 md:-top-37.5 md:h-200 md:w-200'>
            <div
              className='animate-blob h-full w-full rounded-[100%] bg-[#C3FF00] opacity-30 blur-[80px] filter md:blur-[120px]'
              style={{ animationDelay: '5s', animationDuration: '22s' }}
            />
          </div>
          <div className='absolute top-[50%] right-[10%] h-150 w-150 md:top-[60%] md:h-200 md:w-200'>
            <div
              className='animate-blob h-full w-full rounded-[100%] bg-[#C3FF00] opacity-10 blur-[80px] filter md:blur-[120px]'
              style={{ animationDelay: '5s', animationDuration: '22s' }}
            />
          </div>

          {/* Main Electric Green - Center Bottom */}
          <div className='absolute top-[70%] left-[calc(50%-150px)] h-150 w-150 md:top-[40%] md:left-[calc(50%-300px)] md:h-200 md:w-200'>
            <div
              className='animate-blob h-full w-full rounded-[100%] bg-[#C3FF00] opacity-30 blur-[80px] filter md:blur-[120px]'
              style={{ animationDelay: '2s', animationDuration: '18s' }}
            />
          </div>

          {/* Moving Yellow (Lime Glow) - Floats inside */}
          <div className='absolute top-[40%] left-[10%] h-[40%] w-[80%] md:top-[10%] md:left-[20%] md:h-[120%] md:w-[50%]'>
            <div
              className='animate-blob h-full w-full rounded-[100%] bg-[#EEFCC2] opacity-10 blur-[80px] filter md:blur-[100px]'
              style={{ animationDelay: '4s', animationDuration: '16s' }}
            />
          </div>

          {/* Deep Teal Gradient - Right side */}
          <div className='absolute top-[35%] right-[5%] h-100 w-100 md:top-[48%] md:right-[37%] md:h-100 md:w-100'>
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

          {/* Deep Teal Gradient - Left side */}
          <div className='absolute top-[80%] left-[5%] h-100 w-100 md:top-[50%] md:left-[5%] md:h-100 md:w-100'>
            <div
              className='animate-blob h-full w-full rounded-[100%] blur-[60px] filter md:blur-[80px]'
              style={{
                background: 'linear-gradient(0deg, rgba(0, 117, 134, 0) 0%, #007586 100%)',
                opacity: 0.5,
                animationDelay: '3s',
                animationDuration: '20s'
              }}
            />
          </div>

          {/* Ocean Cyan (Digital Cyan) 1 - Top Left */}
          <div className='absolute top-[25%] left-[15%] h-50 w-50 md:top-[35%] md:left-[25%] md:h-30 md:w-30'>
            <div
              className='animate-blob h-full w-full rounded-[100%] bg-[#00A2BB] opacity-30 blur-2xl filter md:blur-[50px]'
              style={{ animationDelay: '1s', animationDuration: '12s' }}
            />
          </div>

          {/* Ocean Cyan (Digital Cyan) 2 - Right */}
          <div className='absolute top-[75%] right-[15%] h-50 w-50 md:top-[45%] md:right-[20%] md:h-30 md:w-30'>
            <div
              className='animate-blob h-full w-full rounded-[100%] bg-[#00A2BB] opacity-30 blur-2xl filter md:blur-[50px]'
              style={{ animationDelay: '7s', animationDuration: '10s' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
