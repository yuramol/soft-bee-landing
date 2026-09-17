'use client';

import { Toaster as Sonner, ToasterProps } from 'sonner';

export function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      theme='light'
      className='toaster group'
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-white group-[.toaster]:text-brand-black group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-2xl',
          description: 'group-[.toast]:text-brand-black/60',
          actionButton: 'group-[.toast]:bg-brand-black group-[.toast]:text-brand-white',
          cancelButton: 'group-[.toast]:bg-mist-gray group-[.toast]:text-brand-black'
        }
      }}
      {...props}
    />
  );
}
