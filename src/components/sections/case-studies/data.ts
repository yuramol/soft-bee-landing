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
  overviewTitle: string;
  overviewDescription: string;
  overviewImages: string[];
  toolsTitle?: string;
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
    cards: mockCards,
    overviewTitle: 'Autobro is an innovative automotive platform designed for seamless car buying and selling experiences.',
    overviewDescription:
      'Built with a user-centric approach, Autobro simplifies vehicle discovery, financing, and transaction management, empowering users to make informed decisions with confidence.',
    overviewImages: ['/images/case-study/overview-img-1.webp', '/images/case-study/overview-img-2.webp'],
    toolsTitle:
      'We tailored our stack for Autobro, ensuring <span class="text-foreground/50">maximum performance and scalability in the automotive industry.</span>'
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
    cards: mockCards,
    overviewTitle: 'GapNurse is a digital healthcare platform connecting facilities with qualified nursing professionals on demand.',
    overviewDescription:
      'With a robust mobile application, GapNurse streamlines shift scheduling, credential verification, and payroll management, ensuring healthcare facilities always have the staff they need.',
    overviewImages: ['/images/case-study/overview-img-1.webp', '/images/case-study/overview-img-2.webp'],
    toolsTitle:
      'Our healthcare-focused technology stack for GapNurse ensures <span class="text-foreground/50">HIPAA compliance, real-time sync, and unwavering reliability for medical professionals.</span>'
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
    cards: mockCards,
    overviewTitle: 'plumBid is a digital real estate auction platform designed for transparent and seamless online bidding.',
    overviewDescription:
      'Built with a modern and responsive interface, plumBid simplifies auction workflows, offer tracking, and property management while helping users navigate transactions with greater transparency and confidence.',
    overviewImages: ['/images/case-study/overview-img-1.webp', '/images/case-study/overview-img-2.webp'],
    toolsTitle:
      'We engineered plumBid with a robust architecture, providing <span class="text-foreground/50">lightning-fast auction updates and bank-grade security for high-stakes real estate bidding.</span>'
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
    cards: mockCards,
    overviewTitle: 'Trovr is a cutting-edge web service designed to revolutionize reward-based recycling and sustainability initiatives.',
    overviewDescription:
      'Featuring an intuitive interface, Trovr simplifies the process of tracking eco-friendly actions, redeeming rewards, and fostering a greener community with engaging digital tools.',
    overviewImages: ['/images/case-study/overview-img-1.webp', '/images/case-study/overview-img-2.webp'],
    toolsTitle:
      'Trovr’s ecosystem is powered by sustainable and scalable technologies, allowing <span class="text-foreground/50">seamless integration with IoT devices and instant reward processing.</span>'
  }
];
