// Fonction edge Ooble — envoi d'e-mails via Resend.
//
// Deux modes :
//
//   ─── Mode « custom » (staff écrit librement) ────────────────
//   POST JSON :
//     { "to": "…", "subject": "…", "html": "<p>…</p>",
//       "text": "(optionnel, sinon dérivé du HTML)",
//       "replyTo": "(optionnel)",
//       "cc": ["…"], "bcc": ["…"] }
//
//   Le corps `html` est encapsulé dans le layout Ooble (header + footer
//   monochromes) pour rester cohérent avec la marque.
//
//   ─── Mode « template » (transactionnel) ─────────────────────
//   POST JSON :
//     { "to": "…", "template": "welcome" | "order-buy" | …,
//       "vars": { … }, "subject": "(optionnel)" }
//
// Secrets requis (Supabase → Edge Functions → Secrets) :
//   RESEND_API_KEY   clé API Resend
//   EMAIL_FROM       ex. "Ooble <bonjour@ooble.ca>"  (domaine vérifié)
//   EMAIL_ASSET_BASE ex. "https://ooble.ca/email-assets"

import { TEMPLATES, SUBJECTS } from "./templates.ts";
import { wrapCustomBody, htmlToText } from "./layout.ts";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

/** Remplace {{clé}} par la valeur ; laisse les clés inconnues intactes. */
function render(str: string, data: Record<string, string>): string {
  return str.replace(/\{\{(\w+)\}\}/g, (m, k) => (k in data ? data[k] : m));
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}

interface Payload {
  to?: string;
  cc?: string[];
  bcc?: string[];
  replyTo?: string;
  subject?: string;
  // Mode template
  template?: string;
  vars?: Record<string, string>;
  // Mode custom
  html?: string;
  text?: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "Méthode non autorisée" }, 405);

  const apiKey = Deno.env.get("RESEND_API_KEY");
  const from = Deno.env.get("EMAIL_FROM") ?? "Ooble <onboarding@resend.dev>";
  const assetBase = Deno.env.get("EMAIL_ASSET_BASE") ?? "https://ooble.ca/email-assets";
  if (!apiKey) return json({ error: "RESEND_API_KEY manquant." }, 500);

  let payload: Payload;
  try { payload = await req.json(); }
  catch { return json({ error: "JSON invalide." }, 400); }

  const { to, cc, bcc, replyTo, subject, template, vars = {}, html, text } = payload;
  if (!to) return json({ error: "Champ 'to' requis." }, 400);

  let finalHtml: string;
  let finalText: string | undefined;
  let finalSubject: string;

  if (template) {
    // ─── Mode template ────────────────────────────────────
    if (!(template in TEMPLATES)) {
      return json({ error: `Template inconnu : ${template}` }, 400);
    }
    const data: Record<string, string> = {
      assetBase,
      year: String(new Date().getFullYear()),
      unsubscribeUrl: vars.unsubscribeUrl ?? "#",
      ...vars,
    };
    finalHtml = render(TEMPLATES[template], data);
    finalSubject = render(subject ?? SUBJECTS[template] ?? "Ooble", data);
    finalText = text; // laissé optionnel pour les templates
  } else if (html) {
    // ─── Mode custom (staff a écrit le contenu) ───────────
    if (!subject?.trim()) return json({ error: "Champ 'subject' requis en mode custom." }, 400);
    finalHtml = wrapCustomBody({ bodyHtml: html, assetBase });
    finalSubject = subject.trim();
    finalText = text ?? htmlToText(html);
  } else {
    return json({ error: "Fournir soit 'template', soit 'html'." }, 400);
  }

  const body: Record<string, unknown> = {
    from,
    to,
    subject: finalSubject,
    html: finalHtml,
  };
  if (finalText) body.text = finalText;
  if (cc?.length) body.cc = cc;
  if (bcc?.length) body.bcc = bcc;
  if (replyTo) body.reply_to = replyTo;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const result = await res.json().catch(() => ({}));
  if (!res.ok) return json({ error: "Échec Resend", detail: result }, res.status);
  return json({ ok: true, id: result.id });
});
