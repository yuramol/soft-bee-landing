export interface CaseStudyCard {
  title: string;
  description: string;
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
}

const mockCards: CaseStudyCard[] = [
  {
    title: 'Real-Time',
    description: 'Users can place and monitor bids instantly through a transparent and responsive auction experience.'
  },
  {
    title: 'Responsive',
    description: 'The platform was optimized to provide seamless interaction across desktop, tablet, and mobile devices.'
  },
  {
    title: 'Streamlined',
    description: 'Simplified user flows helped buyers and sellers manage listings, offers, and bidding with less friction.'
  },
  {
    title: 'Flexible',
    description: 'Customizable auction settings allowed sellers to configure listings and bidding behavior more efficiently.'
  }
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'autobro',
    title: 'Autobro',
    year: '2022',
    image: '/images/case-studies/autobro.webp',
    link: '/case-studies/autobro',
    client: 'AutoBro Inc.',
    projectType: 'Web Application',
    tech: ['React', 'Redux', 'Node.js'],
    cards: mockCards
  },
  {
    id: 'gapnurse',
    title: 'GapNurse',
    year: '2022',
    image: '/images/case-studies/gap-nurse.webp',
    link: '/case-studies/gapnurse',
    client: 'GapNurse LLC',
    projectType: 'Mobile App',
    tech: ['React Native', 'Firebase', 'Redux'],
    cards: mockCards
  },
  {
    id: 'plumbid',
    title: 'plumBid',
    year: '2022',
    image: '/images/case-studies/plumbid.webp',
    link: '/case-studies/plumbid',
    client: 'plumBid Corp',
    projectType: 'Platform',
    tech: ['Next.js', 'Tailwind', 'PostgreSQL'],
    cards: mockCards
  },
  {
    id: 'trovr',
    title: 'Trovr',
    year: '2022',
    image: '/images/case-studies/trovr.webp',
    link: '/case-studies/trovr',
    client: 'Trovr Group',
    projectType: 'Web Service',
    tech: ['Vue.js', 'Python', 'AWS'],
    cards: mockCards
  }
];
