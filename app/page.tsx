/**
 * BigBuilder, single page.
 *
 * Every section below is a client component because each owns scroll-driven
 * behaviour; this file stays a server component so the document shell and
 * metadata are still rendered on the server.
 */
import Hero from '@/components/Hero';
import ServiceRack from '@/components/ServiceRack';
import DeepDives from '@/components/DeepDives';
import AnalyticsGallery from '@/components/AnalyticsGallery';
import Process from '@/components/Process';
import Proof from '@/components/Proof';
import StackGrid from '@/components/StackGrid';
import Pricing from '@/components/Pricing';
import CTA from '@/components/CTA';

export default function Page() {
  return (
    <main id="main">
      <Hero />
      <ServiceRack />
      <DeepDives />
      <AnalyticsGallery />
      <Process />
      <Proof />
      <StackGrid />
      <Pricing />
      <CTA />
    </main>
  );
}
