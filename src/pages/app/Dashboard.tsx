import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Coins, HandCoins, Inbox, ChevronRight } from "lucide-react";
import AppShell from "@/components/app/AppShell";
import RateChart from "@/components/app/RateChart";
import { NETWORKS } from "@/components/app/networks";
import { useUsdtRate } from "@/hooks/useUsdtRate";
import { useUsdtHistory } from "@/hooks/useUsdtHistory";
import { listMyOrders, type OrderRow } from "@/lib/orders";
import { ActivityRow } from "@/components/app/ActivityList";
import { useAuth } from "@/lib/auth";

const nf = new Intl.NumberFormat("fr-CA", { maximumFractionDigits: 2, minimumFractionDigits: 2 });

/** Salutation selon l'heure — sobre, sans illustration. */
function greeting(): string {
  const h = new Date().getHours();
  if (h < 5) return "Bonne nuit";
  if (h < 12) return "Bonjour";
  if (h < 18) return "Bon après-midi";
  return "Bonsoir";
}

/** Activité récente — 3 derniers ordres, épuré. Détail complet sur /app/activite. */
const RecentActivity = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderRow[] | null>(null);

  useEffect(() => {
    let active = true;
    listMyOrders(3).then((rows) => {
      if (active) setOrders(rows);
    });
    return () => { active = false; };
  }, []);

  return (
    <div className="rounded-2xl border border-border bg-card px-5 py-4">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Activité récente
        </p>
        {orders && orders.length > 0 && (
          <Link to="/app/activite" className="inline-flex items-center gap-0.5 text-[12px] font-medium text-foreground transition-opacity hover:opacity-70">
            Voir tout <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
      {orders === null ? (
        <div className="py-6 text-center text-[13px] text-muted-foreground">Chargement…</div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center py-7 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
            <Inbox className="h-5 w-5" strokeWidth={1.6} />
          </span>
          <p className="mt-3 text-[14px] font-medium text-foreground">Aucune transaction</p>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Votre premier achat ou vente apparaîtra ici.
          </p>
        </div>
      ) : (
        <div className="mt-1 divide-y divide-border">
          {orders.map((o) => (
            <ActivityRow
              key={o.id}
              o={o}
              onClick={() => navigate(`/app/activite/${o.id}`, { state: { order: o } })}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const Dashboard = () => {
  const rate = useUsdtRate();
  const history = useUsdtHistory();
  const { user } = useAuth();
  const firstName = user?.name?.trim().split(/\s+/)[0] ?? "";

  return (
    <AppShell
      wide
      header={
        firstName ? (
          <div className="min-w-0">
            <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              {greeting()}
            </p>
            <h1 className="mt-0.5 truncate font-display text-[26px] font-semibold leading-tight tracking-tight">
              {firstName}
            </h1>
          </div>
        ) : (
          <h1 className="font-display text-[22px] font-semibold leading-tight tracking-tight">
            {greeting()}
          </h1>
        )
      }
    >
      <div className="space-y-4">
        <div className="space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
          {/* Taux USDT / CAD */}
          <section className="flex flex-col rounded-2xl border border-border bg-card p-5">
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Taux USDT / CAD
            </span>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-display text-[34px] font-light leading-none tracking-tight">
                {nf.format(rate.buy)}
              </span>
              <span className="text-[15px] font-medium text-muted-foreground">CAD</span>
            </div>
            <RateChart data={history.points} className="hidden w-full text-foreground/55 md:mt-4 md:block md:min-h-[6rem] md:flex-1" />
          </section>

          {/* Actions + réseaux */}
          <div className="space-y-4">
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

            <div>
              <p className="mb-2.5 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                Recevez sur 6 réseaux
              </p>
              <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden">
                {NETWORKS.map((n) => (
                  <div
                    key={n.id}
                    className="flex shrink-0 items-center gap-2.5 rounded-[10px] border border-border bg-card py-2 pl-2 pr-3.5"
                  >
                    <img src={`/coins/${n.id}.svg`} alt="" className="h-7 w-7 rounded-full" draggable={false} />
                    <span className="whitespace-nowrap text-sm font-normal">{n.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <RecentActivity />
      </div>
    </AppShell>
  );
};

export default Dashboard;
