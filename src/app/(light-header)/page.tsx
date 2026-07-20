import { Hero, AboutUs, Services } from '@/components/sections/home';

export default function Home() {
  return (
    <div className='bg-muted'>
      <Hero />
      <AboutUs />
      <Services />
    </div>
  );
}
