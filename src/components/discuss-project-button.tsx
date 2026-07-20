'use client';

import { Button, ButtonProps } from '@/components/ui/button';
import { DiscussProjectDialog } from '@/components/discuss-project-dialog';

export interface DiscussProjectButtonProps extends ButtonProps {
  text: string;
}

export function DiscussProjectButton({ text, ...buttonProps }: DiscussProjectButtonProps) {
  return <DiscussProjectDialog triggerButton={<Button {...buttonProps}>{text}</Button>} />;
}
