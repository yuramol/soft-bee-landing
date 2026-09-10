import nextDynamic from 'next/dynamic';

import { ComponentContainer } from '@/components/layout';
import { AboutUs, Hero } from '@/components/sections/home';

const VideoWrapper = nextDynamic(() => import('@/components/sections/home/video-wrapper').then((module) => module.VideoWrapper));
const Services = nextDynamic(() => import('@/components/sections/home/services').then((module) => module.Services));
const Tools = nextDynamic(() => import('@/components/sections/home/tools').then((module) => module.Tools));
const Team = nextDynamic(() => import('@/components/sections/home/team').then((module) => module.Team));
const Careers = nextDynamic(() => import('@/components/sections/home/careers').then((module) => module.Careers));
const CaseStudies = nextDynamic(() => import('@/components/sections/home/case-studies').then((module) => module.CaseStudies));
const SmartEstimation = nextDynamic(() => import('@/components/sections/home/smart-estimation').then((module) => module.SmartEstimation));
const Awards = nextDynamic(() => import('@/components/sections/home/awards').then((module) => module.Awards));
const Testimonials = nextDynamic(() => import('@/components/sections/home/testimonials').then((module) => module.Testimonials));

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
