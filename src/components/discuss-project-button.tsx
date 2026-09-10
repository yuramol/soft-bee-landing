'use client';

import nextDynamic from 'next/dynamic';
import { useState } from 'react';

import { Button, ButtonProps } from '@/components/ui/button';

const DiscussProjectDialog = nextDynamic(
  () => import('@/components/discuss-project-dialog').then((module) => module.DiscussProjectDialog),
  { ssr: false }
);

export interface DiscussProjectButtonProps extends ButtonProps {
  text: string;
}

export function DiscussProjectButton({ text, ...buttonProps }: DiscussProjectButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDialogLoaded, setIsDialogLoaded] = useState(false);

  function handleClick() {
    setIsDialogLoaded(true);
    setIsOpen(true);
  }

  return (
    <>
      <Button type='button' {...buttonProps} onClick={handleClick}>
        {text}
      </Button>
      {isDialogLoaded ? <DiscussProjectDialog open={isOpen} onOpenChange={setIsOpen} /> : null}
    </>
  );
}
