import { Link } from "react-router-dom";
import { Coins, HandCoins, Send, Handshake, ArrowUpRight, Inbox } from "lucide-react";
import AppShell from "@/components/app/AppShell";
import { useUsdtRate } from "@/hooks/useUsdtRate";
import { getUser, firstName } from "@/lib/session";

const nf = new Intl.NumberFormat("fr-CA", { maximumFractionDigits: 2, minimumFractionDigits: 2 });

const actions = [
  { to: "/app/acheter", label: "Acheter", sub: "Achat rapide", icon: Coins },
  { to: "/app/vendre", label: "Vendre", sub: "Vente rapide", icon: HandCoins },
  { to: "/app/envoyer", label: "Envoyer", sub: "Transfert", icon: Send },
  { to: "/app/envoyer", label: "OTC", sub: "Gros volumes", icon: Handshake },
];

const Dashboard = () => {
  const rate = useUsdtRate();
  const user = getUser();
  const name = user ? firstName(user.name) : "Ami";

  return (
    <AppShell
      header={
        <div>
          <p className="text-[15px] text-muted-foreground">Bonjour,</p>
          <h1 className="font-display text-3xl font-extrabold leading-tight tracking-tight">
            {name} <span className="align-middle">👋</span>
          </h1>
        </div>
      }
    >
      {/* Carte taux */}
      <div className="flex items-center justify-between gap-4 rounded-[1.5rem] border border-border/70 bg-white p-6 shadow-soft">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Taux USDT / CAD
          </p>
          <p className="mt-2 flex items-baseline gap-1.5">
            <span className="font-display text-4xl font-extrabold tracking-tight">{nf.format(rate.buy)}</span>
            <span className="text-lg font-semibold text-muted-foreground">CAD</span>
          </p>
          <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
            <span className={`h-1.5 w-1.5 rounded-full ${rate.live ? "bg-primary" : "bg-muted-foreground/40"}`} />
            pour 1 USDT · Ooble
          </p>
        </div>
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-accent-tint">
          <img src="/coins/usdt.svg" alt="USDT" className="h-10 w-10" draggable={false} />
        </span>
      </div>

      {/* Actions rapides */}
      <p className="mb-3 mt-8 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        Actions rapides
      </p>
      <div className="grid grid-cols-2 gap-3.5">
        {actions.map(({ to, label, sub, icon: Icon }) => (
          <Link
            key={label}
            to={to}
            className="group relative rounded-[1.25rem] border border-border/70 bg-white p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
          >
            <ArrowUpRight className="absolute right-4 top-4 h-4 w-4 text-muted-foreground/50 transition-colors group-hover:text-primary" />
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-tint text-accent-ink">
              <Icon className="h-5 w-5" strokeWidth={1.9} />
            </span>
            <p className="mt-4 font-display text-lg font-bold">{label}</p>
            <p className="text-sm text-muted-foreground">{sub}</p>
          </Link>
        ))}
      </div>

      {/* Activité récente */}
      <p className="mb-3 mt-8 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        Activité récente
      </p>
      <div className="rounded-[1.5rem] border border-border/70 bg-white p-8 shadow-soft">
        <div className="flex flex-col items-center py-4 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
            <Inbox className="h-6 w-6" strokeWidth={1.7} />
          </span>
          <p className="mt-4 font-medium text-foreground">Aucune transaction</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Votre premier achat ou vente apparaîtra ici.
          </p>
        </div>
      </div>
    </AppShell>
  );
};

export default Dashboard;
