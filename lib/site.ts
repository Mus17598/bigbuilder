/**
 * Single source of truth for anything that needs the deployed origin:
 * metadataBase, Open Graph, JSON-LD, robots and the sitemap.
 *
 * Set NEXT_PUBLIC_SITE_URL at build time. The fallback is a placeholder, so
 * absolute URLs in the OG tags will be wrong until it is configured.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://bigbuilder.example';

export const SITE_NAME = 'BigBuilder';

export const SITE_DESCRIPTION =
  'BigBuilder designs, builds and runs the systems behind growing businesses: AI automation, CRM, websites, apps, chatbots and growth infrastructure.';

export const CONTACT_EMAIL = 'hello@bigbuilder.example';
