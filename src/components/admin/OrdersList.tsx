import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  nfCad, nfUsdt, timeAgo,
  type AdminOrder, type OrderStatus, type OrderType,
} from "@/lib/adminOrders";
import { StatusBadge, TypeTag, ClientCell } from "./AdminBits";

interface Props {
  orders: AdminOrder[];
  onOpen: (order: AdminOrder) => void;
}

type TypeFilter = "all" | OrderType;
type StatusFilter = "all" | OrderStatus;

const TYPE_TABS: { id: TypeFilter; label: string }[] = [
  { id: "all", label: "Tous" },
  { id: "buy", label: "Achats" },
  { id: "sell", label: "Ventes" },
];

const STATUS_TABS: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "Tous statuts" },
  { id: "recu", label: "À traiter" },
  { id: "cours", label: "En cours" },
  { id: "attente", label: "En attente" },
  { id: "termine", label: "Terminés" },
  { id: "annule", label: "Annulés" },
];

const Chip = ({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "whitespace-nowrap rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors",
      active ? "border-foreground bg-secondary text-foreground" : "border-border bg-card text-muted-foreground hover:bg-secondary/50",
    )}
  >
    {children}
  </button>
);

/** Liste complète des commandes avec recherche et filtres. */
const OrdersList = ({ orders, onOpen }: Props) => {
  const [q, setQ] = useState("");
  const [type, setType] = useState<TypeFilter>("all");
  const [status, setStatus] = useState<StatusFilter>("all");

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return orders
      .filter((o) => (type === "all" ? true : o.type === type))
      .filter((o) => (status === "all" ? true : o.status === status))
      .filter((o) =>
        needle === ""
          ? true
          : o.ref.toLowerCase().includes(needle) ||
            o.clientName.toLowerCase().includes(needle) ||
            o.clientEmail.toLowerCase().includes(needle),
      )
      .sort((a, b) => a.createdMinsAgo - b.createdMinsAgo);
  }, [orders, q, type, status]);

  return (
    <div className="space-y-4">
      {/* Recherche */}
      <div className="flex items-center gap-2.5 rounded-xl border border-border bg-card px-3.5 py-2.5">
        <Search className="h-[18px] w-[18px] shrink-0 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher une référence, un client, un e-mail…"
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
        />
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap items-center gap-2">
        {TYPE_TABS.map((t) => (
          <Chip key={t.id} active={type === t.id} onClick={() => setType(t.id)}>{t.label}</Chip>
        ))}
        <span className="mx-1 hidden h-5 w-px bg-border sm:block" />
        {STATUS_TABS.map((s) => (
          <Chip key={s.id} active={status === s.id} onClick={() => setStatus(s.id)}>{s.label}</Chip>
        ))}
      </div>

      {/* Tableau (desktop) */}
      <div className="hidden overflow-hidden rounded-2xl border border-border bg-card md:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
              <th className="px-5 py-3 font-semibold">Référence</th>
              <th className="px-5 py-3 font-semibold">Client</th>
              <th className="px-5 py-3 font-semibold">Type</th>
              <th className="px-5 py-3 text-right font-semibold">Montant</th>
              <th className="px-5 py-3 font-semibold">Statut</th>
              <th className="px-5 py-3 text-right font-semibold">Créée</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((o, i) => (
              <tr
                key={o.id}
                onClick={() => onOpen(o)}
                className={cn("cursor-pointer transition-colors hover:bg-secondary/40", i < rows.length - 1 && "border-b border-border")}
              >
                <td className="px-5 py-3 font-mono text-[13px] font-medium">{o.ref}</td>
                <td className="px-5 py-3"><ClientCell name={o.clientName} email={o.clientEmail} /></td>
                <td className="px-5 py-3"><TypeTag type={o.type} /></td>
                <td className="px-5 py-3 text-right text-[13px] font-semibold">
                  <span className="whitespace-nowrap">{nfCad.format(o.cad)} CAD</span>
                  <span className="block text-[12px] font-normal text-muted-foreground">{nfUsdt.format(o.usdt)} USDT</span>
                </td>
                <td className="px-5 py-3"><StatusBadge status={o.status} /></td>
                <td className="px-5 py-3 text-right text-[12px] text-muted-foreground">{timeAgo(o.createdMinsAgo)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <p className="px-5 py-12 text-center text-sm text-muted-foreground">Aucune commande ne correspond.</p>
        )}
      </div>

      {/* Cartes (mobile) */}
      <div className="space-y-2.5 md:hidden">
        {rows.map((o) => (
          <div key={o.id} onClick={() => onOpen(o)}
               className="cursor-pointer rounded-2xl border border-border bg-card p-4 transition-colors active:bg-secondary/50">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[13px] font-medium">{o.ref}</span>
              <StatusBadge status={o.status} />
            </div>
            <div className="mt-3"><ClientCell name={o.clientName} email={o.clientEmail} /></div>
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
              <TypeTag type={o.type} />
              <div className="text-right">
                <p className="text-[13px] font-semibold">{nfCad.format(o.cad)} CAD</p>
                <p className="text-[12px] text-muted-foreground">{timeAgo(o.createdMinsAgo)}</p>
              </div>
            </div>
          </div>
        ))}
        {rows.length === 0 && (
          <p className="rounded-2xl border border-border bg-card px-5 py-12 text-center text-sm text-muted-foreground">
            Aucune commande ne correspond.
          </p>
        )}
      </div>
    </div>
  );
};

export default OrdersList;
