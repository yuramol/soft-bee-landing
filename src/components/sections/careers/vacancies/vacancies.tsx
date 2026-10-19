import { ComponentContainer } from '@/components/layout';
import { VacancyCard } from '@/components/sections/careers/vacancies/components';
import content from './content.json';
import homeCareersContent from '@/components/sections/home/careers/content.json';

export const Vacancies = () => {
  const vacancies = homeCareersContent.cards;

  return (
    <section className='relative z-10'>
      <ComponentContainer>
        <div className='w-full rounded-lg bg-white p-4 md:rounded-2xl md:p-10.5'>
          {vacancies.length > 0 ? (
            <div className='grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'>
              {vacancies.map((vacancy) => (
                <VacancyCard
                  key={vacancy.id}
                  badge={vacancy.badge}
                  title={vacancy.title}
                  description={vacancy.description}
                  roleDescription={vacancy.vacancyDetails.roleDescription}
                />
              ))}
            </div>
          ) : (
            <p className='text-center text-base md:text-lg'>{content.emptyStateMessage}</p>
          )}
        </div>
      </ComponentContainer>
    </section>
  );
};
