import { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

const SCREEN_DURATION = 3200;
const TRANSITION_MS = 600;

const SCREENS = [
  "dashboard",
  "amount",
  "network",
  "address",
  "recap",
  "done",
] as const;
type Screen = (typeof SCREENS)[number];

/* ── Fake bottom nav ── */
const DemoNav = ({ active }: { active: "home" | "buy" }) => (
  <div className="absolute inset-x-0 bottom-0 flex justify-center px-4 pb-3 pt-1">
    <div className="flex w-full max-w-[260px] items-center justify-around rounded-[16px] border border-border bg-card/90 p-1.5 backdrop-blur-xl">
      {[
        { id: "home" as const, label: "Accueil", icon: "M3 12l9-8 9 8M5 10v10h4v-6h6v6h4V10" },
        { id: "buy" as const, label: "Acheter", icon: "M12 2a10 10 0 100 20 10 10 0 000-20zm0 4v6h5" },
        { id: "sell" as const, label: "Vendre", icon: "M12 2a10 10 0 100 20 10 10 0 000-20zm-2 6l4 4-4 4" },
      ].map((item) => (
        <div
          key={item.id}
          className={cn(
            "relative z-10 flex flex-col items-center gap-0.5 rounded-[12px] px-5 py-1.5 text-[10px]",
            active === item.id
              ? "bg-secondary font-medium text-foreground"
              : "text-muted-foreground",
          )}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path d={item.icon} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {item.label}
        </div>
      ))}
    </div>
  </div>
);

/* ── Fake status bar ── */
const StatusBar = () => (
  <div className="flex items-center justify-between px-5 pb-1 pt-2 text-[10px] font-medium text-muted-foreground">
    <span>9:41</span>
    <div className="flex items-center gap-1">
      <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor"><path d="M1 9l2 2c4-4 10.5-4 14.5 0l2-2C14 4 6 4 1 9zm5 5l2 2c2-2 5-2 7 0l2-2c-3-3-8-3-11 0zm4 4l2 2 2-2c-1-1-3-1-4 0z" /></svg>
      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><rect x="1" y="6" width="3" height="12" rx="1" opacity=".3" /><rect x="6" y="4" width="3" height="14" rx="1" opacity=".5" /><rect x="11" y="2" width="3" height="16" rx="1" opacity=".7" /><rect x="16" y="0" width="3" height="18" rx="1" /><rect x="21" y="3" width="2" height="12" rx="1" /></svg>
    </div>
  </div>
);

/* ── Back arrow ── */
const BackArrow = () => (
  <div className="flex h-[28px] w-[28px] items-center justify-center rounded-full bg-secondary">
    <svg className="h-3.5 w-3.5 text-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  </div>
);

/* ── Network chip ── */
const NetChip = ({ name, selected }: { name: string; selected?: boolean }) => (
  <div className={cn(
    "flex items-center gap-1.5 rounded-[8px] border py-1.5 pl-1.5 pr-2.5 text-[10px]",
    selected ? "border-foreground bg-secondary" : "border-border bg-card",
  )}>
    <div className="h-5 w-5 rounded-full bg-muted" />
    <span>{name}</span>
  </div>
);

/* ── Screen: Dashboard ── */
const ScreenDashboard = () => (
  <div className="flex h-full flex-col">
    <StatusBar />
    <div className="flex-1 overflow-hidden px-4 pb-14 pt-2">
      {/* Header */}
      <p className="text-[9px] font-medium uppercase tracking-widest text-muted-foreground">Bonjour</p>
      <p className="mt-0.5 text-[18px] font-semibold tracking-tight">Alexandre</p>

      <div className="mt-3 grid grid-cols-2 gap-2.5">
        {/* Rate card */}
        <div className="rounded-xl border border-border bg-card p-3">
          <p className="text-[8px] font-medium uppercase tracking-widest text-muted-foreground">Taux USDT / CAD</p>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-[24px] font-light leading-none tracking-tight">1,43</span>
            <span className="text-[11px] font-medium text-muted-foreground">CAD</span>
          </div>
          {/* Mini chart line */}
          <svg className="mt-2 h-8 w-full text-foreground/30" viewBox="0 0 120 30" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path d="M0 22 C20 20 25 8 40 12 C55 16 60 6 75 10 C90 14 100 4 120 8" strokeLinecap="round" />
          </svg>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-border bg-card px-3 py-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary">
              <svg className="h-3.5 w-3.5 text-foreground/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><circle cx="12" cy="12" r="10" /><path d="M12 6v12M6 12h12" /></svg>
            </div>
            <span className="text-[11px] font-medium">Acheter</span>
          </div>
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-border bg-card px-3 py-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary">
              <svg className="h-3.5 w-3.5 text-foreground/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><circle cx="12" cy="12" r="10" /><path d="M8 12h8" /></svg>
            </div>
            <span className="text-[11px] font-medium">Vendre</span>
          </div>
        </div>
      </div>

      {/* Networks */}
      <p className="mb-1.5 mt-3 text-[8px] font-medium uppercase tracking-widest text-muted-foreground">Recevez sur 6 réseaux</p>
      <div className="flex gap-1.5 overflow-hidden">
        {["Tron", "Ethereum", "BNB", "Polygon"].map((n) => (
          <div key={n} className="flex items-center gap-1 rounded-[7px] border border-border bg-card py-1 pl-1 pr-2">
            <div className="h-4 w-4 rounded-full bg-muted" />
            <span className="text-[9px]">{n}</span>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <p className="mb-1.5 mt-3 text-[8px] font-medium uppercase tracking-widest text-muted-foreground">Activité récente</p>
      <div className="rounded-xl border border-border bg-card">
        {[
          { type: "Achat", amount: "200 USDT", date: "28 juil.", status: "Terminé" },
          { type: "Vente", amount: "500 USDT", date: "25 juil.", status: "Terminé" },
        ].map((tx, i) => (
          <div key={i} className={cn("flex items-center justify-between px-3 py-2.5", i > 0 && "border-t border-border")}>
            <div className="flex items-center gap-2">
              <div className={cn("flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-semibold text-white", tx.type === "Achat" ? "bg-emerald-500" : "bg-blue-500")}>
                {tx.type === "Achat" ? "A" : "V"}
              </div>
              <div>
                <p className="text-[10px] font-medium">{tx.type} · {tx.amount}</p>
                <p className="text-[8px] text-muted-foreground">{tx.date}</p>
              </div>
            </div>
            <span className="rounded-full bg-secondary px-2 py-0.5 text-[8px] text-muted-foreground">{tx.status}</span>
          </div>
        ))}
      </div>
    </div>
    <DemoNav active="home" />
  </div>
);

/* ── Screen: Amount ── */
const ScreenAmount = () => (
  <div className="flex h-full flex-col">
    <StatusBar />
    <div className="flex-1 px-4 pb-14 pt-2">
      <p className="text-[16px] font-semibold tracking-tight">Acheter USDT</p>
      <p className="mt-0.5 text-[10px] text-muted-foreground">Entrez le montant que vous souhaitez dépenser</p>

      <div className="mt-3 rounded-[14px] border border-border bg-card p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[8px] font-semibold uppercase tracking-widest text-muted-foreground">Montant</span>
          <div className="flex gap-0.5 rounded-[7px] bg-secondary/70 p-[2px]">
            <span className="rounded-[5px] bg-card px-2 py-0.5 text-[9px] font-semibold">CAD</span>
            <span className="px-2 py-0.5 text-[9px] font-semibold text-muted-foreground">USDT</span>
          </div>
        </div>
        <div className="relative">
          <div className="rounded-[10px] border border-border bg-secondary/40 px-3 py-3">
            <span className="text-[26px] font-bold tracking-tight">500</span>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium text-muted-foreground">CAD</span>
          </div>
        </div>
      </div>

      <div className="mt-2 flex flex-col gap-1.5 rounded-[12px] border border-border bg-card px-3 py-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground">Vous recevez</span>
          <span className="text-[10px] font-semibold">347,22 USDT</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground">Taux</span>
          <span className="text-[10px] text-muted-foreground">1 USDT = 1,44 CAD</span>
        </div>
      </div>

      <div className="mt-3 flex justify-end">
        <div className="flex items-center gap-1.5 rounded-[10px] bg-foreground px-4 py-2 text-[11px] font-medium text-background">
          <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10" /><path d="M12 6v12M6 12h12" /></svg>
          Continuer
        </div>
      </div>
    </div>
    <DemoNav active="buy" />
  </div>
);

/* ── Screen: Network ── */
const ScreenNetwork = () => (
  <div className="flex h-full flex-col">
    <StatusBar />
    <div className="flex-1 px-4 pb-14 pt-2">
      <div className="mb-3 flex items-start gap-2">
        <BackArrow />
        <div>
          <p className="text-[14px] font-semibold tracking-tight">Destination</p>
          <p className="mt-0.5 text-[10px] text-muted-foreground">Choisissez où recevoir vos USDT</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        <NetChip name="Tron" selected />
        <NetChip name="Ethereum" />
        <NetChip name="BNB Chain" />
        <NetChip name="Polygon" />
        <NetChip name="Solana" />
        <NetChip name="Avalanche" />
      </div>
      <div className="mt-4 flex justify-end">
        <div className="flex items-center gap-1.5 rounded-[10px] bg-foreground px-4 py-2 text-[11px] font-medium text-background">
          Continuer
        </div>
      </div>
    </div>
    <DemoNav active="buy" />
  </div>
);

/* ── Screen: Address ── */
const ScreenAddress = () => (
  <div className="flex h-full flex-col">
    <StatusBar />
    <div className="flex-1 px-4 pb-14 pt-2">
      <div className="mb-3 flex items-start gap-2">
        <BackArrow />
        <div>
          <p className="text-[14px] font-semibold tracking-tight">Adresse de réception</p>
          <p className="mt-0.5 text-[10px] text-muted-foreground">Entrez votre adresse TRC20</p>
        </div>
      </div>
      <div className="overflow-hidden rounded-[10px] border border-border bg-card">
        <div className="flex items-center gap-1.5 border-b border-border px-3 py-1.5">
          <div className="h-5 w-5 rounded-full bg-muted" />
          <span className="text-[8px] font-semibold uppercase tracking-widest text-muted-foreground">Tron</span>
          <span className="ml-auto text-[8px] text-muted-foreground">TRC20</span>
        </div>
        <div className="px-3 py-3">
          <span className="font-mono text-[11px] text-foreground/70">TSPUk2W5bc…xRJRCBb</span>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <div className="flex items-center gap-1.5 rounded-[10px] bg-foreground px-4 py-2 text-[11px] font-medium text-background">
          Continuer
        </div>
      </div>
    </div>
    <DemoNav active="buy" />
  </div>
);

/* ── Screen: Recap ── */
const ScreenRecap = () => (
  <div className="flex h-full flex-col">
    <StatusBar />
    <div className="flex-1 px-4 pb-14 pt-2">
      <div className="mb-3 flex items-start gap-2">
        <BackArrow />
        <div>
          <p className="text-[14px] font-semibold tracking-tight">Récapitulatif</p>
          <p className="mt-0.5 text-[10px] text-muted-foreground">Vérifiez les détails avant de valider</p>
        </div>
      </div>
      <div className="overflow-hidden rounded-[12px] border border-border bg-card">
        {[
          { label: "Vous payez", value: "500,00 CAD" },
          { label: "Vous recevez", value: "347,22 USDT" },
          { label: "Taux", value: "1 USDT = 1,44 CAD" },
          { label: "Réseau", value: "Tron · TRC20" },
          { label: "Adresse", value: "TSPUk2…RCBb", mono: true },
        ].map((r, i, arr) => (
          <div key={r.label} className={cn("flex items-center justify-between px-3 py-2.5", i < arr.length - 1 && "border-b border-border")}>
            <span className="text-[10px] text-muted-foreground">{r.label}</span>
            <span className={cn("text-[10px] font-medium", r.mono && "font-mono text-[9px]")}>{r.value}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-end">
        <div className="flex items-center gap-1.5 rounded-[10px] bg-foreground px-4 py-2 text-[11px] font-medium text-background">
          <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
          Valider
        </div>
      </div>
    </div>
    <DemoNav active="buy" />
  </div>
);

/* ── Screen: Done ── */
const ScreenDone = () => (
  <div className="flex h-full flex-col">
    <StatusBar />
    <div className="flex-1 px-4 pb-14 pt-2">
      <p className="text-[14px] font-semibold tracking-tight">Ordre créé</p>
      <p className="mt-0.5 text-[10px] text-muted-foreground">Payez par Interac e-Transfer</p>

      <div className="mt-3 overflow-hidden rounded-[12px] border border-border bg-card">
        {[
          { label: "Vous recevez", value: "347,22 USDT" },
          { label: "À payer", value: "500,00 CAD" },
          { label: "Réseau", value: "Tron · TRC20" },
          { label: "Adresse", value: "TSPUk2…RCBb", mono: true },
        ].map((r, i, arr) => (
          <div key={r.label} className={cn("flex items-center justify-between px-3 py-2.5", i < arr.length - 1 && "border-b border-border")}>
            <span className="text-[10px] text-muted-foreground">{r.label}</span>
            <span className={cn("text-[10px] font-medium", r.mono && "font-mono text-[9px]")}>{r.value}</span>
          </div>
        ))}
      </div>

      <p className="mb-1 mt-3 text-[8px] font-semibold uppercase tracking-widest text-muted-foreground">Envoyez votre e-Transfer</p>
      <div className="overflow-hidden rounded-[12px] border border-border bg-card">
        {[
          { label: "Destinataire", value: "paiement@ooble.ca" },
          { label: "Montant exact", value: "500,00 CAD" },
          { label: "Référence", value: "OBL-7A2F4B" },
        ].map((r, i, arr) => (
          <div key={r.label} className={cn("flex items-center justify-between px-3 py-2.5", i < arr.length - 1 && "border-b border-border")}>
            <span className="text-[10px] text-muted-foreground">{r.label}</span>
            <span className="text-[10px] font-medium">{r.value}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-end">
        <div className="flex items-center gap-1.5 rounded-[10px] bg-foreground px-4 py-2 text-[11px] font-medium text-background">
          <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
          Terminé
        </div>
      </div>
    </div>
    <DemoNav active="buy" />
  </div>
);

const SCREEN_COMPONENTS: Record<Screen, React.FC> = {
  dashboard: ScreenDashboard,
  amount: ScreenAmount,
  network: ScreenNetwork,
  address: ScreenAddress,
  recap: ScreenRecap,
  done: ScreenDone,
};

const AppDemo = ({ className }: { className?: string }) => {
  const [index, setIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const advance = useCallback(() => {
    setTransitioning(true);
    setTimeout(() => {
      setIndex((prev) => (prev + 1) % SCREENS.length);
      setTransitioning(false);
    }, TRANSITION_MS);
  }, []);

  useEffect(() => {
    const id = setInterval(advance, SCREEN_DURATION);
    return () => clearInterval(id);
  }, [advance]);

  const Current = SCREEN_COMPONENTS[SCREENS[index]];

  return (
    <div className={cn("flex justify-center", className)}>
      <div className="relative w-full max-w-[920px]">
        {/* Glow behind the frame */}
        <div className="absolute -inset-8 rounded-[3rem] bg-primary/[0.06] blur-3xl dark:bg-primary/[0.08]" />

        {/* Tablet frame 16:9 */}
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border/60 bg-background shadow-2xl shadow-foreground/[0.06] dark:shadow-foreground/[0.12] sm:rounded-[1.25rem] lg:rounded-[1.5rem]">
          {/* Inner content — mobile phone centered inside the tablet view */}
          <div className="absolute inset-0 flex items-center justify-center bg-secondary/30">
            {/* Phone mockup centered */}
            <div className="relative h-[92%] w-auto aspect-[9/19] overflow-hidden rounded-[1rem] border border-border bg-background shadow-lg sm:rounded-[1.25rem]">
              {/* Notch */}
              <div className="absolute left-1/2 top-0 z-10 h-[18px] w-[90px] -translate-x-1/2 rounded-b-xl bg-foreground/90" />

              {/* Screen content */}
              <div
                className={cn(
                  "h-full w-full transition-all",
                  transitioning ? "scale-[0.97] opacity-0" : "scale-100 opacity-100",
                )}
                style={{ transitionDuration: `${TRANSITION_MS}ms`, transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)" }}
              >
                <Current />
              </div>
            </div>

            {/* Decorative side info - left */}
            <div className="absolute left-6 top-1/2 hidden -translate-y-1/2 lg:block">
              <div className="flex flex-col gap-4 text-right">
                {[
                  { n: "6", label: "Réseaux" },
                  { n: "2%", label: "Marge incluse" },
                  { n: "0", label: "Frais cachés" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-[28px] font-light tracking-tight text-foreground/25">{stat.n}</p>
                    <p className="text-[11px] text-muted-foreground/60">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Decorative side info - right */}
            <div className="absolute right-6 top-1/2 hidden -translate-y-1/2 lg:block">
              <div className="flex flex-col gap-4">
                {[
                  { n: "24h", label: "Règlement" },
                  { n: "KYC", label: "Une seule fois" },
                  { n: "∞", label: "Non-custodial" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-[28px] font-light tracking-tight text-foreground/25">{stat.n}</p>
                    <p className="text-[11px] text-muted-foreground/60">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Progress dots */}
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {SCREENS.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1 rounded-full transition-all duration-500",
                  i === index ? "w-5 bg-foreground/50" : "w-1 bg-foreground/15",
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppDemo;
