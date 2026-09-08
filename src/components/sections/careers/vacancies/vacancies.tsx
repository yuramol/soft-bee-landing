import { ComponentContainer } from '@/components/layout';
import { VacancyCard } from '@/components/sections/careers/vacancies/components';

const MOCK_VACANCIES = Array.from({ length: 12 }).map((_, i) => ({
  id: i,
  badge: 'Development',
  title: 'Full-stack Developer',
  description:
    'High-performance code is our standard. Join us to build scalable web applications using the latest tech stacks and agile methodologies.'
}));

export const Vacancies = () => {
  return (
    <section className='relative z-10'>
      <ComponentContainer>
        <div className='w-full rounded-lg bg-white p-4 md:rounded-2xl md:p-10.5'>
          <div className='grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'>
            {MOCK_VACANCIES.map((vacancy) => (
              <VacancyCard key={vacancy.id} badge={vacancy.badge} title={vacancy.title} description={vacancy.description} />
            ))}
          </div>
        </div>
      </ComponentContainer>
    </section>
  );
};
