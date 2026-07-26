import { Coins, HandCoins, ChevronRight } from "lucide-react";
import { orderRef, ORDER_STATUS_FR, isOrderOpen, DB_TO_NET, type OrderRow } from "@/lib/orders";
import { NETWORKS } from "@/components/app/networks";
import BottomSheet from "@/components/app/BottomSheet";
import CopyRow from "@/components/app/CopyRow";
import { cn } from "@/lib/utils";

const nf = new Intl.NumberFormat("fr-CA", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
const nfUsdt = new Intl.NumberFormat("fr-CA", { maximumFractionDigits: 2 });
const dateShort = new Intl.DateTimeFormat("fr-CA", { day: "numeric", month: "short" });
const dateLong = new Intl.DateTimeFormat("fr-CA", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });

/**
 * Ligne d'activité épurée — icône, type, statut, montant CAD, date courte.
 * Le détail USDT, réseau, adresse etc. est réservé au sheet.
 */
export const ActivityRow = ({ o, onClick }: { o: OrderRow; onClick?: () => void }) => {
  const buy = o.side === "buy";
  const open = isOrderOpen(o.status);
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 py-3.5 text-left transition-colors",
        onClick && "hover:bg-secondary/30 active:bg-secondary/50",
      )}
    >
      <span className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
        buy ? "bg-primary/10 text-primary" : "bg-secondary text-foreground/70",
      )}>
        {buy ? <Coins className="h-[18px] w-[18px]" strokeWidth={1.7} /> : <HandCoins className="h-[18px] w-[18px]" strokeWidth={1.7} />}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[14px] font-medium">
          {buy ? "Achat" : "Vente"} USDT
        </p>
        <p className={cn("truncate text-[12px]", open ? "text-primary" : "text-muted-foreground")}>
          {ORDER_STATUS_FR[o.status]}
        </p>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-[14px] font-semibold">{nf.format(Number(o.cad_amount))} $</p>
        <p className="text-[11.5px] text-muted-foreground">
          {dateShort.format(new Date(o.created_at))}
        </p>
      </div>
      {onClick && <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/50" />}
    </button>
  );
};

/** Bottom sheet avec le détail complet d'une commande. */
export const OrderDetailSheet = ({ o, open, onClose }: { o: OrderRow | null; open: boolean; onClose: () => void }) => {
  if (!o) return null;
  const buy = o.side === "buy";
  const netId = DB_TO_NET[o.network];
  const network = NETWORKS.find((n) => n.id === netId);
  const statusOpen = isOrderOpen(o.status);

  return (
    <BottomSheet open={open} onClose={onClose} title={buy ? "Détail de l'achat" : "Détail de la vente"}>
      {/* Montant principal */}
      <div className="mb-5 flex flex-col items-center text-center">
        <span className={cn(
          "mb-3 flex h-12 w-12 items-center justify-center rounded-2xl",
          buy ? "bg-primary/10 text-primary" : "bg-secondary text-foreground/70",
        )}>
          {buy ? <Coins className="h-6 w-6" strokeWidth={1.5} /> : <HandCoins className="h-6 w-6" strokeWidth={1.5} />}
        </span>
        <p className="font-display text-[28px] font-light tracking-tight">
          {nfUsdt.format(Number(o.usdt_amount))} <span className="text-[18px] text-muted-foreground">USDT</span>
        </p>
        <p className="mt-1 text-[14px] text-muted-foreground">{nf.format(Number(o.cad_amount))} CAD</p>
        <span className={cn(
          "mt-3 inline-flex rounded-full px-3 py-1 text-[12px] font-semibold",
          statusOpen ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground",
        )}>
          {ORDER_STATUS_FR[o.status]}
        </span>
      </div>

      {/* Détails */}
      <div className="overflow-hidden rounded-[14px] border border-border">
        {[
          { label: "Référence", value: orderRef(o.id), copy: true },
          { label: "Taux", value: `1 USDT = ${nf.format(Number(o.locked_rate))} CAD` },
          { label: "Réseau", value: network ? `${network.name} · ${network.tag}` : "—" },
          ...(buy && o.wallet_address && o.wallet_address !== "à générer"
            ? [{ label: "Adresse de réception", value: o.wallet_address, mono: true, copy: true }]
            : []),
          ...(!buy && o.interac_email
            ? [{ label: "E-mail Interac", value: o.interac_email, mono: true }]
            : []),
          { label: "Date", value: dateLong.format(new Date(o.created_at)) },
        ].map((r, i, arr) => (
          "copy" in r && r.copy ? (
            <div key={r.label} className={cn(i < arr.length - 1 && "border-b border-border")}>
              <CopyRow label={r.label} value={r.value} mono={"mono" in r && !!r.mono} />
            </div>
          ) : (
            <div key={r.label} className={cn("flex items-start justify-between px-4 py-3", i < arr.length - 1 && "border-b border-border")}>
              <span className="text-[12.5px] text-muted-foreground">{r.label}</span>
              <span className={cn(
                "max-w-[60%] break-all text-right text-[12.5px] font-medium",
                "mono" in r && r.mono && "font-mono text-[11px]",
              )}>
                {r.value}
              </span>
            </div>
          )
        ))}
      </div>
    </BottomSheet>
  );
};
