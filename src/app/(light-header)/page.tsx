import nextDynamic from 'next/dynamic';

import { ComponentContainer } from '@/components/layout';
import { AboutUs, Careers, CaseStudies, Hero, Services, Team, Testimonials } from '@/components/sections/home';

const VideoWrapper = nextDynamic(() => import('@/components/sections/home/video-wrapper').then((module) => module.VideoWrapper));
const Tools = nextDynamic(() => import('@/components/sections/home/tools').then((module) => module.Tools));
const SmartEstimation = nextDynamic(() => import('@/components/sections/home/smart-estimation').then((module) => module.SmartEstimation));
const Awards = nextDynamic(() => import('@/components/sections/home/awards').then((module) => module.Awards));

export const dynamic = 'force-static';

export default function Home() {
  return (
    <>
      <Hero />
      <VideoWrapper />
      <AboutUs />

      <div className='bg-muted relative pb-30.5 md:pb-26.75'>
        <ComponentContainer>
          <div className='relative z-20 w-full overflow-x-clip rounded-lg bg-white md:rounded-2xl'>
            <Services />
            <Tools />
          </div>
        </ComponentContainer>
      </div>
      <Team />
      <Careers />
      <CaseStudies />
      <SmartEstimation />
      <Awards />
      <Testimonials />
    </>
  );
}
