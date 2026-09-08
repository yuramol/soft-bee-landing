'use client';

import servicesContent from './content.json';
import { ServicesDesktopCard, ServicesMobileCard } from './components';

export function ServicesList() {
  return (
    <section className='z-20 w-full'>
      <div className='flex flex-col lg:hidden'>
        {servicesContent.map((service) => (
          <ServicesMobileCard key={service.id} service={service} />
        ))}
      </div>

      <div className='hidden w-full lg:block'>
        {servicesContent.map((service, index) => (
          <ServicesDesktopCard key={service.id} service={service} index={index} allServices={servicesContent} />
        ))}
      </div>
    </section>
  );
}
