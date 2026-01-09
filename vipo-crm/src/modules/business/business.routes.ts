import { Express, Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";

const createBusinessSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
});

// Auth middleware
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

// Super Admin only middleware
function superAdminOnly(req: Request, res: Response, next: NextFunction) {
  if (req.user?.role !== "SUPER_ADMIN") {
    return res.status(403).json({ error: "Super Admin access required" });
  }
  next();
}

export function registerBusinessRoutes(app: Express) {
  // List all businesses (Super Admin only)
  app.get(
    "/api/businesses",
    authMiddleware,
    superAdminOnly,
    async (req: Request, res: Response) => {
      try {
        const businesses = await req.prisma.business.findMany({
          include: {
            _count: {
              select: {
                users: true,
                leads: true,
                customers: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        });

        return res.json(businesses);
      } catch (error) {
        console.error("List businesses error:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  );

  // Create business (Super Admin only)
  app.post(
    "/api/businesses",
    authMiddleware,
    superAdminOnly,
    async (req: Request, res: Response) => {
      try {
        const { name, slug } = createBusinessSchema.parse(req.body);

        const existingBusiness = await req.prisma.business.findUnique({
          where: { slug },
        });

        if (existingBusiness) {
          return res.status(400).json({ error: "Slug already taken" });
        }

        const business = await req.prisma.business.create({
          data: {
            name,
            slug,
          },
        });

        return res.status(201).json(business);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({ error: error.errors });
        }
        console.error("Create business error:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  );

  // Get single business
  app.get(
    "/api/businesses/:id",
    authMiddleware,
    async (req: Request, res: Response) => {
      try {
        const { id } = req.params;

        // Non-super admins can only view their own business
        if (req.user?.role !== "SUPER_ADMIN" && req.businessId !== id) {
          return res.status(403).json({ error: "Access denied" });
        }

        const business = await req.prisma.business.findUnique({
          where: { id },
          include: {
            _count: {
              select: {
                users: true,
                leads: true,
                customers: true,
                agents: true,
              },
            },
          },
        });

        if (!business) {
          return res.status(404).json({ error: "Business not found" });
        }

        return res.json(business);
      } catch (error) {
        console.error("Get business error:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  );

  // Update business
  app.patch(
    "/api/businesses/:id",
    authMiddleware,
    async (req: Request, res: Response) => {
      try {
        const { id } = req.params;

        // Only Super Admin or Owner can update
        if (req.user?.role !== "SUPER_ADMIN" && req.user?.role !== "OWNER") {
          return res.status(403).json({ error: "Access denied" });
        }

        if (req.user?.role === "OWNER" && req.businessId !== id) {
          return res.status(403).json({ error: "Access denied" });
        }

        const { name, status, settings } = req.body;

        const business = await req.prisma.business.update({
          where: { id },
          data: {
            ...(name && { name }),
            ...(status && { status }),
            ...(settings && { settings }),
          },
        });

        return res.json(business);
      } catch (error) {
        console.error("Update business error:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  );
}
