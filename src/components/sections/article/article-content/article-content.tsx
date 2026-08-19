'use client';

import { ComponentContainer } from '@/components/layout';
import { ArticleSidebar } from './components/article-sidebar';
import { ArticleSocialShare } from './components/article-social-share';
import { ArticleBlockContent } from '@/components/sections/insights/insights-list/data';
import { ArticleBlocks } from './components/article-blocks';

interface ArticleContentProps {
  content: ArticleBlockContent[];
}

export const ArticleContent = ({ content }: ArticleContentProps) => {
  const headings = content.filter((block) => block.heading).map((block) => ({ id: block.id, title: block.shortHeading || block.heading! }));

  return (
    <section className='relative w-full px-4 pt-10 pb-20 md:px-10.5 lg:pt-30 lg:pb-40'>
      <ComponentContainer>
        <div className='flex flex-col gap-16 lg:flex-row lg:justify-between lg:gap-0'>
          <div className='flex w-full shrink-0 flex-col lg:w-[25%] lg:max-w-88.5'>
            <div className='flex-1'>
              <ArticleSidebar headings={headings} />
            </div>
            <div className='hidden lg:block'>
              <ArticleSocialShare />
            </div>
          </div>
          <div className='flex w-full max-w-full flex-col lg:w-[66.5%] lg:max-w-302'>
            <ArticleBlocks content={content} />
            <div className='mt-25 lg:hidden'>
              <ArticleSocialShare />
            </div>
          </div>
        </div>
      </ComponentContainer>
    </section>
  );
};
