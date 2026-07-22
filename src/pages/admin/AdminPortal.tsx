import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Inbox, ShoppingCart, FileCheck, Calculator, Users, ArrowLeft, Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  SEED_ORDERS,
  type AdminOrder,
} from "@/lib/adminOrders";
import OrdersQueue from "@/components/admin/OrdersQueue";
import OrdersList from "@/components/admin/OrdersList";
import OrderDetail from "@/components/admin/OrderDetail";
import KycPanel from "@/components/admin/KycPanel";
import AccountingPanel from "@/components/admin/AccountingPanel";
import TeamPanel from "@/components/admin/TeamPanel";

type TabId = "queue" | "orders" | "kyc" | "accounting" | "team";

const NAV: { id: TabId; label: string; desc: string; icon: typeof Inbox }[] = [
  { id: "queue",      label: "File d'attente", desc: "Commandes à traiter — prise en charge", icon: Inbox },
  { id: "orders",     label: "Commandes",      desc: "Toutes les commandes et leur historique", icon: ShoppingCart },
  { id: "kyc",        label: "KYC",            desc: "Vérifications d'identité", icon: FileCheck },
  { id: "accounting", label: "Comptabilité",   desc: "Revenus et marges", icon: Calculator },
  { id: "team",       label: "Équipe",         desc: "Membres et rôles du back-office", icon: Users },
];

const AdminPortal = () => {
  const [orders, setOrders] = useState<AdminOrder[]>(SEED_ORDERS);
  const [tab, setTab] = useState<TabId>("queue");
  const [selected, setSelected] = useState<AdminOrder | null>(null);

  const patch = (id: string, changes: Partial<AdminOrder>) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, ...changes } : o)));
    setSelected((s) => (s && s.id === id ? { ...s, ...changes } : s));
  };

  const toTreat = useMemo(() => orders.filter((o) => o.status === "recu").length, [orders]);

  const active = NAV.find((n) => n.id === tab)!;
  const ActiveIcon = active.icon;
  const openOrder = (o: AdminOrder) => setSelected(o);

  return (
    <div className="app-type min-h-screen bg-background text-foreground">
      {/* Barre du haut */}
      <div className="border-b border-border">
        <div className="mx-auto flex max-w-[1200px] items-center gap-3 px-5 py-4 pt-[max(1rem,env(safe-area-inset-top))] md:px-8">
          <Link
            to="/app"
            aria-label="Retour à l'app"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-card transition-colors hover:bg-secondary active:scale-95"
          >
            <ArrowLeft className="h-[18px] w-[18px]" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-[19px] font-semibold leading-tight tracking-tight">Administration</h1>
            <p className="truncate text-[12px] text-muted-foreground">Pilotez la plateforme Ooble</p>
          </div>
          <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-[11px] font-semibold text-muted-foreground">
            <Shield className="h-[13px] w-[13px]" /> Admin
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-5 py-6 md:px-8">
        {/* Pastilles de navigation — défilables */}
        <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden">
          {NAV.map(({ id, label, icon: Icon }) => {
            const on = id === tab;
            const badge = id === "queue" && toTreat > 0 ? toTreat : null;
            return (
              <button
                key={id}
                onClick={() => { setTab(id); setSelected(null); }}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-[13px] font-medium transition-colors",
                  on ? "border-foreground bg-secondary text-foreground" : "border-border bg-card text-muted-foreground hover:bg-secondary/50",
                )}
              >
                <Icon className="h-4 w-4" strokeWidth={on ? 2 : 1.7} />
                {label}
                {badge && (
                  <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {selected ? (
          <div className="mt-6">
            <OrderDetail order={selected} onBack={() => setSelected(null)} onPatch={patch} />
          </div>
        ) : (
          <>
            {/* Titre de section */}
            <div className="mt-6 flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-foreground/70">
                <ActiveIcon className="h-[19px] w-[19px]" strokeWidth={1.9} />
              </span>
              <div>
                <h2 className="font-display text-[17px] font-semibold tracking-tight">{active.label}</h2>
                <p className="text-[12px] text-muted-foreground">{active.desc}</p>
              </div>
            </div>

            {/* Vue active */}
            <div className="mt-5">
              {tab === "queue" && <OrdersQueue orders={orders} onOpen={openOrder} onPatch={patch} />}
              {tab === "orders" && <OrdersList orders={orders} onOpen={openOrder} />}
              {tab === "kyc" && <KycPanel />}
              {tab === "accounting" && <AccountingPanel orders={orders} />}
              {tab === "team" && <TeamPanel />}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPortal;
