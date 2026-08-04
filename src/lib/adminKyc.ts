/**
 * Back-office — vérifications KYC réelles (table kyc_verifications).
 * Convertit vers le modèle d'affichage `KycRequest` et persiste les décisions.
 */
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import type { KycRequest, KycStatus } from "@/lib/adminOrders";
import { logAdminAction } from "@/lib/audit";

type DbKycStatus = Database["public"]["Enums"]["kyc_status"];
type KycRow = Database["public"]["Tables"]["kyc_verifications"]["Row"];
type RowWithProfile = KycRow & { profiles: { full_name: string | null; email: string | null } | null };

/** Statut base → statut d'affichage. */
const DB_TO_DEMO: Record<DbKycStatus, KycStatus> = {
  not_started: "attente",
  pending: "attente",
  approved: "verifie",
  rejected: "refuse",
};
/** Statut d'affichage → statut base (écriture). */
const DEMO_TO_DB: Record<KycStatus, DbKycStatus> = {
  attente: "pending",
  verifie: "approved",
  refuse: "rejected",
};

const minsAgo = (iso: string) =>
  Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));

/** Lit les vérifications KYC (staff KYC/admin via RLS). */
export async function fetchKyc(): Promise<KycRequest[]> {
  const { data, error } = await supabase
    .from("kyc_verifications")
    .select("*, profiles(full_name, email)")
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return (data as RowWithProfile[]).map((r) => {
    const payload = (r.result_payload ?? {}) as { doc_type?: string };
    return {
      id: r.id,
      clientName: r.profiles?.full_name?.trim() || "Client",
      email: r.profiles?.email ?? "",
      docType: payload.doc_type || "Pièce d'identité",
      submittedMinsAgo: minsAgo(r.created_at),
      status: DB_TO_DEMO[r.status],
    };
  });
}

/** Met à jour le statut d'une vérification. */
export async function setKycStatus(id: string, status: KycStatus): Promise<{ error?: string }> {
  // Snapshot avant décision pour l'audit.
  const { data: before } = await supabase
    .from("kyc_verifications")
    .select("id, user_id, status")
    .eq("id", id)
    .maybeSingle();

  const newDbStatus = DEMO_TO_DB[status];
  const { error } = await supabase
    .from("kyc_verifications")
    .update({ status: newDbStatus })
    .eq("id", id);
  if (error) return { error: error.message };

  // Audit — approbation / refus.
  const action = status === "verifie" ? "kyc.approve" : status === "refuse" ? "kyc.reject" : null;
  if (action) {
    void logAdminAction({
      action,
      entityKind: "kyc",
      entityId: id,
      before,
      after: { ...(before ?? { id }), status: newDbStatus },
      metadata: { client_user_id: before?.user_id ?? null },
    });
  }
  return {};
}
