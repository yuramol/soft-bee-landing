import Link from 'next/link';
import Image from 'next/image';
import { ROUTES } from '@/constants/routes';
import type { InsightArticle } from '../data';
import { Typography } from '@/components/ui/typography';
import insightsContent from '../content.json';

export function InsightCard({ article }: { article: InsightArticle }) {
  return (
    <Link href={`${ROUTES.INSIGHTS}/${article.slug}`} className='group flex flex-col rounded-3xl bg-white p-4 xl:p-6 2xl:p-8'>
      <div className='relative mb-6 aspect-400/235 w-full overflow-hidden rounded-2xl bg-gray-100 xl:h-87.75'>
        <Image
          src={article.image}
          alt={article.title}
          fill
          className='object-cover transition-transform duration-300 group-hover:scale-105'
        />
      </div>

      <div className='mb-6 flex items-center justify-between'>
        <div className='bg-foreground-secondary/4 rounded-sm px-4 py-1.5'>
          <Typography variant='body3' className='font-medium'>
            {article.category}
          </Typography>
        </div>
        <Typography variant='body3' className='text-foreground/50 font-medium'>
          {article.readTime}
        </Typography>
      </div>

      <Typography variant='h4' className='mb-4.25 text-[24px] font-medium'>
        {article.title}
      </Typography>

      <Typography variant='body3' className='text-foreground-secondary mb-6 line-clamp-2'>
        {article.description}
      </Typography>

      <div className='mt-auto'>
        <Typography variant='body3' className='text-accent-dark font-medium transition-colors group-hover:opacity-80'>
          {insightsContent.card.readArticle}
        </Typography>
      </div>
    </Link>
  );
}
