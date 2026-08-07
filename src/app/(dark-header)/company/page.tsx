import { AboutHero, Founders } from '@/components/sections/about';
import { AboutUs, Careers, Team } from '@/components/sections/home';

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutUs />
      <Founders />
      <Team hideCoFounders />
      <Careers className='z-10 -mb-10 bg-transparent md:-mb-10' />
    </>
  );
}
