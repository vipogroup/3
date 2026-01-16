/**
 * WhatsApp Server with Baileys - שרת וואטסאפ אמיתי
 * 
 * הרצה: node whatsapp-server/baileys-server.js
 */

const express = require('express');
const cors = require('cors');
const { default: makeWASocket, useMultiFileAuthState: getMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const pino = require('pino');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.WHATSAPP_PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// State
let sock = null;
let qrCodeData = null;
let isReady = false;
let connectionInfo = null;
let messageHistory = [];

// Auth folder
const AUTH_FOLDER = path.join(__dirname, 'auth_info');

// Create auth folder if not exists
if (!fs.existsSync(AUTH_FOLDER)) {
  fs.mkdirSync(AUTH_FOLDER, { recursive: true });
}

// Initialize WhatsApp connection
async function startWhatsApp() {
  try {
    const { state, saveCreds } = await getMultiFileAuthState(AUTH_FOLDER);
    const { version } = await fetchLatestBaileysVersion();

    sock = makeWASocket({
      version,
      auth: state,
      printQRInTerminal: true,
      logger: pino({ level: 'silent' }),
    });

    // Connection update
    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        console.log('\n📱 סרוק את ה-QR הזה עם וואטסאפ:');
        qrcode.generate(qr, { small: true });
        
        // Save QR for API
        const QRCode = require('qrcode');
        qrCodeData = await QRCode.toDataURL(qr);
      }

      if (connection === 'close') {
        const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
        console.log('❌ נותק. סיבה:', lastDisconnect?.error?.message);
        
        if (shouldReconnect) {
          console.log('🔄 מנסה להתחבר מחדש...');
          setTimeout(startWhatsApp, 3000);
        } else {
          console.log('🚪 התנתקת מהחשבון. מחק את תיקיית auth_info וסרוק מחדש.');
          isReady = false;
          qrCodeData = null;
        }
      }

      if (connection === 'open') {
        console.log('\n✅ מחובר לוואטסאפ!');
        isReady = true;
        qrCodeData = null;
        connectionInfo = {
          phone: sock.user?.id?.split(':')[0] || '',
          name: sock.user?.name || 'WhatsApp Business',
        };
        console.log(`📞 מספר: ${connectionInfo.phone}`);
        console.log(`👤 שם: ${connectionInfo.name}`);
      }
    });

    // Save credentials
    sock.ev.on('creds.update', saveCreds);

    // Handle incoming messages
    sock.ev.on('messages.upsert', async ({ messages, type }) => {
      if (type !== 'notify') return;

      for (const msg of messages) {
        if (msg.key.fromMe) continue; // Skip our own messages

        const from = msg.key.remoteJid?.replace('@s.whatsapp.net', '') || '';
        const text = msg.message?.conversation || 
                     msg.message?.extendedTextMessage?.text || 
                     '[מדיה]';

        console.log(`📨 הודעה מ-${from}: ${text}`);

        const messageData = {
          id: msg.key.id,
          from: from,
          message: text,
          timestamp: new Date(msg.messageTimestamp * 1000).toISOString(),
          type: 'incoming',
        };

        messageHistory.unshift(messageData);
        if (messageHistory.length > 100) messageHistory.pop();

        // Webhook to main app
        try {
          await fetch('http://localhost:3001/api/crm/whatsapp/webhook', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(messageData),
          });
        } catch (e) {
          // Webhook failed, that's ok
        }
      }
    });

  } catch (error) {
    console.error('שגיאה בחיבור:', error);
    setTimeout(startWhatsApp, 5000);
  }
}

// API Routes

// Get status
app.get('/status', (req, res) => {
  res.json({
    ready: isReady,
    hasQR: !!qrCodeData,
    info: connectionInfo,
  });
});

// Get QR code
app.get('/qr', (req, res) => {
  if (isReady) {
    return res.json({ ready: true, message: 'Already connected' });
  }
  
  if (!qrCodeData) {
    return res.json({ ready: false, message: 'QR not ready yet...' });
  }
  
  res.json({ qr: qrCodeData });
});

// Send message
app.post('/send', async (req, res) => {
  try {
    if (!isReady || !sock) {
      return res.status(503).json({ error: 'WhatsApp not connected' });
    }

    const { to, message } = req.body;

    if (!to || !message) {
      return res.status(400).json({ error: 'Missing "to" or "message"' });
    }

    // Normalize phone number
    let phone = to.replace(/\D/g, '');
    if (phone.startsWith('0')) {
      phone = '972' + phone.substring(1);
    }
    
    const jid = phone + '@s.whatsapp.net';
    
    // Send message
    const result = await sock.sendMessage(jid, { text: message });
    
    console.log(`✉️ נשלח ל-${phone}: ${message.substring(0, 50)}...`);
    
    const messageData = {
      id: result.key.id,
      to: phone,
      message: message,
      timestamp: new Date().toISOString(),
      type: 'outgoing',
      status: 'sent',
    };

    messageHistory.unshift(messageData);

    res.json({
      success: true,
      messageId: result.key.id,
      to: phone,
    });
  } catch (error) {
    console.error('Send error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get message history
app.get('/messages', (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  res.json({
    messages: messageHistory.slice(0, limit),
    total: messageHistory.length,
  });
});

// Logout
app.post('/logout', async (req, res) => {
  try {
    if (sock) {
      await sock.logout();
    }
    isReady = false;
    connectionInfo = null;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║         🟢 WhatsApp Server (Baileys) - אמיתי!               ║
╠══════════════════════════════════════════════════════════════╣
║  Status: http://localhost:${PORT}/status                       ║
║  QR Code: http://localhost:${PORT}/qr                          ║
║  Send: POST http://localhost:${PORT}/send                      ║
║  Messages: http://localhost:${PORT}/messages                   ║
╚══════════════════════════════════════════════════════════════╝
  `);
  
  // Start WhatsApp
  startWhatsApp();
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 מכבה...');
  if (sock) {
    await sock.end();
  }
  process.exit(0);
});
