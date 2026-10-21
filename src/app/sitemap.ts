import type { MetadataRoute } from 'next';

import { getCaseStudyListings } from '@/components/sections/case-studies/data';
import { ROUTES } from '@/constants/routes';
import { getBrandSiteOrigin } from '@/lib/brand/tokens';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBrandSiteOrigin();
  const currentDate = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0
    },
    {
      url: `${baseUrl}${ROUTES.SERVICES}`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${baseUrl}${ROUTES.CASE_STUDIES}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9
    },
    {
      url: `${baseUrl}${ROUTES.INSIGHTS}`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.6
    },
    {
      url: `${baseUrl}${ROUTES.CAREERS}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7
    },
    {
      url: `${baseUrl}${ROUTES.PARTNERSHIP}`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${baseUrl}${ROUTES.COMPANY}`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8
    },
    {
      url: `${baseUrl}${ROUTES.PRIVACY_POLICY}`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.2
    },
    {
      url: `${baseUrl}${ROUTES.TERMS_OF_USE}`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.2
    }
  ];

  const caseStudies = getCaseStudyListings();
  const caseStudyRoutes: MetadataRoute.Sitemap = caseStudies.map((study) => ({
    url: `${baseUrl}${study.link}`,
    lastModified: currentDate,
    changeFrequency: 'monthly',
    priority: 0.6
  }));

  return [...staticRoutes, ...caseStudyRoutes];
}
