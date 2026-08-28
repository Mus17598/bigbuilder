/**
 * THE SINGLE SOURCE OF TRUTH for BigBuilder's offering.
 *
 * The service rack, the deep-dive beats, the nav and the footer link column
 * all map over this array. Renaming a service, changing its accent or
 * reordering the pillars is one edit here and nowhere else.
 *
 * Icon paths are stored as raw `d` strings rather than JSX so a single
 * <ServiceIcon> can measure each path with getTotalLength() and draw it in
 * with stroke-dashoffset as the card enters.
 */

export type PillarId = 'intelligence' | 'revenue' | 'product' | 'foundation';

export interface Pillar {
  id: PillarId;
  num: string;
  name: string;
  /** One line explaining what this group of services is for. */
  premise: string;
}

export interface Service {
  /** Stable slug. Used for anchor ids and detail-panel routing. */
  id: string;
  /** Display number in the rack, 01 through 12. */
  num: string;
  name: string;
  /** The promise. One short, concrete sentence. */
  promise: string;
  /** Exactly three deliverables. */
  bullets: [string, string, string];
  pillar: PillarId;
  /** CSS custom property name from styles/tokens.css. Never a literal hex. */
  accent: string;
  /** Path under /public. May legitimately not exist yet, see MediaFrame. */
  image: string;
  /** 24x24 viewBox stroke paths. */
  icon: string[];
}

export const PILLARS: Pillar[] = [
  {
    id: 'intelligence',
    num: '01',
    name: 'Intelligence',
    premise: 'Systems that decide, not just store.',
  },
  {
    id: 'revenue',
    num: '02',
    name: 'Revenue',
    premise: 'Every lead handled, every channel covered.',
  },
  {
    id: 'product',
    num: '03',
    name: 'Product',
    premise: 'The surfaces your customer actually touches.',
  },
  {
    id: 'foundation',
    num: '04',
    name: 'Foundation',
    premise: 'The plan underneath, and the pipes that keep it up.',
  },
];

export const SERVICES: Service[] = [
  {
    id: 'ai-automation',
    num: '01',
    name: 'AI Automation',
    promise: 'Kill the work nobody should be doing.',
    bullets: [
      'Workflow agents that run your process end to end',
      'Document processing for invoices, contracts and forms',
      'Internal copilots wired into the tools your team already opens',
    ],
    pillar: 'intelligence',
    accent: '--acc-automation',
    image: '/assets/images/img-automation.jpg',
    icon: [
      'M5 6h4v4H5z',
      'M15 14h4v4h-4z',
      'M9 8h3a2 2 0 0 1 2 2v4',
      'M5 14v2a2 2 0 0 0 2 2h6',
    ],
  },
  {
    id: 'ai-infrastructure',
    num: '02',
    name: 'AI Provider & Infrastructure',
    promise: 'Your own models, your own data, your own rules.',
    bullets: [
      'Model access and routing across providers',
      'RAG pipelines built on your documents',
      'Private deployment plus evals that prove quality',
    ],
    pillar: 'intelligence',
    accent: '--acc-infra',
    image: '/assets/images/img-ai-infra.jpg',
    icon: [
      'M12 4 3 8l9 4 9-4-9-4z',
      'M3 12l9 4 9-4',
      'M3 16l9 4 9-4',
    ],
  },
  {
    id: 'chatbots-voice',
    num: '03',
    name: 'Chatbots & Voice Agents',
    promise: 'A team member who never sleeps and never forgets.',
    bullets: [
      'Web and WhatsApp bots that hold real context',
      'Inbound and outbound voice agents',
      'CRM-connected handoff to a human at the right moment',
    ],
    pillar: 'intelligence',
    accent: '--acc-chatbot',
    image: '/assets/images/img-chatbot.jpg',
    icon: [
      'M4 5h16v10H9l-5 4V5z',
      'M8 10h.01',
      'M12 10h.01',
      'M16 10h.01',
    ],
  },
  {
    id: 'crm',
    num: '04',
    name: 'CRM Tools',
    promise: 'Every lead accounted for, automatically.',
    bullets: [
      'Custom CRM builds and clean migrations',
      'Pipeline automation that moves deals without nagging',
      'Lead scoring your sales team actually trusts',
    ],
    pillar: 'revenue',
    accent: '--acc-crm',
    image: '/assets/images/img-crm.jpg',
    icon: [
      'M4 5h5v14H4z',
      'M10 5h5v9h-5z',
      'M16 5h4v5h-4z',
    ],
  },
  {
    id: 'email-marketing',
    num: '05',
    name: 'Email Marketing',
    promise: 'Sequences that read like a person wrote them.',
    bullets: [
      'Lifecycle flows from first touch to renewal',
      'Deliverability engineering so you land in the inbox',
      'Segmentation and A/B systems that keep learning',
    ],
    pillar: 'revenue',
    accent: '--acc-email',
    image: '/assets/images/img-email.jpg',
    icon: [
      'M3 6h18v12H3z',
      'M3 7l9 6 9-6',
    ],
  },
  {
    id: 'marketing-growth',
    num: '06',
    name: 'Marketing & Growth',
    promise: 'Demand you can actually forecast.',
    bullets: [
      'Performance campaigns managed against pipeline, not clicks',
      'SEO and content engines built to compound',
      'Attribution that survives a board meeting',
    ],
    pillar: 'revenue',
    accent: '--acc-growth',
    image: '/assets/images/img-marketing.jpg',
    icon: [
      'M4 19V9',
      'M10 19V5',
      'M16 19v-7',
      'M4 19h16',
      'M14 6l3-2 2 3',
    ],
  },
  {
    id: 'omnichannel',
    num: '07',
    name: 'Omnichannel & WhatsApp Commerce',
    promise: 'Sell where your customer already is.',
    bullets: [
      'WhatsApp Business API set up and approved',
      'Catalogue and checkout flows inside the chat',
      'Broadcast plus automation without the spam risk',
    ],
    pillar: 'revenue',
    accent: '--acc-omnichannel',
    image: '/assets/images/img-whatsapp-commerce.jpg',
    icon: [
      'M20 12a8 8 0 1 1-3.6-6.7',
      'M4 20l1.4-4',
      'M9 10c0 3 2 5 5 5',
      'M20 4v5h-5',
    ],
  },
  {
    id: 'website-building',
    num: '08',
    name: 'Website Building',
    promise: 'Sites that load fast and sell harder.',
    bullets: [
      'Marketing sites built for conversion, not decoration',
      'Headless CMS your marketers can run alone',
      'E-commerce and Core Web Vitals in the green',
    ],
    pillar: 'product',
    accent: '--acc-web',
    image: '/assets/images/img-website.jpg',
    icon: [
      'M3 5h18v14H3z',
      'M3 9h18',
      'M6 7h.01',
      'M9 7h.01',
    ],
  },
  {
    id: 'cx-app',
    num: '09',
    name: 'Customer Experience App',
    promise: 'One app, the whole customer relationship.',
    bullets: [
      'Loyalty and rewards that drive repeat orders',
      'Self-serve portals that cut ticket volume',
      'In-app support, push and lifecycle journeys',
    ],
    pillar: 'product',
    accent: '--acc-cx',
    image: '/assets/images/img-cx-app.jpg',
    icon: [
      'M7 3h10v18H7z',
      'M11 18h2',
      'M7 6h10',
    ],
  },
  {
    id: 'analytics-bi',
    num: '10',
    name: 'Analytics & BI Dashboards',
    promise: 'One number everyone agrees on.',
    bullets: [
      'Data pipelines that reconcile across sources',
      'Live dashboards for the floor and the board',
      'Cohort and retention models that explain the why',
    ],
    pillar: 'product',
    accent: '--acc-analytics',
    image: '/assets/images/img-analytics.jpg',
    icon: [
      'M4 20V4',
      'M4 20h16',
      'M8 20v-6',
      'M13 20V9',
      'M18 20v-9',
    ],
  },
  {
    id: 'consultancy',
    num: '11',
    name: 'Business & Tech Consultancy',
    promise: 'A plan before a build.',
    bullets: [
      'Systems audits that find the real bottleneck',
      'Architecture and roadmapping with costed options',
      'Vendor selection and fractional CTO cover',
    ],
    pillar: 'foundation',
    accent: '--acc-consultancy',
    image: '/assets/images/img-consultancy.jpg',
    icon: [
      'M12 3v18',
      'M5 8l7-4 7 4',
      'M5 8v8l7 4 7-4V8',
    ],
  },
  {
    id: 'cloud-devops',
    num: '12',
    name: 'Cloud, DevOps & Integrations',
    promise: 'It stays up. It stays connected.',
    bullets: [
      'Cloud setup sized to what you actually run',
      'CI/CD so shipping stops being an event',
      'API integrations, monitoring and real SLAs',
    ],
    pillar: 'foundation',
    accent: '--acc-devops',
    image: '/assets/images/img-devops.jpg',
    icon: [
      'M6 17a4 4 0 0 1 .5-8 5.5 5.5 0 0 1 10.5 1.5A3.5 3.5 0 0 1 17 17z',
      'M9 20h6',
      'M12 13v7',
    ],
  },
];

/** Services grouped by pillar, preserving rack order within each group. */
export function servicesByPillar(pillarId: PillarId): Service[] {
  return SERVICES.filter((s) => s.pillar === pillarId);
}

export function getService(id: string): Service | undefined {
  return SERVICES.find((s) => s.id === id);
}

/** Fails the build if a service ever points at a pillar that does not exist. */
const KNOWN_PILLARS = new Set(PILLARS.map((p) => p.id));
SERVICES.forEach((s) => {
  if (!KNOWN_PILLARS.has(s.pillar)) {
    throw new Error(`Service "${s.id}" references unknown pillar "${s.pillar}"`);
  }
});
