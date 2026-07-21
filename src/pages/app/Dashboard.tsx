import { Link } from "react-router-dom";
import { Send, Handshake, TrendingUp, ChevronRight, Inbox } from "lucide-react";
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
      {/* Carte pièce maîtresse — pétrole plat, taux en direct + graphe */}
      <section className="relative overflow-hidden rounded-2xl bg-deep p-6 text-white">
        <div
          className="pointer-events-none absolute -right-20 -top-24 h-52 w-52 rounded-full opacity-40 blur-3xl"
          style={{ background: "radial-gradient(circle, hsl(174 60% 45% / 0.5), transparent 70%)" }}
        />
        <div className="relative">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">
              Taux USDT / CAD
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-2.5 py-1 text-[11px] font-medium text-white/70">
              <span className={`h-1.5 w-1.5 rounded-full ${rate.live ? "bg-primary" : "bg-white/40"}`} />
              {rate.live ? "En direct" : "Estimé"}
            </span>
          </div>

          <div className="mt-4 flex items-end justify-between gap-4">
            <div>
              <p className="flex items-baseline gap-1.5">
                <span className="font-display text-[44px] font-extrabold leading-none tracking-tight">
                  {nf.format(rate.buy)}
                </span>
                <span className="text-lg font-semibold text-white/50">CAD</span>
              </p>
              <p className="mt-2 text-sm text-white/50">pour 1 USDT · marché + 2 %</p>
            </div>
            {change !== null && (
              <span
                className={`mb-1 inline-flex items-center gap-1 text-xs font-semibold ${
                  change >= 0 ? "text-primary" : "text-white/60"
                }`}
              >
                <TrendingUp className={`h-3.5 w-3.5 ${change < 0 ? "rotate-180" : ""}`} />
                {change >= 0 ? "+" : ""}
                {change.toFixed(2)} %
              </span>
            )}
          </div>

          <RateChart data={history.points} className="mt-5 h-20 w-full" />
          <p className="mt-1 text-right text-[10px] font-medium uppercase tracking-[0.18em] text-white/30">
            7 derniers jours
          </p>

          <div className="mt-5 grid grid-cols-2 gap-2.5">
            <Button asChild variant="appOnDark" size="lg" shape="rounded" className="w-full">
              <Link to="/app/acheter">Acheter</Link>
            </Button>
            <Button asChild variant="outlineOnDark" size="lg" shape="rounded" className="w-full">
              <Link to="/app/vendre">Vendre</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Réseaux disponibles */}
      <p className="mb-3 mt-8 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        Recevez sur 6 réseaux
      </p>
      <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {NETWORKS.map((n) => (
          <div
            key={n.id}
            className="flex shrink-0 items-center gap-2.5 rounded-xl border border-border bg-white py-1.5 pl-1.5 pr-4"
          >
            <span className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full">
              <img src={`/coins/${n.id}.svg`} alt="" className="h-7 w-7" draggable={false} />
            </span>
            <span className="whitespace-nowrap text-sm font-medium">{n.name}</span>
          </div>
        ))}
      </div>

      {/* Plus — liste à filets fins */}
      <p className="mb-3 mt-8 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        Plus
      </p>
      <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-white">
        {more.map(({ to, label, sub, icon: Icon }) => (
          <Link key={label} to={to} className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-secondary/50 active:bg-secondary">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-foreground/70">
              <Icon className="h-5 w-5" strokeWidth={1.8} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-semibold leading-tight">{label}</span>
              <span className="block text-sm text-muted-foreground">{sub}</span>
            </span>
            <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground/50" />
          </Link>
        ))}
      </div>

      {/* Activité récente */}
      <p className="mb-3 mt-8 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        Activité récente
      </p>
      <div className="rounded-2xl border border-border bg-white p-8">
        <div className="flex flex-col items-center py-2 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
            <Inbox className="h-5 w-5" strokeWidth={1.7} />
          </span>
          <p className="mt-4 text-[15px] font-semibold text-foreground">Aucune transaction</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Votre premier achat ou vente apparaîtra ici.
          </p>
        </div>
      </div>
    </AppShell>
  );
};

export default Dashboard;
