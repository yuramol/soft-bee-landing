'use client';

import Link from 'next/link';
import { useSyncExternalStore } from 'react';
import { Cookie } from 'lucide-react';

import { ComponentContainer } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { getStoredConsent, subscribeToConsent, updateGtagConsent } from '@/lib/analytics';
import { cn } from '@/lib/utils';
import content from './content.json';

export function CookieConsentBanner() {
  const consent = useSyncExternalStore(subscribeToConsent, getStoredConsent, () => 'server');

  function handleAccept() {
    updateGtagConsent('granted');
  }

  function handleDecline() {
    updateGtagConsent('denied');
  }

  if (consent !== null) {
    return null;
  }

  return (
    <aside
      aria-label={content.ariaLabel}
      className={cn(
        'fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#1b1c23]/95 py-4 text-white shadow-2xl backdrop-blur-md md:py-5',
        'animate-in fade-in slide-in-from-bottom-4 duration-300'
      )}
    >
      <ComponentContainer className='flex flex-col gap-4 px-4 sm:flex-row sm:items-center sm:justify-between md:px-8 lg:px-12'>
        <div className='flex max-w-4xl items-center gap-3.5'>
          <div className='text-primary flex size-10 shrink-0 items-center justify-center rounded-full bg-white/10'>
            <Cookie className='size-5' />
          </div>
          <div className='space-y-0.5'>
            <div className='text-14 font-semibold text-white'>{content.title}</div>
            <p className='text-13 leading-relaxed text-[#dad7d7]'>
              {content.description}{' '}
              <Link href={ROUTES.PRIVACY_POLICY} className='text-primary underline underline-offset-2 hover:opacity-80'>
                {content.privacyPolicyLinkText}
              </Link>
              .
            </p>
          </div>
        </div>

        <div className='flex shrink-0 items-center gap-3'>
          <Button type='button' variant='white' size='default' className='text-14 h-11 px-6 font-medium' onClick={handleAccept}>
            {content.acceptButton}
          </Button>
          <Button
            type='button'
            variant='default'
            size='default'
            className='text-14 h-11 border border-white/20 bg-white/5 px-6 font-medium text-white hover:bg-white/15'
            onClick={handleDecline}
          >
            {content.declineButton}
          </Button>
        </div>
      </ComponentContainer>
    </aside>
  );
}
