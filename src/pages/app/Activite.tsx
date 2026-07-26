import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Inbox, Coins, HandCoins, Filter } from "lucide-react";
import AppShell from "@/components/app/AppShell";
import { ActivityRow, OrderDetail } from "@/components/app/ActivityList";
import { listMyOrders, type OrderRow } from "@/lib/orders";
import { cn } from "@/lib/utils";

type TabFilter = "all" | "buy" | "sell";

const Activite = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderRow[] | null>(null);
  const [tab, setTab] = useState<TabFilter>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    listMyOrders(100).then((rows) => { if (active) setOrders(rows); });
    return () => { active = false; };
  }, []);

  const filtered = orders?.filter((o) => tab === "all" || o.side === tab) ?? null;

  const toggle = (id: string) => setExpandedId((prev) => (prev === id ? null : id));

  return (
    <AppShell
      header={
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => navigate("/app")}
            aria-label="Retour"
            className="mt-0.5 flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full bg-secondary text-foreground transition-colors hover:bg-secondary/70 active:scale-95"
          >
            <ArrowLeft className="h-[18px] w-[18px]" />
          </button>
          <div>
            <h1 className="font-display text-[22px] font-semibold tracking-tight">Activité</h1>
            <p className="mt-1 text-[13px] text-muted-foreground">Historique de vos transactions</p>
          </div>
        </div>
      }
    >
      {/* Filtres */}
      <div className="mb-4 flex gap-1.5">
        {([
          { key: "all" as TabFilter, label: "Tout", icon: Filter },
          { key: "buy" as TabFilter, label: "Achats", icon: Coins },
          { key: "sell" as TabFilter, label: "Ventes", icon: HandCoins },
        ]).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={cn(
              "flex items-center gap-1.5 rounded-[10px] px-3.5 py-[7px] text-[12.5px] font-semibold transition-colors",
              tab === key
                ? "bg-foreground text-background"
                : "bg-secondary text-muted-foreground hover:bg-secondary/80",
            )}
          >
            <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />
            {label}
          </button>
        ))}
      </div>

      {filtered === null ? (
        <div className="rounded-2xl border border-border bg-card py-10 text-center text-[13px] text-muted-foreground">
          Chargement…
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-border bg-card py-14 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
            <Inbox className="h-5 w-5" strokeWidth={1.6} />
          </span>
          <p className="mt-3 text-[14px] font-medium text-foreground">Aucune transaction</p>
          <p className="mt-1 text-[13px] text-muted-foreground">
            {tab === "all" ? "Votre premier achat ou vente apparaîtra ici." : tab === "buy" ? "Aucun achat pour le moment." : "Aucune vente pour le moment."}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((o) => (
            <div key={o.id} className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className="px-5">
                <ActivityRow o={o} detailed onClick={() => toggle(o.id)} />
              </div>
              {expandedId === o.id && (
                <div className="border-t border-border px-3 pb-3 pt-2">
                  <OrderDetail o={o} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {filtered && filtered.length > 0 && (
        <p className="mt-4 text-center text-[12px] text-muted-foreground">
          {filtered.length} transaction{filtered.length > 1 ? "s" : ""}
        </p>
      )}
    </AppShell>
  );
};

export default Activite;
