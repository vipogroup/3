import request from "supertest";
import { describe, it, expect, afterAll } from "vitest";
import fs from "fs";
import path from "path";

const base = process.env.PUBLIC_URL || "http://localhost:3001";
const results = { stage: 4, checks: [] };
function record(name, passed, evidence, hint) { results.checks.push({ name, passed, evidence, hint }); }
function writeReport() { try { const outDir = path.join(process.cwd(), "reports", "tests"); fs.mkdirSync(outDir, { recursive: true }); fs.writeFileSync(path.join(outDir, "stage4.json"), JSON.stringify(results, null, 2)); } catch {} }

function randPhone() { return "05" + Math.floor(10000000 + Math.random()*89999999).toString(); }

async function register(role) {
  const phone = randPhone();
  const res = await request(base).post("/api/auth/register").send({ fullName: `${role.toUpperCase()} CRUD`, phone, role, password: "12345678A!" });
  return { phone, password: "12345678A!", res };
}

async function login(phone, password) {
  const res = await request(base).post("/api/auth/login").send({ phone, password });
  const cookie = res.headers["set-cookie"]?.[0] || "";
  return { res, cookie };
}

describe("Stage 4 - Products CRUD + Upload", () => {
  it("admin can POST/GET/PUT/DELETE; agent 403 on write ops", async () => {
    const admin = await register("admin");
    const agent = await register("agent");
    expect(admin.res.status).toBe(201);
    expect(agent.res.status).toBe(201);

    const adminLogin = await login(admin.phone, admin.password);
    const agentLogin = await login(agent.phone, agent.password);

    // Create product (expected 201) – may be missing
    const newProd = { name: "Test Product", description: "Desc", price: 123.45, images: [], category: "general" };
    const create = await request(base).post("/api/products").set("Cookie", adminLogin.cookie).send(newProd);
    record("products.post.admin", create.status === 201, `status=${create.status}`, "Implement POST /api/products (admin-only)");

    // Try agent POST (expect 403)
    const createByAgent = await request(base).post("/api/products").set("Cookie", agentLogin.cookie).send(newProd);
    record("products.post.agent.forbidden", createByAgent.status === 403, `status=${createByAgent.status}`, "Enforce role guard: only admin can POST /api/products");

    const prodId = create.body?._id || create.body?.id;

    // GET list should be 200
    const list = await request(base).get("/api/products");
    record("products.get.list", list.status === 200 && Array.isArray(list.body), `status=${list.status}`, "GET /api/products must return array");

    if (prodId) {
      const update = await request(base).put(`/api/products/${prodId}`).set("Cookie", adminLogin.cookie).send({ price: 200 });
      record("products.put.admin", update.status === 200, `status=${update.status}`, "Implement PUT /api/products/:id (admin-only)");

      const delByAgent = await request(base).delete(`/api/products/${prodId}`).set("Cookie", agentLogin.cookie);
      record("products.delete.agent.forbidden", delByAgent.status === 403, `status=${delByAgent.status}`, "Only admin can DELETE products");

      const del = await request(base).delete(`/api/products/${prodId}`).set("Cookie", adminLogin.cookie);
      record("products.delete.admin", del.status === 200, `status=${del.status}`, "DELETE /api/products/:id should return 200");
    }
  });
});

afterAll(writeReport);
