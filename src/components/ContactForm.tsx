import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Mail, Send } from 'lucide-react';
import { PORTFOLIO_PROFILE } from '../data/portfolio';

interface ContactFormProps {
  prefilledSubject?: string;
}

interface FormFields {
  name: string;
  email: string;
  subject: string;
  message: string;
}

type FieldErrors = Partial<Record<keyof FormFields, string>>;

interface ApiResponse {
  ok: boolean;
  code?: string;
  message?: string;
  recipient?: string;
  errors?: FieldErrors;
}

export function ContactForm({ prefilledSubject = '' }: ContactFormProps) {
  const [fields, setFields] = useState<FormFields>({
    name: '',
    email: '',
    subject: prefilledSubject,
    message: '',
  });

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error' | 'not_configured'>('idle');
  const [feedback, setFeedback] = useState<string>('');

  useEffect(() => {
    if (prefilledSubject) {
      setFields((prev) => ({ ...prev, subject: prefilledSubject }));
      setFieldErrors((prev) => ({ ...prev, subject: undefined }));
    }
  }, [prefilledSubject]);

  const validateClient = (data: FormFields): FieldErrors => {
    const errors: FieldErrors = {};
    if (data.name.trim().length < 2) {
      errors.name = 'Please enter your name (at least 2 characters).';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
      errors.email = 'Please enter a valid contact email address.';
    }
    if (data.subject.trim().length < 2) {
      errors.subject = 'Please enter a subject (at least 2 characters).';
    }
    if (data.message.trim().length < 10) {
      errors.message = 'Please enter a message (at least 10 characters).';
    }
    return errors;
  };

  const handleChange = (key: keyof FormFields, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
    if (fieldErrors[key]) {
      setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
    }
    if (status === 'error' || status === 'success' || status === 'not_configured') {
      setStatus('idle');
      setFeedback('');
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const localErrors = validateClient(fields);
    if (Object.keys(localErrors).length > 0) {
      setFieldErrors(localErrors);
      setStatus('error');
      setFeedback('Please complete all four required fields before sending.');
      return;
    }

    setStatus('submitting');
    setFeedback('');
    setFieldErrors({});

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: fields.name.trim(),
          email: fields.email.trim(),
          subject: fields.subject.trim(),
          message: fields.message.trim(),
        }),
      });

      const data = (await response.json()) as ApiResponse;

      if (response.ok && data.ok) {
        setStatus('success');
        setFeedback(
          data.message || `Your query has been delivered to ${PORTFOLIO_PROFILE.email}.`
        );
        setFields({ name: '', email: '', subject: '', message: '' });
        return;
      }

      if (data.errors) {
        setFieldErrors(data.errors);
      }

      if (data.code === 'EMAIL_NOT_CONFIGURED') {
        setStatus('not_configured');
        setFeedback(
          data.message ||
            'SMTP credentials are not configured in this environment yet. You can still send your pre-filled query directly via your email client.'
        );
        return;
      }

      setStatus('error');
      setFeedback(data.message || 'Unable to send your message right now. Please try again.');
    } catch {
      setStatus('error');
      setFeedback('Network error while contacting the Python backend. Please try again.');
    }
  };

  const mailtoHref = `mailto:${PORTFOLIO_PROFILE.email}?subject=${encodeURIComponent(
    fields.subject.trim() || 'Portfolio Inquiry'
  )}&body=${encodeURIComponent(
    `Name: ${fields.name.trim()}\nContact Email: ${fields.email.trim()}\n\n${fields.message.trim()}`
  )}`;

  const inputBaseClass =
    'w-full rounded-lg border bg-white px-3.5 py-2.5 text-[15px] text-[#111E24] placeholder:text-[#7B8E95] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B6B62] dark:bg-[#0C161B] dark:text-[#E8F0EE] dark:placeholder:text-[#688088] dark:focus-visible:outline-[#5FD0C3]';

  const getBorderClass = (hasError: boolean) =>
    hasError
      ? 'border-[#C23B2B] dark:border-[#F0786B]'
      : 'border-[#C9D7D3] hover:border-[#9EB4AE] dark:border-[#263E46] dark:hover:border-[#3A5A65]';

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border border-[#D4DFDC] bg-[#FFFFFF] p-6 sm:p-8 dark:border-[#243B43] dark:bg-[#112026]"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="contact-name"
            className="mb-1.5 block text-sm font-medium text-[#111E24] dark:text-[#E8F0EE]"
          >
            Your Name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={100}
            value={fields.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="e.g. Ananya Sharma"
            aria-invalid={Boolean(fieldErrors.name)}
            aria-describedby={fieldErrors.name ? 'contact-name-error' : undefined}
            className={`${inputBaseClass} ${getBorderClass(Boolean(fieldErrors.name))}`}
          />
          {fieldErrors.name && (
            <p
              id="contact-name-error"
              className="mt-1.5 text-xs font-medium text-[#C23B2B] dark:text-[#F0786B]"
            >
              {fieldErrors.name}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="contact-email"
            className="mb-1.5 block text-sm font-medium text-[#111E24] dark:text-[#E8F0EE]"
          >
            Contact Email Address
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={150}
            value={fields.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="you@example.com"
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? 'contact-email-error' : undefined}
            className={`${inputBaseClass} ${getBorderClass(Boolean(fieldErrors.email))}`}
          />
          {fieldErrors.email && (
            <p
              id="contact-email-error"
              className="mt-1.5 text-xs font-medium text-[#C23B2B] dark:text-[#F0786B]"
            >
              {fieldErrors.email}
            </p>
          )}
        </div>
      </div>

      <div className="mt-5">
        <label
          htmlFor="contact-subject"
          className="mb-1.5 block text-sm font-medium text-[#111E24] dark:text-[#E8F0EE]"
        >
          Subject
        </label>
        <input
          id="contact-subject"
          name="subject"
          type="text"
          required
          maxLength={150}
          value={fields.subject}
          onChange={(e) => handleChange('subject', e.target.value)}
          placeholder="Internship opportunity, project question, or collaboration"
          aria-invalid={Boolean(fieldErrors.subject)}
          aria-describedby={fieldErrors.subject ? 'contact-subject-error' : undefined}
          className={`${inputBaseClass} ${getBorderClass(Boolean(fieldErrors.subject))}`}
        />
        {fieldErrors.subject && (
          <p
            id="contact-subject-error"
            className="mt-1.5 text-xs font-medium text-[#C23B2B] dark:text-[#F0786B]"
          >
            {fieldErrors.subject}
          </p>
        )}
      </div>

      <div className="mt-5">
        <div className="mb-1.5 flex items-center justify-between">
          <label
            htmlFor="contact-message"
            className="block text-sm font-medium text-[#111E24] dark:text-[#E8F0EE]"
          >
            Message
          </label>
          <span className="font-mono-tabular text-xs text-[#4D626A] dark:text-[#9BB2BA]">
            {fields.message.length}/4000
          </span>
        </div>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          maxLength={4000}
          value={fields.message}
          onChange={(e) => handleChange('message', e.target.value)}
          placeholder="Write your query here..."
          aria-invalid={Boolean(fieldErrors.message)}
          aria-describedby={fieldErrors.message ? 'contact-message-error' : undefined}
          className={`${inputBaseClass} resize-y ${getBorderClass(Boolean(fieldErrors.message))}`}
        />
        {fieldErrors.message && (
          <p
            id="contact-message-error"
            className="mt-1.5 text-xs font-medium text-[#C23B2B] dark:text-[#F0786B]"
          >
            {fieldErrors.message}
          </p>
        )}
      </div>

      {status === 'success' && (
        <div
          role="status"
          className="mt-5 flex items-start gap-3 rounded-lg border border-[#0B6B62]/30 bg-[#0B6B62]/8 p-4 text-sm text-[#0B6B62] dark:border-[#5FD0C3]/35 dark:bg-[#5FD0C3]/10 dark:text-[#8BE2D7]"
        >
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{feedback}</p>
        </div>
      )}

      {status === 'error' && feedback && (
        <div
          role="alert"
          className="mt-5 flex items-start gap-3 rounded-lg border border-[#C23B2B]/35 bg-[#C23B2B]/8 p-4 text-sm text-[#A12C1E] dark:border-[#F0786B]/35 dark:bg-[#F0786B]/10 dark:text-[#F7A49B]"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{feedback}</p>
        </div>
      )}

      {status === 'not_configured' && (
        <div
          role="alert"
          className="mt-5 space-y-3 rounded-lg border border-[#B26A00]/35 bg-[#B26A00]/8 p-4 text-sm text-[#7A4900] dark:border-[#F0B459]/35 dark:bg-[#F0B459]/10 dark:text-[#F7CF8B]"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{feedback}</p>
          </div>
          <div>
            <a
              href={mailtoHref}
              className="inline-flex items-center gap-2 rounded-lg bg-[#111E24] px-3.5 py-2 text-xs font-medium text-white transition-colors hover:bg-[#1E313A] dark:bg-[#E8F0EE] dark:text-[#0C161B] dark:hover:bg-white"
            >
              <Mail className="h-3.5 w-3.5" />
              <span>Open Pre-filled Email to {PORTFOLIO_PROFILE.email}</span>
            </a>
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[#E6EEEC] pt-5 dark:border-[#1E333B]">
        <p className="text-xs text-[#4D626A] dark:text-[#9BB2BA]">
          Delivered directly to {PORTFOLIO_PROFILE.email}
        </p>
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-[#0B6B62] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#095951] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B6B62] disabled:cursor-not-allowed disabled:opacity-60 whitespace-nowrap shrink-0 dark:bg-[#5FD0C3] dark:text-[#0C161B] dark:hover:bg-[#4EC0B3] dark:focus-visible:outline-[#5FD0C3]"
        >
          <Send className="h-4 w-4" />
          <span>{status === 'submitting' ? 'Sending...' : 'Send Message'}</span>
        </button>
      </div>
    </form>
  );
}
