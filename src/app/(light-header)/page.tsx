import { AboutUs, Hero, Services, VideoWrapper } from '@/components/sections/home';
import { Tools } from '@/components/sections/home/tools';

export default function Home() {
  return (
    <>
      <Hero />
      <VideoWrapper />
      <AboutUs />
      <Services />
      <Tools />
    </>
  );
}
