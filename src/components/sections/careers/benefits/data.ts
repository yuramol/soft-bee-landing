import { BenefitType, BenefitLayout } from './components/benefit-card';
import content from './content.json';

export interface BenefitItem {
  title: string;
  description: string;
  type: BenefitType;
  layout: BenefitLayout;
  image?: string;
}

export const BENEFITS: BenefitItem[] = content.benefits as BenefitItem[];
