import { useEffect, useMemo, useState } from "react";
import {
  TrendingUp, TrendingDown, Minus, AlertTriangle, ClipboardCheck,
  Users, ShoppingCart, DollarSign, Wallet, ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { T } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { nfCad, nfUsdt, type AdminOrder } from "@/lib/adminOrders";
import {
  getVolumeMetrics, getMarginMetrics, getOrderStatusCounts,
  getCustomerFunnel, getComplianceAlertsCount, getPendingActionsCount,
  getDailyVolume,
  type VolumeMetrics, type MarginMetrics, type OrderStatusCounts,
  type CustomerFunnel, type DailyVolumePoint, type ComplianceAlertsCount,
} from "@/lib/kpi";
import Sparkline from "./Sparkline";

interface KpiDashboardProps {
  orders: AdminOrder[];
  /** Optionnel — pour naviguer vers d'autres onglets du back-office. */
  onNavigate?: (target: "queue" | "orders" | "compliance") => void;
}

type Period = 1 | 7 | 30;

const PERIOD_LABELS: Record<Period, { fr: string; en: string }> = {
  1:  { fr: "24 h", en: "24h" },
  7:  { fr: "7 j",  en: "7d"  },
  30: { fr: "30 j", en: "30d" },
};

// ────────────────────────────────────────────────────────────
// Helpers d'affichage
// ────────────────────────────────────────────────────────────

const compactCad = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)} M`
  : n >= 10_000  ? `${(n / 1000).toFixed(1)} k`
  : nfCad.format(n);

const signedPct = (p: number | null): string => {
  if (p === null || !Number.isFinite(p)) return "—";
  const sign = p >= 0 ? "+" : "";
  return `${sign}${p.toFixed(1)}%`;
};

// ────────────────────────────────────────────────────────────
// Blocs UI
// ────────────────────────────────────────────────────────────

const Trend = ({ value, invert = false }: { value: number | null; invert?: boolean }) => {
  if (value === null || !Number.isFinite(value) || value === 0) {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-secondary/60 px-1.5 py-0.5 text-[11px] font-medium tabular-nums text-muted-foreground">
        <Minus className="h-3 w-3" /> —
      </span>
    );
  }
  const positive = invert ? value < 0 : value > 0;
  const Icon = value > 0 ? TrendingUp : TrendingDown;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-semibold tabular-nums",
        positive
          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          : "bg-rose-500/10 text-rose-600 dark:text-rose-400",
      )}
    >
      <Icon className="h-3 w-3" strokeWidth={2.2} /> {signedPct(value)}
    </span>
  );
};

interface StatTileProps {
  label: React.ReactNode;
  value: React.ReactNode;
  sub?: React.ReactNode;
  trend?: number | null;
  spark?: number[];
  icon?: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  accent?: "default" | "success" | "warning" | "critical";
  onClick?: () => void;
}

const ACCENT_CLASS: Record<NonNullable<StatTileProps["accent"]>, string> = {
  default:  "text-foreground/70",
  success:  "text-emerald-600 dark:text-emerald-400",
  warning:  "text-amber-600 dark:text-amber-400",
  critical: "text-rose-600 dark:text-rose-400",
};

const StatTile = ({ label, value, sub, trend, spark, icon: Icon, accent = "default", onClick }: StatTileProps) => {
  const inner = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
            {Icon && <Icon className="h-3 w-3" strokeWidth={1.9} />}
            {label}
          </p>
          <p className="mt-2 font-display text-[24px] font-light leading-none tracking-tight tabular-nums text-foreground">
            {value}
          </p>
          {sub && (
            <p className="mt-1.5 text-[12px] tabular-nums text-muted-foreground">{sub}</p>
          )}
        </div>
        {trend !== undefined && <Trend value={trend} />}
      </div>
      {spark && spark.length > 0 && (
        <div className={cn("mt-3 h-8 w-full", ACCENT_CLASS[accent])}>
          <Sparkline data={spark} height={32} fill endDot className="h-full w-full" />
        </div>
      )}
    </>
  );

  const cls = "rounded-2xl border border-border bg-card p-4 transition-colors";
  return onClick ? (
    <button type="button" onClick={onClick} className={cn(cls, "text-left hover:bg-secondary/40")}>
      {inner}
    </button>
  ) : (
    <div className={cls}>{inner}</div>
  );
};

const SkeletonTile = () => (
  <div className="rounded-2xl border border-border bg-card p-4">
    <div className="flex items-start justify-between">
      <div className="w-full space-y-2">
        <div className="h-3 w-16 animate-pulse rounded bg-secondary" />
        <div className="h-6 w-24 animate-pulse rounded bg-secondary" />
        <div className="h-3 w-20 animate-pulse rounded bg-secondary" />
      </div>
      <div className="h-4 w-12 animate-pulse rounded bg-secondary" />
    </div>
    <div className="mt-3 h-8 w-full animate-pulse rounded bg-secondary" />
  </div>
);

const SectionTitle = ({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) => (
  <div className="mb-2.5 flex items-center justify-between px-1">
    <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">{children}</p>
    {action}
  </div>
);

// ────────────────────────────────────────────────────────────
// Sélecteur de période
// ────────────────────────────────────────────────────────────

const PeriodSwitcher = ({ value, onChange }: { value: Period; onChange: (p: Period) => void }) => (
  <div className="inline-flex rounded-xl border border-border bg-card p-0.5">
    {([1, 7, 30] as Period[]).map((p) => {
      const on = p === value;
      return (
        <button
          key={p}
          type="button"
          onClick={() => onChange(p)}
          className={cn(
            "rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors",
            on ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
          )}
        >
          <T en={PERIOD_LABELS[p].en}>{PERIOD_LABELS[p].fr}</T>
        </button>
      );
    })}
  </div>
);

// ────────────────────────────────────────────────────────────
// Graphe surface — volume quotidien empilé (buy + sell)
// ────────────────────────────────────────────────────────────

const StackedVolumeChart = ({ points }: { points: DailyVolumePoint[] }) => {
  if (points.length === 0) return null;
  const W = 800;
  const H = 180;
  const padL = 8;
  const padR = 8;
  const padT = 12;
  const padB = 22;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const max = Math.max(1, ...points.map((p) => p.totalCad));
  const stepX = points.length > 1 ? innerW / (points.length - 1) : innerW;

  const buyPts: [number, number][] = points.map((p, i) => [
    padL + i * stepX,
    padT + innerH * (1 - p.buyCad / max),
  ]);
  const totalPts: [number, number][] = points.map((p, i) => [
    padL + i * stepX,
    padT + innerH * (1 - p.totalCad / max),
  ]);

  const areaFrom = (pts: [number, number][]) => {
    if (pts.length < 2) return "";
    let d = `M ${pts[0][0]} ${padT + innerH} L ${pts[0][0]} ${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) d += ` L ${pts[i][0]} ${pts[i][1]}`;
    d += ` L ${pts[pts.length - 1][0]} ${padT + innerH} Z`;
    return d;
  };

  // Labels : premier, milieu, dernier jour
  const labels = [0, Math.floor(points.length / 2), points.length - 1].map((i) => {
    const d = new Date(points[i].date + "T00:00:00");
    return {
      x: padL + i * stepX,
      text: d.toLocaleDateString("fr-CA", { day: "2-digit", month: "short" }),
    };
  });

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="h-[180px] w-full text-foreground">
      {/* Grille horizontale légère */}
      {[0.25, 0.5, 0.75].map((r) => (
        <line
          key={r}
          x1={padL} x2={W - padR}
          y1={padT + innerH * r} y2={padT + innerH * r}
          stroke="currentColor" strokeOpacity="0.06" strokeWidth="1"
        />
      ))}
      {/* Aire total (buy+sell) — teinte muted */}
      <path d={areaFrom(totalPts)} fill="currentColor" fillOpacity="0.06" />
      {/* Aire buy — teinte accent */}
      <path d={areaFrom(buyPts)} fill="currentColor" fillOpacity="0.14" />
      {/* Ligne total */}
      <path
        d={totalPts.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ")}
        fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" vectorEffect="non-scaling-stroke"
      />
      {labels.map((l, i) => (
        <text
          key={i} x={l.x} y={H - 6}
          textAnchor={i === 0 ? "start" : i === labels.length - 1 ? "end" : "middle"}
          className="fill-muted-foreground"
          style={{ fontSize: 10 }}
        >
          {l.text}
        </text>
      ))}
    </svg>
  );
};

// ────────────────────────────────────────────────────────────
// Statuts — barre horizontale empilée
// ────────────────────────────────────────────────────────────

const STATUS_META: Record<keyof OrderStatusCounts, { fr: string; en: string; tone: string }> = {
  created:           { fr: "Créées",         en: "Created",           tone: "bg-foreground/60" },
  awaiting_payment:  { fr: "Attente paiement", en: "Awaiting payment", tone: "bg-amber-500" },
  payment_received:  { fr: "Paiement reçu",  en: "Payment received",  tone: "bg-sky-500" },
  settling:          { fr: "En traitement",  en: "Processing",        tone: "bg-indigo-500" },
  completed:         { fr: "Terminées",      en: "Completed",         tone: "bg-emerald-500" },
  cancelled:         { fr: "Annulées",       en: "Cancelled",         tone: "bg-muted-foreground/40" },
  expired:           { fr: "Expirées",       en: "Expired",           tone: "bg-rose-500" },
};

const StatusBreakdown = ({ counts }: { counts: OrderStatusCounts }) => {
  const total = Object.values(counts).reduce((s, n) => s + n, 0);
  const entries = (Object.keys(STATUS_META) as (keyof OrderStatusCounts)[])
    .map((k) => ({ key: k, count: counts[k] ?? 0 }));

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-baseline justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
          <T en="Orders by status">Commandes par statut</T>
        </p>
        <p className="text-[13px] font-semibold tabular-nums text-foreground">
          {total} <span className="text-[11px] font-normal text-muted-foreground"><T en="total">total</T></span>
        </p>
      </div>

      {/* Barre empilée */}
      <div className="mt-3 flex h-2 w-full overflow-hidden rounded-full bg-secondary">
        {total > 0 && entries.map(({ key, count }) =>
          count > 0 ? (
            <div
              key={key}
              className={cn("h-full", STATUS_META[key].tone)}
              style={{ width: `${(count / total) * 100}%` }}
              title={STATUS_META[key].fr}
            />
          ) : null,
        )}
      </div>

      <ul className="mt-4 grid grid-cols-1 gap-1 sm:grid-cols-2">
        {entries.map(({ key, count }) => (
          <li key={key} className="flex items-center justify-between gap-3 py-1 text-[13px]">
            <span className="flex items-center gap-2 truncate text-muted-foreground">
              <span className={cn("h-2 w-2 shrink-0 rounded-full", STATUS_META[key].tone)} />
              <T en={STATUS_META[key].en}>{STATUS_META[key].fr}</T>
            </span>
            <span className="tabular-nums text-foreground">{count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// ────────────────────────────────────────────────────────────
// Entonnoir clients
// ────────────────────────────────────────────────────────────

const CustomerFunnelCard = ({ funnel }: { funnel: CustomerFunnel }) => {
  const steps: { label: React.ReactNode; value: number }[] = [
    { label: <T en="Signups">Inscriptions</T>, value: funnel.total },
    { label: <T en="Verified (KYC)">Vérifiés (KYC)</T>, value: funnel.verified },
    { label: <T en="First order">1ᵉʳ ordre</T>, value: funnel.firstOrder },
    { label: <T en="Repeat">Récurrents</T>, value: funnel.repeat },
  ];
  const base = Math.max(1, funnel.total);

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-baseline justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
          <T en="Customer funnel">Entonnoir clients</T>
        </p>
        <p className="text-[12px] tabular-nums text-muted-foreground">
          {funnel.active30d} <T en="active / 30d">actifs / 30 j</T>
        </p>
      </div>

      <ul className="mt-3 space-y-2.5">
        {steps.map((s, i) => {
          const pct = (s.value / base) * 100;
          return (
            <li key={i}>
              <div className="flex items-baseline justify-between text-[13px]">
                <span className="text-muted-foreground">{s.label}</span>
                <span className="tabular-nums text-foreground">
                  {s.value}
                  {i > 0 && (
                    <span className="ml-1.5 text-[11px] text-muted-foreground">
                      ({pct.toFixed(0)}%)
                    </span>
                  )}
                </span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full bg-foreground/70 transition-[width] duration-500"
                  style={{ width: `${Math.min(100, pct)}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

// ────────────────────────────────────────────────────────────
// Volume détaillé — buy vs sell
// ────────────────────────────────────────────────────────────

const VolumeBreakdown = ({ metrics, period }: { metrics: VolumeMetrics; period: Period }) => {
  const { period: cur } = metrics;
  const rows = [
    {
      label: <T en="Buy">Achats</T>,
      cad: cur.buyCad, usdt: cur.buyUsdt, count: cur.buyCount,
      tone: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: <T en="Sell">Ventes</T>,
      cad: cur.sellCad, usdt: cur.sellUsdt, count: cur.sellCount,
      tone: "text-sky-600 dark:text-sky-400",
    },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-baseline justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
          <T en="Buy vs sell">Achat vs vente</T>
        </p>
        <p className="text-[11px] tabular-nums text-muted-foreground">
          <T en={`Last ${PERIOD_LABELS[period].en}`}>{`${PERIOD_LABELS[period].fr}`}</T>
        </p>
      </div>
      <div className="mt-3 divide-y divide-border">
        {rows.map((r, i) => (
          <div key={i} className="flex items-center justify-between py-2.5">
            <div>
              <p className={cn("text-[13px] font-medium", r.tone)}>{r.label}</p>
              <p className="text-[11px] text-muted-foreground">
                {r.count} <T en={r.count > 1 ? "orders" : "order"}>{r.count > 1 ? "commandes" : "commande"}</T>
              </p>
            </div>
            <div className="text-right">
              <p className="text-[14px] font-semibold tabular-nums">{nfCad.format(r.cad)} CAD</p>
              <p className="text-[11px] tabular-nums text-muted-foreground">{nfUsdt.format(r.usdt)} USDT</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ────────────────────────────────────────────────────────────
// Dashboard principal
// ────────────────────────────────────────────────────────────

const KpiDashboard = ({ orders, onNavigate }: KpiDashboardProps) => {
  const [period, setPeriod] = useState<Period>(7);
  const [loading, setLoading] = useState(true);
  const [volume, setVolume] = useState<VolumeMetrics | null>(null);
  const [margin, setMargin] = useState<MarginMetrics | null>(null);
  const [statuses, setStatuses] = useState<OrderStatusCounts | null>(null);
  const [funnel, setFunnel] = useState<CustomerFunnel | null>(null);
  const [pending, setPending] = useState<number>(0);
  const [daily, setDaily] = useState<DailyVolumePoint[]>([]);

  // Compliance : dérivé des ordres (SEED_ALERTS + auto-flag) — synchrone.
  const compliance: ComplianceAlertsCount = useMemo(
    () => getComplianceAlertsCount(orders),
    [orders],
  );

  // Chargement + rafraîchissement en temps réel (postgres_changes).
  useEffect(() => {
    let cancelled = false;

    const refresh = async () => {
      const [v, m, s, f, p, d] = await Promise.all([
        getVolumeMetrics({ periodDays: period }),
        getMarginMetrics({ periodDays: period }),
        getOrderStatusCounts(),
        getCustomerFunnel(),
        getPendingActionsCount(),
        getDailyVolume({ days: 30 }),
      ]);
      if (cancelled) return;
      setVolume(v); setMargin(m); setStatuses(s);
      setFunnel(f); setPending(p); setDaily(d);
      setLoading(false);
    };

    refresh();

    const channel = supabase
      .channel("kpi-dashboard")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => { void refresh(); })
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, () => { void refresh(); })
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [period]);

  // Séries pour sparklines (sur les 30 derniers jours, tronquées à la période).
  const sparks = useMemo(() => {
    const slice = daily.slice(-period);
    return {
      total: slice.map((d) => d.totalCad),
      buy: slice.map((d) => d.buyCad),
      sell: slice.map((d) => d.sellCad),
      margin: slice.map((d) => d.totalCad * 0.02),
    };
  }, [daily, period]);

  const periodLabelFr = PERIOD_LABELS[period].fr;
  const periodLabelEn = PERIOD_LABELS[period].en;

  return (
    <div className="space-y-6">
      {/* En-tête : titre + sélecteur de période */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-[17px] font-semibold tracking-tight">
            <T en="KPI dashboard">Tableau de bord KPI</T>
          </h2>
          <p className="text-[12px] text-muted-foreground">
            <T en={`Business snapshot — last ${periodLabelEn}, updated live.`}>
              {`Aperçu de l'activité — ${periodLabelFr}, mis à jour en direct.`}
            </T>
          </p>
        </div>
        <PeriodSwitcher value={period} onChange={setPeriod} />
      </div>

      {/* Grille de tuiles principales */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {loading || !volume || !margin ? (
          <>
            <SkeletonTile /><SkeletonTile /><SkeletonTile /><SkeletonTile />
          </>
        ) : (
          <>
            <StatTile
              label={<T en="Volume">Volume</T>}
              value={<>{compactCad(volume.totalCad)} <span className="text-[14px] font-normal text-muted-foreground">CAD</span></>}
              sub={<>{nfUsdt.format(volume.totalUsdt)} USDT · {volume.count} <T en={volume.count > 1 ? "orders" : "order"}>{volume.count > 1 ? "commandes" : "commande"}</T></>}
              trend={volume.changePct}
              spark={sparks.total}
              icon={Wallet}
              accent="default"
            />
            <StatTile
              label={<T en="Gross margin">Marge brute</T>}
              value={<>{compactCad(margin.marginCad)} <span className="text-[14px] font-normal text-muted-foreground">CAD</span></>}
              sub={<><T en={`${margin.completedCount} completed · 2% markup`}>{`${margin.completedCount} terminée${margin.completedCount > 1 ? "s" : ""} · marge 2 %`}</T></>}
              trend={margin.changePct}
              spark={sparks.margin}
              icon={DollarSign}
              accent="success"
            />
            <StatTile
              label={<T en="Buy volume">Volume achats</T>}
              value={<>{compactCad(volume.period.buyCad)} <span className="text-[14px] font-normal text-muted-foreground">CAD</span></>}
              sub={<>{volume.period.buyCount} <T en={volume.period.buyCount > 1 ? "buy orders" : "buy order"}>{volume.period.buyCount > 1 ? "achats" : "achat"}</T></>}
              spark={sparks.buy}
              icon={ShoppingCart}
              accent="default"
            />
            <StatTile
              label={<T en="Sell volume">Volume ventes</T>}
              value={<>{compactCad(volume.period.sellCad)} <span className="text-[14px] font-normal text-muted-foreground">CAD</span></>}
              sub={<>{volume.period.sellCount} <T en={volume.period.sellCount > 1 ? "sell orders" : "sell order"}>{volume.period.sellCount > 1 ? "ventes" : "vente"}</T></>}
              spark={sparks.sell}
              icon={ShoppingCart}
              accent="default"
            />
          </>
        )}
      </div>

      {/* Rangée d'action + alertes (priorité opérationnelle) */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatTile
          label={<T en="Pending actions">Actions en attente</T>}
          value={loading ? "…" : String(pending)}
          sub={<T en="Orders needing operator attention">Ordres à traiter par l'équipe</T>}
          icon={ClipboardCheck}
          accent={pending > 5 ? "warning" : "default"}
          onClick={onNavigate ? () => onNavigate("queue") : undefined}
        />
        <StatTile
          label={<T en="Open compliance alerts">Alertes conformité ouvertes</T>}
          value={String(compliance.open)}
          sub={compliance.critical > 0
            ? <span className="text-rose-600 dark:text-rose-400"><T en={`${compliance.critical} critical`}>{`${compliance.critical} critique${compliance.critical > 1 ? "s" : ""}`}</T></span>
            : <T en="No critical alerts">Aucune alerte critique</T>}
          icon={AlertTriangle}
          accent={compliance.critical > 0 ? "critical" : compliance.open > 0 ? "warning" : "success"}
          onClick={onNavigate ? () => onNavigate("compliance") : undefined}
        />
        <StatTile
          label={<T en="Active customers (30d)">Clients actifs (30 j)</T>}
          value={loading || !funnel ? "…" : String(funnel.active30d)}
          sub={loading || !funnel
            ? " "
            : <>{funnel.verified} <T en="verified">vérifiés</T> · {funnel.total} <T en="signups">inscrits</T></>}
          icon={Users}
          accent="default"
        />
      </div>

      {/* Bloc principal : volume quotidien */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
              <T en="Daily volume — last 30 days">Volume quotidien — 30 derniers jours</T>
            </p>
            <p className="mt-0.5 text-[12px] text-muted-foreground">
              <T en="Total CAD (line) with buy component (shaded).">
                Total CAD (courbe) et part des achats (aire teintée).
              </T>
            </p>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-foreground/70" /><T en="Total">Total</T></span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-foreground/30" /><T en="Buy">Achats</T></span>
          </div>
        </div>
        {loading ? (
          <div className="h-[180px] w-full animate-pulse rounded-lg bg-secondary" />
        ) : daily.every((d) => d.totalCad === 0) ? (
          <div className="flex h-[180px] items-center justify-center text-[13px] text-muted-foreground">
            <T en="No volume yet in the last 30 days.">Aucun volume sur les 30 derniers jours.</T>
          </div>
        ) : (
          <StackedVolumeChart points={daily} />
        )}
      </div>

      {/* Deux colonnes : gauche = statuts + volume par sens, droite = entonnoir + alertes */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <div className="space-y-3">
          {statuses ? (
            <StatusBreakdown counts={statuses} />
          ) : (
            <div className="h-48 animate-pulse rounded-2xl bg-secondary/40" />
          )}
          {volume && <VolumeBreakdown metrics={volume} period={period} />}
        </div>

        <div className="space-y-3">
          {funnel ? (
            <CustomerFunnelCard funnel={funnel} />
          ) : (
            <div className="h-48 animate-pulse rounded-2xl bg-secondary/40" />
          )}

          {/* Bloc CTA alertes conformité */}
          <button
            type="button"
            onClick={onNavigate ? () => onNavigate("compliance") : undefined}
            disabled={!onNavigate}
            className={cn(
              "flex w-full items-center justify-between rounded-2xl border p-4 text-left transition-colors",
              compliance.critical > 0
                ? "border-rose-500/30 bg-rose-500/5 hover:bg-rose-500/10"
                : compliance.open > 0
                  ? "border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10"
                  : "border-border bg-card hover:bg-secondary/40",
              !onNavigate && "cursor-default hover:bg-transparent",
            )}
          >
            <div>
              <p className={cn(
                "text-[11px] font-semibold uppercase tracking-[0.1em]",
                compliance.critical > 0 ? "text-rose-600 dark:text-rose-400"
                : compliance.open > 0 ? "text-amber-600 dark:text-amber-400"
                : "text-muted-foreground",
              )}>
                <T en="Compliance">Conformité</T>
              </p>
              <p className="mt-1 font-display text-[20px] font-light leading-none tabular-nums">
                {compliance.open} <span className="text-[12px] font-normal text-muted-foreground">
                  <T en={compliance.open > 1 ? "open alerts" : "open alert"}>
                    {compliance.open > 1 ? "alertes ouvertes" : "alerte ouverte"}
                  </T>
                </span>
              </p>
              <p className="mt-1 text-[12px] text-muted-foreground">
                {compliance.critical > 0
                  ? <T en={`${compliance.critical} require immediate action (DOT / sanctions).`}>
                      {`${compliance.critical} exigent une action immédiate (DOT / sanctions).`}
                    </T>
                  : <T en="Review flagged transactions and clients.">Consultez les alertes et clients signalés.</T>}
              </p>
            </div>
            {onNavigate && <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default KpiDashboard;
