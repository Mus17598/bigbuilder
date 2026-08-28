import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import '@/styles/globals.css';
import SmoothScroll from '@/components/SmoothScroll';
import Preloader from '@/components/Preloader';
import Nav from '@/components/Nav';
import ScrollProgress from '@/components/ScrollProgress';
import Footer from '@/components/Footer';
import StructuredData from '@/components/StructuredData';
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from '@/lib/site';
import GrainOverlay from '@/components/GrainOverlay';
import CursorLight from '@/components/CursorLight';

/**
 * Satoshi is not on Google Fonts. Space Grotesk is the licensed-safe display
 * stand-in; tokens.css lists 'Satoshi' ahead of it, so dropping the woff2 into
 * /public/assets/fonts plus one @font-face rule upgrades the whole site with
 * no component edits.
 */
const display = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-display',
  display: 'swap',
});

const body = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-body',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['500'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'BigBuilder — We build the machine your business runs on',
    template: '%s · BigBuilder',
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    'AI automation',
    'CRM development',
    'WhatsApp Business API',
    'chatbots and voice agents',
    'website development',
    'analytics dashboards',
    'DevOps and integrations',
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  alternates: { canonical: '/' },
  openGraph: {
    title: 'BigBuilder — We build the machine your business runs on',
    description:
      'AI automation, CRM, web, apps and growth systems, built and run end to end.',
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: '/assets/images/img-og-poster.jpg',
        width: 1200,
        height: 630,
        alt: 'BigBuilder, an AI-native build studio',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BigBuilder',
    description: 'We build the machine your business runs on.',
    images: ['/assets/images/img-og-poster.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
};

export const viewport: Viewport = {
  themeColor: '#07070a',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <body>
        <StructuredData />
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Preloader />
        <ScrollProgress />
        <Nav />
        <SmoothScroll>
          {children}
          <Footer />
        </SmoothScroll>
        <CursorLight />
        <GrainOverlay />
      </body>
    </html>
  );
}
