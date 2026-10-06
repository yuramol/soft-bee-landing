import nextDynamic from 'next/dynamic';

import './partnership.css';

import PartnershipHero from './components/partnership-hero';
import PartnershipWhoItsFor from './components/partnership-who-its-for';
import PartnershipHowItWorks from './components/partnership-how-it-works';
import PartnershipContact from './components/partnership-contact';

const TeamAnimatedBackground = nextDynamic(() =>
  import('@/components/sections/home/team/components/team-animated-background').then((module) => module.TeamAnimatedBackground)
);

export function Partnership() {
  return (
    <>
      <PartnershipHero />
      <div className='relative z-10 w-full'>
        <TeamAnimatedBackground className='-top-90 -bottom-50 -left-1.25 -z-10 h-[calc(100%+400px)] w-[calc(100%+10px)] opacity-80 md:-left-2.5 md:w-[calc(100%+20px)]' />
        <PartnershipWhoItsFor />
        <PartnershipHowItWorks />
      </div>
      <PartnershipContact />
    </>
  );
}
