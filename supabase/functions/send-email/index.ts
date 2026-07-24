// Fonction edge Ooble — envoi d'e-mails transactionnels & marketing via Resend.
//
// Corps attendu (POST JSON) :
//   { "to": "client@exemple.ca", "template": "order-buy",
//     "vars": { "ref": "OOB-…", "cadAmount": "500,00", ... },
//     "subject": "(optionnel, sinon sujet par défaut du template)" }
//
// Secrets requis (Supabase → Edge Functions → Secrets) :
//   RESEND_API_KEY   clé API Resend
//   EMAIL_FROM       ex. "Ooble <bonjour@ooble.ca>"  (domaine vérifié)
//   EMAIL_ASSET_BASE ex. "https://ooble.ca/email-assets"  (où sont les PNG)
//
// Tant que le domaine n'est pas acheté/vérifié, la fonction se déploie mais
// l'envoi renverra une erreur Resend explicite (from non vérifié).

import { TEMPLATES, SUBJECTS } from "./templates.ts";

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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "Méthode non autorisée" }, 405);

  const apiKey = Deno.env.get("RESEND_API_KEY");
  const from = Deno.env.get("EMAIL_FROM") ?? "Ooble <onboarding@resend.dev>";
  const assetBase = Deno.env.get("EMAIL_ASSET_BASE") ?? "https://ooble.ca/email-assets";
  if (!apiKey) return json({ error: "RESEND_API_KEY manquant." }, 500);

  let payload: { to?: string; template?: string; vars?: Record<string, string>; subject?: string };
  try {
    payload = await req.json();
  } catch {
    return json({ error: "JSON invalide." }, 400);
  }

  const { to, template, vars = {}, subject } = payload;
  if (!to || !template) return json({ error: "Champs 'to' et 'template' requis." }, 400);
  if (!(template in TEMPLATES)) return json({ error: `Template inconnu : ${template}` }, 400);

  const data: Record<string, string> = {
    assetBase,
    year: String(new Date().getFullYear()),
    unsubscribeUrl: vars.unsubscribeUrl ?? "#",
    ...vars,
  };

  const html = render(TEMPLATES[template], data);
  const finalSubject = render(subject ?? SUBJECTS[template] ?? "Ooble", data);

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to, subject: finalSubject, html }),
  });

  const result = await res.json().catch(() => ({}));
  if (!res.ok) return json({ error: "Échec Resend", detail: result }, res.status);
  return json({ ok: true, id: result.id });
});
