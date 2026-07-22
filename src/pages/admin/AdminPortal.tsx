import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Inbox, ShoppingCart, FileCheck, Calculator, Users, ArrowLeft, Sparkles,
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
  const openOrder = (o: AdminOrder) => setSelected(o);

  return (
    <div className="app-type min-h-screen bg-background text-foreground">
      <div className="lg:flex">
        {/* Barre latérale (desktop) */}
        <aside className="hidden lg:flex lg:h-screen lg:w-64 lg:shrink-0 lg:flex-col lg:border-r lg:border-border lg:bg-card lg:sticky lg:top-0">
          <div className="flex items-center gap-2.5 px-5 py-5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <span className="text-[15px] font-bold">O</span>
            </span>
            <div>
              <p className="text-[14px] font-semibold leading-tight">Ooble</p>
              <p className="text-[11px] leading-tight text-muted-foreground">Back-office</p>
            </div>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-2">
            {NAV.map(({ id, label, icon: Icon }) => {
              const on = id === tab;
              const badge = id === "queue" && counts.toTreat > 0 ? counts.toTreat : null;
              return (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[14px] transition-colors",
                    on ? "bg-secondary font-medium text-foreground" : "text-muted-foreground hover:bg-secondary/50",
                  )}
                >
                  <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={on ? 2 : 1.7} />
                  <span className="flex-1">{label}</span>
                  {badge && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground">
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="border-t border-border px-3 py-3">
            <Link to="/app" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] text-muted-foreground transition-colors hover:bg-secondary/50">
              <ArrowLeft className="h-[18px] w-[18px]" /> Retour à l'app
            </Link>
          </div>
        </aside>

        {/* Contenu */}
        <main className="min-w-0 flex-1">
          <div className="mx-auto max-w-[1200px] px-5 py-6 md:px-8 lg:py-8">
            {/* En-tête */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="font-display text-[22px] font-semibold tracking-tight lg:text-[26px]">{active.label}</h1>
                <p className="mt-1 text-[13px] text-muted-foreground">{active.desc}</p>
              </div>
              <Link
                to="/app"
                className="flex h-10 items-center gap-2 rounded-xl border border-border bg-card px-3.5 text-[13px] font-medium transition-colors hover:bg-secondary lg:hidden"
              >
                <ArrowLeft className="h-4 w-4" /> App
              </Link>
            </div>

            {/* Onglets (mobile / tablette) */}
            <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden">
              {NAV.map(({ id, label, icon: Icon }) => {
                const on = id === tab;
                const badge = id === "queue" && counts.toTreat > 0 ? counts.toTreat : null;
                return (
                  <button
                    key={id}
                    onClick={() => setTab(id)}
                    className={cn(
                      "flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-[13px] font-medium transition-colors",
                      on ? "border-foreground bg-secondary" : "border-border bg-card text-muted-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4" strokeWidth={on ? 2 : 1.7} /> {label}
                    {badge && <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">{badge}</span>}
                  </button>
                );
              })}
            </div>

            {/* Statistiques (file + commandes) */}
            {(tab === "queue" || tab === "orders") && (
              <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
                <Stat label="À traiter" value={String(counts.toTreat)} />
                <Stat label="En cours" value={String(counts.inProgress)} />
                <Stat label="Terminées" value={String(counts.doneCount)} />
                <Stat label="Volume traité" value={`${nfCad.format(counts.volume)} $`} />
              </div>
            )}

            {/* Vue active */}
            <div className="mt-6">
              {tab === "queue" && <OrdersQueue orders={orders} onOpen={openOrder} onAdvance={advance} />}
              {tab === "orders" && <OrdersList orders={orders} onOpen={openOrder} />}
              {tab === "kyc" && <Placeholder label="KYC — vérifications d'identité" />}
              {tab === "accounting" && <Placeholder label="Comptabilité — revenus et marges" />}
              {tab === "team" && <Placeholder label="Équipe & rôles" />}
            </div>
          </div>
        </main>
      </div>

      <OrderDetailSheet order={selected} onClose={() => setSelected(null)} onAdvance={advance} />
    </div>
  );
};

export default AdminPortal;
