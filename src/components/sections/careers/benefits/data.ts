import { BenefitType, BenefitLayout } from './components/benefit-card';

export interface BenefitItem {
  title: string;
  description: string;
  type: BenefitType;
  layout: BenefitLayout;
  image?: string;
}

export const BENEFITS: BenefitItem[] = [
  {
    title: 'Flexible & Remote-First Work',
    description:
      'Choose where and when you work best. We trust our team to manage their own time, offering flexible hours and fully remote options to support your ideal work-life balance.',
    type: 'cyan',
    layout: 'bottom'
  },
  {
    title: 'Flexible & Remote-First Work',
    description:
      'Choose where and when you work best. We trust our team to manage their own time, offering flexible hours and fully remote options to support your ideal work-life balance.',
    type: 'white',
    layout: 'split'
  },
  {
    title: 'Continuous Growth & Learning',
    description:
      'Choose where and when you work best. We trust our team to manage their own time, offering flexible hours and fully remote options to support your ideal work-life balance.',
    type: 'image',
    image: '/images/careers/careers-team.webp',
    layout: 'bottom'
  },
  {
    title: 'Flexible & Remote-First Work',
    description:
      'Choose where and when you work best. We trust our team to manage their own time, offering flexible hours and fully remote options to support your ideal work-life balance.',
    type: 'lime',
    layout: 'top'
  }
];
