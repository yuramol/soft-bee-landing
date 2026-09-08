'use client';

import { Typography } from '@/components/ui/typography';
import content from '../content.json';

interface ArticleSidebarProps {
  headings: { id: string; title: string }[];
}

export const ArticleSidebar = ({ headings }: ArticleSidebarProps) => {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className='sticky top-10 flex flex-col gap-2.25 lg:gap-3.5'>
      <div className='lg:hidden'>
        <Typography variant='h3' className='text-brand-black font-semibold'>
          {content.sidebar.title}
        </Typography>
      </div>
      {headings.map((heading) => (
        <a
          key={heading.id}
          href={`#${heading.id}`}
          onClick={(e) => handleScroll(e, heading.id)}
          className='text-foreground-secondary hover:text-foreground transition-colors duration-200'
        >
          <Typography variant='body2' className='font-medium'>
            {heading.title}
          </Typography>
        </a>
      ))}
    </div>
  );
};
