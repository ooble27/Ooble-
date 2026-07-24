import { supabase } from "@/integrations/supabase/client";

/** Templates e-mail disponibles (voir emails/templates/). */
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

/**
 * Envoie un e-mail via la fonction edge `send-email` (Resend).
 * Nécessite que le domaine soit vérifié chez Resend et les secrets configurés.
 * Best-effort : renvoie une erreur lisible sans jamais lever d'exception.
 */
export async function sendEmail(input: SendEmailInput): Promise<{ id?: string; error?: string }> {
  const { data, error } = await supabase.functions.invoke("send-email", { body: input });
  if (error) return { error: error.message };
  if (data?.error) return { error: data.error };
  return { id: data?.id };
}
