'use client';

import { useState, useSyncExternalStore } from 'react';
import { Typography } from '@/components/ui/typography';
import { Icon } from '@/components/ui/icon';
import Link from 'next/link';
import content from '../content.json';

export const ArticleSocialShare = () => {
  const [isCopied, setIsCopied] = useState(false);

  const currentUrl = useSyncExternalStore(
    () => () => {},
    () => window.location.href,
    () => ''
  );

  const handleCopyLink = () => {
    void navigator.clipboard.writeText(currentUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const encodedUrl = encodeURIComponent(currentUrl);

  return (
    <div className='flex w-fit flex-col gap-8 rounded-3xl bg-white px-4 pt-8 pb-4 md:p-8 lg:mt-10'>
      <Typography variant='body1' className='font-medium'>
        {content.socialShare.title}
      </Typography>

      <div className='flex flex-wrap items-center gap-5 md:gap-2.5'>
        <ShareButton href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}>
          <Icon icon='LogoLinkedin' className='h-5.5 w-5.5' />
        </ShareButton>

        <button
          onClick={() => {
            handleCopyLink();
            window.open('https://www.instagram.com', '_blank', 'noopener,noreferrer');
          }}
          className='flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-[#F4F4F4] transition-colors hover:bg-[#EAEAEA]'
          aria-label={content.socialShare.instagramAriaLabel}
        >
          <Icon icon='LogoInstagram' className='h-5.5 w-5.5' />
        </button>

        <ShareButton href={`https://www.threads.net/intent/post?text=${encodedUrl}`}>
          <Icon icon='LogoThreads' className='h-5.5 w-5.5' />
        </ShareButton>
        <ShareButton href={`https://twitter.com/intent/tweet?url=${encodedUrl}`}>
          <Icon icon='LogoX' className='h-5.5 w-5.5' />
        </ShareButton>
        <button
          onClick={handleCopyLink}
          className='flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-[#F4F4F4] transition-colors hover:bg-[#EAEAEA]'
          aria-label={content.socialShare.copyLinkAriaLabel}
        >
          <Icon icon={isCopied ? 'Check' : 'Copy'} className='text-brand-black h-5 w-5' />
        </button>
      </div>
    </div>
  );
};

const ShareButton = ({ children, href }: { children: React.ReactNode; href: string }) => (
  <Link
    href={href}
    target='_blank'
    rel='noopener noreferrer'
    className='flex h-12 w-12 items-center justify-center rounded-full bg-[#F4F4F4] transition-colors hover:bg-[#EAEAEA]'
  >
    {children}
  </Link>
);
