import Link from 'next/link';
import Image from 'next/image';
import { Typography } from '@/components/ui/typography';

export interface CaseStudy {
  id: string;
  title: string;
  year: string;
  image: string;
  link: string;
}

interface CaseStudiesMobileProps {
  caseStudies: CaseStudy[];
}

export const CaseStudiesMobile = ({ caseStudies }: CaseStudiesMobileProps) => {
  return (
    <div className='flex flex-col gap-19.25 lg:hidden'>
      {caseStudies.map((study) => (
        <Link key={study.id} href={study.link} className='group flex flex-col gap-6.75'>
          <div className='flex items-start gap-3'>
            <Typography variant='h2' tag='h2' className='text-[40px] leading-none font-normal tracking-tight'>
              {study.title}
            </Typography>
            <Typography variant='body3' tag='span' className='leading-10'>
              [{study.year}]
            </Typography>
          </div>
          <div className='relative aspect-4/3 w-full overflow-hidden rounded-[16px] bg-gray-100 shadow-sm'>
            <Image
              src={study.image}
              alt={`${study.title} case study`}
              fill
              className='object-cover transition-transform duration-700 group-hover:scale-105'
              sizes='(max-width: 768px) 100vw, 50vw'
            />
          </div>
        </Link>
      ))}
    </div>
  );
};
