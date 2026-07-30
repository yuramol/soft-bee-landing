import { ComponentContainer } from '@/components/layout';
import { AboutHero } from '@/components/sections/about';
import { AboutUs, Careers, Services, Team } from '@/components/sections/home';

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutUs />
      <div className='bg-muted relative pb-30.5 md:pb-26.75'>
        <ComponentContainer>
          <div className='relative z-20 w-full overflow-x-clip rounded-lg bg-white md:rounded-2xl'>
            <Services />
            {/* <Tools /> */}
          </div>
        </ComponentContainer>
      </div>
      <Team hideCoFounders />
      <Careers className='z-10 -mb-10 bg-transparent md:-mb-10' />
    </>
  );
}
