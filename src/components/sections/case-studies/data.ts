import { TestimonialItem } from '@/components/sections/home/testimonials/testimonials';
import { IconName } from '@/components/ui/icon';
import caseStudiesData from './case-studies.json';

export interface CaseStudyCard {
  title: string;
  description: string;
}

export interface CaseStudyResultCard {
  id: number;
  title: string;
  description: string;
  bottomText?: string;
}

export interface CaseStudyTool {
  name: string;
  description: string;
  icon: IconName;
  invertOnHover?: boolean;
}

export interface CaseStudy {
  id: string;
  title: string;
  shortTitle?: string;
  year: string;
  image: string;
  link: string;
  client: string;
  projectType: string;
  tech: string[];
  cards: CaseStudyCard[];
  overviewTitle: string;
  overviewDescription: string | string[];
  overviewImages: string[];
  toolsTitle?: string;
  tools?: CaseStudyTool[];
  galleryImages?: string[];
  resultsDescription?: string[];
  resultsCards?: CaseStudyResultCard[];
  testimonials?: TestimonialItem[];
}

export const CASE_STUDIES: CaseStudy[] = caseStudiesData as CaseStudy[];
