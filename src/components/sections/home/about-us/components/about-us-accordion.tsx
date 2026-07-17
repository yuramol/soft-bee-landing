'use client';

import { useState } from 'react';
import { AboutUsCard } from './about-us-card';
import { ABOUT_US_CARDS } from '@/constants';

export const AboutUsAccordion = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className='@container flex w-full flex-col gap-2.5 lg:flex-row'>
      {ABOUT_US_CARDS.map((card, index) => (
        <AboutUsCard
          key={card.id}
          id={card.id}
          title={card.title}
          description={card.description}
          activeBg={card.activeBg}
          activeText={card.activeText}
          isActive={activeIndex === index}
          onClick={() => setActiveIndex(index)}
        />
      ))}
    </div>
  );
};
