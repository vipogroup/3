import nodemailer from 'nodemailer';

let transporter = null;

function getTransporter() {
  if (!transporter) {
    const host = process.env.SMTP_HOST || process.env.SMTP_SERVER;
    const user = process.env.SMTP_USER || process.env.SMTP_USERNAME;
    const pass = process.env.SMTP_PASS || process.env.SMTP_PASSWORD;

    if (!host || !user || !pass) {
      throw new Error('SMTP configuration is missing (SMTP_HOST, SMTP_USER, SMTP_PASS)');
    }

    transporter = nodemailer.createTransport({
      host,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user,
        pass,
      },
    });
  }
  return transporter;
}

export async function sendEmail({ to, subject, html, text }) {
  if (!to) {
    throw new Error('EMAIL_MISSING_RECIPIENT');
  }

  const transport = getTransporter();
  const from = process.env.EMAIL_FROM || 'VIPO <no-reply@vipo-group.com>';

  try {
    const result = await transport.sendMail({
      from,
      to,
      subject,
      html,
      text,
    });
    console.log('[EMAIL] Sent successfully via SMTP to:', to);
    return result;
  } catch (error) {
    console.error('[EMAIL] SMTP error:', error?.message || error);
    throw new Error(error?.message || 'Failed to send email');
  }
}
