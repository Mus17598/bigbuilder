'use client';

import { useCallback, useRef } from 'react';
import DeepDive from './DeepDive';
import ChatTranscript, { type ChatTranscriptHandle, type ChatLine } from './ChatTranscript';
import Counter from './Counter';

const CHAT: ChatLine[] = [
  { from: 'them', text: 'Do you deliver to Whitefield on a Sunday?' },
  { from: 'bot', text: 'We do. Sunday slots run 9am to 7pm.' },
  { from: 'them', text: 'Can I move my order to next week?' },
  { from: 'bot', text: 'Moved to Tuesday the 9th. Confirmation sent.' },
  { from: 'them', text: 'Can someone call me about bulk pricing?' },
  { from: 'bot', text: 'Booked. Priya calls you at 11am, with your order open.' },
];

/**
 * The four flagship beats. All of them run through one DeepDive; only the
 * data and the optional side panel differ.
 */
export default function DeepDives() {
  const transcriptRef = useRef<ChatTranscriptHandle>(null);

  /* Stable identity: DeepDive lists onProgress as an effect dependency, and
     an inline arrow would tear down and rebuild the pin on every render. */
  const driveTranscript = useCallback((progress: number) => {
    transcriptRef.current?.setProgress(progress);
  }, []);

  return (
    <>
      <DeepDive
        id="automation"
        eyebrow="01 · AI Automation"
        heading={
          <>
            The work <span className="accent-word">runs itself.</span>
          </>
        }
        body="We map the process you actually follow, then build the agents that run it. Triggers fire, records enrich themselves, decisions get made against your rules, and the work lands finished."
        accent="--acc-automation"
        video="/assets/video/automation-flow.mp4"
        poster="/assets/images/img-automation.jpg"
        labels={[
          { text: 'Trigger', at: 0.08, x: 8, y: 22 },
          { text: 'Enrich', at: 0.28, x: 30, y: 62 },
          { text: 'Decide', at: 0.48, x: 52, y: 26 },
          { text: 'Execute', at: 0.68, x: 70, y: 66 },
          { text: 'Report', at: 0.86, x: 84, y: 34 },
        ]}
      />

      <DeepDive
        id="exploded-stack"
        eyebrow="02 · The stack"
        heading={
          <>
            One stack. <span className="accent-word">Every layer yours.</span>
          </>
        }
        body="Data you own. Models you can swap. Automation that sits above both, and an interface your customer never has to think about. Scroll down to assemble it, back up to pull it apart."
        accent="--acc-infra"
        video="/assets/video/exploded-stack.mp4"
        poster="/assets/images/img-ai-infra.jpg"
        labels={[
          { text: 'Data layer', at: 0.12, x: 6, y: 78 },
          { text: 'Model layer', at: 0.32, x: 6, y: 60 },
          { text: 'Automation layer', at: 0.52, x: 6, y: 42 },
          { text: 'Interface layer', at: 0.72, x: 6, y: 24 },
          { text: 'Your customer', at: 0.9, x: 6, y: 8 },
        ]}
      />

      <DeepDive
        id="chatbots"
        eyebrow="03 · Chatbots & voice"
        heading={
          <>
            Always on. <span className="accent-word">Always on-brand.</span>
          </>
        }
        body="An agent that knows your catalogue, your policies and your customer's history, and hands to a human at the moment it should."
        accent="--acc-chatbot"
        video="/assets/video/chatbot-conversation.mp4"
        poster="/assets/images/img-chatbot.jpg"
        layout="split"
        onProgress={driveTranscript}
      >
        <ChatTranscript ref={transcriptRef} lines={CHAT} />
      </DeepDive>

      <DeepDive
        id="crm"
        eyebrow="04 · CRM & revenue ops"
        heading={
          <>
            Every lead <span className="accent-word">accounted for.</span>
          </>
        }
        body="Deals move themselves through the pipeline. Reps stop retyping what the system already knows, and the forecast starts matching what actually closes."
        accent="--acc-crm"
        video="/assets/video/crm-pipeline.mp4"
        poster="/assets/images/img-crm.jpg"
        labels={[
          { text: 'Captured', at: 0.1, x: 6, y: 18 },
          { text: 'Qualified', at: 0.35, x: 32, y: 18 },
          { text: 'In play', at: 0.6, x: 58, y: 18 },
          { text: 'Closed', at: 0.85, x: 82, y: 18 },
        ]}
      >
        {/* TODO: real figures. Placeholders from the brief. */}
        <div className="stats shell">
          <div className="stats__item">
            <Counter className="stats__num" value={38} prefix="+" suffix="%" />
            <p className="stats__label mono">Qualified leads</p>
          </div>
          <div className="stats__item">
            <Counter className="stats__num" value={64} prefix="&minus;" suffix="%" />
            <p className="stats__label mono">Manual entry</p>
          </div>
          <div className="stats__item">
            <Counter className="stats__num" value={4.2} decimals={1} suffix="h" />
            <p className="stats__label mono">Saved / rep / week</p>
          </div>
        </div>
      </DeepDive>
    </>
  );
}
