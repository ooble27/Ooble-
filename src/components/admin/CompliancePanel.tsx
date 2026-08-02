import { useMemo, useState } from "react";
import {
  Check, ChevronRight, Clock, FileText, Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { nfCad, type AdminOrder } from "@/lib/adminOrders";
import {
  ALERT_TYPE_META, ALERT_STATUS_META,
  DECL_TYPE_META, DECL_STATUS_META,
  RECORD_CATEGORIES, SEED_CHECKLIST, CHECKLIST_CATEGORIES,
  SEED_ALERTS, SEED_DECLARATIONS,
  DOIMV_THRESHOLD, DOIMV_DEADLINE_DAYS,
  RECORD_RETENTION_YEARS,
  autoFlagOrders, daysUntil,
  type ComplianceAlert, type AlertStatus, type AlertType,
  type ComplianceDeclaration,
  type ChecklistItem,
} from "@/lib/compliance";
import { SubTabs } from "./AdminBits";

// ──────────────── Summary Card ────────────────

const SummaryCard = ({ label, value, sub, urgent }: {
  label: string; value: string; sub?: string; urgent?: boolean;
}) => (
  <div className={cn("rounded-2xl border bg-card px-5 py-4", urgent ? "border-destructive/30" : "border-border")}>
    <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
    <p className={cn(
      "mt-1.5 font-display text-[24px] font-light leading-none tracking-tight",
      urgent && "text-destructive",
    )}>
      {value}
    </p>
    {sub && <p className="mt-1.5 text-[12px] text-muted-foreground">{sub}</p>}
  </div>
);

// ──────────────── Alert Type Badge ────────────────

const TypeBadge = ({ type }: { type: AlertType }) => {
  const meta = ALERT_TYPE_META[type];
  return (
    <span className={cn(
      "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.05em]",
      meta.critical ? "bg-destructive/10 text-destructive" : "bg-secondary text-foreground",
    )}>
      {meta.label}
    </span>
  );
};

// ──────────────── Alertes View ────────────────

const AlertesView = ({ alerts, onUpdateStatus }: {
  alerts: ComplianceAlert[];
  onUpdateStatus: (id: string, status: AlertStatus) => void;
}) => {
  type Filter = "actives" | "traitees";
  const [filter, setFilter] = useState<Filter>("actives");

  const actives = alerts.filter((a) => a.status === "nouveau" || a.status === "en_cours");
  const traitees = alerts.filter((a) => a.status === "declare" || a.status === "classe");

  const TABS = [
    { id: "actives", label: "Actives", count: actives.length },
    { id: "traitees", label: "Traitées", count: traitees.length },
  ];
  const list = filter === "actives" ? actives : traitees;

  return (
    <div className="space-y-4">
      <SubTabs tabs={TABS} active={filter} onChange={(id) => setFilter(id as Filter)} />

      {list.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-border bg-card py-16 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
            <Shield className="h-5 w-5" strokeWidth={1.6} />
          </span>
          <p className="mt-3 text-[13px] text-muted-foreground">
            {filter === "actives" ? "Aucune alerte active — tout est conforme." : "Aucune alerte traitée."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((alert) => (
            <div key={alert.id} className="rounded-2xl border border-border bg-card p-4 md:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <TypeBadge type={alert.type} />
                  <span className="text-[12px] text-muted-foreground">{alert.id}</span>
                  {alert.orderRef && (
                    <span className="text-[12px] text-muted-foreground">· {alert.orderRef}</span>
                  )}
                </div>
                <span className={cn("text-[13px] font-semibold", ALERT_STATUS_META[alert.status].text)}>
                  {ALERT_STATUS_META[alert.status].label}
                </span>
              </div>

              <div className="mt-3 flex items-center gap-2.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-[10px] font-semibold text-foreground/70">
                  {alert.clientName.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="text-[13px] font-medium leading-tight">{alert.clientName}</p>
                  <p className="text-[11.5px] leading-tight text-muted-foreground">{alert.clientEmail}</p>
                </div>
                <span className="ml-auto shrink-0 text-[14px] font-semibold tabular-nums">
                  {nfCad.format(alert.amount)} $
                </span>
              </div>

              <p className="mt-3 text-[13px] leading-[1.5] text-muted-foreground">{alert.reason}</p>

              {alert.notes && (
                <p className="mt-2 rounded-lg bg-secondary/50 px-3 py-2 text-[12px] text-muted-foreground">
                  <span className="font-semibold">Note :</span> {alert.notes}
                </p>
              )}

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <span className="text-[12px] text-muted-foreground">{alert.createdAt}</span>
                {(alert.status === "nouveau" || alert.status === "en_cours") && (
                  <div className="flex flex-wrap gap-2">
                    {alert.status === "nouveau" && (
                      <Button
                        variant="appOutline" shape="rounded"
                        className="h-auto gap-1 rounded-[9px] px-3 py-[6px] text-[12px]"
                        onClick={() => onUpdateStatus(alert.id, "en_cours")}
                      >
                        Prendre en charge
                      </Button>
                    )}
                    <Button
                      variant="appOutline" shape="rounded"
                      className="h-auto gap-1 rounded-[9px] px-3 py-[6px] text-[12px]"
                      onClick={() => onUpdateStatus(alert.id, "classe")}
                    >
                      Classer sans suite
                    </Button>
                    <Button
                      variant="appSolid" shape="rounded"
                      className="h-auto gap-1.5 rounded-[9px] px-3 py-[6px] text-[12px] font-bold"
                      onClick={() => onUpdateStatus(alert.id, "declare")}
                    >
                      <FileText className="h-[13px] w-[13px]" /> Déclarer
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ──────────────── Déclarations View ────────────────

const DeclarationsView = ({ declarations }: { declarations: ComplianceDeclaration[] }) => {
  type Filter = "en_cours" | "terminees";
  const [filter, setFilter] = useState<Filter>("en_cours");

  const enCours = declarations.filter((d) => d.status === "brouillon" || d.status === "soumise");
  const terminees = declarations.filter((d) => d.status === "acceptee" || d.status === "rejetee");

  const TABS = [
    { id: "en_cours", label: "En cours", count: enCours.length },
    { id: "terminees", label: "Terminées", count: terminees.length },
  ];
  const list = filter === "en_cours" ? enCours : terminees;

  const cols = "grid grid-cols-[1fr_auto] md:grid-cols-[1.2fr_0.6fr_0.6fr_0.7fr_0.6fr] items-center gap-3";

  return (
    <div className="space-y-4">
      <SubTabs tabs={TABS} active={filter} onChange={(id) => setFilter(id as Filter)} />

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className={cn(cols, "hidden border-b border-border px-4 py-2.5 md:grid")}>
          <span className="text-[10.5px] font-semibold uppercase tracking-[0.07em] text-muted-foreground">Déclaration</span>
          <span className="text-[10.5px] font-semibold uppercase tracking-[0.07em] text-muted-foreground">Type</span>
          <span className="text-[10.5px] font-semibold uppercase tracking-[0.07em] text-muted-foreground">Montant</span>
          <span className="text-[10.5px] font-semibold uppercase tracking-[0.07em] text-muted-foreground">Échéance</span>
          <span className="text-[10.5px] font-semibold uppercase tracking-[0.07em] text-muted-foreground">Statut</span>
        </div>

        {list.map((d, i) => {
          const days = daysUntil(d.dueDate);
          const urgent = d.status === "brouillon" && days <= 5;
          return (
            <div key={d.id} className={cn(cols, "px-4 py-3", i < list.length - 1 && "border-b border-border")}>
              <div className="min-w-0">
                <p className="text-[13px] font-medium">{d.id}</p>
                <p className="truncate text-[11.5px] text-muted-foreground">{d.clientName}</p>
                {d.canafRef && <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{d.canafRef}</p>}
              </div>
              <span className="hidden md:block">
                <span className={cn(
                  "inline-flex rounded-md px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.05em]",
                  d.type === "dot" || d.type === "dbt" ? "bg-destructive/10 text-destructive" : "bg-secondary text-foreground",
                )}>
                  {DECL_TYPE_META[d.type].label}
                </span>
              </span>
              <span className="hidden tabular-nums text-[13px] md:block">{nfCad.format(d.amount)} $</span>
              <span className={cn(
                "hidden text-[12.5px] md:block",
                urgent ? "font-semibold text-destructive" : "text-muted-foreground",
              )}>
                {d.status === "brouillon"
                  ? (days > 0 ? `${days} j restants` : "Échue")
                  : d.submittedAt ?? d.dueDate}
              </span>
              <span className={cn("text-[13px] font-semibold", DECL_STATUS_META[d.status].text)}>
                {DECL_STATUS_META[d.status].label}
              </span>
            </div>
          );
        })}

        {list.length === 0 && (
          <div className="flex flex-col items-center py-16 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
              <FileText className="h-5 w-5" strokeWidth={1.6} />
            </span>
            <p className="mt-3 text-[13px] text-muted-foreground">Aucune déclaration ici.</p>
          </div>
        )}
      </div>

      <p className="px-1 text-[12px] text-muted-foreground">
        Les DOIMV doivent être soumises dans les {DOIMV_DEADLINE_DAYS} jours suivant l'opération.
        Les DOT dans les 30 jours (3 jours si financement terroriste).
        Conservez une copie de chaque déclaration pendant {RECORD_RETENTION_YEARS} ans.
      </p>
    </div>
  );
};

// ──────────────── Dossiers View ────────────────

const DossiersView = () => {
  const total = RECORD_CATEGORIES.reduce((s, c) => s + c.count, 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <SummaryCard label="Total dossiers" value={String(total)} sub="Toutes catégories" />
        <SummaryCard label="Conservation" value={`${RECORD_RETENTION_YEARS} ans`} sub="Obligation LRPCFAT" />
        <SummaryCard label="Plus ancien" value="Juin 2026" sub="Destruction en juin 2031" />
        <SummaryCard label="Prochaine purge" value="Aucune" sub="Aucun dossier à détruire" />
      </div>

      <div>
        <p className="mb-2.5 px-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          Catégories de dossiers
        </p>
        <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          {RECORD_CATEGORIES.map((cat) => (
            <div key={cat.id} className="flex items-center justify-between gap-4 px-5 py-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-[13px] font-medium">{cat.label}</p>
                  <span className="rounded-full bg-secondary px-1.5 py-px text-[11px] font-semibold text-muted-foreground">
                    {cat.count}
                  </span>
                </div>
                <p className="mt-0.5 text-[12px] text-muted-foreground">{cat.description}</p>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/50" />
            </div>
          ))}
        </div>
      </div>

      <p className="px-1 text-[12px] text-muted-foreground">
        Tous les dossiers sont conservés pendant {RECORD_RETENTION_YEARS} ans conformément à la LRPCFAT.
        La destruction automatique est désactivée — chaque suppression nécessite une approbation manuelle.
      </p>
    </div>
  );
};

// ──────────────── Programme View ────────────────

const ProgrammeView = ({ checklist, onToggle }: {
  checklist: ChecklistItem[];
  onToggle: (id: string) => void;
}) => {
  const total = checklist.length;
  const done = checklist.filter((c) => c.done).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  const grouped = CHECKLIST_CATEGORIES.map((cat) => ({
    category: cat,
    items: checklist.filter((c) => c.category === cat),
  }));

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
              Progression du programme
            </p>
            <p className="mt-1.5 font-display text-[24px] font-light leading-none tracking-tight">{pct} %</p>
          </div>
          <p className="text-[13px] text-muted-foreground">{done} / {total}</p>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-foreground transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {grouped.map(({ category, items }) => {
        const catDone = items.filter((i) => i.done).length;
        return (
          <div key={category}>
            <div className="mb-2.5 flex items-center justify-between px-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                {category}
              </p>
              <span className="text-[11px] text-muted-foreground">{catDone} / {items.length}</span>
            </div>
            <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
              {items.map((item) => (
                <div key={item.id} className="flex items-start gap-3 px-5 py-4">
                  <button
                    onClick={() => onToggle(item.id)}
                    className={cn(
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors",
                      item.done
                        ? "border-foreground bg-foreground text-background"
                        : "border-border hover:border-foreground/40",
                    )}
                    aria-label={item.done ? "Décocher" : "Cocher"}
                  >
                    {item.done && <Check className="h-3 w-3" strokeWidth={3} />}
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className={cn("text-[13px] font-medium", item.done && "text-muted-foreground line-through")}>
                      {item.label}
                    </p>
                    <p className="mt-0.5 text-[12px] leading-[1.5] text-muted-foreground">{item.description}</p>
                    {(item.frequency || item.dueDate) && (
                      <div className="mt-1.5 flex flex-wrap gap-3">
                        {item.frequency && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                            <Clock className="h-3 w-3" /> {item.frequency}
                          </span>
                        )}
                        {item.dueDate && (
                          <span className={cn(
                            "text-[11px]",
                            !item.done && daysUntil(item.dueDate) <= 60
                              ? "font-semibold text-foreground"
                              : "text-muted-foreground",
                          )}>
                            Échéance : {item.dueDate}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <p className="px-1 text-[12px] text-muted-foreground">
        Ce programme couvre les obligations prévues par la LRPCFAT et le RRPCFAT.
        Son efficacité doit être examinée par un tiers indépendant au moins tous les deux ans.
      </p>
    </div>
  );
};

// ──────────────── Main Panel ────────────────

type ComplianceTab = "alertes" | "declarations" | "dossiers" | "programme";

const CompliancePanel = ({ orders }: { orders: AdminOrder[] }) => {
  const [tab, setTab] = useState<ComplianceTab>("alertes");
  const [alerts, setAlerts] = useState(SEED_ALERTS);
  const [declarations] = useState(SEED_DECLARATIONS);
  const [checklist, setChecklist] = useState(SEED_CHECKLIST);

  const allAlerts = useMemo(() => {
    const auto = autoFlagOrders(orders);
    const existingRefs = new Set(alerts.map((a) => a.orderRef).filter(Boolean));
    return [...alerts, ...auto.filter((a) => !existingRefs.has(a.orderRef))];
  }, [alerts, orders]);

  const activeAlerts = allAlerts.filter((a) => a.status === "nouveau" || a.status === "en_cours").length;
  const pendingDecl = declarations.filter((d) => d.status === "brouillon" || d.status === "soumise").length;
  const checklistDone = checklist.filter((c) => c.done).length;

  const nextDeadline = useMemo(() => {
    const pending = declarations.filter((d) => d.status === "brouillon");
    if (pending.length === 0) return null;
    return [...pending].sort((a, b) => a.dueDate.localeCompare(b.dueDate))[0];
  }, [declarations]);

  const updateAlertStatus = (id: string, status: AlertStatus) => {
    const autoAlert = allAlerts.find((a) => a.id === id && id.startsWith("AUTO-"));
    if (autoAlert) {
      setAlerts((prev) => [...prev, { ...autoAlert, status }]);
    } else {
      setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    }
  };

  const toggleChecklist = (id: string) => {
    setChecklist((prev) => prev.map((c) => (c.id === id ? { ...c, done: !c.done } : c)));
  };

  const TABS = [
    { id: "alertes", label: "Alertes", count: activeAlerts || undefined },
    { id: "declarations", label: "Déclarations", count: pendingDecl || undefined },
    { id: "dossiers", label: "Dossiers" },
    { id: "programme", label: "Programme" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <SummaryCard
          label="Alertes actives"
          value={String(activeAlerts)}
          sub={activeAlerts > 0 ? "Requièrent votre attention" : "Tout est conforme"}
          urgent={activeAlerts > 0}
        />
        <SummaryCard
          label="Déclarations en attente"
          value={String(pendingDecl)}
          sub={nextDeadline ? `Prochaine : ${daysUntil(nextDeadline.dueDate)} j` : "Tout à jour"}
          urgent={nextDeadline != null && daysUntil(nextDeadline.dueDate) <= 5}
        />
        <SummaryCard
          label="Seuil DOIMV"
          value={`${nfCad.format(DOIMV_THRESHOLD)} $`}
          sub="Détection automatique"
        />
        <SummaryCard
          label="Programme"
          value={`${checklist.length > 0 ? Math.round((checklistDone / checklist.length) * 100) : 0} %`}
          sub={`${checklistDone} / ${checklist.length} éléments`}
        />
      </div>

      <SubTabs tabs={TABS} active={tab} onChange={(id) => setTab(id as ComplianceTab)} />

      {tab === "alertes" && <AlertesView alerts={allAlerts} onUpdateStatus={updateAlertStatus} />}
      {tab === "declarations" && <DeclarationsView declarations={declarations} />}
      {tab === "dossiers" && <DossiersView />}
      {tab === "programme" && <ProgrammeView checklist={checklist} onToggle={toggleChecklist} />}
    </div>
  );
};

export default CompliancePanel;
