'use client';

import { forwardRef, useImperativeHandle, useRef } from 'react';

export interface ChatTranscriptHandle {
  setProgress: (progress: number) => void;
}

export interface ChatLine {
  from: 'them' | 'bot';
  text: string;
}

/**
 * A conversation that types itself out as the beat is scrubbed.
 *
 * Every update is a direct textContent write on a stored ref. Routing this
 * through React state would re-render the whole transcript on every scroll
 * frame; here the component renders once and scroll only mutates text.
 *
 * The full text is present in the DOM from the start inside a visually hidden
 * copy, so a screen reader reads the conversation as prose rather than
 * announcing a string that mutates character by character.
 */
const ChatTranscript = forwardRef<ChatTranscriptHandle, { lines: ChatLine[] }>(
  function ChatTranscript({ lines }, ref) {
    const bubbleRefs = useRef<(HTMLLIElement | null)[]>([]);
    const textRefs = useRef<(HTMLSpanElement | null)[]>([]);

    useImperativeHandle(ref, () => ({
      setProgress: (progress: number) => {
        // Each line gets an equal slice of the beat's scroll range.
        const per = 1 / lines.length;
        lines.forEach((line, i) => {
          const local = (progress - i * per) / per;
          const bubble = bubbleRefs.current[i];
          const text = textRefs.current[i];
          if (!bubble || !text) return;

          if (local <= 0) {
            if (bubble.dataset.state !== 'hidden') {
              bubble.dataset.state = 'hidden';
              bubble.classList.remove('is-in');
              text.textContent = '';
            }
            return;
          }

          if (bubble.dataset.state !== 'in') {
            bubble.dataset.state = 'in';
            bubble.classList.add('is-in');
          }

          const chars = Math.round(Math.min(local, 1) * line.text.length);
          const next = line.text.slice(0, chars);
          if (text.textContent !== next) text.textContent = next;
        });
      },
    }));

    return (
      <div className="chat">
        <ul className="chat__list" aria-hidden="true">
          {lines.map((line, i) => (
            <li
              key={line.text}
              ref={(el) => {
                bubbleRefs.current[i] = el;
              }}
              className={`chat__bubble chat__bubble--${line.from}`}
            >
              <span
                ref={(el) => {
                  textRefs.current[i] = el;
                }}
              />
            </li>
          ))}
        </ul>

        {/* The same conversation, static, for assistive tech. */}
        <div className="sr-only">
          {lines.map((line) => (
            <p key={line.text}>
              {line.from === 'bot' ? 'Agent: ' : 'Customer: '}
              {line.text}
            </p>
          ))}
        </div>
      </div>
    );
  }
);

export default ChatTranscript;
