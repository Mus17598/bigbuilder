import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import '@/styles/globals.css';
import SmoothScroll from '@/components/SmoothScroll';
import Preloader from '@/components/Preloader';
import Nav from '@/components/Nav';
import ScrollProgress from '@/components/ScrollProgress';
import Footer from '@/components/Footer';
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

const SITE = 'https://bigbuilder.example';

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: 'BigBuilder — We build the machine your business runs on',
  description:
    'BigBuilder designs, builds and runs the systems behind growing businesses: AI automation, CRM, websites, apps, chatbots and growth infrastructure.',
  openGraph: {
    title: 'BigBuilder — We build the machine your business runs on',
    description:
      'AI automation, CRM, web, apps and growth systems, built and run end to end.',
    url: SITE,
    siteName: 'BigBuilder',
    images: [{ url: '/assets/images/img-og-poster.jpg', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BigBuilder',
    description: 'We build the machine your business runs on.',
    images: ['/assets/images/img-og-poster.jpg'],
  },
};

/**
 * The ONE documented exception to "no hex outside tokens.css": the browser
 * chrome colour ships in a <meta> tag, which cannot read a CSS variable.
 * Keep this in sync with --ink-900.
 */
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
