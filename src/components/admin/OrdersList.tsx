import { useMemo, useState } from "react";
import { Search, Coins, HandCoins, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  TYPE_META, nfCad, nfUsdt, timeAgo,
  type AdminOrder, type OrderStatus, type OrderType,
} from "@/lib/adminOrders";
import { StatusBadge, ClientCell, SubTabs } from "./AdminBits";

interface Props {
  orders: AdminOrder[];
  onOpen: (order: AdminOrder) => void;
}

type TypeTab = "all" | OrderType;
type StatusFilter = "all" | OrderStatus;

const STATUS_FILTERS: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "Tous" },
  { id: "recu", label: "À traiter" },
  { id: "cours", label: "En cours" },
  { id: "attente", label: "En attente" },
  { id: "termine", label: "Terminées" },
  { id: "annule", label: "Annulées" },
];

const TypeCell = ({ type }: { type: OrderType }) => {
  const Icon = type === "buy" ? Coins : HandCoins;
  return (
    <span className="inline-flex items-center gap-1.5 text-[12.5px] text-muted-foreground">
      <Icon className="h-[13px] w-[13px]" strokeWidth={1.8} /> {TYPE_META[type].label}
    </span>
  );
};

const OrdersList = ({ orders, onOpen }: Props) => {
  const [type, setType] = useState<TypeTab>("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [q, setQ] = useState("");

  const byType = useMemo(
    () => ({
      all: orders,
      buy: orders.filter((o) => o.type === "buy"),
      sell: orders.filter((o) => o.type === "sell"),
    }),
    [orders],
  );

  const TABS = [
    { id: "all", label: "Toutes", count: byType.all.length },
    { id: "buy", label: "Achats", count: byType.buy.length },
    { id: "sell", label: "Ventes", count: byType.sell.length },
  ];

  const base = byType[type];
  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return base
      .filter((o) => (status === "all" ? true : o.status === status))
      .filter((o) =>
        needle === ""
          ? true
          : o.ref.toLowerCase().includes(needle) ||
            o.clientName.toLowerCase().includes(needle) ||
            o.clientEmail.toLowerCase().includes(needle),
      )
      .sort((a, b) => a.createdMinsAgo - b.createdMinsAgo);
  }, [base, q, status]);

  const cols = "grid grid-cols-[1fr_auto] md:grid-cols-[1.7fr_0.8fr_1fr_0.8fr_0.7fr] items-center gap-3";

  return (
    <div className="space-y-4">
      {/* Achats / Ventes — onglets soulignés (comme la file) */}
      <SubTabs tabs={TABS} active={type} onChange={(id) => setType(id as TypeTab)} />

      {/* Recherche (police 16px pour éviter le zoom mobile) */}
      <div className="flex items-center gap-2.5 rounded-xl border border-border bg-card px-3.5 py-2.5">
        <Search className="h-[18px] w-[18px] shrink-0 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher une référence, un client, un e-mail…"
          className="w-full bg-transparent text-base outline-none placeholder:text-muted-foreground/70 md:text-[13px]"
        />
      </div>

      {/* Filtres de statut (petites pastilles) */}
      <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-0.5 [scrollbar-width:none] md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden">
        {STATUS_FILTERS.map((f) => {
          const count = f.id === "all" ? base.length : base.filter((o) => o.status === f.id).length;
          const on = status === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setStatus(f.id)}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12.5px] font-medium transition-colors",
                on ? "border-foreground bg-foreground text-background" : "border-border bg-card text-muted-foreground hover:bg-secondary/50",
              )}
            >
              {f.label}
              <span className={cn("text-[11px]", on ? "text-background/70" : "text-muted-foreground/70")}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Tableau compact (identique à la file d'attente) */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className={cn(cols, "hidden border-b border-border px-4 py-2.5 md:grid")}>
          <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">Client</span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">Type</span>
          <span className="text-right text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">Montant</span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">Statut</span>
          <span className="text-right text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">Date</span>
        </div>

        {rows.map((o, i) => (
          <div
            key={o.id}
            onClick={() => onOpen(o)}
            className={cn(cols, "cursor-pointer px-4 py-3 transition-colors hover:bg-secondary/40", i < rows.length - 1 && "border-b border-border")}
          >
            <ClientCell name={o.clientName} email={o.ref} />
            <div className="hidden md:block"><TypeCell type={o.type} /></div>
            <div className="text-right">
              <p className="whitespace-nowrap text-[13px] font-semibold">{nfCad.format(o.cad)} CAD</p>
              <p className="text-[11px] text-muted-foreground">{nfUsdt.format(o.usdt)} USDT</p>
            </div>
            <div className="hidden md:block"><StatusBadge status={o.status} /></div>
            <span className="hidden text-right text-[12px] text-muted-foreground md:block">{timeAgo(o.createdMinsAgo)}</span>
          </div>
        ))}

        {rows.length === 0 && (
          <div className="flex flex-col items-center py-16 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
              <Inbox className="h-5 w-5" strokeWidth={1.6} />
            </span>
            <p className="mt-3 text-sm text-muted-foreground">Aucune commande ne correspond.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersList;
