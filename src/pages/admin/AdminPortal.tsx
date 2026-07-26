import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Inbox, ShoppingCart, ScanFace, Calculator, Users, ArrowLeft,
  BadgeCheck, UserRound, Megaphone, Headphones,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth, type AppRole } from "@/lib/auth";
import { type AdminOrder } from "@/lib/adminOrders";
import { fetchAdminOrders, persistOrderPatch, deleteOrder } from "@/lib/adminOrdersLive";
import { supabase } from "@/integrations/supabase/client";
import OrdersQueue from "@/components/admin/OrdersQueue";
import OrdersList from "@/components/admin/OrdersList";
import OrderDetail from "@/components/admin/OrderDetail";
import KycPanel from "@/components/admin/KycPanel";
import AccountingPanel from "@/components/admin/AccountingPanel";
import TeamPanel from "@/components/admin/TeamPanel";
import ClientProfile from "@/components/admin/ClientProfile";

type TabId = "queue" | "orders" | "kyc" | "accounting" | "team";

const NAV: { id: TabId; label: string; desc: string; icon: typeof Inbox }[] = [
  { id: "queue",      label: "File d'attente", desc: "Prenez une commande en charge avant de la traiter — elle se verrouille pour l'équipe.", icon: Inbox },
  { id: "orders",     label: "Commandes",      desc: "Toutes les commandes et leur historique.", icon: ShoppingCart },
  { id: "kyc",        label: "KYC",            desc: "Vérifiez l'identité des clients avant leurs transactions.", icon: ScanFace },
  { id: "accounting", label: "Comptabilité",   desc: "Revenus, marges et volumes traités.", icon: Calculator },
  { id: "team",       label: "Équipe",         desc: "Membres, rôles et permissions du back-office.", icon: Users },
];

const ROLE_TABS: Record<AppRole, TabId[]> = {
  admin:        ["queue", "orders", "kyc", "accounting", "team"],
  operator:     ["queue", "orders"],
  kyc_reviewer: ["kyc"],
  support:      ["queue", "orders"],
  marketing:    ["accounting"],
};

const ROLE_LABEL: Partial<Record<AppRole, string>> = {
  admin: "Admin",
  operator: "Opérateur",
  kyc_reviewer: "KYC",
  support: "Support",
  marketing: "Marketing",
};

const ROLE_ICON: Record<AppRole, typeof BadgeCheck> = {
  admin: BadgeCheck,
  operator: UserRound,
  kyc_reviewer: ScanFace,
  support: Headphones,
  marketing: Megaphone,
};

const AdminPortal = () => {
  const { roles } = useAuth();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<AdminOrder | null>(null);
  const [clientView, setClientView] = useState<{ userId: string; name: string } | null>(null);

  const allowedTabs = useMemo(() => {
    const set = new Set<TabId>();
    for (const r of roles) {
      for (const t of ROLE_TABS[r] ?? []) set.add(t);
    }
    return set;
  }, [roles]);

  const visibleNav = useMemo(() => NAV.filter((n) => allowedTabs.has(n.id)), [allowedTabs]);
  const [tab, setTab] = useState<TabId>(visibleNav[0]?.id ?? "queue");

  useEffect(() => {
    if (visibleNav.length > 0 && !allowedTabs.has(tab)) {
      setTab(visibleNav[0].id);
    }
  }, [visibleNav, allowedTabs, tab]);

  const topRole = roles.includes("admin") ? "admin" : roles[0];
  const badgeLabel = ROLE_LABEL[topRole] ?? "Staff";
  const BadgeIcon = ROLE_ICON[topRole] ?? BadgeCheck;

  const refresh = () => fetchAdminOrders().then((rows) => { setOrders(rows); setLoading(false); });

  useEffect(() => {
    refresh();
    const channel = supabase
      .channel("admin-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => refresh())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const patch = (id: string, changes: Partial<AdminOrder>) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, ...changes } : o)));
    setSelected((s) => (s && s.id === id ? { ...s, ...changes } : s));
    persistOrderPatch(id, changes).then((res) => { if (res.error) refresh(); });
  };

  const remove = (id: string) => {
    setSelected(null);
    setOrders((prev) => prev.filter((o) => o.id !== id));
    deleteOrder(id).then((res) => { if (res.error) refresh(); });
  };

  const active = visibleNav.find((n) => n.id === tab) ?? visibleNav[0];
  if (!active) return null;
  const ActiveIcon = active.icon;
  const openOrder = (o: AdminOrder) => setSelected(o);

  const showClient = (userId: string) => {
    const name = selected?.clientName ?? "Client";
    setClientView({ userId, name });
  };

  const openOrderById = (orderId: string) => {
    const o = orders.find((x) => x.id === orderId);
    if (o) {
      setClientView(null);
      setSelected(o);
    }
  };

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
            <BadgeIcon className="h-[13px] w-[13px]" /> {badgeLabel}
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-5 py-6 md:px-8">
        {clientView ? (
          <ClientProfile
            userId={clientView.userId}
            clientName={clientView.name}
            onBack={() => setClientView(null)}
            onOpenOrder={openOrderById}
          />
        ) : selected ? (
          <div>
            {/* Pastilles de navigation — masquées quand une commande est ouverte */}
            <OrderDetail order={selected} onBack={() => setSelected(null)} onPatch={patch} onDelete={remove} onShowClient={showClient} />
          </div>
        ) : (
          <>
            {/* Pastilles de navigation — défilables */}
            <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden">
              {visibleNav.map(({ id, label, icon: Icon }) => {
                const on = id === tab;
                return (
                  <button
                    key={id}
                    onClick={() => { setTab(id); setSelected(null); }}
                    className={cn(
                      "flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-[13px] font-medium transition-colors",
                      on ? "border-foreground bg-foreground text-background" : "border-border bg-card text-muted-foreground hover:bg-secondary/50",
                    )}
                  >
                    <Icon className="h-4 w-4" strokeWidth={on ? 2 : 1.7} />
                    {label}
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

            {/* Vue active */}
            <div className="mt-5">
              {loading && (tab === "queue" || tab === "orders" || tab === "accounting") ? (
                <div className="rounded-2xl border border-border bg-card py-16 text-center text-[13px] text-muted-foreground">
                  Chargement des commandes…
                </div>
              ) : (
                <>
                  {tab === "queue" && <OrdersQueue orders={orders} onOpen={openOrder} onPatch={patch} />}
                  {tab === "orders" && <OrdersList orders={orders} onOpen={openOrder} />}
                  {tab === "kyc" && <KycPanel />}
                  {tab === "accounting" && <AccountingPanel orders={orders} />}
                  {tab === "team" && <TeamPanel />}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPortal;
