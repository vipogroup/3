import { Express, Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";

const createCustomerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  notes: z.string().optional(),
});

const updateCustomerSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
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

export function registerCustomersRoutes(app: Express) {
  // List customers
  app.get(
    "/api/customers",
    authMiddleware,
    requireBusiness,
    async (req: Request, res: Response) => {
      try {
        const { search, page = "1", limit = "20" } = req.query;

        const where: any = {};
        
        if (req.user?.role !== "SUPER_ADMIN") {
          where.businessId = req.businessId;
        }

        if (search) {
          where.OR = [
            { name: { contains: search as string, mode: "insensitive" } },
            { email: { contains: search as string, mode: "insensitive" } },
            { phone: { contains: search as string } },
          ];
        }

        const skip = (Number(page) - 1) * Number(limit);

        const [customers, total] = await Promise.all([
          req.prisma.customer.findMany({
            where,
            include: {
              owner: { select: { id: true, name: true } },
              lead: { select: { id: true, source: true } },
              _count: {
                select: {
                  conversations: true,
                  tasks: true,
                },
              },
            },
            orderBy: { createdAt: "desc" },
            skip,
            take: Number(limit),
          }),
          req.prisma.customer.count({ where }),
        ]);

        return res.json({
          data: customers,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit)),
          },
        });
      } catch (error) {
        console.error("List customers error:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  );

  // Create customer
  app.post(
    "/api/customers",
    authMiddleware,
    requireBusiness,
    async (req: Request, res: Response) => {
      try {
        const data = createCustomerSchema.parse(req.body);

        const customer = await req.prisma.customer.create({
          data: {
            ...data,
            businessId: req.businessId!,
            ownerId: req.user!.id,
          },
          include: {
            owner: { select: { id: true, name: true } },
          },
        });

        await req.prisma.auditEvent.create({
          data: {
            businessId: req.businessId!,
            actorId: req.user!.id,
            entity: "Customer",
            entityId: customer.id,
            action: "CREATE",
          },
        });

        return res.status(201).json(customer);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({ error: error.errors });
        }
        console.error("Create customer error:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  );

  // Get single customer (Customer 360 view)
  app.get(
    "/api/customers/:id",
    authMiddleware,
    requireBusiness,
    async (req: Request, res: Response) => {
      try {
        const { id } = req.params;

        const customer = await req.prisma.customer.findFirst({
          where: {
            id,
            ...(req.user?.role !== "SUPER_ADMIN" && { businessId: req.businessId }),
          },
          include: {
            owner: { select: { id: true, name: true, email: true } },
            lead: {
              include: {
                agent: { select: { id: true, name: true } },
              },
            },
            conversations: {
              orderBy: { updatedAt: "desc" },
              include: {
                interactions: {
                  orderBy: { createdAt: "desc" },
                  take: 5,
                },
              },
            },
            tasks: {
              orderBy: { dueAt: "asc" },
              where: { status: { in: ["OPEN", "OVERDUE"] } },
            },
            attributions: {
              include: {
                agent: { select: { id: true, name: true } },
              },
            },
          },
        });

        if (!customer) {
          return res.status(404).json({ error: "Customer not found" });
        }

        return res.json(customer);
      } catch (error) {
        console.error("Get customer error:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  );

  // Update customer
  app.patch(
    "/api/customers/:id",
    authMiddleware,
    requireBusiness,
    async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        const data = updateCustomerSchema.parse(req.body);

        const existingCustomer = await req.prisma.customer.findFirst({
          where: {
            id,
            ...(req.user?.role !== "SUPER_ADMIN" && { businessId: req.businessId }),
          },
        });

        if (!existingCustomer) {
          return res.status(404).json({ error: "Customer not found" });
        }

        const customer = await req.prisma.customer.update({
          where: { id },
          data,
          include: {
            owner: { select: { id: true, name: true } },
          },
        });

        await req.prisma.auditEvent.create({
          data: {
            businessId: req.businessId!,
            actorId: req.user!.id,
            entity: "Customer",
            entityId: customer.id,
            action: "UPDATE",
            before: existingCustomer as any,
            after: customer as any,
          },
        });

        return res.json(customer);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({ error: error.errors });
        }
        console.error("Update customer error:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  );

  // Get customer timeline
  app.get(
    "/api/customers/:id/timeline",
    authMiddleware,
    requireBusiness,
    async (req: Request, res: Response) => {
      try {
        const { id } = req.params;

        const customer = await req.prisma.customer.findFirst({
          where: {
            id,
            ...(req.user?.role !== "SUPER_ADMIN" && { businessId: req.businessId }),
          },
        });

        if (!customer) {
          return res.status(404).json({ error: "Customer not found" });
        }

        // Get all interactions across conversations
        const interactions = await req.prisma.interaction.findMany({
          where: {
            conversation: { customerId: id },
          },
          include: {
            conversation: { select: { channel: true } },
            createdBy: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 50,
        });

        // Get audit events
        const auditEvents = await req.prisma.auditEvent.findMany({
          where: {
            entity: "Customer",
            entityId: id,
          },
          include: {
            actor: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 20,
        });

        return res.json({
          interactions,
          auditEvents,
        });
      } catch (error) {
        console.error("Get customer timeline error:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  );
}
