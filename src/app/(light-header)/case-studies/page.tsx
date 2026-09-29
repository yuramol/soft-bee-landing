import type { Metadata } from 'next';
import { CaseStudies } from '@/components/sections/case-studies';

export const metadata: Metadata = {
  title: 'Case Studies | Soft Bee',
  description:
    'SaaS, healthtech, AI, and e-commerce projects with real numbers: a $900K+ telehealth platform, a £11M recycling app, an award-winning real estate auction.'
};
import { SmartEstimation } from '@/components/sections/home';

export default function CaseStudiesPage() {
  return (
    <>
      <CaseStudies />
      <SmartEstimation hideAnimatedBackground className='z-10 -mb-10 md:-mb-80 lg:-mb-40' />
    </>
  );
}
