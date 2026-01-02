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

  const resend = getResendClient();
  const from = process.env.EMAIL_FROM || 'VIPO <onboarding@resend.dev>';

  try {
    const result = await resend.emails.send({
      from,
      to,
      subject,
      html,
      text,
    });
    console.log('[EMAIL] Sent successfully via Resend to:', to);
    return result;
  } catch (error) {
    console.error('[EMAIL] Resend error:', error?.message || error);
    throw new Error(error?.message || 'Failed to send email');
  }
}
