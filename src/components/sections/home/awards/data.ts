import type { IconName } from '@/components/ui/icon';

export interface AwardItemData {
  id: string;
  logoIcon: IconName;
  logoClassName: string;
  description: string;
  profileUrl: string;
}

export const AWARDS_ITEMS: AwardItemData[] = [
  {
    id: 'upwork',
    logoIcon: 'LogoUpwork',
    logoClassName: 'h-8 w-auto lg:h-16',
    description:
      'As a Top Rated Plus agency on Upwork, we’ve delivered 50+ projects with a flawless 100% Job Success Score. Dozens of 5-star reviews and thousands of logged hours prove our commitment to clean code and transparent partnership.',
    profileUrl: 'https://www.upwork.com'
  },
  {
    id: 'clutch',
    logoIcon: 'LogoClutch',
    logoClassName: 'h-6 w-auto lg:h-11',
    description:
      'Recognized on Clutch for consistent delivery and client satisfaction, Soft Bee maintains a 5-star rating across enterprise and startup engagements. Our reviews highlight technical depth, clear communication, and measurable business outcomes.',
    profileUrl: 'https://www.clutch.co'
  },
  {
    id: 'upwork1',
    logoIcon: 'LogoUpwork',
    logoClassName: 'h-8 w-auto lg:h-16',
    description:
      'As a Top Rated Plus agency on Upwork, we’ve delivered 50+ projects with a flawless 100% Job Success Score. Dozens of 5-star reviews and thousands of logged hours prove our commitment to clean code and transparent partnership.',
    profileUrl: 'https://www.upwork.com'
  }
];

export const AWARD_STATS = [
  {
    value: 94,
    suffix: '%',
    description: 'of clients report a significant increase in development velocity with Soft Bee.'
  },
  {
    value: 50,
    suffix: '+',
    description: 'complex digital products successfully delivered to the global market.'
  },
  {
    value: 3.5,
    suffix: 'x',
    decimals: 1,
    description: 'Average revenue growth for our partners post-launch.'
  }
];
