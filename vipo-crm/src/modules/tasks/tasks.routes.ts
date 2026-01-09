import { Express, Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";

const createTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  type: z.enum(["FOLLOW_UP", "CALL", "SEND_INFO", "OTHER"]),
  dueAt: z.string().transform((s) => new Date(s)),
  leadId: z.string().optional(),
  customerId: z.string().optional(),
  conversationId: z.string().optional(),
});

const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(["OPEN", "DONE", "OVERDUE", "CANCELED"]).optional(),
  dueAt: z.string().transform((s) => new Date(s)).optional(),
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

export function registerTasksRoutes(app: Express) {
  // List tasks (follow-up board)
  app.get(
    "/api/tasks",
    authMiddleware,
    requireBusiness,
    async (req: Request, res: Response) => {
      try {
        const { 
          status, 
          type,
          ownerId,
          overdue,
          page = "1", 
          limit = "20" 
        } = req.query;

        const where: any = {};
        
        if (req.user?.role !== "SUPER_ADMIN") {
          where.businessId = req.businessId;
        }

        if (status) where.status = status;
        if (type) where.type = type;
        if (ownerId) where.ownerId = ownerId;
        if (overdue === "true") {
          where.status = "OPEN";
          where.dueAt = { lt: new Date() };
        }

        const skip = (Number(page) - 1) * Number(limit);

        const [tasks, total] = await Promise.all([
          req.prisma.task.findMany({
            where,
            include: {
              owner: { select: { id: true, name: true } },
              lead: { select: { id: true, name: true } },
              customer: { select: { id: true, name: true } },
              conversation: { select: { id: true, channel: true, subject: true } },
            },
            orderBy: { dueAt: "asc" },
            skip,
            take: Number(limit),
          }),
          req.prisma.task.count({ where }),
        ]);

        return res.json({
          data: tasks,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit)),
          },
        });
      } catch (error) {
        console.error("List tasks error:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  );

  // Create task
  app.post(
    "/api/tasks",
    authMiddleware,
    requireBusiness,
    async (req: Request, res: Response) => {
      try {
        const data = createTaskSchema.parse(req.body);

        const task = await req.prisma.task.create({
          data: {
            ...data,
            businessId: req.businessId!,
            ownerId: req.user!.id,
            status: "OPEN",
          },
          include: {
            owner: { select: { id: true, name: true } },
            lead: { select: { id: true, name: true } },
            customer: { select: { id: true, name: true } },
          },
        });

        return res.status(201).json(task);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({ error: error.errors });
        }
        console.error("Create task error:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  );

  // Get single task
  app.get(
    "/api/tasks/:id",
    authMiddleware,
    requireBusiness,
    async (req: Request, res: Response) => {
      try {
        const { id } = req.params;

        const task = await req.prisma.task.findFirst({
          where: {
            id,
            ...(req.user?.role !== "SUPER_ADMIN" && { businessId: req.businessId }),
          },
          include: {
            owner: { select: { id: true, name: true, email: true } },
            lead: { select: { id: true, name: true, phone: true, email: true } },
            customer: { select: { id: true, name: true, phone: true, email: true } },
            conversation: {
              select: { id: true, channel: true, subject: true, status: true },
            },
          },
        });

        if (!task) {
          return res.status(404).json({ error: "Task not found" });
        }

        return res.json(task);
      } catch (error) {
        console.error("Get task error:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  );

  // Update task
  app.patch(
    "/api/tasks/:id",
    authMiddleware,
    requireBusiness,
    async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        const data = updateTaskSchema.parse(req.body);

        const existing = await req.prisma.task.findFirst({
          where: {
            id,
            ...(req.user?.role !== "SUPER_ADMIN" && { businessId: req.businessId }),
          },
        });

        if (!existing) {
          return res.status(404).json({ error: "Task not found" });
        }

        const task = await req.prisma.task.update({
          where: { id },
          data: {
            ...data,
            ...(data.status === "DONE" && { completedAt: new Date() }),
          },
          include: {
            owner: { select: { id: true, name: true } },
            lead: { select: { id: true, name: true } },
            customer: { select: { id: true, name: true } },
          },
        });

        return res.json(task);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({ error: error.errors });
        }
        console.error("Update task error:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  );

  // Complete task
  app.post(
    "/api/tasks/:id/complete",
    authMiddleware,
    requireBusiness,
    async (req: Request, res: Response) => {
      try {
        const { id } = req.params;

        const existing = await req.prisma.task.findFirst({
          where: {
            id,
            ...(req.user?.role !== "SUPER_ADMIN" && { businessId: req.businessId }),
          },
        });

        if (!existing) {
          return res.status(404).json({ error: "Task not found" });
        }

        const task = await req.prisma.task.update({
          where: { id },
          data: {
            status: "DONE",
            completedAt: new Date(),
          },
          include: {
            owner: { select: { id: true, name: true } },
          },
        });

        return res.json(task);
      } catch (error) {
        console.error("Complete task error:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  );

  // Delete task
  app.delete(
    "/api/tasks/:id",
    authMiddleware,
    requireBusiness,
    async (req: Request, res: Response) => {
      try {
        const { id } = req.params;

        const existing = await req.prisma.task.findFirst({
          where: {
            id,
            ...(req.user?.role !== "SUPER_ADMIN" && { businessId: req.businessId }),
          },
        });

        if (!existing) {
          return res.status(404).json({ error: "Task not found" });
        }

        await req.prisma.task.delete({ where: { id } });

        return res.json({ success: true });
      } catch (error) {
        console.error("Delete task error:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  );

  // Get my tasks (for current user)
  app.get(
    "/api/my-tasks",
    authMiddleware,
    async (req: Request, res: Response) => {
      try {
        const tasks = await req.prisma.task.findMany({
          where: {
            ownerId: req.user!.id,
            status: { in: ["OPEN", "OVERDUE"] },
          },
          include: {
            lead: { select: { id: true, name: true } },
            customer: { select: { id: true, name: true } },
          },
          orderBy: { dueAt: "asc" },
          take: 20,
        });

        return res.json(tasks);
      } catch (error) {
        console.error("Get my tasks error:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  );
}
