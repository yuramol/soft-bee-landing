import type { MetadataRoute } from 'next';

import { getCaseStudyListings } from '@/components/sections/case-studies/data';
import { ROUTES } from '@/constants/routes';
import { getBrandSiteOrigin } from '@/lib/brand/tokens';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBrandSiteOrigin();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      changeFrequency: 'weekly',
      priority: 1.0
    },
    {
      url: `${baseUrl}${ROUTES.SERVICES}`,
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${baseUrl}${ROUTES.CASE_STUDIES}`,
      changeFrequency: 'weekly',
      priority: 0.9
    },
    {
      url: `${baseUrl}${ROUTES.INSIGHTS}`,
      changeFrequency: 'daily',
      priority: 0.6
    },
    {
      url: `${baseUrl}${ROUTES.CAREERS}`,
      changeFrequency: 'weekly',
      priority: 0.7
    },
    {
      url: `${baseUrl}${ROUTES.PARTNERSHIP}`,
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${baseUrl}${ROUTES.COMPANY}`,
      changeFrequency: 'monthly',
      priority: 0.8
    },
    {
      url: `${baseUrl}${ROUTES.PRIVACY_POLICY}`,
      changeFrequency: 'yearly',
      priority: 0.2
    },
    {
      url: `${baseUrl}${ROUTES.TERMS_OF_USE}`,
      changeFrequency: 'yearly',
      priority: 0.2
    }
  ];

  const caseStudies = getCaseStudyListings();
  const caseStudyRoutes: MetadataRoute.Sitemap = caseStudies.map((study) => ({
    url: `${baseUrl}${study.link}`,
    changeFrequency: 'monthly' as const,
    priority: 0.6
  }));

  return [...staticRoutes, ...caseStudyRoutes];
}
