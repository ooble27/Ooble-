// Fonction edge Ooble — webhook e-mails entrants (Resend Inbound).
//
// Reçoit les e-mails envoyés à `support@ooble.ca` et les insère dans
// la table `mail_messages`, rattachés au bon thread. Le thread est
// identifié par le plus-addressing de l'adresse de destination :
//
//   support+t.{threadId}@ooble.ca  →  rattaché au thread existant
//   support@ooble.ca (sans +t.)    →  nouveau thread créé automatiquement
//
// Cette fonction est déployée SANS vérification JWT (--no-verify-jwt)
// car Resend l'appelle directement sans authentification Supabase.
//
// Secrets requis :
//   SUPABASE_URL              (auto Supabase)
//   SUPABASE_SERVICE_ROLE_KEY (auto Supabase)
//   MAIL_WEBHOOK_SECRET       (optionnel) signature Resend pour valider l'appel

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function extractEmail(raw: string): string {
  const match = /<([^>]+)>/.exec(raw);
  return (match ? match[1] : raw).trim().toLowerCase();
}

function extractName(raw: string): string {
  const match = /^"?([^"<]+)"?\s*</.exec(raw);
  return match ? match[1].trim() : "";
}

function cleanSubject(s: string): string {
  return s.replace(/^(Re|Fwd|Tr|Fw)\s*:\s*/gi, "").trim() || s;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return json({ error: "POST only" }, 405);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey) return json({ error: "Config manquante" }, 500);

  let payload: Record<string, unknown>;
  try { payload = await req.json(); }
  catch { return json({ error: "JSON invalide" }, 400); }

  // Resend Inbound envoie { type: "email.received", data: { ... } }
  if (payload.type !== "email.received") return json({ ok: true, skipped: true });

  const data = payload.data as Record<string, unknown> | undefined;
  if (!data) return json({ ok: true, skipped: true });

  // `from` peut être une string ("Nom <a@b.c>"), un objet {email, name},
  // ou un tableau d'objets. On normalise.
  const fromField = data.from as unknown;
  let fromRaw = "";
  let fromNameFromObj = "";
  if (typeof fromField === "string") {
    fromRaw = fromField;
  } else if (Array.isArray(fromField) && fromField.length > 0) {
    const f = fromField[0] as { email?: string; name?: string };
    fromRaw = f?.email ?? "";
    fromNameFromObj = f?.name ?? "";
  } else if (fromField && typeof fromField === "object") {
    const f = fromField as { email?: string; name?: string };
    fromRaw = f?.email ?? "";
    fromNameFromObj = f?.name ?? "";
  }

  const senderEmail = extractEmail(fromRaw);
  const senderName = extractName(fromRaw)
    || fromNameFromObj
    || ((data.from_name as string) ?? "");

  const subject = (data.subject as string) ?? "";

  // `text` / `html` peuvent être aux racines OU dans un objet imbriqué
  // (variantes Resend). On fait des fallbacks explicites.
  const bodyText = (data.text as string)
    || (data.plain_text as string)
    || (data.stripped_text as string)
    || "";
  const bodyHtml = (data.html as string)
    || (data.body_html as string)
    || "";

  // `to` peut être un tableau de strings OU un tableau d'objets {email}.
  const toRaw = Array.isArray(data.to) ? data.to : [];
  const toAddresses: string[] = toRaw.map((x: unknown) => {
    if (typeof x === "string") return x;
    if (x && typeof x === "object") return (x as { email?: string }).email ?? "";
    return "";
  }).filter(Boolean);

  const resendId = (data.email_id as string) ?? (data.id as string) ?? null;

  // Debug : si tout est vide, on stocke le payload brut comme corps du
  // message pour qu'il soit visible dans le back-office et qu'on comprenne
  // quel format Resend nous envoie exactement.
  const debugDump = (!bodyText && !bodyHtml)
    ? `[DEBUG payload brut Resend — texte et html vides]\n\n${JSON.stringify(payload, null, 2).slice(0, 6000)}`
    : null;
  if (debugDump) {
    console.warn("mail-webhook: text ET html vides — payload complet:", JSON.stringify(payload).slice(0, 4000));
  }
  const effectiveBodyText = bodyText || debugDump;

  // Extraire l'ID du thread depuis le plus-addressing :
  //   support+t.{uuid}@ooble.ca  →  thread existant
  let threadId: string | null = null;
  for (const addr of toAddresses) {
    const match = /^support\+t\.([a-f0-9-]{36})@/i.exec(extractEmail(addr));
    if (match) { threadId = match[1]; break; }
  }

  const admin = createClient(supabaseUrl, serviceKey);

  if (threadId) {
    // Thread connu — vérifier qu'il existe avant d'insérer.
    const { data: thread } = await admin
      .from("mail_threads")
      .select("id")
      .eq("id", threadId)
      .maybeSingle();

    if (thread) {
      await admin.from("mail_messages").insert({
        thread_id: threadId,
        direction: "inbound",
        from_email: senderEmail,
        from_name: senderName || null,
        to_email: toAddresses[0] ?? "",
        subject,
        body_text: effectiveBodyText,
        body_html: bodyHtml || null,
        resend_id: resendId,
      });
      return json({ ok: true, threadId, action: "message_added" });
    }
    // Thread ID invalide : on tombe dans le cas « nouveau thread ».
  }

  // Thread inconnu — en créer un nouveau.
  // Tenter de rattacher le client par e-mail.
  const { data: profile } = await admin
    .from("profiles")
    .select("id, full_name")
    .eq("email", senderEmail)
    .maybeSingle();

  const { data: newThread, error: threadErr } = await admin
    .from("mail_threads")
    .insert({
      client_id: profile?.id ?? null,
      client_email: senderEmail,
      client_name: senderName || profile?.full_name || null,
      subject: cleanSubject(subject),
      last_message_at: new Date().toISOString(),
      has_unread: true,
    })
    .select("id")
    .single();

  if (threadErr || !newThread) {
    console.error("mail-webhook: erreur création thread", threadErr);
    return json({ error: "Échec création thread" }, 500);
  }

  await admin.from("mail_messages").insert({
    thread_id: newThread.id,
    direction: "inbound",
    from_email: senderEmail,
    from_name: senderName || null,
    to_email: toAddresses[0] ?? "",
    subject,
    body_text: bodyText || null,
    body_html: bodyHtml || null,
    resend_id: resendId,
  });

  return json({ ok: true, threadId: newThread.id, action: "thread_created" });
});
