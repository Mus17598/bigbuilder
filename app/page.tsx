/**
 * STEP 5 — hero, pinned rack and the four scrub deep-dives. Analytics
 * gallery, process, proof, pricing and the CTA land in steps 6-7.
 */
import Hero from '@/components/Hero';
import ServiceRack from '@/components/ServiceRack';
import DeepDives from '@/components/DeepDives';

export default function Page() {
  return (
    <main id="main">
      <Hero />

      <ServiceRack />
      <DeepDives />
    </main>
  );
}
