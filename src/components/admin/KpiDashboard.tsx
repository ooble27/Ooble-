/**
 * Tableau de bord KPI du back-office Ooble.
 *
 * Design monochrome sombre inspiré du back-office Terex : fond `#1a1a1a`,
 * cartes `#212121`, séparateurs subtils, texte en trois niveaux de gris,
 * chiffres en JetBrains Mono avec letter-spacing serré. Aucun accent
 * coloré (vert/rouge/orange) : les tendances utilisent uniquement des
 * flèches monochromes et le blanc pur pour la valeur positive.
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  TrendingUp, TrendingDown, ArrowRight, ArrowDownToLine, Send,
  Users2, ShieldCheck, ClipboardList,
} from "lucide-react";
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
import {
  C, FONT, MONO, card, heroCard, sH, cardHeader, cardHeaderRow, cardTitle, cardSubtitle,
  listRowStyle, listRowHoverIn, listRowHoverOut, pillSmall,
} from "./adminTheme";
import Sparkline from "./Sparkline";

interface KpiDashboardProps {
  orders: AdminOrder[];
  onNavigate?: (target: "queue" | "orders" | "compliance") => void;
}

type Period = 1 | 7 | 30;

const PERIOD_LABELS: Record<Period, { fr: string; en: string }> = {
  1:  { fr: "24 h", en: "24h" },
  7:  { fr: "7 j",  en: "7d"  },
  30: { fr: "30 j", en: "30d" },
};

// ────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────

const compact = (n: number): string =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)} M`
  : n >= 10_000  ? `${(n / 1000).toFixed(1)} k`
  : nfCad.format(n);

const signedPct = (p: number | null): string | null => {
  if (p === null || !Number.isFinite(p)) return null;
  const sign = p >= 0 ? "+" : "";
  return `${sign}${p.toFixed(1)} %`;
};

// ────────────────────────────────────────────────────────────
// Blocs UI
// ────────────────────────────────────────────────────────────

function Trend({ value }: { value: number | null }) {
  const txt = signedPct(value);
  if (txt === null || value === null || value === 0) return null;
  const Icon = value > 0 ? TrendingUp : TrendingDown;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      fontSize: 11, color: C.t2, fontFamily: MONO, letterSpacing: 0,
    }}>
      <Icon style={{ width: 11, height: 11 }} strokeWidth={2} />
      {txt}
    </span>
  );
}

interface StatTileProps {
  label: React.ReactNode;
  value: React.ReactNode;
  sub?: React.ReactNode;
  trend?: number | null;
  onClick?: () => void;
}

function StatTile({ label, value, sub, trend, onClick }: StatTileProps) {
  const clickable = !!onClick;
  return (
    <button
      onClick={onClick}
      disabled={!clickable}
      style={{
        ...card,
        padding: "16px 18px",
        textAlign: "left",
        cursor: clickable ? "pointer" : "default",
        fontFamily: FONT,
        transition: "border-color 0.15s, background 0.15s",
      }}
      onMouseEnter={(e) => {
        if (!clickable) return;
        (e.currentTarget as HTMLButtonElement).style.borderColor = C.bdh;
      }}
      onMouseLeave={(e) => {
        if (!clickable) return;
        (e.currentTarget as HTMLButtonElement).style.borderColor = C.bds;
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ ...sH, fontSize: 10 }}>{label}</span>
        {typeof trend === "number" && <Trend value={trend} />}
      </div>
      <p style={{
        marginTop: 8, marginBottom: 0,
        fontFamily: MONO, fontSize: 26, fontWeight: 600, color: C.t1,
        letterSpacing: "-0.02em", lineHeight: 1,
      }}>
        {value}
      </p>
      {sub && (
        <p style={{ marginTop: 6, marginBottom: 0, fontSize: 11, color: C.t3, lineHeight: 1.4 }}>
          {sub}
        </p>
      )}
    </button>
  );
}

function SkeletonTile() {
  return (
    <div style={{ ...card, padding: "16px 18px" }}>
      <div style={{ height: 10, width: "40%", background: C.l3, borderRadius: 3 }} />
      <div style={{ marginTop: 12, height: 26, width: "60%", background: C.l3, borderRadius: 4 }} />
      <div style={{ marginTop: 8, height: 10, width: "70%", background: C.l3, borderRadius: 3 }} />
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Sélecteur de période — segmented dark
// ────────────────────────────────────────────────────────────

function PeriodSwitcher({ value, onChange }: { value: Period; onChange: (v: Period) => void }) {
  const periods: Period[] = [1, 7, 30];
  return (
    <div style={{ display: "inline-flex", gap: 4 }}>
      {periods.map((p) => (
        <button key={p} onClick={() => onChange(p)} style={pillSmall(value === p)}>
          {PERIOD_LABELS[p].fr}
        </button>
      ))}
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Composant principal
// ────────────────────────────────────────────────────────────

const KpiDashboard = ({ orders, onNavigate }: KpiDashboardProps) => {
  const [period, setPeriod] = useState<Period>(7);
  const [loading, setLoading] = useState(true);
  const [volume, setVolume] = useState<VolumeMetrics | null>(null);
  const [margin, setMargin] = useState<MarginMetrics | null>(null);
  const [statuses, setStatuses] = useState<OrderStatusCounts | null>(null);
  const [pending, setPending] = useState(0);
  const [funnel, setFunnel] = useState<CustomerFunnel | null>(null);
  const [daily, setDaily] = useState<DailyVolumePoint[]>([]);

  const complianceCount: ComplianceAlertsCount = useMemo(
    () => getComplianceAlertsCount(orders),
    [orders],
  );

  const load = useCallback(async () => {
    setLoading(true);
    const [v, m, s, p, f, d] = await Promise.all([
      getVolumeMetrics({ periodDays: period }),
      getMarginMetrics({ periodDays: period }),
      getOrderStatusCounts(),
      getPendingActionsCount(),
      getCustomerFunnel(),
      getDailyVolume({ days: 30 }),
    ]);
    setVolume(v);
    setMargin(m);
    setStatuses(s);
    setPending(p);
    setFunnel(f);
    setDaily(d);
    setLoading(false);
  }, [period]);

  useEffect(() => { void load(); }, [load]);

  // Live refresh via subscription.
  useEffect(() => {
    const channel = supabase
      .channel("kpi-dashboard")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => load())
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [load]);

  const sparks = useMemo(() => {
    const slice = daily.slice(-period);
    return {
      total:  slice.map((d) => d.totalCad),
      buy:    slice.map((d) => d.buyCad),
      sell:   slice.map((d) => d.sellCad),
      margin: slice.map((d) => d.totalCad * 0.02),
    };
  }, [daily, period]);

  const periodLabel = PERIOD_LABELS[period].fr;
  const today = new Date().toLocaleDateString("fr-CA", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div style={{ fontFamily: FONT, color: C.t1 }}>

      {/* ══════════════════ En-tête ══════════════════ */}
      <div style={{
        display: "flex", alignItems: "flex-end", justifyContent: "space-between",
        flexWrap: "wrap", gap: 12, marginBottom: 18,
      }}>
        <div>
          <p style={{ ...sH, marginBottom: 6 }}><T en="Overview">Vue d'ensemble</T></p>
          <h2 style={{
            fontSize: 24, fontWeight: 600, color: C.t1, margin: 0,
            letterSpacing: "-0.02em", lineHeight: 1.1,
          }}>
            <T en={`Business snapshot · ${periodLabel}`}>{`Activité · ${periodLabel}`}</T>
          </h2>
          <p style={{ fontSize: 12, color: C.t3, margin: "6px 0 0", textTransform: "capitalize" }}>
            {today}
          </p>
        </div>
        <PeriodSwitcher value={period} onChange={setPeriod} />
      </div>

      {/* ══════════════════ Grille principale ══════════════════ */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 14 }}
           className="lg:!grid-cols-[3fr_2fr]">

        {/* ─── Colonne gauche : héro + tuiles + graphique ─── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Héro — volume total */}
          <div style={heroCard}>
            <p style={{ ...sH, marginBottom: 18 }}><T en={`Volume · last ${periodLabel}`}>{`Volume · ${periodLabel}`}</T></p>

            {loading || !volume ? (
              <div style={{ height: 60, width: "60%", background: C.l3, borderRadius: 6 }} />
            ) : (
              <>
                <p style={{
                  fontFamily: MONO, fontSize: 50, fontWeight: 700, color: C.t1, margin: 0,
                  letterSpacing: "-0.04em", lineHeight: 1,
                }}>
                  {compact(volume.totalCad)}
                  <span style={{ color: C.t3, fontSize: 18, fontWeight: 400, marginLeft: 10, letterSpacing: 0 }}>
                    CAD
                  </span>
                </p>

                <div style={{ display: "flex", gap: 0, marginTop: 22, marginBottom: 24 }}>
                  <div style={{ paddingRight: 24 }}>
                    <p style={{ ...sH, marginBottom: 4 }}>USDT</p>
                    <p style={{ color: C.t2, fontSize: 16, fontFamily: MONO, fontWeight: 600, margin: 0 }}>
                      {nfUsdt.format(volume.totalUsdt)}
                    </p>
                  </div>
                  <div style={{ width: 1, background: C.bds, marginRight: 24 }} />
                  <div style={{ paddingRight: 24 }}>
                    <p style={{ ...sH, marginBottom: 4 }}><T en="Orders">Commandes</T></p>
                    <p style={{ color: C.t2, fontSize: 16, fontFamily: MONO, fontWeight: 600, margin: 0 }}>
                      {volume.count}
                    </p>
                  </div>
                  <div style={{ width: 1, background: C.bds, marginRight: 24 }} />
                  <div>
                    <p style={{ ...sH, marginBottom: 4 }}><T en="Variation">Variation</T></p>
                    <div style={{ marginTop: 2 }}><Trend value={volume.changePct} /></div>
                    {volume.changePct === null && (
                      <p style={{ color: C.t2, fontSize: 14, fontFamily: MONO, margin: 0 }}>—</p>
                    )}
                  </div>
                </div>
              </>
            )}

            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => onNavigate?.("orders")}
                style={{
                  height: 36, paddingLeft: 16, paddingRight: 16,
                  background: "transparent", border: `1px solid ${C.bd}`,
                  borderRadius: 9, color: C.t2, fontSize: 12, fontWeight: 500,
                  cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6,
                  fontFamily: FONT, transition: "all 0.15s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.accentBd; e.currentTarget.style.color = C.accent; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.bd; e.currentTarget.style.color = C.t2; }}
              >
                <ClipboardList style={{ width: 13, height: 13 }} />
                <T en="All orders">Toutes les commandes</T>
              </button>
              <button
                onClick={() => onNavigate?.("queue")}
                style={{
                  height: 36, paddingLeft: 18, paddingRight: 18,
                  background: C.accent, border: "none", borderRadius: 9,
                  color: "#111", fontSize: 12, fontWeight: 500,
                  cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6,
                  fontFamily: FONT, transition: "background 0.15s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = C.accentHover; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = C.accent; }}
              >
                <Send style={{ width: 13, height: 13 }} />
                <T en="Open queue">File d'attente</T>
              </button>
            </div>
          </div>

          {/* Tuiles KPI secondaires */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {loading || !volume || !margin ? (
              <>
                <SkeletonTile />
                <SkeletonTile />
              </>
            ) : (
              <>
                <StatTile
                  label={<T en="Buy volume">Volume achats</T>}
                  value={<>{compact(volume.period.buyCad)} <span style={{ color: C.t3, fontSize: 14, fontWeight: 400 }}>CAD</span></>}
                  sub={<T en={`${volume.period.buyCount} orders`}>{`${volume.period.buyCount} commande${volume.period.buyCount > 1 ? "s" : ""}`}</T>}
                />
                <StatTile
                  label={<T en="Sell volume">Volume ventes</T>}
                  value={<>{compact(volume.period.sellCad)} <span style={{ color: C.t3, fontSize: 14, fontWeight: 400 }}>CAD</span></>}
                  sub={<T en={`${volume.period.sellCount} orders`}>{`${volume.period.sellCount} commande${volume.period.sellCount > 1 ? "s" : ""}`}</T>}
                />
              </>
            )}
          </div>

          {/* Graphique volume quotidien */}
          <div style={card}>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "16px 20px", borderBottom: `1px solid ${C.bds}`,
            }}>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: C.t1, margin: 0 }}>
                  <T en="Daily volume">Volume quotidien</T>
                </p>
                <p style={{ fontSize: 11, color: C.t3, margin: "3px 0 0" }}>
                  <T en={`${period} last days · CAD`}>{`${period} derniers jours · CAD`}</T>
                </p>
              </div>
            </div>
            <div style={{ padding: "20px 12px 16px" }}>
              {sparks.total.length >= 2 ? (
                <div style={{ color: C.accent }}>
                  <Sparkline data={sparks.total} height={140} fill endDot />
                </div>
              ) : (
                <div style={{ padding: "40px 20px", textAlign: "center" }}>
                  <p style={{ fontSize: 12, color: C.t3, margin: 0 }}>
                    <T en="Not enough data yet.">Pas encore assez de données.</T>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ─── Colonne droite : marge + statuts + funnel + conformité ─── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Marge dégagée — mise en avant */}
          <div style={{ ...card, padding: "20px 22px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <p style={sH}><T en="Gross margin">Marge brute</T></p>
              {margin && <Trend value={margin.changePct} />}
            </div>
            <p style={{
              fontFamily: MONO, fontSize: 34, fontWeight: 700, color: C.t1, margin: 0,
              letterSpacing: "-0.03em", lineHeight: 1,
            }}>
              {loading || !margin ? "—" : compact(margin.marginCad)}
              <span style={{ color: C.t3, fontSize: 14, fontWeight: 400, marginLeft: 8 }}>CAD</span>
            </p>
            <p style={{ fontSize: 11, color: C.t3, margin: "8px 0 0" }}>
              {margin
                ? <T en={`${margin.completedCount} completed · 2% markup`}>{`${margin.completedCount} terminée${margin.completedCount > 1 ? "s" : ""} · marge 2 %`}</T>
                : "—"}
            </p>
          </div>

          {/* Statuts */}
          <div style={card}>
            <div style={cardHeader}>
              <span style={sH}><T en="By status">Par statut</T></span>
            </div>
            {loading || !statuses ? (
              <div style={{ padding: "40px 20px", textAlign: "center" }}>
                <p style={{ fontSize: 12, color: C.t3, margin: 0 }}>—</p>
              </div>
            ) : (() => {
              const rows: Array<{ label: string; en: string; count: number }> = [
                { label: "En attente",        en: "Awaiting",     count: statuses.awaiting_payment + statuses.created },
                { label: "Paiement reçu",     en: "Paid",         count: statuses.payment_received },
                { label: "En traitement",     en: "Processing",   count: statuses.settling },
                { label: "Terminées",         en: "Completed",    count: statuses.completed },
                { label: "Annulées / expirées", en: "Cancelled / expired", count: statuses.cancelled + statuses.expired },
              ];
              return rows.map((r, i) => (
                <div
                  key={r.label}
                  style={{ ...listRowStyle(i === rows.length - 1), justifyContent: "space-between" }}
                  onMouseEnter={(e) => listRowHoverIn(e.currentTarget)}
                  onMouseLeave={(e) => listRowHoverOut(e.currentTarget)}
                >
                  <span style={{ fontSize: 12.5, color: C.t2 }}><T en={r.en}>{r.label}</T></span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.t1, fontFamily: MONO, letterSpacing: "-0.01em" }}>
                    {r.count}
                  </span>
                </div>
              ));
            })()}
          </div>

          {/* Actions en attente + Conformité */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <button
              onClick={() => onNavigate?.("queue")}
              style={{
                ...card, padding: "16px 18px", textAlign: "left", cursor: "pointer", fontFamily: FONT,
                transition: "border-color 0.15s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = C.bdh; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = C.bds; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <div style={{
                  width: 26, height: 26, borderRadius: 7, background: C.l3, border: `1px solid ${C.bd}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <ClipboardList style={{ width: 13, height: 13, color: C.t1 }} />
                </div>
                <p style={sH}><T en="Pending">À traiter</T></p>
              </div>
              <p style={{ fontFamily: MONO, fontSize: 24, fontWeight: 600, color: C.t1, margin: 0 }}>
                {pending}
              </p>
              <p style={{ fontSize: 11, color: C.t3, margin: "4px 0 0" }}>
                <T en="orders needing action">commandes à traiter</T>
              </p>
            </button>
            <button
              onClick={() => onNavigate?.("compliance")}
              style={{
                ...card, padding: "16px 18px", textAlign: "left", cursor: "pointer", fontFamily: FONT,
                transition: "border-color 0.15s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = C.bdh; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = C.bds; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <div style={{
                  width: 26, height: 26, borderRadius: 7, background: C.l3, border: `1px solid ${C.bd}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <ShieldCheck style={{ width: 13, height: 13, color: C.t1 }} />
                </div>
                <p style={sH}><T en="Compliance">Conformité</T></p>
              </div>
              <p style={{ fontFamily: MONO, fontSize: 24, fontWeight: 600, color: C.t1, margin: 0 }}>
                {complianceCount.open}
              </p>
              <p style={{ fontSize: 11, color: C.t3, margin: "4px 0 0" }}>
                <T en="alerts open">alertes ouvertes</T>
              </p>
            </button>
          </div>

          {/* Funnel clients */}
          <div style={card}>
            <div style={cardHeader}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Users2 style={{ width: 12, height: 12, color: C.t3 }} />
                <span style={sH}><T en="Customer funnel">Entonnoir client</T></span>
              </div>
            </div>
            {loading || !funnel ? (
              <div style={{ padding: "40px 20px", textAlign: "center" }}>
                <p style={{ fontSize: 12, color: C.t3, margin: 0 }}>—</p>
              </div>
            ) : (() => {
              const steps: Array<{ label: string; en: string; count: number }> = [
                { label: "Inscriptions",         en: "Signups",        count: funnel.total },
                { label: "KYC vérifié",          en: "KYC verified",   count: funnel.verified },
                { label: "1er achat / vente",    en: "First order",    count: funnel.firstOrder },
                { label: "Clients récurrents",   en: "Repeat",         count: funnel.repeat },
              ];
              const max = Math.max(1, ...steps.map((s) => s.count));
              return steps.map((s, i) => {
                const pct = (s.count / max) * 100;
                const isLast = i === steps.length - 1;
                return (
                  <div
                    key={s.label}
                    style={{
                      padding: "12px 18px",
                      borderBottom: isLast ? "none" : `1px solid ${C.bds}`,
                      transition: "background 0.12s",
                    }}
                    onMouseEnter={(e) => listRowHoverIn(e.currentTarget)}
                    onMouseLeave={(e) => listRowHoverOut(e.currentTarget)}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontSize: 12.5, color: C.t2 }}><T en={s.en}>{s.label}</T></span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: C.t1, fontFamily: MONO, letterSpacing: "-0.01em" }}>
                        {s.count}
                      </span>
                    </div>
                    <div style={{ height: 2, background: C.l3, borderRadius: 1, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: C.accent, transition: "width 0.4s" }} />
                    </div>
                  </div>
                );
              });
            })()}
          </div>

        </div>
      </div>

      {/* Note bas de page */}
      <p style={{
        marginTop: 18, fontSize: 11, color: C.t3, textAlign: "center", fontFamily: FONT,
      }}>
        <T en="Live · updates automatically when orders or profiles change.">
          En direct · se met à jour automatiquement à chaque changement de commande ou de client.
        </T>
      </p>
    </div>
  );
};

export default KpiDashboard;
