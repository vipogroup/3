import { Express, Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";

const createLeadSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  source: z.string().optional(),
  notes: z.string().optional(),
  agentId: z.string().optional(),
});

const updateLeadSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  status: z.enum(["NEW", "CONTACTED", "QUALIFIED", "CONVERTED", "LOST"]).optional(),
  notes: z.string().optional(),
  ownerId: z.string().optional(),
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

export function registerLeadsRoutes(app: Express) {
  // List leads
  app.get(
    "/api/leads",
    authMiddleware,
    requireBusiness,
    async (req: Request, res: Response) => {
      try {
        const { status, search, page = "1", limit = "20" } = req.query;

        const where: any = {};
        
        if (req.user?.role !== "SUPER_ADMIN") {
          where.businessId = req.businessId;
        }

        if (status) {
          where.status = status;
        }

        if (search) {
          where.OR = [
            { name: { contains: search as string, mode: "insensitive" } },
            { email: { contains: search as string, mode: "insensitive" } },
            { phone: { contains: search as string } },
          ];
        }

        const skip = (Number(page) - 1) * Number(limit);

        const [leads, total] = await Promise.all([
          req.prisma.lead.findMany({
            where,
            include: {
              owner: { select: { id: true, name: true } },
              agent: { select: { id: true, name: true } },
              customer: { select: { id: true } },
            },
            orderBy: { createdAt: "desc" },
            skip,
            take: Number(limit),
          }),
          req.prisma.lead.count({ where }),
        ]);

        return res.json({
          data: leads,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit)),
          },
        });
      } catch (error) {
        console.error("List leads error:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  );

  // Create lead
  app.post(
    "/api/leads",
    authMiddleware,
    requireBusiness,
    async (req: Request, res: Response) => {
      try {
        const data = createLeadSchema.parse(req.body);

        const lead = await req.prisma.lead.create({
          data: {
            ...data,
            businessId: req.businessId!,
            ownerId: req.user!.id,
          },
          include: {
            owner: { select: { id: true, name: true } },
            agent: { select: { id: true, name: true } },
          },
        });

        // Create audit event
        await req.prisma.auditEvent.create({
          data: {
            businessId: req.businessId!,
            actorId: req.user!.id,
            entity: "Lead",
            entityId: lead.id,
            action: "CREATE",
          },
        });

        return res.status(201).json(lead);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({ error: error.errors });
        }
        console.error("Create lead error:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  );

  // Get single lead
  app.get(
    "/api/leads/:id",
    authMiddleware,
    requireBusiness,
    async (req: Request, res: Response) => {
      try {
        const { id } = req.params;

        const lead = await req.prisma.lead.findFirst({
          where: {
            id,
            ...(req.user?.role !== "SUPER_ADMIN" && { businessId: req.businessId }),
          },
          include: {
            owner: { select: { id: true, name: true, email: true } },
            agent: { select: { id: true, name: true } },
            customer: true,
            conversations: {
              orderBy: { updatedAt: "desc" },
              take: 5,
            },
            attributions: true,
          },
        });

        if (!lead) {
          return res.status(404).json({ error: "Lead not found" });
        }

        return res.json(lead);
      } catch (error) {
        console.error("Get lead error:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  );

  // Update lead
  app.patch(
    "/api/leads/:id",
    authMiddleware,
    requireBusiness,
    async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        const data = updateLeadSchema.parse(req.body);

        const existingLead = await req.prisma.lead.findFirst({
          where: {
            id,
            ...(req.user?.role !== "SUPER_ADMIN" && { businessId: req.businessId }),
          },
        });

        if (!existingLead) {
          return res.status(404).json({ error: "Lead not found" });
        }

        const lead = await req.prisma.lead.update({
          where: { id },
          data,
          include: {
            owner: { select: { id: true, name: true } },
            agent: { select: { id: true, name: true } },
          },
        });

        // Create audit event
        await req.prisma.auditEvent.create({
          data: {
            businessId: req.businessId!,
            actorId: req.user!.id,
            entity: "Lead",
            entityId: lead.id,
            action: "UPDATE",
            before: existingLead as any,
            after: lead as any,
          },
        });

        return res.json(lead);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({ error: error.errors });
        }
        console.error("Update lead error:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  );

  // Convert lead to customer
  app.post(
    "/api/leads/:id/convert",
    authMiddleware,
    requireBusiness,
    async (req: Request, res: Response) => {
      try {
        const { id } = req.params;

        const lead = await req.prisma.lead.findFirst({
          where: {
            id,
            ...(req.user?.role !== "SUPER_ADMIN" && { businessId: req.businessId }),
          },
        });

        if (!lead) {
          return res.status(404).json({ error: "Lead not found" });
        }

        if (lead.status === "CONVERTED") {
          return res.status(400).json({ error: "Lead already converted" });
        }

        // Create customer from lead
        const customer = await req.prisma.customer.create({
          data: {
            businessId: lead.businessId,
            leadId: lead.id,
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            ownerId: lead.ownerId,
          },
        });

        // Update lead status
        await req.prisma.lead.update({
          where: { id },
          data: { status: "CONVERTED" },
        });

        // Create audit event
        await req.prisma.auditEvent.create({
          data: {
            businessId: req.businessId!,
            actorId: req.user!.id,
            entity: "Lead",
            entityId: lead.id,
            action: "CONVERT",
            after: { customerId: customer.id } as any,
          },
        });

        return res.json({ lead, customer });
      } catch (error) {
        console.error("Convert lead error:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  );

  // Delete lead
  app.delete(
    "/api/leads/:id",
    authMiddleware,
    requireBusiness,
    async (req: Request, res: Response) => {
      try {
        const { id } = req.params;

        const lead = await req.prisma.lead.findFirst({
          where: {
            id,
            ...(req.user?.role !== "SUPER_ADMIN" && { businessId: req.businessId }),
          },
        });

        if (!lead) {
          return res.status(404).json({ error: "Lead not found" });
        }

        await req.prisma.lead.delete({ where: { id } });

        // Create audit event
        await req.prisma.auditEvent.create({
          data: {
            businessId: req.businessId!,
            actorId: req.user!.id,
            entity: "Lead",
            entityId: id,
            action: "DELETE",
            before: lead as any,
          },
        });

        return res.json({ success: true });
      } catch (error) {
        console.error("Delete lead error:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  );
}
