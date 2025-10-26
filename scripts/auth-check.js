const base = process.argv[2] || "http://localhost:3001";

async function main() {
  const loginRes = await fetch(`${base}/api/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ phone: "0501113334", password: "123456" }),
    redirect: "manual",
  });

  console.log("login status", loginRes.status);
  const cookie = loginRes.headers.get("set-cookie") || "";
  console.log("set-cookie present", Boolean(cookie));

  const meRes = await fetch(`${base}/api/auth/me`, {
    headers: { cookie },
    redirect: "manual",
  });
  console.log("/api/auth/me status", meRes.status);
  console.log("/api/auth/me body", await meRes.text());

  const adminRes = await fetch(`${base}/admin`, {
    headers: { cookie },
    redirect: "manual",
  });
  console.log("/admin status", adminRes.status);
  console.log("/admin redirected?", adminRes.status >= 300 && adminRes.status < 400);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
