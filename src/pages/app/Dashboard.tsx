import { Link } from "react-router-dom";
import { Send, Handshake, TrendingUp, ChevronRight, Inbox, ShieldCheck } from "lucide-react";
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
          <h1 className="font-display text-[26px] font-extrabold leading-tight tracking-tight md:text-3xl">
            {name} <span className="align-middle">👋</span>
          </h1>
        </div>
      }
    >
      <div className="grid gap-4 md:grid-cols-3">
        {/* ── Hero pétrole — taux + graphe ─────────────────────────── */}
        <section className="relative overflow-hidden rounded-2xl bg-deep p-6 text-white md:col-span-2 md:p-8">
          <div
            className="pointer-events-none absolute -right-24 -top-28 h-64 w-64 rounded-full opacity-40 blur-3xl"
            style={{ background: "radial-gradient(circle, hsl(174 60% 45% / 0.5), transparent 70%)" }}
          />
          <div className="relative flex h-full flex-col gap-6 md:flex-row md:items-stretch md:gap-8">
            {/* Infos */}
            <div className="flex flex-1 flex-col">
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
                <span className="font-display text-[44px] font-extrabold leading-none tracking-tight md:text-[52px]">
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

              <div className="mt-auto grid grid-cols-2 gap-2.5 pt-6">
                <Button asChild variant="appOnDark" size="lg" shape="soft" className="w-full">
                  <Link to="/app/acheter">Acheter</Link>
                </Button>
                <Button asChild variant="outlineOnDark" size="lg" shape="soft" className="w-full">
                  <Link to="/app/vendre">Vendre</Link>
                </Button>
              </div>
            </div>

            {/* Graphe */}
            <div className="flex flex-col justify-end md:w-[46%]">
              <RateChart data={history.points} className="h-24 w-full md:h-full md:min-h-[160px]" />
              <p className="mt-1 text-right text-[10px] font-medium uppercase tracking-[0.18em] text-white/30">
                7 derniers jours
              </p>
            </div>
          </div>
        </section>

        {/* ── Réseaux (colonne droite, haute) ──────────────────────── */}
        <div className="rounded-2xl border border-border bg-white p-5 md:col-span-1 md:row-span-2">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Recevez sur 6 réseaux
          </p>
          <div className="flex flex-col gap-2">
            {NETWORKS.map((n) => (
              <div
                key={n.id}
                className="flex items-center gap-3 rounded-xl border border-border bg-white px-3 py-2.5"
              >
                <img src={`/coins/${n.id}.svg`} alt="" className="h-8 w-8 rounded-full" draggable={false} />
                <span className="text-sm font-semibold">{n.name}</span>
                <span className="ml-auto text-xs font-medium text-muted-foreground">{n.tag}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-secondary/50 px-3 py-2.5 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 shrink-0 text-accent-ink" strokeWidth={1.9} />
            Non-custodial — vos USDT vont directement dans votre wallet.
          </div>
        </div>

        {/* ── Actions « Plus » ─────────────────────────────────────── */}
        <Link
          to="/app/envoyer"
          className="group flex items-center gap-4 rounded-2xl border border-border bg-white p-5 transition-colors hover:bg-secondary/50 active:bg-secondary md:col-span-1"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-foreground/70">
            <Send className="h-5 w-5" strokeWidth={1.8} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-semibold leading-tight">Envoyer des USDT</span>
            <span className="block text-sm text-muted-foreground">Vers un wallet ou un exchange</span>
          </span>
          <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5" />
        </Link>

        <Link
          to="/app/envoyer"
          className="group flex items-center gap-4 rounded-2xl border border-border bg-white p-5 transition-colors hover:bg-secondary/50 active:bg-secondary md:col-span-1"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-foreground/70">
            <Handshake className="h-5 w-5" strokeWidth={1.8} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-semibold leading-tight">Desk OTC</span>
            <span className="block text-sm text-muted-foreground">Pour les gros volumes</span>
          </span>
          <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5" />
        </Link>

        {/* ── Activité récente ─────────────────────────────────────── */}
        <div className="rounded-2xl border border-border bg-white p-6 md:col-span-3">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Activité récente
          </p>
          <div className="flex flex-col items-center py-6 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
              <Inbox className="h-6 w-6" strokeWidth={1.7} />
            </span>
            <p className="mt-4 text-[15px] font-semibold text-foreground">Aucune transaction</p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Votre premier achat ou vente apparaîtra ici. Commencez en quelques secondes.
            </p>
            <div className="mt-5 flex gap-2.5">
              <Button asChild variant="appPrimary" shape="soft" size="default">
                <Link to="/app/acheter">Acheter des USDT</Link>
              </Button>
              <Button asChild variant="ghost" shape="soft" size="default">
                <Link to="/app/vendre">Vendre</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default Dashboard;
