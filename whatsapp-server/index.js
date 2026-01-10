/**
 * WhatsApp Server - שרת וואטסאפ עצמאי
 * 
 * הרצה: node whatsapp-server/index.js
 * 
 * השרת הזה רץ בנפרד מהאפליקציה הראשית ומספק API לשליחת הודעות.
 */

const express = require('express');
const cors = require('cors');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.WHATSAPP_PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// State
let qrCodeData = null;
let isReady = false;
let clientInfo = null;

// Session folder
const SESSION_PATH = path.join(__dirname, '.wwebjs_auth');

// Create WhatsApp client
const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: SESSION_PATH,
  }),
  puppeteer: {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu',
    ],
  },
});

// Events
client.on('qr', async (qr) => {
  console.log('📱 QR Code received - scan with WhatsApp');
  qrCodeData = await qrcode.toDataURL(qr);
  isReady = false;
});

client.on('ready', () => {
  console.log('✅ WhatsApp client is ready!');
  isReady = true;
  qrCodeData = null;
  clientInfo = client.info;
  console.log(`📞 Connected as: ${clientInfo?.pushname} (${clientInfo?.wid?.user})`);
});

client.on('authenticated', () => {
  console.log('🔐 Authenticated successfully');
});

client.on('auth_failure', (msg) => {
  console.error('❌ Authentication failed:', msg);
  isReady = false;
});

client.on('disconnected', (reason) => {
  console.log('🔌 Disconnected:', reason);
  isReady = false;
  clientInfo = null;
  
  // Try to reconnect
  setTimeout(() => {
    console.log('🔄 Attempting to reconnect...');
    client.initialize();
  }, 5000);
});

client.on('message', async (msg) => {
  console.log(`📨 Message from ${msg.from}: ${msg.body}`);
  
  // TODO: Forward to main app webhook
  // You can add webhook logic here to notify your main app
});

// API Routes

// Get status
app.get('/status', (req, res) => {
  res.json({
    ready: isReady,
    hasQR: !!qrCodeData,
    info: clientInfo ? {
      name: clientInfo.pushname,
      phone: clientInfo.wid?.user,
    } : null,
  });
});

// Get QR code
app.get('/qr', (req, res) => {
  if (isReady) {
    return res.json({ ready: true, message: 'Already connected' });
  }
  
  if (!qrCodeData) {
    return res.json({ ready: false, message: 'QR not ready yet, please wait...' });
  }
  
  res.json({ qr: qrCodeData });
});

// Send message
app.post('/send', async (req, res) => {
  try {
    if (!isReady) {
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
    
    const chatId = phone + '@c.us';
    
    // Send message
    const result = await client.sendMessage(chatId, message);
    
    console.log(`✉️ Message sent to ${phone}`);
    
    res.json({
      success: true,
      messageId: result.id._serialized,
      to: phone,
    });
  } catch (error) {
    console.error('Send error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Logout
app.post('/logout', async (req, res) => {
  try {
    await client.logout();
    isReady = false;
    clientInfo = null;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Restart
app.post('/restart', async (req, res) => {
  try {
    await client.destroy();
    isReady = false;
    clientInfo = null;
    qrCodeData = null;
    
    setTimeout(() => {
      client.initialize();
    }, 2000);
    
    res.json({ success: true, message: 'Restarting...' });
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
╔════════════════════════════════════════════════════════════╗
║                    WhatsApp Server                          ║
╠════════════════════════════════════════════════════════════╣
║  Status: http://localhost:${PORT}/status                     ║
║  QR Code: http://localhost:${PORT}/qr                        ║
║  Send: POST http://localhost:${PORT}/send                    ║
╚════════════════════════════════════════════════════════════╝
  `);
  
  // Initialize WhatsApp client
  console.log('🚀 Initializing WhatsApp client...');
  client.initialize();
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down...');
  await client.destroy();
  process.exit(0);
});
