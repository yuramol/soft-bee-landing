import caseStudiesData from './case-studies.json';

export interface CaseStudyCard {
  title: string;
  description: string;
}

export interface CaseStudyResultCard {
  id: number;
  title: string;
  description: string;
  bottomText: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  year: string;
  image: string;
  link: string;
  client: string;
  projectType: string;
  tech: string[];
  cards: CaseStudyCard[];
  overviewTitle: string;
  overviewDescription: string;
  overviewImages: string[];
  toolsTitle?: string;
  galleryImages?: string[];
  resultsDescription?: string[];
  resultsCards?: CaseStudyResultCard[];
}

export const CASE_STUDIES: CaseStudy[] = caseStudiesData as CaseStudy[];
