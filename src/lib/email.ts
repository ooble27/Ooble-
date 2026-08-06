/**
 * Envoi d'e-mails via la fonction edge `send-email` (Resend).
 *
 * Deux modes :
 *   - `template` : envoi transactionnel (welcome, order-buy, …), déclenché
 *     automatiquement par la plateforme sur événement (paiement reçu, etc.).
 *   - `custom` : le staff écrit le contenu depuis le back-office (sujet libre,
 *     corps HTML libre). Aucun template n'est imposé.
 *
 * Le retour est toujours `{ id?, error? }` — jamais d'exception.
 */
import { supabase } from "@/integrations/supabase/client";

/** Templates transactionnels disponibles (voir supabase/functions/send-email/templates.ts). */
export type EmailTemplate =
  | "welcome"
  | "order-buy"
  | "order-sell"
  | "payment-received"
  | "order-completed"
  | "newsletter";

export interface SendEmailInput {
  to: string;
  template: EmailTemplate;
  vars?: Record<string, string>;
  subject?: string;
}

interface SendResult { id?: string; error?: string }

async function invoke(body: unknown): Promise<SendResult> {
  const { data, error } = await supabase.functions.invoke("send-email", { body });
  // Le SDK Supabase renvoie « Edge Function returned a non-2xx status code »
  // et cache le vrai message dans `error.context.body`. On extrait le détail
  // pour que l'UI puisse afficher ce qui a vraiment échoué (clé Resend absente,
  // domaine non vérifié, adresse invalide, etc.).
  if (error) {
    let detail: string | undefined;
    try {
      const ctx = (error as unknown as { context?: Response }).context;
      if (ctx?.text) {
        const raw = await ctx.text();
        try {
          const parsed = JSON.parse(raw) as { error?: string; message?: string };
          detail = parsed.error ?? parsed.message ?? raw;
        } catch {
          detail = raw;
        }
      }
    } catch { /* ignore : on retombe sur error.message */ }
    return { error: detail || error.message };
  }
  if (data?.error) return { error: data.error };
  return { id: data?.id };
}

/**
 * Envoi par template (rétrocompatible avec le code existant).
 * Nécessite un domaine vérifié chez Resend + les secrets configurés.
 */
export async function sendEmail(input: SendEmailInput): Promise<SendResult> {
  return invoke(input);
}

/**
 * Envoi libre depuis le back-office : le staff a écrit le sujet et le corps
 * HTML lui-même. L'edge function encapsule le corps dans le layout Ooble
 * (header/footer monochromes) pour rester cohérent avec la marque.
 */
export async function sendCustomEmail(input: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  cc?: string[];
  bcc?: string[];
  replyTo?: string;
}): Promise<SendResult> {
  return invoke(input);
}
