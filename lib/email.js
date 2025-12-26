import { Resend } from 'resend';

let resendClient = null;

function getResendClient() {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY is not configured');
    }
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

export async function sendEmail({ to, subject, html, text }) {
  if (!to) {
    throw new Error('EMAIL_MISSING_RECIPIENT');
  }

  const from = process.env.EMAIL_FROM || 'VIPO <onboarding@resend.dev>';
  const resend = getResendClient();

  const { data, error } = await resend.emails.send({
    from,
    to: [to],
    subject,
    html,
    text,
  });

  if (error) {
    console.error('[EMAIL] Resend error:', error);
    throw new Error(error.message || 'Failed to send email');
  }

  console.log('[EMAIL] Sent successfully:', data?.id);
  return data;
}
