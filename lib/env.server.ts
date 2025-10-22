import 'server-only';

function req(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env: ${name}`);
  return v;
}

export const RECAPTCHA_SECRET_KEY = req('RECAPTCHA_SECRET_KEY');
// Add other server-only secrets here (e.g., FIREBASE_PRIVATE_KEY, etc.)