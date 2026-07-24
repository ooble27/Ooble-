import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Client Supabase, piloté par les variables d'environnement.
 *
 * Tant que `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` ne sont pas
 * renseignées (voir `.env.example`), `isSupabaseConfigured` vaut `false` et
 * `supabase` reste `null` : l'app continue de tourner sur les données de
 * démonstration. Aucune bascule brutale — on branchera chaque écran un par un.
 */
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(
  url && anonKey && !url.includes("VOTRE-PROJET"),
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    })
  : null;
