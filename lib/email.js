import nodemailer from 'nodemailer';

let cachedTransporter = null;
let cachedConfigSignature = '';
let cachedTestAccount = null;

function buildConfigFromEnv() {
  const host = process.env.SMTP_HOST || process.env.SMTP_SERVER;
  const port = Number(process.env.SMTP_PORT || '0') || 587;
  const user = process.env.SMTP_USER || process.env.SMTP_USERNAME;
  const pass = process.env.SMTP_PASS || process.env.SMTP_PASSWORD;
  const secureEnv = process.env.SMTP_SECURE || '';
  const secure = secureEnv === 'true' || secureEnv === '1' || port === 465;
  const from = process.env.EMAIL_FROM || user;

  if (!host || !user || !pass || !from) {
    return null;
  }

  return {
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
    from,
    signature: JSON.stringify({ host, port, secure, user }),
  };
}

async function getTransporter() {
  const envConfig = buildConfigFromEnv();

  if (envConfig) {
    if (!cachedTransporter || cachedConfigSignature !== envConfig.signature) {
      cachedTransporter = nodemailer.createTransport({
        host: envConfig.host,
        port: envConfig.port,
        secure: envConfig.secure,
        auth: envConfig.auth,
      });
      cachedConfigSignature = envConfig.signature;
    }

    return { transporter: cachedTransporter, from: envConfig.from, isTest: false };
  }

  if (!cachedTestAccount) {
    cachedTestAccount = await nodemailer.createTestAccount();
  }

  const signature = `test-${cachedTestAccount.user}`;
  if (!cachedTransporter || cachedConfigSignature !== signature) {
    cachedTransporter = nodemailer.createTransport({
      host: cachedTestAccount.smtp.host,
      port: cachedTestAccount.smtp.port,
      secure: cachedTestAccount.smtp.secure,
      auth: {
        user: cachedTestAccount.user,
        pass: cachedTestAccount.pass,
      },
    });
    cachedConfigSignature = signature;
  }

  return {
    transporter: cachedTransporter,
    from: `VIPO <${cachedTestAccount.user}>`,
    isTest: true,
    testAccount: cachedTestAccount,
  };
}

export async function sendEmail({ to, subject, html, text }) {
  if (!to) {
    throw new Error('EMAIL_MISSING_RECIPIENT');
  }

  const { transporter, from, isTest, testAccount } = await getTransporter();

  const info = await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
  });

  if (isTest) {
    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log('[EMAIL_TEST] נשלח מייל בדיקת Ethereal', {
      user: testAccount.user,
      pass: testAccount.pass,
      previewUrl,
    });
  }

  return info;
}
