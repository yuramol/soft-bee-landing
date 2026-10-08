import type { Metadata } from 'next';
import nextDynamic from 'next/dynamic';

import { CaseStudies } from '@/components/sections/case-studies';
import { getCaseStudyListings } from '@/components/sections/case-studies/data';

export const metadata: Metadata = {
  title: 'Case Studies | Soft Bee',
  description:
    'SaaS, healthtech, AI, and e-commerce projects with real numbers: a $900K+ telehealth platform, a £11M recycling app, an award-winning real estate auction.'
};

const SmartEstimation = nextDynamic(() => import('@/components/sections/home/smart-estimation').then((module) => module.SmartEstimation));

export const dynamic = 'force-static';

export default function CaseStudiesPage() {
  return (
    <>
      <CaseStudies caseStudies={getCaseStudyListings()} />
      <SmartEstimation hideAnimatedBackground className='z-10 -mb-10 md:-mb-80 lg:-mb-40' />
    </>
  );
}
