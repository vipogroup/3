import { Express, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
});

export function registerAuthRoutes(app: Express) {
  // Login
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = loginSchema.parse(req.body);

      const user = await req.prisma.user.findUnique({
        where: { email },
        include: { business: true },
      });

      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const validPassword = await bcrypt.compare(password, user.passwordHash);
      if (!validPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign(
        {
          id: user.id,
          role: user.role,
          businessId: user.businessId,
        },
        req.env.jwtSecret,
        { expiresIn: req.env.jwtExpiresIn }
      );

      await req.prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });

      return res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          businessId: user.businessId,
          businessName: user.business?.name,
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Login error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Register (for Super Admin to create first user, or self-registration if enabled)
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const { email, password, name } = registerSchema.parse(req.body);

      const existingUser = await req.prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(400).json({ error: "Email already registered" });
      }

      const passwordHash = await bcrypt.hash(password, 12);

      // Check if this is the first user (make them SUPER_ADMIN)
      const userCount = await req.prisma.user.count();
      const role = userCount === 0 ? "SUPER_ADMIN" : "STAFF";

      const user = await req.prisma.user.create({
        data: {
          email,
          passwordHash,
          name,
          role,
        },
      });

      const token = jwt.sign(
        {
          id: user.id,
          role: user.role,
          businessId: user.businessId,
        },
        req.env.jwtSecret,
        { expiresIn: req.env.jwtExpiresIn }
      );

      return res.status(201).json({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Register error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get current user
  app.get("/api/auth/me", async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ error: "No token provided" });
      }

      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, req.env.jwtSecret) as {
        id: string;
        role: string;
        businessId?: string;
      };

      const user = await req.prisma.user.findUnique({
        where: { id: decoded.id },
        include: { business: true },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.json({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        businessId: user.businessId,
        businessName: user.business?.name,
      });
    } catch (error) {
      return res.status(401).json({ error: "Invalid token" });
    }
  });
}
