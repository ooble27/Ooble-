import { Link } from "react-router-dom";
import { ArrowUpRight, Send, Handshake, TrendingUp, ChevronRight, Inbox } from "lucide-react";
import AppShell from "@/components/app/AppShell";
import RateChart from "@/components/app/RateChart";
import { NETWORKS } from "@/components/app/networks";
import { Button } from "@/components/ui/button";
import { useUsdtRate } from "@/hooks/useUsdtRate";
import { useUsdtHistory } from "@/hooks/useUsdtHistory";
import { getUser, firstName } from "@/lib/session";

const nf = new Intl.NumberFormat("fr-CA", { maximumFractionDigits: 2, minimumFractionDigits: 2 });

const more = [
  { to: "/app/envoyer", label: "Envoyer des USDT", sub: "Vers un wallet ou un exchange", icon: Send },
  { to: "/app/envoyer", label: "Desk OTC", sub: "Pour les gros volumes", icon: Handshake },
];

const Dashboard = () => {
  const rate = useUsdtRate();
  const history = useUsdtHistory();
  const user = getUser();
  const name = user ? firstName(user.name) : "Ami";
  const change = history.changePct;

  return (
    <AppShell
      header={
        <div>
          <p className="text-[15px] text-muted-foreground">Bonjour,</p>
          <h1 className="font-display text-[26px] font-extrabold leading-tight tracking-tight">
            {name} <span className="align-middle">👋</span>
          </h1>
        </div>
      }
    >
      {/* Carte pièce maîtresse — pétrole + taux en direct + graphe */}
      <section className="relative overflow-hidden rounded-[1.75rem] bg-deep p-6 text-white shadow-lift">
        {/* halo teal */}
        <div
          className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full opacity-70 blur-2xl"
          style={{ background: "radial-gradient(circle, hsl(174 60% 45% / 0.55), transparent 70%)" }}
        />
        <div className="relative">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/55">
              Taux USDT / CAD
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white/80 ring-1 ring-white/15">
              <span className={`h-1.5 w-1.5 rounded-full ${rate.live ? "bg-primary" : "bg-white/40"}`} />
              {rate.live ? "En direct" : "Estimé"}
            </span>
          </div>

          <div className="mt-3 flex items-end justify-between gap-4">
            <div>
              <p className="flex items-baseline gap-1.5">
                <span className="font-display text-[44px] font-extrabold leading-none tracking-tight">
                  {nf.format(rate.buy)}
                </span>
                <span className="text-lg font-semibold text-white/60">CAD</span>
              </p>
              <p className="mt-1.5 text-sm text-white/55">pour 1 USDT · marché + 2 %</p>
            </div>
            {change !== null && (
              <span
                className={`mb-1 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                  change >= 0 ? "bg-primary/20 text-primary" : "bg-white/10 text-white/70"
                }`}
              >
                <TrendingUp className={`h-3.5 w-3.5 ${change < 0 ? "rotate-180" : ""}`} />
                {change >= 0 ? "+" : ""}
                {change.toFixed(2)} %
              </span>
            )}
          </div>

          {/* graphe */}
          <RateChart data={history.points} className="mt-4 h-24 w-full" />
          <p className="-mt-1 text-right text-[11px] font-medium uppercase tracking-wider text-white/35">
            7 derniers jours
          </p>

          {/* actions principales */}
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <Button asChild variant="white" size="lg" shape="rounded" className="w-full">
              <Link to="/app/acheter">Acheter</Link>
            </Button>
            <Button asChild variant="outlineOnDark" size="lg" shape="rounded" className="w-full">
              <Link to="/app/vendre">Vendre</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Réseaux disponibles */}
      <div className="mb-3 mt-7 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Recevez sur 6 réseaux
        </p>
      </div>
      <div className="-mx-5 flex gap-2.5 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {NETWORKS.map((n) => (
          <div
            key={n.id}
            className="flex shrink-0 items-center gap-2.5 rounded-full border border-border/70 bg-white py-2 pl-2 pr-4 shadow-soft"
          >
            <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-border/60">
              <img src={`/coins/${n.id}.svg`} alt="" className="h-8 w-8" draggable={false} />
            </span>
            <span className="whitespace-nowrap text-sm font-semibold">{n.name}</span>
          </div>
        ))}
      </div>

      {/* Plus d'actions — liste raffinée */}
      <p className="mb-3 mt-7 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        Plus
      </p>
      <div className="divide-y divide-border/60 overflow-hidden rounded-[1.5rem] border border-border/70 bg-white shadow-soft">
        {more.map(({ to, label, sub, icon: Icon }) => (
          <Link key={label} to={to} className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-secondary/60">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-tint text-accent-ink">
              <Icon className="h-5 w-5" strokeWidth={1.9} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold leading-tight">{label}</span>
              <span className="block text-sm text-muted-foreground">{sub}</span>
            </span>
            <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground/60" />
          </Link>
        ))}
      </div>

      {/* Activité récente */}
      <div className="mb-3 mt-7 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Activité récente
        </p>
        <ArrowUpRight className="h-4 w-4 text-muted-foreground/50" />
      </div>
      <div className="rounded-[1.5rem] border border-dashed border-border bg-white/60 p-8">
        <div className="flex flex-col items-center py-2 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
            <Inbox className="h-6 w-6" strokeWidth={1.7} />
          </span>
          <p className="mt-4 font-semibold text-foreground">Aucune transaction</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Votre premier achat ou vente apparaîtra ici.
          </p>
        </div>
      </div>
    </AppShell>
  );
};

export default Dashboard;
