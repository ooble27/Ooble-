import { supabase } from "@/integrations/supabase/client";

export interface MyProfile {
  fullName: string | null;
  email: string | null;
  sellRef: string | null;
}

/** Profil de l'utilisateur connecté (RLS : le sien uniquement). */
export async function getMyProfile(): Promise<MyProfile | null> {
  const { data: auth } = await supabase.auth.getUser();
  const uid = auth.user?.id;
  if (!uid) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select("full_name, email, sell_ref")
    .eq("id", uid)
    .maybeSingle();
  if (error || !data) return null;
  return { fullName: data.full_name, email: data.email, sellRef: data.sell_ref };
}
