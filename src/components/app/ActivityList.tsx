import { Coins, HandCoins, ChevronRight } from "lucide-react";
import { orderRef, ORDER_STATUS_FR, isOrderOpen, DB_TO_NET, type OrderRow } from "@/lib/orders";
import { NETWORKS } from "@/components/app/networks";
import { cn } from "@/lib/utils";

const nf = new Intl.NumberFormat("fr-CA", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
const nfUsdt = new Intl.NumberFormat("fr-CA", { maximumFractionDigits: 2 });
const dateShort = new Intl.DateTimeFormat("fr-CA", { day: "numeric", month: "short" });
const dateLong = new Intl.DateTimeFormat("fr-CA", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

export const ActivityRow = ({ o, detailed = false, onClick }: { o: OrderRow; detailed?: boolean; onClick?: () => void }) => {
  const buy = o.side === "buy";
  const open = isOrderOpen(o.status);
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 py-3 text-left transition-colors",
        onClick && "hover:bg-secondary/30 active:bg-secondary/50",
      )}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-foreground/70">
        {buy ? <Coins className="h-[18px] w-[18px]" strokeWidth={1.7} /> : <HandCoins className="h-[18px] w-[18px]" strokeWidth={1.7} />}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[14px] font-medium">
          {buy ? "Achat" : "Vente"} · {nfUsdt.format(Number(o.usdt_amount))} USDT
        </p>
        <p className={cn("truncate text-[12px]", open ? "text-primary" : "text-muted-foreground")}>
          {ORDER_STATUS_FR[o.status]}
          {detailed && <span className="text-muted-foreground"> · {orderRef(o.id)}</span>}
        </p>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-[13px] font-semibold">{nf.format(Number(o.cad_amount))} CAD</p>
        <p className="text-[11.5px] text-muted-foreground">
          {(detailed ? dateLong : dateShort).format(new Date(o.created_at))}
        </p>
      </div>
      {onClick && <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />}
    </button>
  );
};

/** Détail d'une commande — affiché inline sous la ligne quand on clique. */
export const OrderDetail = ({ o }: { o: OrderRow }) => {
  const buy = o.side === "buy";
  const netId = DB_TO_NET[o.network];
  const network = NETWORKS.find((n) => n.id === netId);

  const rows = [
    { label: "Référence", value: orderRef(o.id) },
    { label: "Type", value: buy ? "Achat USDT" : "Vente USDT" },
    { label: "Montant USDT", value: `${nfUsdt.format(Number(o.usdt_amount))} USDT` },
    { label: "Montant CAD", value: `${nf.format(Number(o.cad_amount))} CAD` },
    { label: "Taux verrouillé", value: `1 USDT = ${nf.format(Number(o.locked_rate))} CAD` },
    { label: "Réseau", value: network ? `${network.name} · ${network.tag}` : "—" },
    ...(buy && o.wallet_address ? [{ label: "Adresse", value: o.wallet_address, mono: true }] : []),
    ...(!buy && o.interac_email ? [{ label: "E-mail Interac", value: o.interac_email, mono: true }] : []),
    { label: "Statut", value: ORDER_STATUS_FR[o.status] },
    { label: "Créé le", value: dateLong.format(new Date(o.created_at)) },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-top-2 overflow-hidden rounded-[14px] border border-border bg-secondary/30">
      {rows.map((r, i) => (
        <div key={r.label} className={cn("flex items-start justify-between px-4 py-[11px]", i < rows.length - 1 && "border-b border-border/60")}>
          <span className="text-[12px] text-muted-foreground">{r.label}</span>
          <span className={cn(
            "max-w-[60%] break-all text-right text-[12.5px] font-medium",
            "mono" in r && r.mono && "font-mono text-[11px]",
          )}>
            {r.value}
          </span>
        </div>
      ))}
    </div>
  );
};
