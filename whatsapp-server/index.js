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

// Store messages in memory for API access
let messageHistory = [];

client.on('message', async (msg) => {
  // Skip status messages and group messages
  if (msg.from === 'status@broadcast' || msg.from.includes('@g.us')) {
    return;
  }
  
  console.log(`📨 Message from ${msg.from}: ${msg.body}`);
  
  const messageData = {
    id: msg.id._serialized,
    from: msg.from.replace('@c.us', ''),
    to: clientInfo?.wid?.user || '',
    message: msg.body,
    timestamp: new Date(msg.timestamp * 1000).toISOString(),
    type: 'incoming',
    hasMedia: msg.hasMedia,
    status: 'received',
  };
  
  // Save to memory
  messageHistory.unshift(messageData);
  if (messageHistory.length > 100) messageHistory.pop();
  
  // Forward to VIPO webhook
  const WEBHOOK_URL = process.env.VIPO_WEBHOOK_URL || 'http://localhost:3001/api/crm/whatsapp/webhook';
  
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(messageData),
    });
    
    if (response.ok) {
      console.log(`✅ Message forwarded to VIPO webhook`);
    } else {
      console.error(`❌ Webhook error: ${response.status}`);
    }
  } catch (error) {
    console.error(`❌ Failed to forward to webhook:`, error.message);
  }
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

// Get QR code as JSON (for API)
app.get('/qr/json', (req, res) => {
  if (isReady) {
    return res.json({ ready: true, message: 'Already connected' });
  }
  
  if (!qrCodeData) {
    return res.json({ ready: false, message: 'QR not ready yet, please wait...' });
  }
  
  res.json({ qr: qrCodeData });
});

// Get QR code as HTML page
app.get('/qr', (req, res) => {
  const html = `
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>חיבור WhatsApp - VIPO</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .container {
      background: white;
      padding: 40px;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      text-align: center;
      max-width: 400px;
      width: 90%;
    }
    h1 {
      color: #1e3a8a;
      margin-bottom: 10px;
      font-size: 24px;
    }
    p {
      color: #666;
      margin-bottom: 20px;
    }
    .qr-container {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 15px;
      margin: 20px 0;
    }
    .qr-container img {
      max-width: 280px;
      width: 100%;
      height: auto;
    }
    .status {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 14px;
      margin-top: 15px;
    }
    .status.connected {
      background: #d1fae5;
      color: #065f46;
    }
    .status.waiting {
      background: #fef3c7;
      color: #92400e;
    }
    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      animation: pulse 1.5s infinite;
    }
    .connected .dot { background: #10b981; }
    .waiting .dot { background: #f59e0b; }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    .refresh-note {
      color: #999;
      font-size: 12px;
      margin-top: 20px;
    }
  </style>
  <script>
    setTimeout(() => location.reload(), 5000);
  </script>
</head>
<body>
  <div class="container">
    <h1>🔗 חיבור WhatsApp</h1>
    <p>סרוק את הקוד עם אפליקציית WhatsApp בטלפון</p>
    
    <div class="qr-container">
      ${isReady 
        ? '<p style="color: #10b981; font-size: 48px;">✅</p><p style="color: #065f46; font-weight: bold;">מחובר בהצלחה!</p>'
        : qrCodeData 
          ? '<img src="' + qrCodeData + '" alt="QR Code" />'
          : '<p style="color: #666;">ממתין ל-QR...</p><div class="dot waiting" style="margin: 20px auto;"></div>'
      }
    </div>
    
    <div class="status ${isReady ? 'connected' : 'waiting'}">
      <span class="dot"></span>
      ${isReady ? 'מחובר' : 'ממתין לסריקה'}
    </div>
    
    ${clientInfo ? '<p style="margin-top: 15px; color: #666;">מחובר כ: ' + clientInfo.pushname + '</p>' : ''}
    
    <p class="refresh-note">הדף מתעדכן אוטומטית כל 5 שניות</p>
  </div>
</body>
</html>
  `;
  
  res.type('html').send(html);
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

    // Handle different ID formats
    let chatId;
    
    // Check if it's already a LID format (from incoming messages)
    if (to.includes('@lid') || to.startsWith('lid@')) {
      // Use LID format directly
      const lidNumber = to.replace('lid@', '').replace('@lid', '');
      chatId = lidNumber + '@lid';
      console.log(`Using LID format: ${chatId}`);
    } else {
      // Normalize phone number
      let phone = to.replace(/\D/g, '');
      if (phone.startsWith('0')) {
        phone = '972' + phone.substring(1);
      }
      chatId = phone + '@c.us';
    }
    
    const phone = chatId.split('@')[0];
    
    // Try different approaches to send the message
    let result;
    let sent = false;
    
    try {
      // Method 1: Direct send (works for existing chats)
      result = await client.sendMessage(chatId, message);
      sent = true;
      console.log(`✉️ Message sent to ${phone} (direct method)`);
    } catch (directError) {
      console.log(`Direct send failed for ${phone}, trying alternative method...`);
      
      try {
        // Method 2: Check if number exists and create chat
        const contact = await client.getContactById(chatId).catch(() => null);
        
        if (contact) {
          const chat = await contact.getChat();
          result = await chat.sendMessage(message);
          sent = true;
          console.log(`✉️ Message sent to ${phone} (via contact)`);
        } else {
          // Method 3: Force send to new number
          const number = await client.getNumberId(phone).catch(() => null);
          
          if (number) {
            result = await client.sendMessage(number._serialized, message);
            sent = true;
            console.log(`✉️ Message sent to ${phone} (via number ID)`);
          } else {
            throw new Error(`Cannot send to ${phone} - number not found on WhatsApp`);
          }
        }
      } catch (altError) {
        console.error(`All send methods failed for ${phone}:`, altError.message);
        throw altError;
      }
    }
    
    if (!sent || !result) {
      throw new Error('Message sending failed');
    }
    
    // Store in message history
    messageHistory.push({
      id: result.id?._serialized || Date.now().toString(),
      from: clientInfo?.wid?.user || 'me',
      to: phone,
      message: message,
      timestamp: new Date().toISOString(),
      type: 'sent'
    });
    
    // Keep only last 100 messages
    if (messageHistory.length > 100) {
      messageHistory.shift();
    }
    
    res.json({
      success: true,
      messageId: result.id?._serialized || Date.now().toString(),
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

// Get messages history
app.get('/messages', (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  res.json({
    messages: messageHistory.slice(0, limit),
    total: messageHistory.length,
  });
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
