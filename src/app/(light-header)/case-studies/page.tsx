import { CaseStudies } from '@/components/sections/case-studies';
import { SmartEstimation } from '@/components/sections/home';

export default function CaseStudiesPage() {
  return (
    <>
      <CaseStudies />
      <SmartEstimation hideAnimatedBackground className='z-10 -mb-10 md:-mb-80 lg:-mb-40' />
    </>
  );
}
