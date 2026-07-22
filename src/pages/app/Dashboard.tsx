import { Link } from "react-router-dom";
import { Send, Handshake, Coins, HandCoins, TrendingUp, Inbox } from "lucide-react";
import AppShell from "@/components/app/AppShell";
import RateChart from "@/components/app/RateChart";
import { NETWORKS } from "@/components/app/networks";
import { useUsdtRate } from "@/hooks/useUsdtRate";
import { useUsdtHistory } from "@/hooks/useUsdtHistory";

const nf = new Intl.NumberFormat("fr-CA", { maximumFractionDigits: 2, minimumFractionDigits: 2 });

/**
 * Signe animé « Ooble » — deux anneaux qui respirent + un point en orbite,
 * en teal de la charte. SVG autonome (animation SMIL), remplace l'emoji main.
 */
const HeroMark = () => (
  <svg viewBox="0 0 46 40" className="inline-block h-7 w-8 shrink-0 align-middle text-primary" aria-hidden="true">
    <g fill="none" strokeWidth="3.2" strokeLinecap="round">
      <circle cx="18" cy="20" r="8.5" stroke="currentColor">
        <animate attributeName="stroke-opacity" values="1;0.35;1" dur="2.8s" repeatCount="indefinite" />
      </circle>
      <circle cx="28" cy="20" r="8.5" stroke="currentColor">
        <animate attributeName="stroke-opacity" values="0.35;1;0.35" dur="2.8s" repeatCount="indefinite" />
      </circle>
    </g>
    <circle cx="23" cy="6" r="2.3" fill="currentColor">
      <animateTransform attributeName="transform" type="rotate" from="0 23 20" to="360 23 20" dur="6s" repeatCount="indefinite" />
    </circle>
  </svg>
);

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
                <span className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
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

            <RateChart data={history.points} className="mt-4 h-20 w-full text-foreground/55 md:mt-auto md:h-auto md:min-h-[5rem] md:flex-1" />
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
