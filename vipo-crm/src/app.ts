import express from "express";
import cors from "cors";
import morgan from "morgan";
import createHttpError from "http-errors";

import { prisma } from "./lib/prisma";
import { env } from "./config/env";
import { registerAuthRoutes } from "./modules/auth/auth.routes";
import { registerBusinessRoutes } from "./modules/business/business.routes";
import { registerLeadsRoutes } from "./modules/leads/leads.routes";
import { registerCustomersRoutes } from "./modules/customers/customers.routes";
import { registerConversationsRoutes } from "./modules/conversations/conversations.routes";
import { registerTasksRoutes } from "./modules/tasks/tasks.routes";
import { registerAgentsRoutes } from "./modules/agents/agents.routes";
import { registerWebhooksRoutes } from "./modules/webhooks/webhooks.routes";
import { registerWhatsAppRoutes } from "./modules/whatsapp/whatsapp.routes";

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("combined"));

app.use((req, _res, next) => {
  req.prisma = prisma;
  req.env = env;
  next();
});

registerAuthRoutes(app);
registerBusinessRoutes(app);
registerLeadsRoutes(app);
registerCustomersRoutes(app);
registerConversationsRoutes(app);
registerTasksRoutes(app);
registerAgentsRoutes(app);
registerWebhooksRoutes(app);
registerWhatsAppRoutes(app);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "vipo-crm", timestamp: new Date().toISOString() });
});

app.use((req, _res, next) => {
  next(createHttpError(404, `Route not found: ${req.method} ${req.path}`));
});

app.use((err: createHttpError.HttpError, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const status = err.status || 500;
  const response = {
    status,
    message: err.message || "Unexpected server error",
  };

  if (process.env.NODE_ENV !== "production" && err.stack) {
    Object.assign(response, { stack: err.stack });
  }

  res.status(status).json(response);
});

export default app;
