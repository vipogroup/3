import request from "supertest";
import { describe, it, afterAll } from "vitest";
import fs from "fs";
import path from "path";

const base = process.env.PUBLIC_URL || "http://localhost:3001";
const results = { stage: 5, checks: [] };
function record(name, passed, evidence, hint) { results.checks.push({ name, passed, evidence, hint }); }
function writeReport() { try { const outDir = path.join(process.cwd(), "reports", "tests"); fs.mkdirSync(outDir, { recursive: true }); fs.writeFileSync(path.join(outDir, "stage5.json"), JSON.stringify(results, null, 2)); } catch {} }

function randPhone() { return "05" + Math.floor(10000000 + Math.random()*89999999).toString(); }

async function register(role) {
  const phone = randPhone();
  const res = await request(base).post("/api/auth/register").send({ fullName: `${role.toUpperCase()} SALES`, phone, role, password: "12345678A!" });
  return { phone, password: "12345678A!", res };
}

async function login(phone, password) {
  const res = await request(base).post("/api/auth/login").send({ phone, password });
  const cookie = res.headers["set-cookie"]?.[0] || "";
  return { res, cookie };
}

describe("Stage 5 - Sales + Commission + Status", () => {
  it("agent creates sale (commission 5%); admin can change status; agent cannot", async () => {
    const agent = await register("agent");
    const admin = await register("admin");
    const regOk = agent.res.status === 201 && admin.res.status === 201;
    record("sales.reg.users", regOk, `agent=${agent.res.status}; admin=${admin.res.status}`, "Register agent/admin via /api/auth/register");

    const agentLogin = await login(agent.phone, agent.password);
    const adminLogin = await login(admin.phone, admin.password);

    const salePrice = 1000;
    const productId = "656565656565656565656565"; // arbitrary ObjectId
    const create = await request(base).post("/api/sales").set("Cookie", agentLogin.cookie).send({ productId, customerName: "Test Buyer", customerPhone: "0550001111", salePrice });

    const createOk = create.status === 201;
    const commission = create.body?.commission;
    const commissionOk = typeof commission === "number" && Math.abs(commission - salePrice*0.05) < 1e-6;
    const statusOk = create.body?.status === "pending";
    record("sales.create.agent", createOk && commissionOk && statusOk, `status=${create.status}; commission=${commission}; status=${create.body?.status}`, "POST /api/sales should compute 5% and set status 'pending'");

    const id = create.body?._id || create.body?.id;

    if (id) {
      // Admin change status
      const updAdmin = await request(base).put(`/api/sales/${id}`).set("Cookie", adminLogin.cookie).send({ status: "in-progress" });
      record("sales.status.admin", updAdmin.status === 200, `status=${updAdmin.status}`, "Admin should be able to change sale status");

      // Agent cannot change status (expected 403)
      const updAgent = await request(base).put(`/api/sales/${id}`).set("Cookie", agentLogin.cookie).send({ status: "completed" });
      record("sales.status.agent.forbidden", updAgent.status === 403, `status=${updAgent.status}`, "Agent should not be able to change sale status");

      // Agent list only his sales
      const list = await request(base).get("/api/sales").set("Cookie", agentLogin.cookie);
      record("sales.list.agent.scope", list.status === 200 && Array.isArray(list.body), `status=${list.status}`, "Agent should see only his sales");
    }
  });
});

afterAll(writeReport);
