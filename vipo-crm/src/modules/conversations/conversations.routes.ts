import { Express, Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";

const createConversationSchema = z.object({
  channel: z.enum(["SITE", "WHATSAPP", "PHONE", "INTERNAL"]),
  leadId: z.string().optional(),
  customerId: z.string().optional(),
  subject: z.string().optional(),
});

const createInteractionSchema = z.object({
  type: z.enum(["SITE_MESSAGE", "WHATSAPP_NOTE", "CALL_NOTE", "INTERNAL_NOTE", "SYSTEM_EVENT"]),
  content: z.string().min(1),
  metadata: z.record(z.any()).optional(),
});

const updateConversationSchema = z.object({
  status: z.enum(["NEW", "IN_PROGRESS", "WAITING_CUSTOMER", "FOLLOW_UP", "CLOSED_WON", "CLOSED_LOST"]).optional(),
  ownerId: z.string().nullable().optional(),
  subject: z.string().optional(),
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

function requireBusiness(req: Request, res: Response, next: NextFunction) {
  if (!req.businessId && req.user?.role !== "SUPER_ADMIN") {
    return res.status(403).json({ error: "Business context required" });
  }
  next();
}

export function registerConversationsRoutes(app: Express) {
  // Unified Inbox - List conversations
  app.get(
    "/api/inbox",
    authMiddleware,
    requireBusiness,
    async (req: Request, res: Response) => {
      try {
        const { 
          status, 
          channel, 
          ownerId,
          unassigned,
          page = "1", 
          limit = "20" 
        } = req.query;

        const where: any = {};
        
        if (req.user?.role !== "SUPER_ADMIN") {
          where.businessId = req.businessId;
        }

        if (status) where.status = status;
        if (channel) where.channel = channel;
        if (ownerId) where.ownerId = ownerId;
        if (unassigned === "true") where.ownerId = null;

        const skip = (Number(page) - 1) * Number(limit);

        const [conversations, total, statusCounts] = await Promise.all([
          req.prisma.conversation.findMany({
            where,
            include: {
              lead: { select: { id: true, name: true, phone: true, email: true } },
              customer: { select: { id: true, name: true, phone: true, email: true } },
              owner: { select: { id: true, name: true } },
              interactions: {
                orderBy: { createdAt: "desc" },
                take: 1,
              },
            },
            orderBy: { updatedAt: "desc" },
            skip,
            take: Number(limit),
          }),
          req.prisma.conversation.count({ where }),
          req.prisma.conversation.groupBy({
            by: ["status"],
            where: req.user?.role !== "SUPER_ADMIN" ? { businessId: req.businessId } : {},
            _count: true,
          }),
        ]);

        return res.json({
          data: conversations,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit)),
          },
          statusCounts: statusCounts.reduce((acc, item) => {
            acc[item.status] = item._count;
            return acc;
          }, {} as Record<string, number>),
        });
      } catch (error) {
        console.error("List inbox error:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  );

  // Create conversation
  app.post(
    "/api/conversations",
    authMiddleware,
    requireBusiness,
    async (req: Request, res: Response) => {
      try {
        const data = createConversationSchema.parse(req.body);

        if (!data.leadId && !data.customerId) {
          return res.status(400).json({ error: "Either leadId or customerId is required" });
        }

        const conversation = await req.prisma.conversation.create({
          data: {
            ...data,
            businessId: req.businessId!,
            ownerId: req.user!.id,
            status: "NEW",
          },
          include: {
            lead: { select: { id: true, name: true } },
            customer: { select: { id: true, name: true } },
            owner: { select: { id: true, name: true } },
          },
        });

        return res.status(201).json(conversation);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({ error: error.errors });
        }
        console.error("Create conversation error:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  );

  // Get single conversation with interactions
  app.get(
    "/api/conversations/:id",
    authMiddleware,
    requireBusiness,
    async (req: Request, res: Response) => {
      try {
        const { id } = req.params;

        const conversation = await req.prisma.conversation.findFirst({
          where: {
            id,
            ...(req.user?.role !== "SUPER_ADMIN" && { businessId: req.businessId }),
          },
          include: {
            lead: { select: { id: true, name: true, phone: true, email: true, status: true } },
            customer: { select: { id: true, name: true, phone: true, email: true } },
            owner: { select: { id: true, name: true, email: true } },
            agent: { select: { id: true, name: true } },
            interactions: {
              orderBy: { createdAt: "asc" },
              include: {
                createdBy: { select: { id: true, name: true } },
              },
            },
          },
        });

        if (!conversation) {
          return res.status(404).json({ error: "Conversation not found" });
        }

        return res.json(conversation);
      } catch (error) {
        console.error("Get conversation error:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  );

  // Update conversation (status, owner, etc.)
  app.patch(
    "/api/conversations/:id",
    authMiddleware,
    requireBusiness,
    async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        const data = updateConversationSchema.parse(req.body);

        const existing = await req.prisma.conversation.findFirst({
          where: {
            id,
            ...(req.user?.role !== "SUPER_ADMIN" && { businessId: req.businessId }),
          },
        });

        if (!existing) {
          return res.status(404).json({ error: "Conversation not found" });
        }

        const conversation = await req.prisma.conversation.update({
          where: { id },
          data,
          include: {
            lead: { select: { id: true, name: true } },
            customer: { select: { id: true, name: true } },
            owner: { select: { id: true, name: true } },
          },
        });

        return res.json(conversation);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({ error: error.errors });
        }
        console.error("Update conversation error:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  );

  // Add interaction to conversation
  app.post(
    "/api/conversations/:id/interactions",
    authMiddleware,
    requireBusiness,
    async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        const data = createInteractionSchema.parse(req.body);

        const conversation = await req.prisma.conversation.findFirst({
          where: {
            id,
            ...(req.user?.role !== "SUPER_ADMIN" && { businessId: req.businessId }),
          },
        });

        if (!conversation) {
          return res.status(404).json({ error: "Conversation not found" });
        }

        const interaction = await req.prisma.interaction.create({
          data: {
            ...data,
            conversationId: id,
            businessId: req.businessId!,
            createdById: req.user!.id,
          },
          include: {
            createdBy: { select: { id: true, name: true } },
          },
        });

        // Update conversation status if it's NEW
        if (conversation.status === "NEW") {
          await req.prisma.conversation.update({
            where: { id },
            data: { status: "IN_PROGRESS" },
          });
        }

        // Update conversation updatedAt
        await req.prisma.conversation.update({
          where: { id },
          data: { updatedAt: new Date() },
        });

        return res.status(201).json(interaction);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({ error: error.errors });
        }
        console.error("Create interaction error:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  );

  // Assign conversation to user
  app.post(
    "/api/conversations/:id/assign",
    authMiddleware,
    requireBusiness,
    async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        const { userId } = req.body;

        const conversation = await req.prisma.conversation.findFirst({
          where: {
            id,
            ...(req.user?.role !== "SUPER_ADMIN" && { businessId: req.businessId }),
          },
        });

        if (!conversation) {
          return res.status(404).json({ error: "Conversation not found" });
        }

        const updated = await req.prisma.conversation.update({
          where: { id },
          data: { ownerId: userId || req.user!.id },
          include: {
            owner: { select: { id: true, name: true } },
          },
        });

        return res.json(updated);
      } catch (error) {
        console.error("Assign conversation error:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  );
}
