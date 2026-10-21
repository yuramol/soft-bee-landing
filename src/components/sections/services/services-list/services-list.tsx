'use client';

import servicesContent from './content.json';
import { ServicesDesktopCard, ServicesMobileCard } from './components';

export function ServicesList() {
  return (
    <section className='z-20 w-full'>
      <div className='flex flex-col lg:hidden'>
        {servicesContent.services.map((service) => (
          <ServicesMobileCard key={service.id} service={service} ctaText={servicesContent.cta} />
        ))}
      </div>

      <div className='hidden w-full lg:block'>
        {servicesContent.services.map((service, index) => (
          <ServicesDesktopCard
            key={service.id}
            service={service}
            index={index}
            allServices={servicesContent.services}
            ctaText={servicesContent.cta}
          />
        ))}
      </div>
    </section>
  );
}
