import { ArrowRight, Check, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  TYPE_META, nfCad, nfUsdt, timeAgo,
  type AdminOrder, type OrderStatus,
} from "@/lib/adminOrders";
import { StatusBadge, ClientCell, Channel } from "./AdminBits";

interface Props {
  orders: AdminOrder[];
  onOpen: (order: AdminOrder) => void;
  onAdvance: (id: string, status: OrderStatus) => void;
}

/** File d'attente : commandes reçues à traiter + celles en cours. */
const OrdersQueue = ({ orders, onOpen, onAdvance }: Props) => {
  // À traiter d'abord (recu), puis en cours (cours) ; plus anciennes en haut.
  const queue = orders
    .filter((o) => o.status === "recu" || o.status === "cours")
    .sort((a, b) => {
      if (a.status !== b.status) return a.status === "recu" ? -1 : 1;
      return b.createdMinsAgo - a.createdMinsAgo;
    });

  if (queue.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-border bg-card py-16 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
          <Inbox className="h-6 w-6" strokeWidth={1.6} />
        </span>
        <p className="mt-4 text-[15px] font-medium">File vide</p>
        <p className="mt-1 text-sm text-muted-foreground">Aucune commande à traiter pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {queue.map((o) => (
        <div
          key={o.id}
          className="flex cursor-pointer flex-col rounded-2xl border border-border bg-card p-4 transition-colors hover:bg-secondary/40"
          onClick={() => onOpen(o)}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[13px] font-semibold">{o.ref}</span>
            <StatusBadge status={o.status} />
          </div>

          <div className="mt-3">
            <ClientCell name={o.clientName} email={o.clientEmail} />
          </div>

          <div className="mt-3 flex items-end justify-between border-t border-border pt-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                {TYPE_META[o.type].label}
              </p>
              <p className="mt-0.5 text-[15px] font-semibold">
                {o.type === "buy" ? `${nfCad.format(o.cad)} CAD` : `${nfUsdt.format(o.usdt)} USDT`}
              </p>
            </div>
            <span className="text-[12px] text-muted-foreground">{timeAgo(o.createdMinsAgo)}</span>
          </div>

          <div className="mt-2.5"><Channel order={o} /></div>

          {/* Actions rapides */}
          <div className="mt-4 flex gap-2" onClick={(e) => e.stopPropagation()}>
            {o.status === "recu" ? (
              <Button variant="appPrimary" shape="soft" className="h-auto flex-1 gap-2 py-[10px] text-[13px]"
                      onClick={() => onAdvance(o.id, "cours")}>
                <ArrowRight className="h-4 w-4" /> Prendre en charge
              </Button>
            ) : (
              <Button variant="appPrimary" shape="soft" className="h-auto flex-1 gap-2 py-[10px] text-[13px]"
                      onClick={() => onAdvance(o.id, "termine")}>
                <Check className="h-4 w-4" /> Marquer terminé
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrdersQueue;
