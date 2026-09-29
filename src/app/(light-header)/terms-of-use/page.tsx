import { Metadata } from 'next';
import { ComponentContainer } from '@/components/layout';
import { Typography } from '@/components/ui/typography';
import content from './content.json';

export const metadata: Metadata = {
  title: String(content.metadataTitle)
};

export default function TermsOfUsePage() {
  return (
    <main className='px-4 pt-32 md:pt-48 md:pb-0'>
      <ComponentContainer className='max-w-250'>
        <div className='flex flex-col gap-6 md:gap-8'>
          <div>
            <Typography variant='h1' className='font-bold'>
              {content.title}
            </Typography>
            <Typography variant='body2' className='text-brand-black/60 mt-4'>
              <strong>{content.lastUpdated}</strong>
            </Typography>
          </div>

          <div className='flex flex-col gap-4'>
            {content.intro.map((text, idx) => (
              <Typography key={idx} variant='body3' dangerouslySetInnerHTML={{ __html: text }} />
            ))}
          </div>

          {content.sections.map((section, idx) => (
            <div key={idx} className='flex flex-col gap-4'>
              <Typography variant='h4' className='mt-6 font-bold'>
                {section.title}
              </Typography>
              {section.blocks.map((block, bIdx) => {
                if (block.type === 'h5' && block.content) {
                  return (
                    <Typography key={bIdx} variant='h5' className='mt-2 font-bold' dangerouslySetInnerHTML={{ __html: block.content }} />
                  );
                }
                if (block.type === 'p' && block.content) {
                  return <Typography key={bIdx} variant='body3' dangerouslySetInnerHTML={{ __html: block.content }} />;
                }
                if (block.type === 'ul' && block.items) {
                  return (
                    <ul
                      key={bIdx}
                      className={block.style === 'disc' ? 'flex list-inside list-disc flex-col gap-2 pl-2' : 'flex flex-col gap-2'}
                    >
                      {block.items.map((item, iIdx) => (
                        <li key={iIdx}>
                          <Typography variant='body3' tag='span' dangerouslySetInnerHTML={{ __html: item }} />
                        </li>
                      ))}
                    </ul>
                  );
                }
                return null;
              })}
            </div>
          ))}
        </div>
      </ComponentContainer>
    </main>
  );
}
