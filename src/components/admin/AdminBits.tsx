import { cn } from "@/lib/utils";
import { STATUS_META, TYPE_META, type AdminOrder, type OrderStatus, type OrderType } from "@/lib/adminOrders";
import { NETWORKS } from "@/components/app/networks";

/** Pastille de statut (point coloré + libellé), sobre sur blanc. */
export const StatusBadge = ({ status }: { status: OrderStatus }) => {
  const m = STATUS_META[status];
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-border bg-card px-2.5 py-1 text-[12px] font-medium">
      <span className={cn("h-1.5 w-1.5 rounded-full", m.dot)} />
      <span className={m.tone}>{m.label}</span>
    </span>
  );
};

/** Libellé du type d'opération. */
export const TypeTag = ({ type }: { type: OrderType }) => (
  <span className="whitespace-nowrap text-[13px] font-medium">{TYPE_META[type].label}</span>
);

/** Réseau (logo + nom) ou canal Interac selon le type. */
export const Channel = ({ order }: { order: AdminOrder }) => {
  if (order.type === "sell") {
    return <span className="text-[13px] text-muted-foreground">Interac e-Transfer</span>;
  }
  const net = NETWORKS.find((n) => n.id === order.network);
  if (!net) return <span className="text-[13px] text-muted-foreground">—</span>;
  return (
    <span className="inline-flex items-center gap-2">
      <img src={`/coins/${net.id}.svg`} alt="" className="h-5 w-5 rounded-full" draggable={false} />
      <span className="text-[13px] text-muted-foreground">{net.name} · {net.tag}</span>
    </span>
  );
};

/** Avatar initiales du client. */
export const ClientCell = ({ name, email }: { name: string; email: string }) => {
  const initials = name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-[11px] font-semibold text-foreground/70">
        {initials}
      </span>
      <div className="min-w-0">
        <p className="truncate text-[13px] font-medium leading-tight">{name}</p>
        <p className="truncate text-[12px] leading-tight text-muted-foreground">{email}</p>
      </div>
    </div>
  );
};
