import fs from "fs";
import path from "path";

const TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_ID = process.env.WHATSAPP_PHONE_ID;
const DRY_RUN = !TOKEN || !PHONE_ID;

const LOG_DIR = path.resolve(process.cwd(), "logs");
const LOG_FILE = path.join(LOG_DIR, "notifications.log");
if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });

function writeLog(entry) {
  try {
    fs.appendFileSync(LOG_FILE, JSON.stringify({ ts: new Date().toISOString(), ...entry }) + "\n", "utf8");
  } catch {}
}

/**
 * שולח הודעת וואטסאפ טקסט פשוט.
 * @param {string} phone - מספר יעד בפורמט בינלאומי (ללא +)
 * @param {string} text  - טקסט ההודעה
 */
export async function sendWhatsAppMessage(phone, text) {
  const payload = {
    messaging_product: "whatsapp",
    to: phone,
    type: "text",
    text: { preview_url: false, body: text }
  };

  if (DRY_RUN) {
    writeLog({ level: "INFO", dryRun: true, phone, text, note: "Missing WHATSAPP_TOKEN/WHATSAPP_PHONE_ID" });
    return { ok: true, dryRun: true };
  }

  try {
    const res = await fetch(`https://graph.facebook.com/v19.0/${PHONE_ID}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}` 
      },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    writeLog({ level: "INFO", dryRun: false, phone, text, status: res.status, response: data });
    return { ok: res.ok, status: res.status, data };
  } catch (err) {
    writeLog({ level: "ERROR", dryRun: false, phone, text, error: String(err?.stack || err) });
    return { ok: false, error: String(err?.message || err) };
  }
}
