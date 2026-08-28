import SplitHeading from './SplitHeading';

/**
 * Integration grid. Rendered as wordmarks rather than logo files: real vendor
 * logos are trademarked assets that need permission and correct clear-space,
 * and a missing SVG would leave an empty cell. Swap in <MediaFrame kind="image">
 * per cell once licensed art exists.
 */
const GROUPS = [
  { label: 'CRM & sales', items: ['Salesforce', 'HubSpot', 'Zoho', 'Pipedrive'] },
  { label: 'Messaging', items: ['WhatsApp Business', 'Twilio', 'Slack', 'Intercom'] },
  { label: 'Models', items: ['Anthropic', 'OpenAI', 'Bedrock', 'Vertex AI'] },
  { label: 'Cloud & data', items: ['AWS', 'GCP', 'Snowflake', 'Postgres'] },
  { label: 'Commerce', items: ['Shopify', 'Stripe', 'Razorpay', 'WooCommerce'] },
  { label: 'Marketing', items: ['Klaviyo', 'Braze', 'Meta Ads', 'GA4'] },
];

export default function StackGrid() {
  return (
    <section id="stack" className="stack">
      <div className="grid-lines" aria-hidden="true" />
      <div className="shell">
        <p className="eyebrow">Integrations</p>
        <SplitHeading as="h2" className="stack__heading">
          We plug into what you already use
        </SplitHeading>

        <div className="stack__groups">
          {GROUPS.map((group) => (
            <div key={group.label} className="stack__group">
              <p className="mono stack__label">{group.label}</p>
              <ul className="stack__cells">
                {group.items.map((item) => (
                  <li key={item} className="stack__cell">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mono stack__note">
          Not listed is not a problem. If it has an API, we connect it.
        </p>
      </div>
    </section>
  );
}
