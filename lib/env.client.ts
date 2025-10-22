function reqPublic(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required public env: ${name}`);
  return v;
}

export const NEXT_PUBLIC_RECAPTCHA_SITE_KEY = reqPublic('NEXT_PUBLIC_RECAPTCHA_SITE_KEY');
// Add other NEXT_PUBLIC_* here