import { Express, Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import crypto from "crypto";

const createAgentSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  commissionRate: z.number().min(0).max(100).default(10),
});

const updateAgentSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  commissionRate: z.number().min(0).max(100).optional(),
  isActive: z.boolean().optional(),
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

function generateUniqueCode(): string {
  return crypto.randomBytes(4).toString("hex").toUpperCase();
}

export function registerAgentsRoutes(app: Express) {
  // List agents
  app.get(
    "/api/agents",
    authMiddleware,
    requireBusiness,
    async (req: Request, res: Response) => {
      try {
        const { active, page = "1", limit = "20" } = req.query;

        const where: any = {};
        
        if (req.user?.role !== "SUPER_ADMIN") {
          where.businessId = req.businessId;
        }

        if (active !== undefined) {
          where.isActive = active === "true";
        }

        const skip = (Number(page) - 1) * Number(limit);

        const [agents, total] = await Promise.all([
          req.prisma.agent.findMany({
            where,
            include: {
              _count: {
                select: {
                  leads: true,
                  attributions: true,
                },
              },
            },
            orderBy: { createdAt: "desc" },
            skip,
            take: Number(limit),
          }),
          req.prisma.agent.count({ where }),
        ]);

        return res.json({
          data: agents,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit)),
          },
        });
      } catch (error) {
        console.error("List agents error:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  );

  // Create agent
  app.post(
    "/api/agents",
    authMiddleware,
    requireBusiness,
    async (req: Request, res: Response) => {
      try {
        const data = createAgentSchema.parse(req.body);

        // Generate unique link code and coupon code
        const linkCode = generateUniqueCode();
        const couponCode = `AG${generateUniqueCode()}`;

        const agent = await req.prisma.agent.create({
          data: {
            ...data,
            businessId: req.businessId!,
            linkCode,
            couponCode,
          },
        });

        return res.status(201).json(agent);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({ error: error.errors });
        }
        console.error("Create agent error:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  );

  // Get single agent with stats
  app.get(
    "/api/agents/:id",
    authMiddleware,
    requireBusiness,
    async (req: Request, res: Response) => {
      try {
        const { id } = req.params;

        const agent = await req.prisma.agent.findFirst({
          where: {
            id,
            ...(req.user?.role !== "SUPER_ADMIN" && { businessId: req.businessId }),
          },
          include: {
            leads: {
              orderBy: { createdAt: "desc" },
              take: 10,
              select: {
                id: true,
                name: true,
                status: true,
                createdAt: true,
              },
            },
            attributions: {
              orderBy: { createdAt: "desc" },
              take: 10,
              include: {
                lead: { select: { id: true, name: true } },
                customer: { select: { id: true, name: true } },
              },
            },
            _count: {
              select: {
                leads: true,
                attributions: true,
              },
            },
          },
        });

        if (!agent) {
          return res.status(404).json({ error: "Agent not found" });
        }

        // Calculate stats
        const stats = await req.prisma.lead.groupBy({
          by: ["status"],
          where: { agentId: id },
          _count: true,
        });

        return res.json({
          ...agent,
          stats: stats.reduce((acc, item) => {
            acc[item.status] = item._count;
            return acc;
          }, {} as Record<string, number>),
        });
      } catch (error) {
        console.error("Get agent error:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  );

  // Update agent
  app.patch(
    "/api/agents/:id",
    authMiddleware,
    requireBusiness,
    async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        const data = updateAgentSchema.parse(req.body);

        const existing = await req.prisma.agent.findFirst({
          where: {
            id,
            ...(req.user?.role !== "SUPER_ADMIN" && { businessId: req.businessId }),
          },
        });

        if (!existing) {
          return res.status(404).json({ error: "Agent not found" });
        }

        const agent = await req.prisma.agent.update({
          where: { id },
          data,
        });

        return res.json(agent);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({ error: error.errors });
        }
        console.error("Update agent error:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  );

  // Regenerate agent codes
  app.post(
    "/api/agents/:id/regenerate-codes",
    authMiddleware,
    requireBusiness,
    async (req: Request, res: Response) => {
      try {
        const { id } = req.params;

        const existing = await req.prisma.agent.findFirst({
          where: {
            id,
            ...(req.user?.role !== "SUPER_ADMIN" && { businessId: req.businessId }),
          },
        });

        if (!existing) {
          return res.status(404).json({ error: "Agent not found" });
        }

        const agent = await req.prisma.agent.update({
          where: { id },
          data: {
            linkCode: generateUniqueCode(),
            couponCode: `AG${generateUniqueCode()}`,
          },
        });

        return res.json(agent);
      } catch (error) {
        console.error("Regenerate codes error:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  );

  // Public endpoint: Track agent link click
  app.get(
    "/api/track/:linkCode",
    async (req: Request, res: Response) => {
      try {
        const { linkCode } = req.params;

        const agent = await req.prisma.agent.findFirst({
          where: { linkCode, isActive: true },
          select: { id: true, businessId: true, name: true },
        });

        if (!agent) {
          return res.status(404).json({ error: "Invalid tracking link" });
        }

        // Return agent info for attribution
        return res.json({
          agentId: agent.id,
          businessId: agent.businessId,
          agentName: agent.name,
        });
      } catch (error) {
        console.error("Track link error:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  );

  // Public endpoint: Validate coupon code
  app.get(
    "/api/validate-coupon/:couponCode",
    async (req: Request, res: Response) => {
      try {
        const { couponCode } = req.params;

        const agent = await req.prisma.agent.findFirst({
          where: { couponCode, isActive: true },
          select: { id: true, businessId: true, name: true },
        });

        if (!agent) {
          return res.json({ valid: false });
        }

        return res.json({
          valid: true,
          agentId: agent.id,
          businessId: agent.businessId,
        });
      } catch (error) {
        console.error("Validate coupon error:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  );

  // Create attribution
  app.post(
    "/api/attributions",
    authMiddleware,
    requireBusiness,
    async (req: Request, res: Response) => {
      try {
        const { agentId, leadId, customerId, method } = req.body;

        if (!agentId || (!leadId && !customerId)) {
          return res.status(400).json({ 
            error: "agentId and either leadId or customerId are required" 
          });
        }

        const attribution = await req.prisma.attribution.create({
          data: {
            businessId: req.businessId!,
            agentId,
            leadId,
            customerId,
            method: method || "MANUAL",
          },
          include: {
            agent: { select: { id: true, name: true } },
            lead: { select: { id: true, name: true } },
            customer: { select: { id: true, name: true } },
          },
        });

        return res.status(201).json(attribution);
      } catch (error) {
        console.error("Create attribution error:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  );
}
