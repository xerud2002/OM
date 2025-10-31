// Centralized EmailJS helper
// Uses dynamic import to avoid server-side bundling where not needed

export type EmailParams = Record<string, any> & {
  to_email: string;
  to_name?: string;
};

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const DEFAULT_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

function assertEnv() {
  if (!SERVICE_ID || !PUBLIC_KEY) {
    throw new Error("EmailJS environment variables are missing: SERVICE_ID or PUBLIC_KEY");
  }
}

export async function sendEmail(params: EmailParams, templateId?: string): Promise<void> {
  assertEnv();
  const emailjs = (await import("emailjs-com")).default;
  await emailjs.send(
    SERVICE_ID!,
    templateId || DEFAULT_TEMPLATE_ID!,
    params,
    PUBLIC_KEY!
  );
}
