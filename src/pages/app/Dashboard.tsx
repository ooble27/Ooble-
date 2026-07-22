import { Link } from "react-router-dom";
import { Send, Handshake, Coins, HandCoins, TrendingUp, Inbox } from "lucide-react";
import AppShell from "@/components/app/AppShell";
import RateChart from "@/components/app/RateChart";
import { NETWORKS } from "@/components/app/networks";
import { useUsdtRate } from "@/hooks/useUsdtRate";
import { useUsdtHistory } from "@/hooks/useUsdtHistory";

const nf = new Intl.NumberFormat("fr-CA", { maximumFractionDigits: 2, minimumFractionDigits: 2 });

const Dashboard = () => {
  const rate = useUsdtRate();
  const history = useUsdtHistory();
  const change = history.changePct;

  return (
    <AppShell
      wide
      header={
        <h1 className="font-display text-[22px] font-semibold leading-tight tracking-tight">
          Bonjour <span className="align-middle">👋</span>
        </h1>
      }
    >
      <div className="space-y-4 lg:grid lg:grid-cols-2 lg:items-start lg:gap-4 lg:space-y-0">
        {/* Hero éditorial — taux en écriture fine sur blanc */}
        <section className="rounded-2xl border border-border bg-card p-5 lg:col-span-2 lg:p-7">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Taux USDT / CAD
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
              <span className={`h-1.5 w-1.5 rounded-full ${rate.live ? "bg-primary" : "bg-muted-foreground/40"}`} />
              {rate.live ? "En direct" : "Estimé"}
            </span>
          </div>

          <div className="mt-5 flex items-end gap-3">
            <span className="font-display text-[30px] font-light leading-[0.9] tracking-tight">
              {nf.format(rate.buy)}
            </span>
            <div className="pb-1">
              <span className="block text-base font-normal text-muted-foreground">$ CAD</span>
              {change !== null && (
                <span className={`mt-1 inline-flex items-center gap-1 text-xs font-medium ${change >= 0 ? "text-primary" : "text-muted-foreground"}`}>
                  <TrendingUp className={`h-3.5 w-3.5 ${change < 0 ? "rotate-180" : ""}`} />
                  {change >= 0 ? "+" : ""}{change.toFixed(2)} %
                </span>
              )}
            </div>
          </div>
          <p className="mt-2 text-sm font-light text-muted-foreground">pour 1 USDT · marché + 2 %</p>

          <RateChart
            data={history.points}
            className="mt-3 h-20 w-full"
            stroke="#1f9c88"
            fillFrom="rgba(38,161,123,0.14)"
          />
        </section>

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

        {/* Activité récente */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Activité récente
          </p>
          <div className="flex flex-col items-center py-8 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
              <Inbox className="h-6 w-6" strokeWidth={1.6} />
            </span>
            <p className="mt-4 text-[15px] font-medium text-foreground">Aucune transaction</p>
            <p className="mt-1 text-sm font-light text-muted-foreground">
              Votre premier achat ou vente apparaîtra ici.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default Dashboard;
