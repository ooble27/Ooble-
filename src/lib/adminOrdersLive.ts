/**
 * Back-office — accès aux vraies commandes Supabase.
 *
 * Le back-office a été conçu autour du type `AdminOrder` (modèle démo). Plutôt
 * que de tout réécrire, on branche la base ici : on lit les vraies commandes,
 * on les convertit vers `AdminOrder`, et on répercute les changements de statut
 * dans la base. L'UID reste identique côté composants.
 */
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { DB_TO_NET, orderRef } from "@/lib/orders";
import { CURRENT_OPERATOR, nfCad, nfUsdt, type AdminOrder, type OrderStatus } from "@/lib/adminOrders";
import { sendEmail } from "@/lib/email";
import { NETWORKS } from "@/components/app/networks";

type DbStatus = Database["public"]["Enums"]["order_status"];
type OrderRow = Database["public"]["Tables"]["orders"]["Row"];
type RowWithProfile = OrderRow & { profiles: { full_name: string | null; email: string | null } | null };

/** Statut base → statut d'affichage du back-office. */
const DB_TO_DEMO: Record<DbStatus, OrderStatus> = {
  created: "attente",
  awaiting_payment: "attente",
  payment_received: "recu",
  settling: "cours",
  completed: "termine",
  cancelled: "annule",
  expired: "annule",
};

/** Statut d'affichage → statut base (pour l'écriture). */
const DEMO_TO_DB: Record<OrderStatus, DbStatus> = {
  attente: "awaiting_payment",
  recu: "payment_received",
  cours: "settling",
  termine: "completed",
  annule: "cancelled",
};

const minsAgo = (iso: string) =>
  Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));

/** Convertit une ligne base (+ profil) vers le modèle du back-office. */
function toAdminOrder(row: RowWithProfile, currentUid: string | null): AdminOrder {
  const assigned = row.assigned_to
    ? (row.assigned_to === currentUid ? CURRENT_OPERATOR : "Équipe")
    : null;
  return {
    id: row.id,
    ref: orderRef(row.id),
    type: row.side, // 'buy' | 'sell'
    status: DB_TO_DEMO[row.status],
    userId: row.user_id,
    clientName: row.profiles?.full_name?.trim() || "Client",
    clientEmail: row.profiles?.email ?? row.interac_email ?? "",
    cad: Number(row.cad_amount),
    usdt: Number(row.usdt_amount),
    rate: Number(row.locked_rate),
    network: DB_TO_NET[row.network],
    address: row.wallet_address,
    interacEmail: row.interac_email ?? undefined,
    createdMinsAgo: minsAgo(row.created_at),
    assignedTo: assigned,
  };
}

/** Supprime définitivement une commande (RLS : admin uniquement). */
export async function deleteOrder(id: string): Promise<{ error?: string }> {
  const { error } = await supabase.from("orders").delete().eq("id", id);
  return error ? { error: error.message } : {};
}

/** Lit toutes les commandes (le staff les voit toutes via RLS). */
export async function fetchAdminOrders(): Promise<AdminOrder[]> {
  const { data: auth } = await supabase.auth.getUser();
  const uid = auth.user?.id ?? null;

  const { data, error } = await supabase
    .from("orders")
    .select("*, profiles(full_name, email)")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return (data as RowWithProfile[]).map((r) => toAdminOrder(r, uid));
}

/**
 * Répercute un changement d'état en base : statut et/ou prise en charge.
 * Best-effort — journalise aussi l'événement (ignoré si la policy manque).
 */
export async function persistOrderPatch(
  id: string,
  changes: Partial<Pick<AdminOrder, "status" | "assignedTo">>,
): Promise<{ error?: string }> {
  const { data: auth } = await supabase.auth.getUser();
  const uid = auth.user?.id ?? null;

  const update: Partial<OrderRow> = {};
  if (changes.status) update.status = DEMO_TO_DB[changes.status];
  if ("assignedTo" in changes) {
    if (changes.assignedTo === CURRENT_OPERATOR) {
      update.assigned_to = uid;
      update.assigned_at = new Date().toISOString();
    } else if (changes.assignedTo === null) {
      update.assigned_to = null;
      update.assigned_at = null;
    }
  }
  if (Object.keys(update).length === 0) return {};

  const { error } = await supabase.from("orders").update(update).eq("id", id);
  if (error) return { error: error.message };

  // Journal d'audit (best-effort).
  if (changes.status) {
    await supabase.from("order_events").insert({
      order_id: id,
      new_status: DEMO_TO_DB[changes.status],
      actor: uid ?? "staff",
    });
  }

  // E-mails transactionnels (best-effort, fire-and-forget).
  if (changes.status === "recu" || changes.status === "termine") {
    void notifyClient(id, changes.status);
  }

  return {};
}

async function notifyClient(orderId: string, newStatus: "recu" | "termine") {
  const { data } = await supabase
    .from("orders")
    .select("*, profiles(full_name, email)")
    .eq("id", orderId)
    .single();
  if (!data) return;
  const row = data as RowWithProfile;
  const to = row.profiles?.email ?? row.interac_email;
  if (!to) return;

  const ref = orderRef(row.id);
  const net = NETWORKS.find((n) => n.id === DB_TO_NET[row.network]);
  const networkLabel = net ? `${net.name} · ${net.tag}` : "—";
  const orderUrl = `${window.location.origin}/app`;

  if (newStatus === "recu") {
    const amount = row.side === "buy"
      ? `${nfCad.format(Number(row.cad_amount))} CAD`
      : `${nfUsdt.format(Number(row.usdt_amount))} USDT`;
    void sendEmail({
      to,
      template: "payment-received",
      vars: {
        ref,
        amount,
        usdtAmount: nfUsdt.format(Number(row.usdt_amount)),
        orderUrl,
      },
    });
  } else {
    const isBuy = row.side === "buy";
    void sendEmail({
      to,
      template: "order-completed",
      vars: {
        ref,
        summaryLabel: isBuy ? "Vous avez reçu" : "Vous avez vendu",
        summaryValue: isBuy
          ? `${nfUsdt.format(Number(row.usdt_amount))} USDT`
          : `${nfCad.format(Number(row.cad_amount))} CAD`,
        network: networkLabel,
        txHash: "—",
        orderUrl,
      },
    });
  }
}
