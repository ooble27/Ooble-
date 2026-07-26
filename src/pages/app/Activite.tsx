import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Inbox } from "lucide-react";
import AppShell from "@/components/app/AppShell";
import { ActivityRow } from "@/components/app/ActivityList";
import { listMyOrders, type OrderRow } from "@/lib/orders";

/** Page dédiée — historique complet des activités du client. */
const Activite = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderRow[] | null>(null);

  useEffect(() => {
    let active = true;
    listMyOrders(100).then((rows) => { if (active) setOrders(rows); });
    return () => { active = false; };
  }, []);

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
            <p className="mt-1 text-[13px] text-muted-foreground">Vos achats et ventes</p>
          </div>
        </div>
      }
    >
      {orders === null ? (
        <div className="rounded-2xl border border-border bg-card py-10 text-center text-[13px] text-muted-foreground">
          Chargement…
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-border bg-card py-14 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
            <Inbox className="h-5 w-5" strokeWidth={1.6} />
          </span>
          <p className="mt-3 text-[14px] font-medium text-foreground">Aucune transaction</p>
          <p className="mt-1 text-[13px] text-muted-foreground">Votre premier achat ou vente apparaîtra ici.</p>
        </div>
      ) : (
        <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card px-5">
          {orders.map((o) => <ActivityRow key={o.id} o={o} detailed />)}
        </div>
      )}
    </AppShell>
  );
};

export default Activite;
