import { cn } from '@/lib/utils';
import { Typography } from '@/components/ui/typography';

export interface AboutUsCardProps {
  id: string;
  title: string;
  description: string;
  activeBg: string;
  activeText: string;
  isActive: boolean;
  onClick: () => void;
}

export const AboutUsCard = ({ id, title, description, activeBg, activeText, isActive, onClick }: AboutUsCardProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative cursor-pointer overflow-hidden transition-all duration-500 ease-in-out',
        'flex flex-col justify-between px-4 pt-4 pb-5 lg:px-8 lg:pt-8 lg:pb-16',
        'rounded-lg',
        isActive
          ? `lg:min-h-147.5 lg:min-w-0 lg:flex-[0_1_903px] ${activeBg}`
          : 'bg-accent-foreground hover:bg-accent-foreground/80 lg:min-w-0 lg:flex-[0_1_294px]'
      )}
    >
      <div className={cn('flex flex-col transition-all duration-500 lg:min-w-0', isActive ? 'mb-8' : 'mb-0')}>
        <span
          className={cn(
            'mb-2 text-[24px] font-semibold transition-all duration-500 lg:mb-4 lg:truncate',
            isActive ? `lg:text-[48px] ${activeText}` : 'text-foreground-secondary lg:text-[32px]'
          )}
        >
          {id}
        </span>
        <span
          className={cn(
            'text-[24px] font-semibold transition-all duration-500 lg:truncate',
            isActive ? `mb-8 lg:text-[48px] ${activeText}` : 'text-foreground-secondary mb-0 lg:text-[32px]'
          )}
        >
          {title}
        </span>

        <div className={cn('overflow-hidden transition-all duration-500', isActive ? 'max-h-125 opacity-100' : 'max-h-0 opacity-0')}>
          <Typography
            variant='h5'
            className={cn(
              'max-w-179.75 transition-colors duration-500 lg:w-(--about-card-text-width)',
              isActive ? activeText : 'text-foreground-secondary'
            )}
          >
            {description}
          </Typography>
        </div>
      </div>

      {isActive && <div className={cn('h-px w-[34.5px] shrink-0', id === '01' ? 'bg-foreground-secondary' : 'bg-muted')} />}
    </div>
  );
};
