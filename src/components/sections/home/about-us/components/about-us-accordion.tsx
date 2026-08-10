'use client';

import { useState } from 'react';

import { AboutUsCard } from './about-us-card';

interface AboutUsCardData {
  id: string;
  title: string;
  description: string;
  activeBg: string;
  activeText: string;
}

interface AboutUsAccordionProps {
  cards: AboutUsCardData[];
}

export function AboutUsAccordion({ cards }: AboutUsAccordionProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  function handleCardClick(index: number) {
    setActiveIndex(index);
  }

  return (
    <div className='@container flex w-full flex-col gap-2.5 lg:flex-row'>
      {cards.map((card, index) => (
        <AboutUsCard
          key={card.id}
          id={card.id}
          title={card.title}
          description={card.description}
          activeBg={card.activeBg}
          activeText={card.activeText}
          isActive={activeIndex === index}
          onClick={() => handleCardClick(index)}
        />
      ))}
    </div>
  );
}
