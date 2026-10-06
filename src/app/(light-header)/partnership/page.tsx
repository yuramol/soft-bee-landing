import type { Metadata } from 'next';
import { preload } from 'react-dom';

import { Partnership } from '@/components/sections/partnership';

export const metadata: Metadata = {
  title: 'Partnership | Soft Bee',
  description:
    'Partner with Soft Bee to design and build product experiences. You design it — we engineer and ship it with a senior delivery team.'
};

export const dynamic = 'force-static';

export default function PartnershipPage() {
  preload('/videos/partnership/partnership-ribbons-poster.webp', {
    as: 'image',
    fetchPriority: 'high'
  });

  return <Partnership />;
}
