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
  if (error) return { error: error.message };
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
