import { notFound } from 'next/navigation';
import { CASE_STUDIES } from '@/components/sections/case-studies/data';
import { CaseStudyHero } from '@/components/sections/case-study';
import { Tools } from '@/components/sections/home';

export function generateStaticParams() {
  return CASE_STUDIES.map((study) => ({
    id: study.id
  }));
}

export default async function CaseStudyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const caseStudy = CASE_STUDIES.find((c) => c.id === id);

  if (!caseStudy) {
    return notFound();
  }

  return (
    <>
      <CaseStudyHero
        title={caseStudy.title}
        year={caseStudy.year}
        client={caseStudy.client}
        projectType={caseStudy.projectType}
        tech={caseStudy.tech}
        cards={caseStudy.cards}
      />
      <Tools />
    </>
  );
}
