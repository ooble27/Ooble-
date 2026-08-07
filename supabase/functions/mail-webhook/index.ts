// Fonction edge Ooble — webhook e-mails entrants (Resend Inbound).
//
// Reçoit les e-mails envoyés à `*@reply.ooble.ca` et les insère dans
// la table `mail_messages`, rattachés au bon thread. Le thread est
// identifié par le local-part de l'adresse de destination :
//
//   t.{threadId}@reply.ooble.ca  →  rattaché au thread existant
//   *@reply.ooble.ca (sans t.)   →  nouveau thread créé automatiquement
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

  const fromRaw = (data.from as string) ?? "";
  const senderEmail = extractEmail(fromRaw);
  const senderName = extractName(fromRaw) || (data.from_name as string) ?? "";
  const subject = (data.subject as string) ?? "";
  const bodyText = (data.text as string) ?? "";
  const bodyHtml = (data.html as string) ?? "";
  const toAddresses: string[] = Array.isArray(data.to) ? data.to : [];
  const resendId = (data.email_id as string) ?? null;

  // Extraire l'ID du thread depuis l'adresse de destination :
  //   t.{uuid}@reply.ooble.ca  →  thread existant
  let threadId: string | null = null;
  for (const addr of toAddresses) {
    const match = /^t\.([a-f0-9-]{36})@/i.exec(extractEmail(addr));
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
        body_text: bodyText || null,
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
