import { Express, Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { whatsappService } from "./whatsapp.service";

const sendMessageSchema = z.object({
  to: z.string().min(9),
  body: z.string().min(1),
  leadId: z.string().optional(),
  conversationId: z.string().optional(),
});

const sendTemplateSchema = z.object({
  to: z.string().min(9),
  templateName: z.string(),
  variables: z.record(z.string()).optional(),
  leadId: z.string().optional(),
});

function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, req.env.jwtSecret) as {
      id: string;
      role: string;
      businessId?: string;
    };
    req.user = decoded;
    req.businessId = decoded.businessId;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

export function registerWhatsAppRoutes(app: Express) {
  // Check WhatsApp service status
  app.get("/api/whatsapp/status", authMiddleware, (_req: Request, res: Response) => {
    res.json({
      configured: whatsappService.isConfigured(),
      provider: "twilio",
    });
  });

  // Send WhatsApp message
  app.post(
    "/api/whatsapp/send",
    authMiddleware,
    async (req: Request, res: Response) => {
      try {
        const data = sendMessageSchema.parse(req.body);

        if (!whatsappService.isConfigured()) {
          return res.status(503).json({ 
            error: "WhatsApp service not configured",
            hint: "Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_WHATSAPP_FROM in .env"
          });
        }

        // Send the message
        const result = await whatsappService.sendMessage({
          to: data.to,
          body: data.body,
        });

        if (!result.success) {
          return res.status(500).json({ error: result.error });
        }

        // Log the interaction if conversationId provided
        if (data.conversationId && req.businessId) {
          await req.prisma.interaction.create({
            data: {
              businessId: req.businessId,
              conversationId: data.conversationId,
              type: "WHATSAPP_NOTE",
              direction: "outbound",
              body: data.body,
              createdById: req.user?.id,
              metadata: { messageId: result.messageId, to: data.to },
            },
          });
        }

        // Create audit event
        if (req.businessId) {
          await req.prisma.auditEvent.create({
            data: {
              businessId: req.businessId,
              actorId: req.user?.id,
              entity: "WhatsApp",
              entityId: result.messageId || "unknown",
              action: "SEND_MESSAGE",
              after: { to: data.to, leadId: data.leadId } as any,
            },
          });
        }

        return res.json({
          success: true,
          messageId: result.messageId,
        });
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({ error: error.errors });
        }
        console.error("WhatsApp send error:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  );

  // Send template message
  app.post(
    "/api/whatsapp/send-template",
    authMiddleware,
    async (req: Request, res: Response) => {
      try {
        const data = sendTemplateSchema.parse(req.body);

        if (!whatsappService.isConfigured()) {
          return res.status(503).json({ error: "WhatsApp service not configured" });
        }

        const result = await whatsappService.sendTemplateMessage(
          data.to,
          data.templateName,
          data.variables || {}
        );

        if (!result.success) {
          return res.status(500).json({ error: result.error });
        }

        return res.json({
          success: true,
          messageId: result.messageId,
        });
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({ error: error.errors });
        }
        console.error("WhatsApp template send error:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  );

  // Quick actions - Send follow-up to lead
  app.post(
    "/api/leads/:leadId/whatsapp",
    authMiddleware,
    async (req: Request, res: Response) => {
      try {
        const { leadId } = req.params;
        const { message, templateName } = req.body;

        // Get lead
        const lead = await req.prisma.lead.findFirst({
          where: { id: leadId },
        });

        if (!lead) {
          return res.status(404).json({ error: "Lead not found" });
        }

        if (!lead.phone) {
          return res.status(400).json({ error: "Lead has no phone number" });
        }

        if (!whatsappService.isConfigured()) {
          return res.status(503).json({ error: "WhatsApp service not configured" });
        }

        let result;
        if (templateName) {
          result = await whatsappService.sendTemplateMessage(
            lead.phone,
            templateName,
            { customerName: lead.firstName || "לקוח/ה" }
          );
        } else {
          result = await whatsappService.sendMessage({
            to: lead.phone,
            body: message || "שלום! איך נוכל לעזור?",
          });
        }

        if (!result.success) {
          return res.status(500).json({ error: result.error });
        }

        // Find or create conversation
        let conversation = await req.prisma.conversation.findFirst({
          where: {
            businessId: lead.businessId,
            leadId: lead.id,
            channel: "WHATSAPP",
          },
          orderBy: { updatedAt: "desc" },
        });

        if (!conversation) {
          conversation = await req.prisma.conversation.create({
            data: {
              businessId: lead.businessId,
              leadId: lead.id,
              channel: "WHATSAPP",
              status: "IN_PROGRESS",
              subject: `שיחת וואטסאפ - ${lead.firstName || lead.phone}`,
              ownerId: req.user?.id,
            },
          });
        }

        // Log the message
        await req.prisma.interaction.create({
          data: {
            businessId: lead.businessId,
            conversationId: conversation.id,
            type: "WHATSAPP_NOTE",
            direction: "outbound",
            body: message || `[תבנית: ${templateName}]`,
            createdById: req.user?.id,
            metadata: { messageId: result.messageId },
          },
        });

        return res.json({
          success: true,
          messageId: result.messageId,
          conversationId: conversation.id,
        });
      } catch (error) {
        console.error("Lead WhatsApp error:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  );
}
