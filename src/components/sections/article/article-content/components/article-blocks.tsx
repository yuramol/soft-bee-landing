import { ArticleBlockContent } from '@/components/sections/insights/insights-list/data';
import { Typography } from '@/components/ui/typography';
import Image from 'next/image';
import contentData from '../content.json';

interface ArticleBlocksProps {
  content: ArticleBlockContent[];
}

export const ArticleBlocks = ({ content }: ArticleBlocksProps) => {
  return (
    <div className='flex flex-col gap-14 md:gap-20 lg:gap-32'>
      {content.map((block) => (
        <div key={block.id} id={block.id} className='scroll-mt-32'>
          {block.type === 'text' && <BlockText block={block} />}
          {block.type === 'quote' && <BlockQuote block={block} />}
          {block.type === 'image' && <BlockImage block={block} />}
          {block.type === 'conclusion' && <BlockConclusion block={block} />}
          {block.type === 'list' && <BlockList block={block} />}
        </div>
      ))}
    </div>
  );
};

const BlockText = ({ block }: { block: ArticleBlockContent }) => (
  <div className='flex flex-col gap-6 md:gap-8'>
    {block.heading && (
      <Typography variant='h4' className='text-foreground text-24 md:text-28 font-semibold'>
        {block.heading}
      </Typography>
    )}
    {block.text && (
      <div className='flex flex-col gap-3'>
        {block.text
          .split('\n\n')
          .filter((t) => t.trim() !== '')
          .map((paragraph, index) => (
            <Typography key={index} variant='body2' className='text-foreground/50 text-20 md:text-24 font-normal whitespace-pre-line'>
              {paragraph}
            </Typography>
          ))}
      </div>
    )}
  </div>
);

const BlockConclusion = ({ block }: { block: ArticleBlockContent }) => (
  <div className='flex flex-col gap-6 pt-4 md:gap-8'>
    {block.heading && (
      <Typography variant='h4' className='text-foreground text-24 md:text-28 font-semibold'>
        {block.heading}
      </Typography>
    )}
    {block.text && (
      <div className='flex flex-col gap-3'>
        {block.text
          .split('\n\n')
          .filter((t) => t.trim() !== '')
          .map((paragraph, index) => (
            <Typography key={index} variant='body2' className='text-foreground/50 text-20 md:text-24 font-normal whitespace-pre-line'>
              {paragraph}
            </Typography>
          ))}
      </div>
    )}
  </div>
);

const BlockQuote = ({ block }: { block: ArticleBlockContent }) => (
  <div className='flex flex-col gap-8 rounded-3xl bg-white p-4 lg:p-8'>
    <div className='flex items-start gap-2'>
      <Typography variant='body1' tag='span' className='text-accent shrink-0'>
        &quot;
      </Typography>
      <Typography variant='body1' className='text-brand-black leading-relaxed'>
        {block.text}
      </Typography>
    </div>
    {block.authorName && (
      <Typography variant='body2' className='text-brand-black text-right'>
        {block.authorName}
      </Typography>
    )}
  </div>
);

const BlockImage = ({ block }: { block: ArticleBlockContent }) => (
  <div className='flex flex-col gap-3'>
    {block.image && (
      <Image
        src={block.image}
        alt={block.caption || contentData.blocks.imageAltFallback}
        width={1208}
        height={656}
        className='aspect-360/253 w-full rounded-3xl object-cover lg:aspect-1208/656'
      />
    )}

    {block.caption && (
      <Typography variant='body3' className='text-foreground/50 text-12 md:text-18 font-normal'>
        {block.caption}
      </Typography>
    )}
  </div>
);

const BlockList = ({ block }: { block: ArticleBlockContent }) => (
  <div className='flex flex-col gap-6 md:gap-8'>
    {block.heading && (
      <Typography variant='h4' className='text-foreground text-24 md:text-28 font-semibold'>
        {block.heading}
      </Typography>
    )}
    {block.description && (
      <Typography variant='body2' className='text-foreground/50 text-20 md:text-24 font-normal'>
        {block.description}
      </Typography>
    )}
    {block.items && block.items.length > 0 && (
      <ul className='marker:text-electric-green flex list-disc flex-col gap-4 pl-4'>
        {block.items.map((item, idx) => (
          <li key={idx}>
            <Typography variant='body2' className='text-foreground/50 text-20 md:text-24 font-normal'>
              {item}
            </Typography>
          </li>
        ))}
      </ul>
    )}
  </div>
);
