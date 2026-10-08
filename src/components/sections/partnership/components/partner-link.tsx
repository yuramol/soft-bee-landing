'use client';

import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';

export default function PartnerLink({
  children,
  className,
  onNavigate
}: {
  children: ReactNode;
  className?: string;
  onNavigate?: () => void;
}) {
  return (
    <Button
      variant='primary'
      className={className}
      rightIcon={<Icon icon='ArrowRight' />}
      onClick={(event) => {
        onNavigate?.();
        const target = document.getElementById('partnership-form');
        if (!target) return;
        event.preventDefault();
        window.history.replaceState(null, '', '#partnership-form');
        const focusTarget = document.getElementById('partner-name') ?? target.querySelector<HTMLElement>('[tabindex="-1"]');
        focusTarget?.focus({ preventScroll: true });
        target.scrollIntoView({
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
          block: 'start'
        });
      }}
    >
      {children}
    </Button>
  );
}
