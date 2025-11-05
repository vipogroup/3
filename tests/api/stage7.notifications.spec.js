import request from "supertest";
import { describe, it, afterAll } from "vitest";
import fs from "fs";
import path from "path";

const base = process.env.PUBLIC_URL || "http://localhost:3001";
const results = { stage: 7, checks: [] };
function record(name, passed, evidence, hint) { results.checks.push({ name, passed, evidence, hint }); }
function writeReport() { try { const outDir = path.join(process.cwd(), "reports", "tests"); fs.mkdirSync(outDir, { recursive: true }); fs.writeFileSync(path.join(outDir, "stage7.json"), JSON.stringify(results, null, 2)); } catch {} }

function randPhone() { return "05" + Math.floor(10000000 + Math.random()*89999999).toString(); }

async function register(role) {
  const phone = randPhone();
  const res = await request(base).post("/api/auth/register").send({ fullName: `${role.toUpperCase()} NOTIFY`, phone, role, password: "12345678A!" });
  return { phone, password: "12345678A!", res };
}

async function login(phone, password) {
  const res = await request(base).post("/api/auth/login").send({ phone, password });
  const cookie = res.headers["set-cookie"]?.[0] || "";
  return { res, cookie };
}

function readLogLines() {
  try {
    const logPath = path.join(process.cwd(), "logs", "notifications.log");
    if (!fs.existsSync(logPath)) return [];
    return fs.readFileSync(logPath, "utf8").trim().split(/\r?\n/).filter(Boolean);
  } catch { return []; }
}

function clearLog() {
  try { fs.rmSync(path.join(process.cwd(), "logs", "notifications.log"), { force: true }); } catch {}
}

describe("Stage 7 - Notifications", () => {
  it("status changes trigger WhatsApp sends; identical status -> no spam", async () => {
    clearLog();
    const admin = await register("admin");
    const agent = await register("agent");
    const adminLogin = await login(admin.phone, admin.password);
    const agentLogin = await login(agent.phone, agent.password);

    const create = await request(base).post("/api/sales").set("Cookie", agentLogin.cookie).send({ productId: "656565656565656565656565", customerName: "Notify Buyer", customerPhone: "0550002222", salePrice: 500 });
    const id = create.body?._id || create.body?.id;

    const before = readLogLines().length;
    const s1 = await request(base).put(`/api/sales/${id}`).set("Cookie", adminLogin.cookie).send({ status: "in-progress" });
    const mid = readLogLines().length;
    const s2 = await request(base).put(`/api/sales/${id}`).set("Cookie", adminLogin.cookie).send({ status: "completed" });
    const after = readLogLines().length;
    const s3 = await request(base).put(`/api/sales/${id}`).set("Cookie", adminLogin.cookie).send({ status: "completed" });
    const final = readLogLines().length;

    // Expect at least one log line added on each change; identical status adds none
    record("notify.on-change.agent", mid > before, `before=${before}, mid=${mid}`, "PUT to in-progress should notify agent");
    record("notify.on-completed.customer", after > mid, `mid=${mid}, after=${after}`, "PUT to completed should notify customer as well");
    record("notify.no-dup", final === after, `after=${after}, final=${final}`, "Same status should not resend notifications");
  });
});

afterAll(writeReport);
