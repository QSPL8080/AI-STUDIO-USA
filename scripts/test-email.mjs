// Test both email senders.  Run from the project folder:   node scripts/test-email.mjs
import fs from "node:fs";
import nodemailer from "nodemailer";

const env = {};
for (const line of fs.readFileSync(".env", "utf8").split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}
const LEADS_TO = "qsaistudio@gmail.com";
const ALERTS_TO = "info@quickuppaistudio.us";
const stamp = new Date().toLocaleString();

async function tryIt(label, opts, from, to) {
  try {
    const t = nodemailer.createTransport({ ...opts, connectionTimeout: 15000 });
    await t.verify();
    const info = await t.sendMail({ from, to, subject: `TEST ${label} – ${stamp}`, text: `Test email (${label}) sent at ${stamp}.` });
    console.log(`OK    ${label}: ${from} -> ${to}  (${info.response})`);
  } catch (e) {
    console.log(`FAIL  ${label}: ${from} -> ${to}\n      ${e.code || ""} ${e.message}`);
  }
}

const hostinger = {
  host: env.SMTP_HOST || "smtp.hostinger.com", port: Number(env.SMTP_PORT || 465),
  secure: env.SMTP_SECURE !== "false", auth: { user: env.SMTP_USER, pass: (env.SMTP_PASS || "").replace(/\s+/g, "") },
};
const gmail = {
  host: "smtp.gmail.com", port: 465, secure: true,
  auth: { user: env.GMAIL_USER || "qsaistudio@gmail.com", pass: (env.GMAIL_APP_PASSWORD || "").replace(/\s+/g, "") },
};

await tryIt("LEAD email (Gmail)", gmail, `"Quickupp AI Studio Leads" <${gmail.auth.user}>`, LEADS_TO);
await tryIt("FAILED-LOGIN alert (Gmail)", gmail, `"Quickupp CRM Security" <${gmail.auth.user}>`, ALERTS_TO);
