import { ComponentContainer } from '@/components/layout';
import {
  AboutUs,
  Awards,
  Careers,
  CaseStudies,
  Hero,
  Services,
  Team,
  Testimonials,
  Tools,
  VideoWrapper,
  SmartEstimation
} from '@/components/sections/home';

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
