import { Express, Request, Response } from "express";
import { z } from "zod";

// Schema for incoming order webhook from VIPO Agents
const orderWebhookSchema = z.object({
  orderId: z.string(),
  customerName: z.string(),
  customerPhone: z.string().optional(),
  customerEmail: z.string().email().optional(),
  productName: z.string(),
  productId: z.string(),
  amount: z.number(),
  agentId: z.string().optional(),
  agentName: z.string().optional(),
  referralCode: z.string().optional(),
  status: z.string(),
  createdAt: z.string().optional(),
});

// Schema for WhatsApp incoming message webhook
const whatsappWebhookSchema = z.object({
  from: z.string(),
  body: z.string(),
  messageId: z.string().optional(),
  timestamp: z.string().optional(),
});

export function registerWebhooksRoutes(app: Express) {
  
  // Webhook: New order from VIPO Agents → Create Lead in CRM
  app.post("/api/webhooks/vipo-order", async (req: Request, res: Response) => {
    try {
      const webhookSecret = req.headers["x-webhook-secret"];
      
      // Validate webhook secret (optional but recommended)
      if (req.env.webhookSecret && webhookSecret !== req.env.webhookSecret) {
        return res.status(401).json({ error: "Invalid webhook secret" });
      }

      const data = orderWebhookSchema.parse(req.body);
      
      // Find or create default business
      let business = await req.prisma.business.findFirst({
        where: { slug: "vipo-main" },
      });

      if (!business) {
        business = await req.prisma.business.create({
          data: {
            name: "VIPO Main",
            slug: "vipo-main",
            status: "active",
          },
        });
      }

      // Check if lead already exists by phone
      const existingLead = data.customerPhone 
        ? await req.prisma.lead.findFirst({
            where: {
              businessId: business.id,
              phone: data.customerPhone,
            },
          })
        : null;

      let lead;
      
      if (existingLead) {
        // Update existing lead with new order info
        lead = await req.prisma.lead.update({
          where: { id: existingLead.id },
          data: {
            notes: `${existingLead.notes || ""}\n\n[${new Date().toISOString()}] הזמנה חדשה: ${data.productName} - ₪${data.amount}`,
          },
        });
      } else {
        // Create new lead
        lead = await req.prisma.lead.create({
          data: {
            businessId: business.id,
            firstName: data.customerName.split(" ")[0],
            lastName: data.customerName.split(" ").slice(1).join(" ") || undefined,
            phone: data.customerPhone,
            phoneNormalized: data.customerPhone?.replace(/\D/g, ""),
            email: data.customerEmail,
            source: "VIPO_ORDER",
            status: "NEW",
            notes: `הזמנה: ${data.productName}\nסכום: ₪${data.amount}\nמזהה הזמנה: ${data.orderId}${data.agentName ? `\nסוכן: ${data.agentName}` : ""}`,
            tags: { orderId: data.orderId, productId: data.productId },
          },
        });
      }

      // Create conversation for the order
      const conversation = await req.prisma.conversation.create({
        data: {
          businessId: business.id,
          leadId: lead.id,
          channel: "SITE",
          status: "NEW",
          subject: `הזמנה חדשה: ${data.productName}`,
        },
      });

      // Add initial message to conversation
      await req.prisma.interaction.create({
        data: {
          businessId: business.id,
          conversationId: conversation.id,
          type: "SITE_MESSAGE",
          direction: "inbound",
          body: `לקוח חדש מ-VIPO:\n\nשם: ${data.customerName}\nטלפון: ${data.customerPhone || "לא צוין"}\nאימייל: ${data.customerEmail || "לא צוין"}\n\nמוצר: ${data.productName}\nסכום: ₪${data.amount}\n\nסטטוס הזמנה: ${data.status}`,
        },
      });

      // Create follow-up task
      const dueDate = new Date();
      dueDate.setHours(dueDate.getHours() + 2); // Follow up in 2 hours

      await req.prisma.task.create({
        data: {
          businessId: business.id,
          leadId: lead.id,
          conversationId: conversation.id,
          title: `התקשר ללקוח - ${data.customerName}`,
          description: `לקוח הזמין ${data.productName}. יש ליצור קשר לאישור ההזמנה.`,
          type: "CALL",
          status: "OPEN",
          dueAt: dueDate,
        },
      });

      // Create audit event
      await req.prisma.auditEvent.create({
        data: {
          businessId: business.id,
          entity: "Lead",
          entityId: lead.id,
          action: "WEBHOOK_CREATE",
          after: { source: "VIPO_ORDER", orderId: data.orderId } as any,
        },
      });

      console.log(`✅ Webhook processed: Lead ${lead.id} created/updated for order ${data.orderId}`);

      return res.status(200).json({
        success: true,
        leadId: lead.id,
        conversationId: conversation.id,
        isNew: !existingLead,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Webhook validation error:", error.errors);
        return res.status(400).json({ error: "Invalid webhook data", details: error.errors });
      }
      console.error("Webhook processing error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Webhook: WhatsApp incoming message
  app.post("/api/webhooks/whatsapp", async (req: Request, res: Response) => {
    try {
      const data = whatsappWebhookSchema.parse(req.body);
      
      // Find business
      const business = await req.prisma.business.findFirst({
        where: { slug: "vipo-main" },
      });

      if (!business) {
        return res.status(404).json({ error: "Business not found" });
      }

      // Normalize phone number
      const phoneNormalized = data.from.replace(/\D/g, "").replace(/^972/, "0");

      // Find lead by phone
      let lead = await req.prisma.lead.findFirst({
        where: {
          businessId: business.id,
          OR: [
            { phone: data.from },
            { phoneNormalized },
            { phone: phoneNormalized },
          ],
        },
      });

      // Create lead if not exists
      if (!lead) {
        lead = await req.prisma.lead.create({
          data: {
            businessId: business.id,
            phone: phoneNormalized,
            phoneNormalized,
            source: "WHATSAPP",
            status: "NEW",
            notes: "נוצר אוטומטית מהודעת וואטסאפ",
          },
        });
      }

      // Find or create conversation
      let conversation = await req.prisma.conversation.findFirst({
        where: {
          businessId: business.id,
          leadId: lead.id,
          channel: "WHATSAPP",
          status: { not: "CLOSED_WON" },
        },
        orderBy: { updatedAt: "desc" },
      });

      if (!conversation) {
        conversation = await req.prisma.conversation.create({
          data: {
            businessId: business.id,
            leadId: lead.id,
            channel: "WHATSAPP",
            status: "NEW",
            subject: `שיחת וואטסאפ - ${phoneNormalized}`,
          },
        });
      }

      // Add message to conversation
      await req.prisma.interaction.create({
        data: {
          businessId: business.id,
          conversationId: conversation.id,
          type: "WHATSAPP_NOTE",
          direction: "inbound",
          body: data.body,
          metadata: { 
            messageId: data.messageId, 
            from: data.from,
            timestamp: data.timestamp,
          },
        },
      });

      // Update conversation status if it was closed
      if (conversation.status === "CLOSED_WON" || conversation.status === "CLOSED_LOST") {
        await req.prisma.conversation.update({
          where: { id: conversation.id },
          data: { status: "IN_PROGRESS" },
        });
      }

      console.log(`✅ WhatsApp message received from ${data.from}`);

      return res.status(200).json({
        success: true,
        leadId: lead.id,
        conversationId: conversation.id,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid webhook data", details: error.errors });
      }
      console.error("WhatsApp webhook error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Health check for webhooks
  app.get("/api/webhooks/health", (_req: Request, res: Response) => {
    res.json({ 
      status: "ok", 
      webhooks: ["vipo-order", "whatsapp"],
      timestamp: new Date().toISOString(),
    });
  });
}
