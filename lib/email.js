import sgMail from '@sendgrid/mail';

let initialized = false;

function initSendGrid() {
  if (!initialized) {
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      throw new Error('SENDGRID_API_KEY is not configured');
    }
    sgMail.setApiKey(apiKey);
    initialized = true;
  }
}

export async function sendEmail({ to, subject, html, text }) {
  if (!to) {
    throw new Error('EMAIL_MISSING_RECIPIENT');
  }

  initSendGrid();
  
  const from = process.env.EMAIL_FROM || 'vipo@vipo-group.com';

  try {
    const result = await sgMail.send({
      to,
      from,
      subject,
      html,
      text,
    });
    console.log('[EMAIL] Sent successfully via SendGrid');
    return result;
  } catch (error) {
    console.error('[EMAIL] SendGrid error:', error?.response?.body || error);
    throw new Error(error?.message || 'Failed to send email');
  }
}
