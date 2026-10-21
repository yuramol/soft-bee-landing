import type { MetadataRoute } from 'next';

import { ROUTES } from '@/constants/routes';
import { getBrandSiteOrigin } from '@/lib/brand/tokens';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBrandSiteOrigin();

  return {
    rules: [
      {
        userAgent: '*',
        allow: ROUTES.HOME,
        disallow: ['/api/', `${ROUTES.DASHBOARD}/`, '/auth/', ROUTES.LOGIN]
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl
  };
}
