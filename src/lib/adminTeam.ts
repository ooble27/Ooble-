/**
 * Back-office — équipe réelle (table user_roles + profiles).
 * L'admin voit les membres et modifie leur rôle (RLS : admin uniquement).
 */
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import type { TeamRole } from "@/lib/adminOrders";

type AppRole = Database["public"]["Enums"]["app_role"];

export interface LiveTeamMember {
  userId: string;
  name: string;
  email: string;
  role: TeamRole;
}

const APP_TO_TEAM: Record<AppRole, TeamRole> = {
  admin: "Admin",
  operator: "Opérateur",
  kyc_reviewer: "KYC",
  support: "Support",
  marketing: "Marketing",
};
export const TEAM_TO_APP: Record<TeamRole, AppRole> = {
  Admin: "admin",
  Opérateur: "operator",
  KYC: "kyc_reviewer",
  Support: "support",
  Marketing: "marketing",
};

/** Priorité d'affichage si un membre cumule plusieurs rôles. */
const ROLE_RANK: AppRole[] = ["admin", "operator", "kyc_reviewer", "support", "marketing"];

/** Liste les membres de l'équipe (un rôle affiché par membre). */
export async function fetchTeam(): Promise<LiveTeamMember[]> {
  const { data: roles, error } = await supabase.from("user_roles").select("user_id, role");
  if (error || !roles || roles.length === 0) return [];

  const ids = [...new Set(roles.map((r) => r.user_id))];
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .in("id", ids);
  const byId = new Map((profiles ?? []).map((p) => [p.id, p]));

  // Rôle le plus élevé par utilisateur.
  const topRole = new Map<string, AppRole>();
  for (const r of roles) {
    const cur = topRole.get(r.user_id);
    if (!cur || ROLE_RANK.indexOf(r.role) < ROLE_RANK.indexOf(cur)) topRole.set(r.user_id, r.role);
  }

  return ids.map((id) => {
    const p = byId.get(id);
    return {
      userId: id,
      name: p?.full_name?.trim() || "Membre",
      email: p?.email ?? "",
      role: APP_TO_TEAM[topRole.get(id) ?? "support"],
    };
  });
}

/** Remplace le rôle d'un membre (un seul rôle actif à la fois). */
export async function setMemberRole(userId: string, role: TeamRole): Promise<{ error?: string }> {
  const { error: delErr } = await supabase.from("user_roles").delete().eq("user_id", userId);
  if (delErr) return { error: delErr.message };
  const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: TEAM_TO_APP[role] });
  return error ? { error: error.message } : {};
}
