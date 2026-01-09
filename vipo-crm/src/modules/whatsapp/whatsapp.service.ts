/**
 * WhatsApp Business Integration Service
 * Uses Twilio WhatsApp API for sending messages
 */

interface WhatsAppConfig {
  accountSid: string;
  authToken: string;
  fromNumber: string;
}

interface SendMessageParams {
  to: string;
  body: string;
  mediaUrl?: string;
}

interface SendMessageResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

class WhatsAppService {
  private config: WhatsAppConfig | null = null;
  private baseUrl = 'https://api.twilio.com/2010-04-01';

  constructor() {
    this.loadConfig();
  }

  private loadConfig() {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_WHATSAPP_FROM;

    if (accountSid && authToken && fromNumber) {
      this.config = { accountSid, authToken, fromNumber };
      console.log('✅ WhatsApp service configured with Twilio');
    } else {
      console.warn('⚠️ WhatsApp service not configured - missing Twilio credentials');
    }
  }

  isConfigured(): boolean {
    return this.config !== null;
  }

  /**
   * Format phone number for WhatsApp
   * Converts Israeli format (05X) to international format (+972)
   */
  private formatPhoneNumber(phone: string): string {
    let cleaned = phone.replace(/\D/g, '');
    
    // Israeli number starting with 0
    if (cleaned.startsWith('0') && cleaned.length === 10) {
      cleaned = '972' + cleaned.substring(1);
    }
    
    // Add + prefix if not present
    if (!cleaned.startsWith('+')) {
      cleaned = '+' + cleaned;
    }
    
    return `whatsapp:${cleaned}`;
  }

  /**
   * Send WhatsApp message via Twilio
   */
  async sendMessage(params: SendMessageParams): Promise<SendMessageResult> {
    if (!this.config) {
      return { success: false, error: 'WhatsApp service not configured' };
    }

    try {
      const { accountSid, authToken, fromNumber } = this.config;
      const toFormatted = this.formatPhoneNumber(params.to);

      const url = `${this.baseUrl}/Accounts/${accountSid}/Messages.json`;
      
      const formData = new URLSearchParams();
      formData.append('To', toFormatted);
      formData.append('From', fromNumber);
      formData.append('Body', params.body);
      
      if (params.mediaUrl) {
        formData.append('MediaUrl', params.mediaUrl);
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('WhatsApp send failed:', result);
        return { 
          success: false, 
          error: result.message || `HTTP ${response.status}` 
        };
      }

      console.log(`✅ WhatsApp message sent to ${params.to}, SID: ${result.sid}`);
      return { success: true, messageId: result.sid };
    } catch (error) {
      console.error('WhatsApp send error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Send template message (for first contact with customer)
   */
  async sendTemplateMessage(to: string, templateName: string, variables: Record<string, string>): Promise<SendMessageResult> {
    // For now, we'll send a regular message
    // Twilio templates require pre-approval from WhatsApp
    const body = this.buildTemplateBody(templateName, variables);
    return this.sendMessage({ to, body });
  }

  private buildTemplateBody(templateName: string, variables: Record<string, string>): string {
    const templates: Record<string, string> = {
      'order_confirmation': `שלום ${variables.customerName}! 🎉\n\nתודה על הזמנתך מ-VIPO.\nמספר הזמנה: ${variables.orderId}\nסכום: ₪${variables.amount}\n\nנציג יצור איתך קשר בהקדם.`,
      'follow_up': `שלום ${variables.customerName},\n\nרצינו לוודא שהכל בסדר עם ההזמנה שלך.\nיש לך שאלות? אנחנו כאן לעזור! 😊`,
      'welcome': `שלום ${variables.customerName}! 👋\n\nברוכים הבאים ל-VIPO!\nאנחנו שמחים שבחרת בנו.\n\nאיך נוכל לעזור?`,
    };

    return templates[templateName] || variables.message || 'שלום! איך נוכל לעזור?';
  }
}

export const whatsappService = new WhatsAppService();
