import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Lead from '@/models/Lead';
import Conversation from '@/models/Conversation';

export const dynamic = 'force-dynamic';

// Store messages in memory for display
let recentMessages = [];
// Idempotency - track processed message IDs
const processedMessageIds = new Set();

// Note: This function is used internally by this module
// Next.js routes can only export HTTP methods (GET, POST, etc.)
function getRecentMessages() {
  return recentMessages;
}

// SLA Configuration (in hours)
const SLA_FIRST_RESPONSE_HOURS = 2;

/**
 * Webhook שמקבל הודעות נכנסות משרת הוואטסאפ
 * ויוצר לידים אוטומטית
 * לא דורש אימות כי זה שרת פנימי
 */
export async function POST(request) {
  try {
    const messageData = await request.json();
    
    // Idempotency check - skip if already processed
    if (messageData.id && processedMessageIds.has(messageData.id)) {
      console.log('⏭️ Skipping duplicate message:', messageData.id);
      return NextResponse.json({ success: true, duplicate: true });
    }
    
    // Add to processed set (keep last 1000)
    if (messageData.id) {
      processedMessageIds.add(messageData.id);
      if (processedMessageIds.size > 1000) {
        const firstId = processedMessageIds.values().next().value;
        processedMessageIds.delete(firstId);
      }
    }
    
    // Save to memory for quick display
    recentMessages.unshift({
      ...messageData,
      receivedAt: new Date().toISOString()
    });
    if (recentMessages.length > 50) recentMessages.pop();
    
    console.log('📨 Webhook received:', messageData);
    
    await dbConnect();
    const { from, message, timestamp, id } = messageData;

    if (!from || !message) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }

    // נרמל מספר טלפון
    let phone = from.replace(/\D/g, '');
    if (phone.startsWith('972')) {
      phone = '0' + phone.substring(3);
    }

    console.log(`📨 הודעה נכנסת מ-${phone}: ${message}`);

    // חפש ליד קיים לפי מספר טלפון
    let lead = await Lead.findOne({ phone: phone });

    if (!lead) {
      // צור ליד חדש עם SLA deadline
      const slaDeadline = new Date(Date.now() + SLA_FIRST_RESPONSE_HOURS * 60 * 60 * 1000);
      
      lead = await Lead.create({
        name: `לקוח וואטסאפ - ${phone}`,
        phone: phone,
        source: 'whatsapp',
        status: 'new',
        notes: `הודעה ראשונה: ${message}`,
        tags: ['וואטסאפ', 'חדש'],
        lastContactAt: new Date(),
        slaDeadline,
        slaStatus: 'pending',
        priority: 'normal',
      });
      
      console.log(`✅ נוצר ליד חדש: ${lead._id} (SLA: ${slaDeadline.toISOString()})`);
    } else {
      // עדכן ליד קיים
      lead.lastContactAt = new Date();
      await lead.save();
      console.log(`📝 עודכן ליד קיים: ${lead._id}`);
    }

    // צור/עדכן שיחה
    let conversation = await Conversation.findOne({ 
      leadId: lead._id, 
      channel: 'whatsapp' 
    });

    if (!conversation) {
      conversation = await Conversation.create({
        leadId: lead._id,
        channel: 'whatsapp',
        status: 'open',
        messages: [],
      });
    }

    // הוסף הודעה לשיחה
    conversation.messages.push({
      direction: 'incoming',
      content: message,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      externalId: id,
    });
    conversation.lastMessageAt = new Date();
    conversation.status = 'open';
    await conversation.save();

    return NextResponse.json({
      success: true,
      leadId: lead._id,
      conversationId: conversation._id,
      isNewLead: !lead.updatedAt || lead.createdAt.getTime() === lead.updatedAt.getTime(),
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ 
      success: false,
      error: error.message 
    }, { status: 500 });
  }
}
