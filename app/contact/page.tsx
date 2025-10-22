// app/contact/page.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type Attachment = { filename: string; content: string | null }; // data:*/*;base64,...
type FormState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'success' }
  | { status: 'error'; message: string };

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';

function useRecaptcha(siteKey: string) {
  const loadedRef = useRef(false);

  useEffect(() => {
    if (!siteKey || typeof window === 'undefined') return;

    if ((window as any).grecaptcha?.execute) {
      loadedRef.current = true;
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>('script[data-recaptcha="1"]');
    if (existing) return;

    const s = document.createElement('script');
    s.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
    s.async = true;
    s.defer = true;
    s.dataset.recaptcha = '1';
    s.onload = () => { loadedRef.current = true; };
    document.head.appendChild(s);
  }, [siteKey]);

  const execute = async (action: string): Promise<string> => {
    if (!siteKey) throw new Error('Missing NEXT_PUBLIC_RECAPTCHA_SITE_KEY');
    // wait for grecaptcha.ready
    await new Promise<void>((resolve) => {
      const go = () => (window as any).grecaptcha.ready(() => resolve());
      if ((window as any).grecaptcha?.ready) go();
      else {
        let tries = 0;
        const id = setInterval(() => {
          tries++;
          if ((window as any).grecaptcha?.ready) { clearInterval(id); go(); }
          else if (tries > 40) { clearInterval(id); resolve(); }
        }, 100);
      }
    });
    const token = await (window as any).grecaptcha.execute(siteKey, { action });
    if (!token) throw new Error('Failed to obtain reCAPTCHA token');
    return token;
  };

  return { execute };
}

export default function ContactPage() {
  const [state, setState] = useState<FormState>({ status: 'idle' });
  const [fileName, setFileName] = useState<string>('');
  const [fileDataUrl, setFileDataUrl] = useState<string | null>(null);
  const recaptcha = useRecaptcha(SITE_KEY);

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const subjectRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const disabled = useMemo(() => state.status === 'submitting', [state.status]);

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.currentTarget.files?.[0];
    if (!f) { setFileName(''); setFileDataUrl(null); return; }
    setFileName(f.name);
    const reader = new FileReader();
    reader.onload = () => setFileDataUrl(reader.result as string);
    reader.onerror = () => setFileDataUrl(null);
    reader.readAsDataURL(f);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (disabled) return;

    const name = nameRef.current?.value.trim() || '';
    const email = emailRef.current?.value.trim() || '';
    const subject = subjectRef.current?.value.trim() || '';
    const message = messageRef.current?.value.trim() || '';

    if (!name || !email || !subject || !message) {
      setState({ status: 'error', message: 'Please fill in all fields.' });
      return;
    }
    if (!SITE_KEY) {
      setState({ status: 'error', message: 'reCAPTCHA is not configured.' });
      return;
    }

    try {
      setState({ status: 'submitting' });

      const token = await recaptcha.execute('contact');

      const attachment: Attachment | null = fileDataUrl
        ? { filename: fileName, content: fileDataUrl }
        : null;

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, name, email, subject, message, attachment }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to send message');

      setState({ status: 'success' });
      if (nameRef.current) nameRef.current.value = '';
      if (emailRef.current) emailRef.current.value = '';
      if (subjectRef.current) subjectRef.current.value = '';
      if (messageRef.current) messageRef.current.value = '';
      setFileName(''); setFileDataUrl(null);
    } catch (err: any) {
      setState({ status: 'error', message: err?.message || 'Something went wrong' });
    }
  }

  return (
    <section className="container py-10">
      <h1 className="h1 mb-4">Contact</h1>
      <p className="mb-6 muted">
        Send us a message. We’ll get back as soon as we can.
      </p>

      <form onSubmit={onSubmit} className="max-w-2xl space-y-4" noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="label">Name</label>
            <input id="name" ref={nameRef} type="text" autoComplete="name" required className="input" disabled={disabled} />
          </div>
          <div>
            <label htmlFor="email" className="label">Email</label>
            <input id="email" ref={emailRef} type="email" autoComplete="email" required className="input" disabled={disabled} />
          </div>
        </div>

        <div>
          <label htmlFor="subject" className="label">Subject</label>
          <input id="subject" ref={subjectRef} type="text" required className="input" disabled={disabled} />
        </div>

        <div>
          <label htmlFor="message" className="label">Message</label>
          <textarea id="message" ref={messageRef} required rows={6} className="textarea" disabled={disabled} />
        </div>

        <div>
          <label htmlFor="file" className="label">Attachment (optional)</label>
          <input id="file" type="file" onChange={onFileChange} className="block text-sm" disabled={disabled} />
          {fileName ? <p className="small mt-1">Selected: <span className="font-medium">{fileName}</span></p> : null}
        </div>

        <div className="pt-2 flex items-center gap-3">
          <button type="submit" className="btn btn-primary" disabled={disabled}>
            {state.status === 'submitting' ? 'Sending…' : 'Send message'}
          </button>
          {state.status === 'success' && (
            <span role="status" className="small text-green-400">Sent! We’ll reply soon.</span>
          )}
          {state.status === 'error' && (
            <span role="alert" className="small text-red-400">{state.message}</span>
          )}
        </div>

        <p className="small muted">
          This site is protected by reCAPTCHA and the Google{' '}
          <a className="link-underline" href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a> and{' '}
          <a className="link-underline" href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a> apply.
        </p>
      </form>
    </section>
  );
}