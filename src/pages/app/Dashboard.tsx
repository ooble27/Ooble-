import { Link } from "react-router-dom";
import { Send, Handshake, TrendingUp, Inbox } from "lucide-react";
import AppShell from "@/components/app/AppShell";
import RateChart from "@/components/app/RateChart";
import { NETWORKS } from "@/components/app/networks";
import { Button } from "@/components/ui/button";
import { useUsdtRate } from "@/hooks/useUsdtRate";
import { useUsdtHistory } from "@/hooks/useUsdtHistory";
import { getUser, firstName } from "@/lib/session";

const nf = new Intl.NumberFormat("fr-CA", { maximumFractionDigits: 2, minimumFractionDigits: 2 });

const Dashboard = () => {
  const rate = useUsdtRate();
  const history = useUsdtHistory();
  const user = getUser();
  const name = user ? firstName(user.name) : "Ami";
  const change = history.changePct;

  return (
    <AppShell
      wide
      header={
        <div>
          <p className="text-[15px] text-muted-foreground">Bonjour,</p>
          <h1 className="font-display text-[26px] font-extrabold leading-tight tracking-tight">
            {name} <span className="align-middle">👋</span>
          </h1>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Carte taux — pétrole, épurée */}
        <section className="relative overflow-hidden rounded-2xl bg-deep p-6 text-white">
          <div
            className="pointer-events-none absolute -right-24 -top-28 h-64 w-64 rounded-full opacity-40 blur-3xl"
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

            <div className="mt-4 flex items-end gap-3">
              <span className="font-display text-[46px] font-extrabold leading-none tracking-tight">
                {nf.format(rate.buy)}
              </span>
              <span className="pb-1 text-lg font-semibold text-white/50">CAD</span>
              {change !== null && (
                <span className={`mb-2 inline-flex items-center gap-1 text-xs font-semibold ${change >= 0 ? "text-white/85" : "text-white/60"}`}>
                  <TrendingUp className={`h-3.5 w-3.5 ${change < 0 ? "rotate-180" : ""}`} />
                  {change >= 0 ? "+" : ""}{change.toFixed(2)} %
                </span>
              )}
            </div>
            <p className="mt-2 text-sm text-white/50">pour 1 USDT · marché + 2 %</p>

            <RateChart data={history.points} className="mt-5 h-20 w-full" />

            <div className="mt-5 grid grid-cols-2 gap-2.5">
              <Button asChild variant="appOnDark" size="lg" shape="soft" className="w-full">
                <Link to="/app/acheter">Acheter</Link>
              </Button>
              <Button asChild variant="outlineOnDark" size="lg" shape="soft" className="w-full">
                <Link to="/app/vendre">Vendre</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Réseaux — rangée simple de pastilles */}
        <div>
          <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Recevez sur 6 réseaux
          </p>
          <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden">
            {NETWORKS.map((n) => (
              <div
                key={n.id}
                className="flex shrink-0 items-center gap-2.5 rounded-xl border border-border bg-white py-2 pl-2 pr-3.5"
              >
                <img src={`/coins/${n.id}.svg`} alt="" className="h-7 w-7 rounded-full" draggable={false} />
                <span className="whitespace-nowrap text-sm font-medium">{n.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Envoyer / OTC — deux tuiles simples */}
        <div className="grid grid-cols-2 gap-3">
          <Link to="/app/envoyer" className="rounded-2xl border border-border bg-white p-4 transition-colors hover:bg-secondary/50 active:bg-secondary">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-foreground/70">
              <Send className="h-5 w-5" strokeWidth={1.8} />
            </span>
            <p className="mt-3 text-sm font-semibold">Envoyer</p>
            <p className="text-xs text-muted-foreground">Vers un wallet</p>
          </Link>
          <Link to="/app/envoyer" className="rounded-2xl border border-border bg-white p-4 transition-colors hover:bg-secondary/50 active:bg-secondary">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-foreground/70">
              <Handshake className="h-5 w-5" strokeWidth={1.8} />
            </span>
            <p className="mt-3 text-sm font-semibold">Desk OTC</p>
            <p className="text-xs text-muted-foreground">Gros volumes</p>
          </Link>
        </div>

        {/* Activité récente */}
        <div className="rounded-2xl border border-border bg-white p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Activité récente
          </p>
          <div className="flex flex-col items-center py-8 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
              <Inbox className="h-6 w-6" strokeWidth={1.7} />
            </span>
            <p className="mt-4 text-[15px] font-semibold text-foreground">Aucune transaction</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Votre premier achat ou vente apparaîtra ici.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default Dashboard;
