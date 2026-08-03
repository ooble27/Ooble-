/**
 * Jeton d'accès Sumsub pour le WebSDK.
 *
 * On ne signe jamais côté client : la fonction edge `sumsub-token` génère le
 * jeton avec les secrets Sumsub, lié à l'utilisateur connecté.
 */
import { supabase } from "@/integrations/supabase/client";
import { getLang } from "@/lib/i18n";

export async function getSumsubToken(): Promise<{ token?: string; error?: string }> {
  const { data, error } = await supabase.functions.invoke<{ token?: string; error?: string }>(
    "sumsub-token",
    { method: "POST" },
  );
  if (error) return { error: error.message };
  if (data?.error) return { error: data.error };
  if (!data?.token) return { error: getLang() === "en" ? "Sumsub token unavailable." : "Jeton Sumsub indisponible." };
  return { token: data.token };
}
