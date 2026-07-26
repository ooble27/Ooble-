import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type KycStatus = Database["public"]["Enums"]["kyc_status"];

export interface ClientProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  kycStatus: KycStatus;
  dailyLimitCad: number;
  interacQuestion: string | null;
  interacAnswer: string | null;
  createdAt: string;
  orderCount: number;
  totalCad: number;
}

export interface ClientOrder {
  id: string;
  side: "buy" | "sell";
  status: string;
  cadAmount: number;
  usdtAmount: number;
  createdAt: string;
}

const KYC_LABEL: Record<KycStatus, string> = {
  not_started: "Non commencée",
  pending: "En cours de vérification",
  approved: "Approuvée",
  rejected: "Refusée",
};

export { KYC_LABEL };

export async function fetchClientProfile(userId: string): Promise<ClientProfile | null> {
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, phone, kyc_status, daily_limit_cad, interac_question, interac_answer, created_at")
    .eq("id", userId)
    .maybeSingle();
  if (error || !profile) return null;

  const { count } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);

  const { data: totals } = await supabase
    .from("orders")
    .select("cad_amount")
    .eq("user_id", userId)
    .eq("status", "completed");

  const totalCad = (totals ?? []).reduce((s, o) => s + Number(o.cad_amount), 0);

  return {
    id: profile.id,
    fullName: profile.full_name?.trim() || "Client",
    email: profile.email ?? "",
    phone: profile.phone,
    kycStatus: profile.kyc_status,
    dailyLimitCad: profile.daily_limit_cad,
    interacQuestion: profile.interac_question,
    interacAnswer: profile.interac_answer,
    createdAt: profile.created_at,
    orderCount: count ?? 0,
    totalCad,
  };
}

export async function fetchClientOrders(userId: string): Promise<ClientOrder[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("id, side, status, cad_amount, usdt_amount, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map((o) => ({
    id: o.id,
    side: o.side,
    status: o.status,
    cadAmount: Number(o.cad_amount),
    usdtAmount: Number(o.usdt_amount),
    createdAt: o.created_at,
  }));
}
