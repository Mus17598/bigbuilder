import { SERVICES } from '@/lib/services';
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, CONTACT_EMAIL } from '@/lib/site';

/**
 * Organization plus one Service node per module.
 *
 * Emitted as a single @graph rather than several separate <script> blocks so
 * the nodes can reference each other by @id, which is what lets each Service
 * name its provider without repeating the whole Organization twelve times.
 *
 * This is a server component, so the JSON is in the initial HTML where
 * crawlers that do not execute JavaScript will still see it.
 */
export default function StructuredData() {
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        description: SITE_DESCRIPTION,
        slogan: 'We build the machine your business runs on.',
        email: CONTACT_EMAIL,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Bengaluru',
          addressCountry: 'IN',
        },
        image: `${SITE_URL}/assets/images/img-og-poster.jpg`,
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
      ...SERVICES.map((service) => ({
        '@type': 'Service',
        '@id': `${SITE_URL}/#${service.id}`,
        name: service.name,
        description: `${service.promise} ${service.bullets.join('. ')}.`,
        provider: { '@id': `${SITE_URL}/#organization` },
        areaServed: 'Worldwide',
      })),
    ],
  };

  return (
    <script
      type="application/ld+json"
      // Server-rendered, and the content is our own typed data rather than
      // anything user-supplied.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
