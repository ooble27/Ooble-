import { Coins, HandCoins } from "lucide-react";
import { orderRef, ORDER_STATUS_FR, isOrderOpen, type OrderRow } from "@/lib/orders";
import { cn } from "@/lib/utils";

const nf = new Intl.NumberFormat("fr-CA", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
const nfUsdt = new Intl.NumberFormat("fr-CA", { maximumFractionDigits: 2 });
const dateShort = new Intl.DateTimeFormat("fr-CA", { day: "numeric", month: "short" });
const dateLong = new Intl.DateTimeFormat("fr-CA", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

/**
 * Ligne d'activité — style épuré (façon liste Gmail) : une info principale,
 * une info secondaire discrète. `detailed` ajoute la référence et l'heure
 * (utilisé sur la page dédiée, pas sur l'accueil).
 */
export const ActivityRow = ({ o, detailed = false }: { o: OrderRow; detailed?: boolean }) => {
  const buy = o.side === "buy";
  const open = isOrderOpen(o.status);
  return (
    <div className="flex items-center gap-3 py-3">
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
    </div>
  );
};
