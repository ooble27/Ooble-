import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Send, Handshake, Coins, HandCoins, TrendingUp, Inbox } from "lucide-react";
import AppShell from "@/components/app/AppShell";
import RateChart from "@/components/app/RateChart";
import { NETWORKS } from "@/components/app/networks";
import { useUsdtRate } from "@/hooks/useUsdtRate";
import { useUsdtHistory } from "@/hooks/useUsdtHistory";
import { listMyOrders, orderRef, ORDER_STATUS_FR, isOrderOpen, type OrderRow } from "@/lib/orders";

const nf = new Intl.NumberFormat("fr-CA", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
const nfUsdt = new Intl.NumberFormat("fr-CA", { maximumFractionDigits: 2 });
const dateFr = new Intl.DateTimeFormat("fr-CA", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

/**
 * Signe animé du « Bonjour » — un petit personnage stylisé qui fait coucou
 * de la main, aux couleurs Ooble. SVG autonome (animation SMIL).
 */
const HeroMark = () => (
  <svg viewBox="0 0 48 48" className="inline-block h-9 w-9 shrink-0" aria-hidden="true">
    {/* Épaules / t-shirt teal */}
    <path d="M8 47 C 8 35.5, 14.5 31, 24 31 C 33.5 31, 40 35.5, 40 47 Z" fill="hsl(var(--primary))" />
    {/* Cou */}
    <rect x="20.5" y="23" width="7" height="9" rx="3" fill="#E9C1A0" />
    {/* Tête */}
    <circle cx="24" cy="16.5" r="9" fill="#E9C1A0" />
    {/* Cheveux */}
    <path d="M15 16 C 15 10, 19 7, 24 7 C 29 7, 33 10, 33 16 C 31 13.5, 28.5 12.5, 24 12.5 C 19.5 12.5, 17 13.5, 15 16 Z" fill="hsl(var(--deep))" />
    {/* Yeux */}
    <circle cx="21" cy="17" r="1.05" fill="hsl(var(--deep))" />
    <circle cx="27" cy="17" r="1.05" fill="hsl(var(--deep))" />
    {/* Sourire */}
    <path d="M21 20 Q 24 22.5, 27 20" fill="none" stroke="hsl(var(--deep))" strokeWidth="1.2" strokeLinecap="round" />
    {/* Bras qui fait coucou (pivot à l'épaule) */}
    <g>
      <animateTransform attributeName="transform" type="rotate"
        values="-16 35 33; 14 35 33; -16 35 33" keyTimes="0;0.5;1"
        calcMode="spline" keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"
        dur="1.3s" repeatCount="indefinite" />
      <path d="M34 33 L 40.5 15" stroke="hsl(var(--primary))" strokeWidth="5" strokeLinecap="round" />
      <circle cx="41" cy="13" r="4" fill="#E9C1A0" />
    </g>
  </svg>
);

/** Une ligne d'ordre dans l'activité récente. */
const ActivityRow = ({ o }: { o: OrderRow }) => {
  const buy = o.side === "buy";
  return (
    <div className="flex items-center gap-3 py-3.5">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-foreground/70">
        {buy ? <Coins className="h-5 w-5" strokeWidth={1.6} /> : <HandCoins className="h-5 w-5" strokeWidth={1.6} />}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">
          {buy ? "Achat" : "Vente"} · {nfUsdt.format(Number(o.usdt_amount))} USDT
        </p>
        <p className="truncate text-xs font-light text-muted-foreground">
          {orderRef(o.id)} · {dateFr.format(new Date(o.created_at))}
        </p>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-sm font-medium">{nf.format(Number(o.cad_amount))} CAD</p>
        <p className={`text-xs font-medium ${isOrderOpen(o.status) ? "text-primary" : "text-muted-foreground"}`}>
          {ORDER_STATUS_FR[o.status]}
        </p>
      </div>
    </div>
  );
};

/** Activité récente — ordres réels de l'utilisateur (Supabase). */
const RecentActivity = () => {
  const [orders, setOrders] = useState<OrderRow[] | null>(null);

  useEffect(() => {
    let active = true;
    listMyOrders(8).then((rows) => {
      if (active) setOrders(rows);
    });
    return () => { active = false; };
  }, []);

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
        Activité récente
      </p>
      {orders === null ? (
        <div className="py-8 text-center text-sm font-light text-muted-foreground">Chargement…</div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center py-8 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
            <Inbox className="h-6 w-6" strokeWidth={1.6} />
          </span>
          <p className="mt-4 text-[15px] font-medium text-foreground">Aucune transaction</p>
          <p className="mt-1 text-sm font-light text-muted-foreground">
            Votre premier achat ou vente apparaîtra ici.
          </p>
        </div>
      ) : (
        <div className="mt-1 divide-y divide-border">
          {orders.map((o) => <ActivityRow key={o.id} o={o} />)}
        </div>
      )}
    </div>
  );
};

const Dashboard = () => {
  const rate = useUsdtRate();
  const history = useUsdtHistory();
  const change = history.changePct;

  return (
    <AppShell
      wide
      header={
        <h1 className="flex items-center gap-2 font-display text-[22px] font-semibold leading-tight tracking-tight">
          Bonjour <HeroMark />
        </h1>
      }
    >
      <div className="space-y-4">
        {/*
          Mobile : une seule colonne (hero, actions, réseaux, envoyer/otc).
          Tablette/desktop : hero à gauche + le reste empilé à droite, pour
          occuper la largeur sans laisser de vide entre Acheter/Vendre et
          Envoyer/Desk OTC.
        */}
        <div className="space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
          {/* Hero éditorial — taux clair et lisible */}
          <section className="flex flex-col rounded-2xl border border-border bg-card p-5">
            <div className="flex items-start justify-between gap-3">
              <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Taux USDT / CAD
              </span>
              {change !== null && (
                <span className="hidden items-center gap-1 rounded-full border border-border px-2.5 py-1 text-[11px] font-medium text-muted-foreground md:inline-flex">
                  <TrendingUp className={`h-3 w-3 ${change < 0 ? "rotate-180" : ""}`} />
                  {change >= 0 ? "+" : ""}{change.toFixed(2)} % · 7 j
                </span>
              )}
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-display text-[34px] font-light leading-none tracking-tight">
                {nf.format(rate.buy)}
              </span>
              <span className="text-[15px] font-medium text-muted-foreground">$ CAD</span>
            </div>
            <p className="mt-2 text-sm font-light text-muted-foreground">1 USDT en dollars canadiens · marché + 2 %</p>

            <RateChart data={history.points} className="hidden w-full text-foreground/55 md:mt-4 md:block md:min-h-[6rem] md:flex-1" />
          </section>

          {/* Colonne droite (empilée) : actions, réseaux, envoyer/otc */}
          <div className="space-y-4">
            {/* Actions principales */}
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/app/acheter"
                className="flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-4 transition-colors hover:bg-secondary/50 active:bg-secondary"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-foreground/70">
                  <Coins className="h-5 w-5" strokeWidth={1.6} />
                </span>
                <span className="text-[15px] font-medium">Acheter</span>
              </Link>
              <Link
                to="/app/vendre"
                className="flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-4 transition-colors hover:bg-secondary/50 active:bg-secondary"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-foreground/70">
                  <HandCoins className="h-5 w-5" strokeWidth={1.6} />
                </span>
                <span className="text-[15px] font-medium">Vendre</span>
              </Link>
            </div>

            {/* Réseaux */}
            <div>
              <p className="mb-2.5 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                Recevez sur 6 réseaux
              </p>
              <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden">
                {NETWORKS.map((n) => (
                  <div
                    key={n.id}
                    className="flex shrink-0 items-center gap-2.5 rounded-xl border border-border bg-card py-2 pl-2 pr-3.5"
                  >
                    <img src={`/coins/${n.id}.svg`} alt="" className="h-7 w-7 rounded-full" draggable={false} />
                    <span className="whitespace-nowrap text-sm font-normal">{n.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Envoyer / OTC */}
            <div className="grid grid-cols-2 gap-3">
              <Link to="/app/envoyer" className="rounded-2xl border border-border bg-card p-4 transition-colors hover:bg-secondary/50 active:bg-secondary">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-foreground/70">
                  <Send className="h-5 w-5" strokeWidth={1.6} />
                </span>
                <p className="mt-3 text-sm font-medium">Envoyer</p>
                <p className="text-xs font-light text-muted-foreground">Vers un wallet</p>
              </Link>
              <Link to="/app/otc" className="rounded-2xl border border-border bg-card p-4 transition-colors hover:bg-secondary/50 active:bg-secondary">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-foreground/70">
                  <Handshake className="h-5 w-5" strokeWidth={1.6} />
                </span>
                <p className="mt-3 text-sm font-medium">Desk OTC</p>
                <p className="text-xs font-light text-muted-foreground">Gros volumes</p>
              </Link>
            </div>
          </div>
        </div>

        {/* Activité récente — pleine largeur */}
        <RecentActivity />
      </div>
    </AppShell>
  );
};

export default Dashboard;
