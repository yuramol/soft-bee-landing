import { ComponentContainer } from '@/components/layout';
import { AboutUs, Awards, Careers, CaseStudies, Hero, Services, Testimonials, Tools, VideoWrapper } from '@/components/sections/home';

export default function Home() {
  return (
    <>
      <Hero />
      <VideoWrapper />
      <AboutUs />

      <div className='bg-muted relative pb-10'>
        <ComponentContainer>
          <div className='w-full overflow-x-clip rounded-lg bg-white md:rounded-2xl'>
            <Services />
            <Tools />
          </div>
        </ComponentContainer>
      </div>
      <Careers />
      <CaseStudies />
      <Awards />
      <Testimonials />
    </>
  );
}
