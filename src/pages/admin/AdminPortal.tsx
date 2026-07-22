import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Inbox, ShoppingCart, FileCheck, Calculator, Users, ArrowLeft, Sparkles, Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  SEED_ORDERS, nfCad,
  type AdminOrder, type OrderStatus,
} from "@/lib/adminOrders";
import OrdersQueue from "@/components/admin/OrdersQueue";
import OrdersList from "@/components/admin/OrdersList";
import OrderDetailSheet from "@/components/admin/OrderDetailSheet";

type TabId = "queue" | "orders" | "kyc" | "accounting" | "team";

const NAV: { id: TabId; label: string; desc: string; icon: typeof Inbox }[] = [
  { id: "queue",      label: "File d'attente", desc: "Commandes à traiter — prise en charge", icon: Inbox },
  { id: "orders",     label: "Commandes",      desc: "Toutes les commandes et leur historique", icon: ShoppingCart },
  { id: "kyc",        label: "KYC",            desc: "Vérifications d'identité", icon: FileCheck },
  { id: "accounting", label: "Comptabilité",   desc: "Revenus et marges", icon: Calculator },
  { id: "team",       label: "Équipe",         desc: "Membres et rôles du back-office", icon: Users },
];

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-2xl border border-border bg-card px-5 py-4">
    <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
    <p className="mt-1.5 font-display text-[24px] font-light leading-none tracking-tight">{value}</p>
  </div>
);

const Placeholder = ({ label }: { label: string }) => (
  <div className="flex flex-col items-center rounded-2xl border border-border bg-card py-20 text-center">
    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
      <Sparkles className="h-6 w-6" strokeWidth={1.6} />
    </span>
    <p className="mt-4 text-[15px] font-medium">{label}</p>
    <p className="mt-1 max-w-xs text-sm text-muted-foreground">
      Module prévu dans la prochaine étape du back-office.
    </p>
  </div>
);

const AdminPortal = () => {
  const [orders, setOrders] = useState<AdminOrder[]>(SEED_ORDERS);
  const [tab, setTab] = useState<TabId>("queue");
  const [selected, setSelected] = useState<AdminOrder | null>(null);

  const advance = (id: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    setSelected((s) => (s && s.id === id ? { ...s, status } : s));
  };

  const counts = useMemo(() => {
    const toTreat = orders.filter((o) => o.status === "recu").length;
    const inProgress = orders.filter((o) => o.status === "cours").length;
    const doneToday = orders.filter((o) => o.status === "termine");
    const volume = doneToday.reduce((s, o) => s + o.cad, 0);
    return { toTreat, inProgress, doneCount: doneToday.length, volume };
  }, [orders]);

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
            const badge = id === "queue" && counts.toTreat > 0 ? counts.toTreat : null;
            return (
              <button
                key={id}
                onClick={() => setTab(id)}
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

        {/* Statistiques (file + commandes) */}
        {(tab === "queue" || tab === "orders") && (
          <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Stat label="À traiter" value={String(counts.toTreat)} />
            <Stat label="En cours" value={String(counts.inProgress)} />
            <Stat label="Terminées" value={String(counts.doneCount)} />
            <Stat label="Volume traité" value={`${nfCad.format(counts.volume)} $`} />
          </div>
        )}

        {/* Vue active */}
        <div className="mt-5">
          {tab === "queue" && <OrdersQueue orders={orders} onOpen={openOrder} onAdvance={advance} />}
          {tab === "orders" && <OrdersList orders={orders} onOpen={openOrder} />}
          {tab === "kyc" && <Placeholder label="KYC — vérifications d'identité" />}
          {tab === "accounting" && <Placeholder label="Comptabilité — revenus et marges" />}
          {tab === "team" && <Placeholder label="Équipe & rôles" />}
        </div>
      </div>

      <OrderDetailSheet order={selected} onClose={() => setSelected(null)} onAdvance={advance} />
    </div>
  );
};

export default AdminPortal;
