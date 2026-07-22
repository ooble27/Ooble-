import { X, ArrowRight, Check, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  STATUS_META, TYPE_META, nfCad, nfUsdt, timeAgo,
  type AdminOrder, type OrderStatus,
} from "@/lib/adminOrders";
import { StatusBadge, Channel } from "./AdminBits";

const Row = ({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) => (
  <div className="flex items-start justify-between gap-4 px-5 py-3">
    <span className="shrink-0 text-[13px] text-muted-foreground">{label}</span>
    <span className={cn("min-w-0 break-all text-right text-[13px] font-medium", mono && "font-mono text-[12px]")}>{value}</span>
  </div>
);

interface Props {
  order: AdminOrder | null;
  onClose: () => void;
  onAdvance: (id: string, status: OrderStatus) => void;
}

/** Tiroir latéral : détail complet d'une commande + actions de traitement. */
const OrderDetailSheet = ({ order, onClose, onAdvance }: Props) => {
  const open = !!order;

  return (
    <div className={cn("fixed inset-0 z-50", open ? "pointer-events-auto" : "pointer-events-none")}>
      {/* Voile */}
      <div
        onClick={onClose}
        className={cn("absolute inset-0 bg-foreground/20 transition-opacity", open ? "opacity-100" : "opacity-0")}
      />

      {/* Panneau */}
      <aside
        className={cn(
          "absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col bg-background transition-transform duration-300",
          "border-l border-border",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        {order && (
          <>
            <header className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <p className="font-mono text-[13px] font-semibold">{order.ref}</p>
                <p className="mt-0.5 text-[12px] text-muted-foreground">
                  {TYPE_META[order.type].label} · {timeAgo(order.createdMinsAgo)}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Fermer"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card transition-colors hover:bg-secondary active:scale-95"
              >
                <X className="h-[18px] w-[18px]" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto">
              <div className="flex items-center justify-between px-5 py-4">
                <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Statut</span>
                <StatusBadge status={order.status} />
              </div>

              <div className="mx-5 divide-y divide-border rounded-[16px] border border-border bg-card">
                <Row label="Client" value={order.clientName} />
                <Row label="E-mail" value={order.clientEmail} mono />
                <Row label={order.type === "buy" ? "Le client paie" : "Le client envoie"}
                     value={order.type === "buy" ? `${nfCad.format(order.cad)} CAD` : `${nfUsdt.format(order.usdt)} USDT`} />
                <Row label={order.type === "buy" ? "Le client reçoit" : "Le client reçoit"}
                     value={order.type === "buy" ? `${nfUsdt.format(order.usdt)} USDT` : `${nfCad.format(order.cad)} CAD`} />
                <Row label="Taux" value={`1 USDT = ${nfCad.format(order.rate)} CAD`} />
                <Row label="Canal" value={<Channel order={order} />} />
                {order.address && <Row label="Adresse" value={order.address} mono />}
                {order.interacEmail && <Row label="Interac" value={order.interacEmail} mono />}
                {order.assignedTo && <Row label="Pris en charge par" value={order.assignedTo} />}
              </div>

              {/* Action à réaliser */}
              {(order.status === "recu" || order.status === "cours") && (
                <p className="mx-5 mt-4 rounded-[14px] border border-border bg-secondary/50 px-4 py-3 text-[13px] text-muted-foreground">
                  À faire : <span className="font-medium text-foreground">{TYPE_META[order.type].verb}</span>
                </p>
              )}
            </div>

            {/* Barre d'actions */}
            <footer className="flex flex-wrap gap-2.5 border-t border-border px-5 py-4">
              {order.status === "attente" && (
                <Button variant="appPrimary" shape="soft" className="h-auto flex-1 gap-2 py-[11px] text-sm"
                        onClick={() => onAdvance(order.id, "recu")}>
                  <Check className="h-[17px] w-[17px]" /> Marquer reçu
                </Button>
              )}
              {order.status === "recu" && (
                <Button variant="appPrimary" shape="soft" className="h-auto flex-1 gap-2 py-[11px] text-sm"
                        onClick={() => onAdvance(order.id, "cours")}>
                  <ArrowRight className="h-[17px] w-[17px]" /> Prendre en charge
                </Button>
              )}
              {order.status === "cours" && (
                <Button variant="appPrimary" shape="soft" className="h-auto flex-1 gap-2 py-[11px] text-sm"
                        onClick={() => onAdvance(order.id, "termine")}>
                  <Check className="h-[17px] w-[17px]" /> Marquer terminé
                </Button>
              )}
              {order.status !== "termine" && order.status !== "annule" && (
                <Button variant="appOutline" shape="soft" className="h-auto gap-2 py-[11px] text-sm"
                        onClick={() => onAdvance(order.id, "annule")}>
                  <Ban className="h-[17px] w-[17px]" /> Annuler
                </Button>
              )}
              {(order.status === "termine" || order.status === "annule") && (
                <p className="w-full text-center text-[13px] text-muted-foreground">
                  Commande {STATUS_META[order.status].label.toLowerCase()} — aucune action.
                </p>
              )}
            </footer>
          </>
        )}
      </aside>
    </div>
  );
};

export default OrderDetailSheet;
