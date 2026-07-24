import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Client Supabase du projet Ooble.
 *
 * L'URL et la clé *publishable* (publique par nature — elle vit dans l'app
 * côté navigateur) sont inscrites ici, surchargées si besoin par les variables
 * d'environnement `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`.
 */
const DEFAULT_URL = "https://uukxacjjviiktmbikdwp.supabase.co";
const DEFAULT_KEY = "sb_publishable_BMJbWAvc4W77-fwZhRvn9g_F165LGPA";

const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined) || DEFAULT_URL;
const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) || DEFAULT_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey && !url.includes("VOTRE-PROJET"));

export const supabase: SupabaseClient = createClient(url, anonKey, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});
