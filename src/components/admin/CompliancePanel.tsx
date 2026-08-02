import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft, Check, ChevronRight, Clock, FileText, Shield,
  AlertTriangle, Send, Save, UserCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { nfCad, CURRENT_OPERATOR, type AdminOrder } from "@/lib/adminOrders";
import {
  ALERT_TYPE_META, ALERT_STATUS_META,
  DECL_TYPE_META, DECL_STATUS_META,
  RECORD_CATEGORIES, SEED_CHECKLIST, CHECKLIST_CATEGORIES,
  SEED_ALERTS, SEED_DECLARATIONS,
  DOIMV_THRESHOLD, DOIMV_DEADLINE_DAYS, DOT_DEADLINE_DAYS,
  RECORD_RETENTION_YEARS,
  autoFlagOrders, daysUntil,
  CLASSIFICATION_REASONS, DOT_INDICATORS, ID_TYPES, PROVINCES,
  initialDeclarationForm,
  type ComplianceAlert, type AlertStatus, type AlertType,
  type ComplianceDeclaration, type DeclarationType,
  type ChecklistItem, type DeclarationFormData,
} from "@/lib/compliance";
import { SubTabs } from "./AdminBits";

// ──────────────── Shared helpers ────────────────

const SummaryCard = ({ label, value, sub, urgent }: {
  label: string; value: string; sub?: string; urgent?: boolean;
}) => (
  <div className={cn("rounded-2xl border bg-card px-5 py-4", urgent ? "border-destructive/30" : "border-border")}>
    <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
    <p className={cn(
      "mt-1.5 font-display text-[24px] font-light leading-none tracking-tight",
      urgent && "text-destructive",
    )}>{value}</p>
    {sub && <p className="mt-1.5 text-[12px] text-muted-foreground">{sub}</p>}
  </div>
);

const TypeBadge = ({ type }: { type: AlertType | DeclarationType }) => {
  const meta = (ALERT_TYPE_META as Record<string, { label: string; critical: boolean }>)[type]
    ?? { label: (DECL_TYPE_META as Record<string, { label: string }>)[type]?.label ?? type, critical: type === "dot" || type === "dbt" };
  return (
    <span className={cn(
      "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.05em]",
      meta.critical ? "bg-destructive/10 text-destructive" : "bg-secondary text-foreground",
    )}>{meta.label}</span>
  );
};

const inputCn = "w-full rounded-xl border border-border bg-secondary/40 px-4 py-3 text-[14px] outline-none placeholder:text-muted-foreground/60 focus:border-foreground";

const Field = ({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) => (
  <div>
    <label className="mb-1.5 block text-[12px] font-medium">
      {label}{required && <span className="ml-0.5 text-destructive">*</span>}
    </label>
    {children}
  </div>
);

const BackButton = ({ onClick, label }: { onClick: () => void; label?: string }) => (
  <button
    onClick={onClick}
    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-card transition-colors hover:bg-secondary active:scale-95"
    aria-label={label ?? "Retour"}
  >
    <ArrowLeft className="h-[18px] w-[18px]" />
  </button>
);

const initials = (name: string) =>
  name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();

// ──────────────── Step Indicator ────────────────

const DECL_STEPS = ["Opération", "Client", "Justification", "Récapitulatif"] as const;

const StepIndicator = ({ current }: { current: number }) => (
  <div className="flex items-center gap-1 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
    {DECL_STEPS.map((label, i) => {
      const done = i < current;
      const active = i === current;
      return (
        <div key={label} className="flex shrink-0 items-center gap-1">
          {i > 0 && <div className={cn("h-px w-4 md:w-6", done || active ? "bg-foreground" : "bg-border")} />}
          <div className={cn(
            "flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[12px] font-medium transition-colors",
            active ? "bg-foreground text-background" : done ? "text-foreground" : "text-muted-foreground",
          )}>
            <span className={cn(
              "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
              active ? "bg-background text-foreground" : done ? "bg-foreground text-background" : "bg-secondary text-muted-foreground",
            )}>
              {done ? <Check className="h-3 w-3" /> : i + 1}
            </span>
            <span className="hidden sm:inline">{label}</span>
          </div>
        </div>
      );
    })}
  </div>
);

// ──────────────── Success Banner ────────────────

const SuccessBanner = ({ message }: { message: string }) => (
  <div className="flex items-center gap-2 rounded-xl border border-foreground/10 bg-foreground/5 px-4 py-3">
    <Check className="h-4 w-4 shrink-0 text-foreground" />
    <p className="text-[13px] font-medium">{message}</p>
  </div>
);

// ──────────────── Classer sans suite — Form ────────────────

const ClasserView = ({ alert, onSubmit, onBack }: {
  alert: ComplianceAlert;
  onSubmit: (reason: string, notes: string) => void;
  onBack: () => void;
}) => {
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const valid = reason.length > 0 && notes.trim().length > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <BackButton onClick={onBack} />
        <div>
          <h3 className="font-display text-[17px] font-semibold tracking-tight">Classer sans suite</h3>
          <p className="mt-0.5 text-[12px] text-muted-foreground">
            Clôturez cette alerte sans soumettre de déclaration au CANAFE.
          </p>
        </div>
      </div>

      {/* Alert summary */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center gap-2.5">
          <TypeBadge type={alert.type} />
          <span className="text-[12px] text-muted-foreground">{alert.id}</span>
        </div>
        <div className="mt-3 flex items-center gap-2.5">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-[10px] font-semibold text-foreground/70">
            {initials(alert.clientName)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-medium">{alert.clientName}</p>
            <p className="text-[11.5px] text-muted-foreground">{alert.clientEmail}</p>
          </div>
          <span className="shrink-0 text-[14px] font-semibold tabular-nums">{nfCad.format(alert.amount)} $</span>
        </div>
        <p className="mt-2 text-[12px] text-muted-foreground">{alert.reason}</p>
      </div>

      {/* Reason selection */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <Field label="Motif du classement" required>
          <div className="mt-1 space-y-2">
            {CLASSIFICATION_REASONS.map((r) => (
              <label key={r} className="flex cursor-pointer items-start gap-3 rounded-lg px-1 py-1 transition-colors hover:bg-secondary/50">
                <input
                  type="radio"
                  name="classReason"
                  checked={reason === r}
                  onChange={() => setReason(r)}
                  className="mt-0.5 h-4 w-4 accent-foreground"
                />
                <span className="text-[13px]">{r}</span>
              </label>
            ))}
          </div>
        </Field>

        <div className="mt-5">
          <Field label="Notes justificatives" required>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Décrivez brièvement pourquoi cette alerte ne nécessite pas de déclaration…"
              className={cn(inputCn, "resize-none")}
            />
          </Field>
        </div>

        <div className="mt-2">
          <p className="text-[11.5px] text-muted-foreground">
            Le motif et les notes seront conservés dans le dossier de l'alerte pendant {RECORD_RETENTION_YEARS} ans,
            conformément aux obligations de tenue de dossiers (LRPCFAT).
          </p>
        </div>
      </div>

      <Button
        variant="appSolid"
        shape="rounded"
        className="h-auto w-full gap-2 rounded-xl px-5 py-3.5 text-[14px] font-bold"
        disabled={!valid}
        onClick={() => onSubmit(reason, notes)}
      >
        <Check className="h-4 w-4" />
        Confirmer le classement
      </Button>
    </div>
  );
};

// ──────────────── Declaration Workflow — 4 steps ────────────────

const DeclarationWorkflow = ({ alert, form, onChange, onSubmit, onBack }: {
  alert: ComplianceAlert;
  form: DeclarationFormData;
  onChange: (f: DeclarationFormData) => void;
  onSubmit: (asBrouillon: boolean) => void;
  onBack: () => void;
}) => {
  const [step, setStep] = useState(0);
  const set = <K extends keyof DeclarationFormData>(k: K, v: DeclarationFormData[K]) =>
    onChange({ ...form, ...{ [k]: v } });

  const canAdvance = (): boolean => {
    if (step === 0) return form.amountCad.length > 0 && form.operationDate.length > 0;
    if (step === 1) return form.clientName.length > 0 && form.clientEmail.length > 0
      && form.clientDob.length > 0 && form.clientIdType.length > 0 && form.clientIdNumber.length > 0
      && form.clientAddress.length > 0 && form.clientCity.length > 0 && form.clientProvince.length > 0
      && form.clientPostalCode.length > 0;
    if (step === 2) {
      if (form.type === "dot") return form.suspicionIndicators.length > 0 && form.observations.trim().length > 0;
      return true;
    }
    return true;
  };

  const toggleIndicator = (ind: string) => {
    const cur = form.suspicionIndicators;
    set("suspicionIndicators", cur.includes(ind) ? cur.filter((x) => x !== ind) : [...cur, ind]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <BackButton onClick={step > 0 ? () => setStep(step - 1) : onBack} />
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-[17px] font-semibold tracking-tight">
            Déclarer au CANAFE
          </h3>
          <p className="mt-0.5 text-[12px] text-muted-foreground">
            {DECL_TYPE_META[form.type].full} — {alert.id}
          </p>
        </div>
      </div>

      <StepIndicator current={step} />

      {/* ── Step 0: Opération ── */}
      {step === 0 && (
        <div className="rounded-2xl border border-border bg-card p-5 space-y-5">
          <p className="text-[12.5px] text-muted-foreground">
            Vérifiez les détails de l'opération qui a déclenché cette alerte.
            Les champs pré-remplis proviennent de l'alerte {alert.id}.
          </p>

          <Field label="Type de déclaration" required>
            <div className="mt-1 flex flex-wrap gap-2">
              {(["doimv", "dot", "dbt"] as DeclarationType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => set("type", t)}
                  className={cn(
                    "flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-[13px] font-medium transition-colors",
                    form.type === t
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-card text-muted-foreground hover:bg-secondary/50",
                  )}
                >
                  {DECL_TYPE_META[t].label}
                </button>
              ))}
            </div>
            <p className="mt-1.5 text-[11.5px] text-muted-foreground">{DECL_TYPE_META[form.type].full}</p>
          </Field>

          <Field label="Type d'opération" required>
            <div className="mt-1 flex gap-2">
              {[{ v: "buy", l: "Achat" }, { v: "sell", l: "Vente" }].map(({ v, l }) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => set("operationType", v)}
                  className={cn(
                    "rounded-xl border px-3.5 py-2.5 text-[13px] font-medium transition-colors",
                    form.operationType === v
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-card text-muted-foreground hover:bg-secondary/50",
                  )}
                >
                  {l}
                </button>
              ))}
            </div>
          </Field>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Montant (CAD)" required>
              <input type="text" value={form.amountCad} onChange={(e) => set("amountCad", e.target.value)} className={inputCn} />
            </Field>
            <Field label="Montant (USDT)">
              <input type="text" value={form.amountUsdt} onChange={(e) => set("amountUsdt", e.target.value)} placeholder="Facultatif" className={inputCn} />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Date de l'opération" required>
              <input type="date" value={form.operationDate} onChange={(e) => set("operationDate", e.target.value)} className={inputCn} />
            </Field>
            <Field label="Mode de paiement">
              <input type="text" value={form.paymentMethod} onChange={(e) => set("paymentMethod", e.target.value)} className={inputCn} />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Réseau blockchain">
              <input type="text" value={form.network} onChange={(e) => set("network", e.target.value)} placeholder="Ex. : Tron, Ethereum…" className={inputCn} />
            </Field>
            <Field label="Adresse de portefeuille">
              <input type="text" value={form.walletAddress} onChange={(e) => set("walletAddress", e.target.value)} placeholder="Adresse du client" className={inputCn} />
            </Field>
          </div>
        </div>
      )}

      {/* ── Step 1: Client ── */}
      {step === 1 && (
        <div className="rounded-2xl border border-border bg-card p-5 space-y-5">
          <p className="text-[12.5px] text-muted-foreground">
            Complétez les informations d'identification du client. Le CANAFE exige
            l'identité complète pour toute déclaration (art. 64 et 65 RRPCFAT).
          </p>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Nom complet" required>
              <input type="text" value={form.clientName} onChange={(e) => set("clientName", e.target.value)} className={inputCn} />
            </Field>
            <Field label="Courriel" required>
              <input type="email" value={form.clientEmail} onChange={(e) => set("clientEmail", e.target.value)} className={inputCn} />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Date de naissance" required>
              <input type="date" value={form.clientDob} onChange={(e) => set("clientDob", e.target.value)} className={inputCn} />
            </Field>
            <Field label="Occupation">
              <input type="text" value={form.clientOccupation} onChange={(e) => set("clientOccupation", e.target.value)} placeholder="Ex. : Analyste, Étudiant…" className={inputCn} />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Type de pièce d'identité" required>
              <select value={form.clientIdType} onChange={(e) => set("clientIdType", e.target.value)} className={cn(inputCn, "appearance-none")}>
                <option value="">Sélectionner…</option>
                {ID_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Numéro de pièce d'identité" required>
              <input type="text" value={form.clientIdNumber} onChange={(e) => set("clientIdNumber", e.target.value)} placeholder="Ex. : P1234567" className={inputCn} />
            </Field>
          </div>

          <Field label="Adresse" required>
            <input type="text" value={form.clientAddress} onChange={(e) => set("clientAddress", e.target.value)} placeholder="123 rue Principale" className={inputCn} />
          </Field>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Field label="Ville" required>
              <input type="text" value={form.clientCity} onChange={(e) => set("clientCity", e.target.value)} className={inputCn} />
            </Field>
            <Field label="Province" required>
              <select value={form.clientProvince} onChange={(e) => set("clientProvince", e.target.value)} className={cn(inputCn, "appearance-none")}>
                <option value="">Sélectionner…</option>
                {PROVINCES.map((p) => <option key={p.code} value={p.code}>{p.code} — {p.name}</option>)}
              </select>
            </Field>
            <Field label="Code postal" required>
              <input type="text" value={form.clientPostalCode} onChange={(e) => set("clientPostalCode", e.target.value)} placeholder="H2X 1Y1" className={inputCn} />
            </Field>
          </div>
        </div>
      )}

      {/* ── Step 2: Justification ── */}
      {step === 2 && (
        <div className="rounded-2xl border border-border bg-card p-5 space-y-5">
          {form.type === "doimv" && (
            <>
              <div className="flex items-start gap-3 rounded-xl border border-foreground/10 bg-foreground/5 px-4 py-3">
                <Shield className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
                <div>
                  <p className="text-[13px] font-medium">Seuil DOIMV atteint</p>
                  <p className="mt-0.5 text-[12px] text-muted-foreground">
                    Cette opération de {nfCad.format(Number(form.amountCad))} $ CA atteint ou dépasse
                    le seuil de {nfCad.format(DOIMV_THRESHOLD)} $ CA. En vertu de l'article 12 du RRPCFAT,
                    une déclaration d'opérations importantes en monnaie virtuelle (DOIMV) doit être
                    soumise au CANAFE dans un délai de {DOIMV_DEADLINE_DAYS} jours.
                  </p>
                </div>
              </div>
              <Field label="Observations (facultatif)">
                <textarea
                  value={form.observations}
                  onChange={(e) => set("observations", e.target.value)}
                  rows={3}
                  placeholder="Ajoutez des observations pertinentes si nécessaire…"
                  className={cn(inputCn, "resize-none")}
                />
              </Field>
            </>
          )}

          {form.type === "dot" && (
            <>
              <p className="text-[12.5px] text-muted-foreground">
                Sélectionnez les indicateurs de soupçon observés. Le CANAFE exige au moins un indicateur
                pour toute DOT. Décrivez ensuite vos observations dans le champ ci-dessous.
              </p>

              <Field label="Indicateurs de soupçon" required>
                <div className="mt-1 space-y-1.5">
                  {DOT_INDICATORS.map((ind) => {
                    const on = form.suspicionIndicators.includes(ind);
                    return (
                      <label
                        key={ind}
                        className={cn(
                          "flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2.5 transition-colors",
                          on ? "border-foreground/20 bg-foreground/5" : "border-transparent hover:bg-secondary/50",
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={on}
                          onChange={() => toggleIndicator(ind)}
                          className="mt-0.5 h-4 w-4 accent-foreground"
                        />
                        <span className="text-[13px]">{ind}</span>
                      </label>
                    );
                  })}
                </div>
              </Field>

              <Field label="Observations détaillées" required>
                <textarea
                  value={form.observations}
                  onChange={(e) => set("observations", e.target.value)}
                  rows={4}
                  placeholder="Décrivez les faits et circonstances qui ont éveillé vos soupçons. Soyez précis : dates, montants, comportements observés…"
                  className={cn(inputCn, "resize-none")}
                />
              </Field>

              <div className="flex items-start gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                <p className="text-[12px] text-muted-foreground">
                  <span className="font-semibold text-destructive">Important :</span> les DOT doivent être soumises
                  dans les {DOT_DEADLINE_DAYS} jours suivant la détection du soupçon (3 jours si lié au financement
                  du terrorisme). Ne divulguez jamais au client qu'une DOT a été soumise.
                </p>
              </div>
            </>
          )}

          {form.type === "dbt" && (
            <>
              <div className="flex items-start gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                <div>
                  <p className="text-[13px] font-semibold text-destructive">Déclaration de biens terroristes</p>
                  <p className="mt-1 text-[12px] text-muted-foreground">
                    Si vous avez des motifs raisonnables de croire que des biens sont la propriété
                    d'un groupe terroriste ou sont utilisés pour le financement du terrorisme,
                    cette déclaration est obligatoire et doit être soumise immédiatement.
                    Gelez les fonds et contactez le CANAFE par téléphone au 1-866-346-8722.
                  </p>
                </div>
              </div>
              <Field label="Observations détaillées" required>
                <textarea
                  value={form.observations}
                  onChange={(e) => set("observations", e.target.value)}
                  rows={4}
                  placeholder="Décrivez les motifs de la déclaration de biens terroristes…"
                  className={cn(inputCn, "resize-none")}
                />
              </Field>
            </>
          )}
        </div>
      )}

      {/* ── Step 3: Récapitulatif ── */}
      {step === 3 && (
        <div className="space-y-3">
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Opération</p>
            <div className="mt-3 space-y-1.5 text-[13px]">
              <div className="flex justify-between"><span className="text-muted-foreground">Type</span><TypeBadge type={form.type} /></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Opération</span><span className="font-medium">{form.operationType === "buy" ? "Achat" : "Vente"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Montant CAD</span><span className="font-semibold tabular-nums">{nfCad.format(Number(form.amountCad))} $</span></div>
              {form.amountUsdt && <div className="flex justify-between"><span className="text-muted-foreground">Montant USDT</span><span className="tabular-nums">{form.amountUsdt} USDT</span></div>}
              <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span>{form.operationDate}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Paiement</span><span>{form.paymentMethod}</span></div>
              {form.network && <div className="flex justify-between"><span className="text-muted-foreground">Réseau</span><span>{form.network}</span></div>}
              {form.walletAddress && <div className="flex justify-between"><span className="text-muted-foreground">Portefeuille</span><span className="max-w-[200px] truncate">{form.walletAddress}</span></div>}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Client</p>
            <div className="mt-3 space-y-1.5 text-[13px]">
              <div className="flex justify-between"><span className="text-muted-foreground">Nom</span><span className="font-medium">{form.clientName}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Courriel</span><span>{form.clientEmail}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Date de naissance</span><span>{form.clientDob}</span></div>
              {form.clientOccupation && <div className="flex justify-between"><span className="text-muted-foreground">Occupation</span><span>{form.clientOccupation}</span></div>}
              <div className="flex justify-between"><span className="text-muted-foreground">Pièce d'identité</span><span>{form.clientIdType} · {form.clientIdNumber}</span></div>
              <div className="flex justify-between flex-wrap gap-1"><span className="text-muted-foreground">Adresse</span><span className="text-right">{form.clientAddress}, {form.clientCity}, {form.clientProvince} {form.clientPostalCode}</span></div>
            </div>
          </div>

          {form.type === "dot" && form.suspicionIndicators.length > 0 && (
            <div className="rounded-2xl border border-destructive/20 bg-card p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-destructive">Indicateurs de soupçon</p>
              <ul className="mt-3 space-y-1.5">
                {form.suspicionIndicators.map((ind, i) => (
                  <li key={i} className="flex items-start gap-2 text-[13px]">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />
                    {ind}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {form.observations && (
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Observations</p>
              <p className="mt-3 text-[13px] leading-relaxed">{form.observations}</p>
            </div>
          )}

          <div className="rounded-xl border border-foreground/10 bg-foreground/5 px-4 py-3">
            <p className="text-[12.5px] text-muted-foreground">
              <span className="font-semibold text-foreground">Échéance de soumission :</span>{" "}
              {form.type === "dot" ? `${DOT_DEADLINE_DAYS} jours` : `${DOIMV_DEADLINE_DAYS} jours`} après la détection.
              Après avoir marqué la déclaration comme « soumise » ici, rendez-vous sur le
              portail F2R du CANAFE pour compléter la soumission officielle avec les informations ci-dessus.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              variant="appOutline"
              shape="rounded"
              className="h-auto flex-1 gap-2 rounded-xl px-5 py-3.5 text-[14px] font-bold"
              onClick={() => onSubmit(true)}
            >
              <Save className="h-4 w-4" />
              Enregistrer en brouillon
            </Button>
            <Button
              variant="appSolid"
              shape="rounded"
              className="h-auto flex-1 gap-2 rounded-xl px-5 py-3.5 text-[14px] font-bold"
              onClick={() => onSubmit(false)}
            >
              <Send className="h-4 w-4" />
              Marquer comme soumise
            </Button>
          </div>
        </div>
      )}

      {/* Nav buttons for steps 0–2 */}
      {step < 3 && (
        <div className="flex justify-between gap-3">
          <Button
            variant="appOutline"
            shape="rounded"
            className="h-auto gap-2 rounded-xl px-5 py-3 text-[13px] font-bold"
            onClick={step > 0 ? () => setStep(step - 1) : onBack}
          >
            <ArrowLeft className="h-4 w-4" />
            {step > 0 ? "Précédent" : "Annuler"}
          </Button>
          <Button
            variant="appSolid"
            shape="rounded"
            className="h-auto gap-2 rounded-xl px-5 py-3 text-[13px] font-bold"
            disabled={!canAdvance()}
            onClick={() => setStep(step + 1)}
          >
            Suivant
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

// ──────────────── Declaration Detail View ────────────────

const DeclarationDetailView = ({ decl, onBack }: {
  decl: ComplianceDeclaration;
  onBack: () => void;
}) => {
  const days = daysUntil(decl.dueDate);
  const urgent = decl.status === "brouillon" && days <= 5;

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <BackButton onClick={onBack} />
        <div>
          <h3 className="font-display text-[17px] font-semibold tracking-tight">
            Déclaration {decl.id}
          </h3>
          <p className="mt-0.5 text-[12px] text-muted-foreground">{DECL_TYPE_META[decl.type].full}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <TypeBadge type={decl.type} />
          <span className={cn("text-[13px] font-semibold", DECL_STATUS_META[decl.status].text)}>
            {DECL_STATUS_META[decl.status].label}
          </span>
        </div>

        <div className="mt-4 space-y-2 text-[13px]">
          <div className="flex justify-between"><span className="text-muted-foreground">Client</span><span className="font-medium">{decl.clientName}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Montant</span><span className="font-semibold tabular-nums">{nfCad.format(decl.amount)} $</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Créée le</span><span>{decl.createdAt}</span></div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Échéance</span>
            <span className={cn(urgent ? "font-semibold text-destructive" : "")}>
              {decl.dueDate} {decl.status === "brouillon" && (days > 0 ? `(${days} j restants)` : "(Échue)")}
            </span>
          </div>
          {decl.submittedAt && <div className="flex justify-between"><span className="text-muted-foreground">Soumise le</span><span>{decl.submittedAt}</span></div>}
          {decl.canafRef && <div className="flex justify-between"><span className="text-muted-foreground">Référence CANAFE</span><span className="font-mono text-[12px]">{decl.canafRef}</span></div>}
          <div className="flex justify-between"><span className="text-muted-foreground">Alerte source</span><span>{decl.alertId}</span></div>
        </div>
      </div>

      {decl.formData && (
        <>
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Identification du client</p>
            <div className="mt-3 space-y-1.5 text-[13px]">
              <div className="flex justify-between"><span className="text-muted-foreground">Courriel</span><span>{decl.formData.clientEmail}</span></div>
              {decl.formData.clientDob && <div className="flex justify-between"><span className="text-muted-foreground">Date de naissance</span><span>{decl.formData.clientDob}</span></div>}
              {decl.formData.clientIdType && <div className="flex justify-between"><span className="text-muted-foreground">Pièce d'identité</span><span>{decl.formData.clientIdType} · {decl.formData.clientIdNumber}</span></div>}
              {decl.formData.clientAddress && <div className="flex justify-between flex-wrap gap-1"><span className="text-muted-foreground">Adresse</span><span className="text-right">{decl.formData.clientAddress}, {decl.formData.clientCity}, {decl.formData.clientProvince} {decl.formData.clientPostalCode}</span></div>}
              {decl.formData.clientOccupation && <div className="flex justify-between"><span className="text-muted-foreground">Occupation</span><span>{decl.formData.clientOccupation}</span></div>}
            </div>
          </div>

          {decl.formData.suspicionIndicators.length > 0 && (
            <div className="rounded-2xl border border-destructive/20 bg-card p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-destructive">Indicateurs de soupçon</p>
              <ul className="mt-3 space-y-1.5">
                {decl.formData.suspicionIndicators.map((ind, i) => (
                  <li key={i} className="flex items-start gap-2 text-[13px]">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />
                    {ind}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {decl.formData.observations && (
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Observations</p>
              <p className="mt-3 text-[13px] leading-relaxed">{decl.formData.observations}</p>
            </div>
          )}
        </>
      )}

      <p className="px-1 text-[12px] text-muted-foreground">
        Conservez cette déclaration et tous les documents justificatifs pendant {RECORD_RETENTION_YEARS} ans
        conformément à la LRPCFAT. Référez-vous au portail F2R du CANAFE pour la soumission officielle.
      </p>
    </div>
  );
};

// ──────────────── Alertes View ────────────────

const AlertesView = ({ alerts, onPrendreEnCharge, onClasser, onDeclarer }: {
  alerts: ComplianceAlert[];
  onPrendreEnCharge: (id: string) => void;
  onClasser: (id: string) => void;
  onDeclarer: (id: string) => void;
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
                <div className="flex items-center gap-2">
                  {alert.assignedTo && (
                    <span className="flex items-center gap-1 text-[12px] text-muted-foreground">
                      <UserCheck className="h-3 w-3" /> {alert.assignedTo}
                    </span>
                  )}
                  <span className={cn("text-[13px] font-semibold", ALERT_STATUS_META[alert.status].text)}>
                    {ALERT_STATUS_META[alert.status].label}
                  </span>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-[10px] font-semibold text-foreground/70">
                  {initials(alert.clientName)}
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
                        className="h-auto gap-1.5 rounded-[9px] px-3 py-[6px] text-[12px]"
                        onClick={() => onPrendreEnCharge(alert.id)}
                      >
                        <UserCheck className="h-[13px] w-[13px]" />
                        Prendre en charge
                      </Button>
                    )}
                    <Button
                      variant="appOutline" shape="rounded"
                      className="h-auto gap-1 rounded-[9px] px-3 py-[6px] text-[12px]"
                      onClick={() => onClasser(alert.id)}
                    >
                      Classer sans suite
                    </Button>
                    <Button
                      variant="appSolid" shape="rounded"
                      className="h-auto gap-1.5 rounded-[9px] px-3 py-[6px] text-[12px] font-bold"
                      onClick={() => onDeclarer(alert.id)}
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

const DeclarationsView = ({ declarations, onOpen }: {
  declarations: ComplianceDeclaration[];
  onOpen: (id: string) => void;
}) => {
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
            <button
              key={d.id}
              onClick={() => onOpen(d.id)}
              className={cn(cols, "w-full px-4 py-3 text-left transition-colors hover:bg-secondary/30", i < list.length - 1 && "border-b border-border")}
            >
              <div className="min-w-0">
                <p className="text-[13px] font-medium">{d.id}</p>
                <p className="truncate text-[11.5px] text-muted-foreground">{d.clientName}</p>
                {d.canafRef && <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{d.canafRef}</p>}
              </div>
              <span className="hidden md:block">
                <TypeBadge type={d.type} />
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
            </button>
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
        Les DOT dans les {DOT_DEADLINE_DAYS} jours (3 jours si financement terroriste).
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
type PanelView = "main" | "classer" | "declarer" | "decl-detail";

const CompliancePanel = ({ orders }: { orders: AdminOrder[] }) => {
  const [view, setView] = useState<PanelView>("main");
  const [tab, setTab] = useState<ComplianceTab>("alertes");
  const [alerts, setAlerts] = useState(SEED_ALERTS);
  const [declarations, setDeclarations] = useState(SEED_DECLARATIONS);
  const [checklist, setChecklist] = useState(SEED_CHECKLIST);
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const [selectedDeclId, setSelectedDeclId] = useState<string | null>(null);
  const [declForm, setDeclForm] = useState<DeclarationFormData | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!successMsg) return;
    const t = setTimeout(() => setSuccessMsg(null), 3500);
    return () => clearTimeout(t);
  }, [successMsg]);

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

  // ── Alert helpers ──

  const updateAlert = (id: string, changes: Partial<ComplianceAlert>) => {
    setAlerts((prev) => {
      const exists = prev.some((a) => a.id === id);
      if (exists) return prev.map((a) => (a.id === id ? { ...a, ...changes } : a));
      const auto = allAlerts.find((a) => a.id === id);
      if (auto) return [...prev, { ...auto, ...changes }];
      return prev;
    });
  };

  const goBack = () => {
    setView("main");
    setSelectedAlertId(null);
    setSelectedDeclId(null);
    setDeclForm(null);
  };

  const prendreEnCharge = (id: string) => {
    updateAlert(id, { status: "en_cours", assignedTo: CURRENT_OPERATOR });
    setSuccessMsg("Alerte prise en charge — vous en êtes responsable.");
  };

  const openClasser = (id: string) => {
    setSelectedAlertId(id);
    setView("classer");
  };

  const submitClasser = (reason: string, notes: string) => {
    if (!selectedAlertId) return;
    updateAlert(selectedAlertId, { status: "classe", notes: `Classée : ${reason}\n${notes}` });
    goBack();
    setTab("alertes");
    setSuccessMsg("Alerte classée sans suite. Le motif est conservé au dossier.");
  };

  const openDeclarer = (id: string) => {
    const alert = allAlerts.find((a) => a.id === id);
    if (!alert) return;
    setSelectedAlertId(id);
    setDeclForm(initialDeclarationForm(alert));
    setView("declarer");
  };

  const submitDeclaration = (asBrouillon: boolean) => {
    if (!selectedAlertId || !declForm) return;

    const now = new Date();
    const deadlineDays = declForm.type === "dot" ? DOT_DEADLINE_DAYS : DOIMV_DEADLINE_DAYS;
    const dueDate = new Date(now);
    dueDate.setDate(dueDate.getDate() + deadlineDays);

    const newDecl: ComplianceDeclaration = {
      id: `DC-${String(declarations.length + 1).padStart(3, "0")}`,
      type: declForm.type,
      alertId: selectedAlertId,
      clientName: declForm.clientName,
      amount: Number(declForm.amountCad) || 0,
      createdAt: now.toISOString().split("T")[0],
      dueDate: dueDate.toISOString().split("T")[0],
      status: asBrouillon ? "brouillon" : "soumise",
      submittedAt: asBrouillon ? undefined : now.toISOString().split("T")[0],
      formData: declForm,
    };

    setDeclarations((prev) => [newDecl, ...prev]);

    if (!asBrouillon) {
      updateAlert(selectedAlertId, { status: "declare" });
    }

    goBack();
    setTab("declarations");
    setSuccessMsg(
      asBrouillon
        ? "Déclaration enregistrée en brouillon. Complétez-la et soumettez-la avant l'échéance."
        : "Déclaration marquée comme soumise. Rendez-vous sur le portail F2R du CANAFE pour la soumission officielle.",
    );
  };

  const openDeclDetail = (id: string) => {
    setSelectedDeclId(id);
    setView("decl-detail");
  };

  const toggleChecklist = (id: string) => {
    setChecklist((prev) => prev.map((c) => (c.id === id ? { ...c, done: !c.done } : c)));
  };

  // ── Tabs config ──

  const TABS = [
    { id: "alertes", label: "Alertes", count: activeAlerts || undefined },
    { id: "declarations", label: "Déclarations", count: pendingDecl || undefined },
    { id: "dossiers", label: "Dossiers" },
    { id: "programme", label: "Programme" },
  ];

  // ── Resolved entities for sub-views ──

  const selectedAlert = selectedAlertId ? allAlerts.find((a) => a.id === selectedAlertId) : null;
  const selectedDecl = selectedDeclId ? declarations.find((d) => d.id === selectedDeclId) : null;

  return (
    <div className="space-y-4">
      {successMsg && <SuccessBanner message={successMsg} />}

      {view === "classer" && selectedAlert && (
        <ClasserView alert={selectedAlert} onSubmit={submitClasser} onBack={goBack} />
      )}

      {view === "declarer" && selectedAlert && declForm && (
        <DeclarationWorkflow
          alert={selectedAlert}
          form={declForm}
          onChange={setDeclForm}
          onSubmit={submitDeclaration}
          onBack={goBack}
        />
      )}

      {view === "decl-detail" && selectedDecl && (
        <DeclarationDetailView decl={selectedDecl} onBack={goBack} />
      )}

      {view === "main" && (
        <>
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

          {tab === "alertes" && (
            <AlertesView
              alerts={allAlerts}
              onPrendreEnCharge={prendreEnCharge}
              onClasser={openClasser}
              onDeclarer={openDeclarer}
            />
          )}
          {tab === "declarations" && (
            <DeclarationsView declarations={declarations} onOpen={openDeclDetail} />
          )}
          {tab === "dossiers" && <DossiersView />}
          {tab === "programme" && <ProgrammeView checklist={checklist} onToggle={toggleChecklist} />}
        </>
      )}
    </div>
  );
};

export default CompliancePanel;
