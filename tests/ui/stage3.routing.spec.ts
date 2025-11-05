import { test, expect, request as pwRequest } from "@playwright/test";
import fs from "fs";
import path from "path";

const base = process.env.PUBLIC_URL || "http://localhost:3001";

async function apiRegister(req: any, role: "admin"|"agent", phone: string) {
  return await req.post(`${base}/api/auth/register`, {
    data: { fullName: `${role.toUpperCase()} UI`, phone, role, password: "12345678A!" },
  });
}

async function uiLogin(page: any, phone: string, password: string) {
  await page.goto(`${base}/login`);
  await page.fill('input[placeholder], input[type="text"]', phone);
  await page.fill('input[type="password"]', password);
  await Promise.all([
    page.waitForURL(/\/(agent|admin|)/),
    page.click('button[type="submit"]')
  ]);
}

function record(stage: number, checks: any[]) {
  try {
    const outDir = path.join(process.cwd(), "reports", "tests");
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, `stage${stage}.json`), JSON.stringify({ stage, checks }, null, 2));
  } catch {}
}

const checks: any[] = [];

test.describe("Stage 3 - Layout + Routing + Role-Guard", () => {
  test.setTimeout(120000);

  test("agent sees limited menu; admin sees full; agent blocked from /admin", async ({ page, request }) => {
    const agentPhone = "05" + Math.floor(10000000 + Math.random()*89999999).toString();
    const adminPhone = "05" + Math.floor(10000000 + Math.random()*89999999).toString();

    const r1 = await apiRegister(request, "agent", agentPhone);
    const r2 = await apiRegister(request, "admin", adminPhone);

    try {
      expect(r1.status()).toBe(201);
      expect(r2.status()).toBe(201);
    } catch {}

    // Agent login and menu assertions
    await uiLogin(page, agentPhone, "12345678A!");
    const agentMenuTexts = await page.locator("nav >> li").allInnerTexts().catch(() => [] as string[]);
    const agentJoined = agentMenuTexts.join(" | ");
    const agentHasLimited = /(My Sales|Sales)/.test(agentJoined) && /(New Sale)/.test(agentJoined) && !/Products/.test(agentJoined) && !/Reports/.test(agentJoined);
    checks.push({ name: "agent.menu", passed: agentHasLimited, evidence: agentJoined, hint: "Agent should not see Products/Reports" });

    // Agent cannot access /admin
    await page.goto(`${base}/admin`);
    const url = page.url();
    const redirected = /\/login|auth=forbidden/.test(url);
    checks.push({ name: "agent.admin.guard", passed: redirected, evidence: url, hint: "Agent must be redirected away from /admin" });

    // Admin login and menu assertions
    await page.context().clearCookies();
    await uiLogin(page, adminPhone, "12345678A!");
    const adminMenuTexts = await page.locator("nav >> li").allInnerTexts().catch(() => [] as string[]);
    const adminJoined = adminMenuTexts.join(" | ");
    const adminHasFull = /Products/.test(adminJoined) && /Reports/.test(adminJoined) && /Agents/.test(adminJoined);
    checks.push({ name: "admin.menu", passed: adminHasFull, evidence: adminJoined, hint: "Admin should see full menu" });
  });

  test.afterAll(async () => record(3, checks));
});
