import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

/**
 * One page, so one entry. Section anchors are deliberately not listed:
 * fragment URLs are not separate documents and listing them dilutes the page.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
