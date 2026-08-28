'use client';

import { useId, useState } from 'react';
import { SERVICES } from '@/lib/services';
import MagneticButton from './MagneticButton';

type Status = 'idle' | 'sending' | 'sent' | 'error';

interface Fields {
  name: string;
  email: string;
  company: string;
  message: string;
}

type Errors = Partial<Record<keyof Fields | 'services', string>>;

const ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT;

/**
 * Validation runs client-side and reports per field.
 *
 * The email test is deliberately loose. Strict RFC patterns reject valid
 * addresses (plus-addressing, new TLDs, unicode locals) and the only real
 * verification is sending mail, so this checks the shape and nothing more.
 */
function validate(fields: Fields, services: string[]): Errors {
  const errors: Errors = {};
  if (!fields.name.trim()) errors.name = 'Tell us who you are.';
  if (!fields.email.trim()) errors.email = 'We need somewhere to reply.';
  else if (!/^\S+@\S+\.\S+$/.test(fields.email.trim()))
    errors.email = 'That address looks incomplete.';
  if (!services.length) errors.services = 'Pick at least one thing to talk about.';
  if (fields.message.trim().length < 10)
    errors.message = 'A sentence or two about the problem helps.';
  return errors;
}

export default function ContactForm() {
  const id = useId();
  const [fields, setFields] = useState<Fields>({
    name: '',
    email: '',
    company: '',
    message: '',
  });
  const [services, setServices] = useState<string[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>('idle');

  const set = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFields((f) => ({ ...f, [key]: e.target.value }));
    // Clear the error as soon as the visitor starts fixing it, rather than
    // making them submit again to find out whether they got it right.
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  const toggleService = (name: string) => {
    setServices((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    );
    setErrors((prev) => (prev.services ? { ...prev, services: undefined } : prev));
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found = validate(fields, services);
    setErrors(found);
    if (Object.values(found).some(Boolean)) {
      // Move focus to the first problem so keyboard and screen reader users
      // are not left guessing what changed.
      const first = Object.keys(found).find((k) => found[k as keyof Errors]);
      document.getElementById(`${id}-${first}`)?.focus();
      return;
    }

    setStatus('sending');
    const payload = { ...fields, services, submittedAt: new Date().toISOString() };

    try {
      if (!ENDPOINT) {
        /* No endpoint configured. Rather than leaving the form dead, we
           acknowledge the submission and log the payload so the build can be
           demonstrated before the backend exists. Set
           NEXT_PUBLIC_FORM_ENDPOINT to post for real. */
        console.info('[BigBuilder] NEXT_PUBLIC_FORM_ENDPOINT unset. Payload:', payload);
        setStatus('sent');
        return;
      }

      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Request failed with ${res.status}`);
      setStatus('sent');
    } catch (err) {
      console.error('[BigBuilder] contact form failed', err);
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <div className="form form--sent" role="status">
        <p className="eyebrow">Received</p>
        <h3 className="form__thanks">We&rsquo;ll come back within one working day.</h3>
        <p>
          You will hear from a person who has read this, not an autoresponder.
          If it is urgent, say so in a reply and we will move.
        </p>
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => {
            setFields({ name: '', email: '', company: '', message: '' });
            setServices([]);
            setStatus('idle');
          }}
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <div className="form__row">
        <div className="field">
          <label className="mono" htmlFor={`${id}-name`}>
            Name
          </label>
          <input
            id={`${id}-name`}
            name="name"
            value={fields.name}
            onChange={set('name')}
            autoComplete="name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? `${id}-name-err` : undefined}
          />
          {errors.name && (
            <p className="field__error mono" id={`${id}-name-err`}>
              {errors.name}
            </p>
          )}
        </div>

        <div className="field">
          <label className="mono" htmlFor={`${id}-email`}>
            Work email
          </label>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            inputMode="email"
            value={fields.email}
            onChange={set('email')}
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? `${id}-email-err` : undefined}
          />
          {errors.email && (
            <p className="field__error mono" id={`${id}-email-err`}>
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className="field">
        <label className="mono" htmlFor={`${id}-company`}>
          Company <span className="field__optional">optional</span>
        </label>
        <input
          id={`${id}-company`}
          name="company"
          value={fields.company}
          onChange={set('company')}
          autoComplete="organization"
        />
      </div>

      <fieldset className="field" aria-describedby={errors.services ? `${id}-services-err` : undefined}>
        <legend className="mono">What should we talk about?</legend>
        <div className="chips" id={`${id}-services`} tabIndex={-1}>
          {SERVICES.map((service) => {
            const checked = services.includes(service.name);
            return (
              <label
                key={service.id}
                className={`chip${checked ? ' is-on' : ''}`}
                style={{ '--card-accent': `var(${service.accent})` } as React.CSSProperties}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={checked}
                  onChange={() => toggleService(service.name)}
                />
                {service.name}
              </label>
            );
          })}
        </div>
        {errors.services && (
          <p className="field__error mono" id={`${id}-services-err`}>
            {errors.services}
          </p>
        )}
      </fieldset>

      <div className="field">
        <label className="mono" htmlFor={`${id}-message`}>
          What are you trying to fix?
        </label>
        <textarea
          id={`${id}-message`}
          name="message"
          rows={4}
          value={fields.message}
          onChange={set('message')}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? `${id}-message-err` : undefined}
        />
        {errors.message && (
          <p className="field__error mono" id={`${id}-message-err`}>
            {errors.message}
          </p>
        )}
      </div>

      <div className="form__actions">
        <MagneticButton className="btn btn--primary" type="submit">
          {status === 'sending' ? 'Sending…' : 'Book a build call'}
        </MagneticButton>
        <p className="mono form__note">One working day. No sequence, no drip.</p>
      </div>

      {status === 'error' && (
        <p className="field__error mono" role="alert">
          That did not go through. Email us at hello@bigbuilder.example and we
          will pick it up from there.
        </p>
      )}
    </form>
  );
}
