// Email helper using Resend API (server-side)
// Sends emails via /api/send-email endpoint

export type EmailParams = Record<string, any> & {
  to_email: string;
  to_name?: string;
};

// Legacy function signature for backward compatibility
export async function sendEmail(params: EmailParams, templateId?: string): Promise<void> {
  // Map old EmailJS template IDs to new email types
  let emailType = 'contactForm';
  
  if (templateId === 'template_review_request' || templateId === process.env.NEXT_PUBLIC_EMAILJS_REMINDER_TEMPLATE_ID) {
    emailType = 'reviewRequest';
  }

  const response = await fetch('/api/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: emailType,
      data: {
        email: params.to_email,
        name: params.to_name || params.customer_name || '',
        ...params,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Email sending failed');
  }
}

// New helper function with better API
export async function sendEmailViaAPI(type: string, data: Record<string, any>): Promise<{ success: boolean; emailId?: string; error?: string }> {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, data }),
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, error: result.error };
    }

    return { success: true, emailId: result.data?.emailId };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}
