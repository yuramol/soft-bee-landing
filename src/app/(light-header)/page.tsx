import { AboutUs, Hero, Services, VideoWrapper } from '@/components/sections/home';
import { Tools } from '@/components/sections/home/tools';

import { ComponentContainer } from '@/components/layout';

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
    </>
  );
}
