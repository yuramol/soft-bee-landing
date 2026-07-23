import { ComponentContainer } from '@/components/layout';
import { AboutUs, Hero, Services, VideoWrapper } from '@/components/sections/home';
import { Awards } from '@/components/sections/home/awards';
import { Tools } from '@/components/sections/home/tools';

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
      <Awards />
    </>
  );
}
