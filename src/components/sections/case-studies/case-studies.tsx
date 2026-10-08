import nextDynamic from 'next/dynamic';

import { ComponentContainer } from '@/components/layout';
import { CaseStudiesMobile } from './components';
import type { CaseStudyListing } from './data';

const CaseStudiesDesktop = nextDynamic(() => import('./components/case-studies-desktop').then((module) => module.CaseStudiesDesktop));

interface CaseStudiesProps {
  caseStudies: CaseStudyListing[];
}

export function CaseStudies({ caseStudies }: CaseStudiesProps) {
  return (
    <div className='bg-brand-white text-brand-black w-full rounded-2xl px-4 pt-40.25 pb-7.25 shadow-sm lg:px-5 lg:pt-37.25 lg:pb-41.5 lg:shadow-none'>
      <ComponentContainer className='w-full'>
        <CaseStudiesMobile caseStudies={caseStudies} />
        <CaseStudiesDesktop caseStudies={caseStudies} />
      </ComponentContainer>
    </div>
  );
}
