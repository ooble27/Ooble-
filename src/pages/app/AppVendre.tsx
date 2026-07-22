import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, HandCoins, Check, Mail } from "lucide-react";
import AppShell from "@/components/app/AppShell";
import CopyRow from "@/components/app/CopyRow";
import { Button } from "@/components/ui/button";
import { useUsdtRate } from "@/hooks/useUsdtRate";
import { cn } from "@/lib/utils";

type Unit = "USDT" | "CAD";
type Step = "amount" | "reception" | "done";

const MIN_USDT = 50;
const nfCad = new Intl.NumberFormat("fr-CA", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
const nfUsdt = new Intl.NumberFormat("fr-CA", { maximumFractionDigits: 2 });
const newRef = () => `OOB-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

const StepHeader = ({ title, sub, onBack }: { title: string; sub: string; onBack?: () => void }) => (
  <div className="mb-4 flex items-start gap-3">
    {onBack && (
      <button
        type="button"
        onClick={onBack}
        aria-label="Retour"
        className="mt-0.5 flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full bg-secondary text-foreground transition-colors hover:bg-secondary/70 active:scale-95"
      >
        <ArrowLeft className="h-[18px] w-[18px]" />
      </button>
    )}
    <div>
      <h1 className="font-display text-[18px] font-semibold tracking-tight">{title}</h1>
      <p className="mt-1 text-[13px] text-muted-foreground">{sub}</p>
    </div>
  </div>
);

const AppVendre = () => {
  const rate = useUsdtRate();
  const [step, setStep] = useState<Step>("amount");
  const [unit, setUnit] = useState<Unit>("USDT");
  const [amount, setAmount] = useState("");
  const [email, setEmail] = useState("");
  const orderRef = useMemo(() => newRef(), []);

  const value = parseFloat(amount.replace(",", ".")) || 0;
  const usdt = unit === "USDT" ? value : value / rate.sell;
  const cad = unit === "USDT" ? value * rate.sell : value;
  const belowMin = usdt > 0 && usdt < MIN_USDT;

  /* ---------- Montant ---------- */
  if (step === "amount") {
    return (
      <AppShell header={<div><h1 className="font-display text-[22px] font-semibold tracking-tight">Vendre USDT</h1><p className="mt-1 text-[13px] text-muted-foreground">Entrez le montant à vendre</p></div>}>
        <div className="rounded-[20px] border border-border bg-card p-5">
          <div className="mb-3.5 flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Montant</span>
            <div className="inline-flex gap-0.5 rounded-[10px] bg-secondary/70 p-[3px]">
              {(["USDT", "CAD"] as Unit[]).map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => { setUnit(u); setAmount(""); }}
                  className={cn(
                    "rounded-[7px] px-3 py-[5px] text-xs font-semibold transition-colors",
                    unit === u ? "bg-card text-foreground dark:bg-neutral-600" : "text-muted-foreground",
                  )}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <input
              inputMode="decimal"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^\d.,]/g, ""))}
              className="w-full rounded-[14px] border border-border bg-secondary/40 py-[16px] pl-5 pr-[84px] text-[30px] font-bold tracking-[-1px] outline-none placeholder:text-muted-foreground/40"
            />
            <span className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-1.5 text-sm font-medium text-muted-foreground">
              {unit === "USDT" && <img src="/coins/usdt.svg" alt="" className="h-5 w-5" />}
              {unit}
            </span>
          </div>

          <p className={cn("mt-2 text-xs", belowMin ? "text-destructive" : "text-muted-foreground")}>Minimum : {MIN_USDT} USDT</p>
        </div>

        <div className="mt-3.5 flex flex-col gap-2.5 rounded-[16px] border border-border bg-card px-5 py-4">
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-muted-foreground">Vous recevez</span>
            <span className="text-sm font-semibold">{nfCad.format(cad)} CAD</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-muted-foreground">Taux</span>
            <span className="text-[13px] text-muted-foreground">1 USDT = {nfCad.format(rate.sell)} CAD</span>
          </div>
        </div>

        {/* Continuer — à GAUCHE (Vendre) */}
        <div className="mt-3.5 flex justify-start">
          <Button variant="appPrimary" shape="soft" className="h-auto gap-2 px-[22px] py-[13px] text-sm" disabled={value <= 0 || belowMin} onClick={() => setStep("reception")}>
            <HandCoins className="h-[17px] w-[17px]" strokeWidth={2} /> Continuer
          </Button>
        </div>
      </AppShell>
    );
  }

  /* ---------- Réception Interac ---------- */
  if (step === "reception") {
    return (
      <AppShell header={<StepHeader title="Réception" sub="Où envoyer vos dollars" onBack={() => setStep("amount")} />}>
        <div className="overflow-hidden rounded-[14px] border border-border bg-card">
          <div className="border-b border-border px-4 py-2.5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">E-mail Interac e-Transfer</span>
          </div>
          <div className="flex items-center gap-2.5 px-4 py-4">
            <Mail className="h-5 w-5 shrink-0 text-muted-foreground" strokeWidth={1.9} />
            <input
              type="email"
              spellCheck={false}
              autoCapitalize="none"
              placeholder="vous@exemple.ca"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              className="w-full bg-transparent text-base outline-none placeholder:text-muted-foreground/60"
            />
          </div>
        </div>
        <p className="mt-3 px-1 text-[13px] text-muted-foreground">
          Vous recevrez <span className="font-semibold text-foreground">{nfCad.format(cad)} CAD</span> par e-Transfer à cette adresse dès réception de vos USDT.
        </p>

        <div className="mt-6 flex justify-start">
          <Button variant="appPrimary" shape="soft" className="h-auto gap-2 px-[22px] py-[13px] text-sm" disabled={!/^\S+@\S+\.\S+$/.test(email)} onClick={() => setStep("done")}>
            <HandCoins className="h-[17px] w-[17px]" strokeWidth={2} /> Continuer
          </Button>
        </div>
      </AppShell>
    );
  }

  /* ---------- Confirmation ---------- */
  return (
    <AppShell header={<StepHeader title="Ordre créé" sub="Envoyez vos USDT à Ooble" />}>
      <div className="overflow-hidden rounded-[16px] border border-border bg-card">
        {[
          { label: "Vous envoyez", value: `${nfUsdt.format(usdt)} USDT` },
          { label: "Vous recevez", value: `${nfCad.format(cad)} CAD` },
          { label: "Taux", value: `1 USDT = ${nfCad.format(rate.sell)} CAD` },
          { label: "Reçu par Interac", value: email, mono: true },
        ].map((r, i, arr) => (
          <div key={r.label} className={cn("flex items-center justify-between px-4 py-[14px]", i < arr.length - 1 && "border-b border-border")}>
            <span className="text-[13px] text-muted-foreground">{r.label}</span>
            <span className={cn("max-w-[60%] break-all text-right text-[13px] font-medium", r.mono && "font-mono text-[11px]")}>{r.value}</span>
          </div>
        ))}
      </div>

      <p className="mb-2 mt-5 px-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Détail de l'ordre</p>
      <div className="divide-y divide-border overflow-hidden rounded-[16px] border border-border bg-card">
        <CopyRow label="Montant à envoyer" value={`${nfUsdt.format(usdt)} USDT`} />
        <CopyRow label="Référence de l'ordre" value={orderRef} mono />
      </div>

      <div className="mt-6 flex justify-start gap-2.5">
        <Button variant="appPrimary" shape="soft" className="h-auto gap-2 px-[22px] py-[13px] text-sm" asChild>
          <Link to="/app"><Check className="h-[17px] w-[17px]" strokeWidth={2} /> Terminé</Link>
        </Button>
        <Button variant="ghost" shape="soft" className="h-auto px-[22px] py-[13px] text-sm" onClick={() => { setStep("amount"); setAmount(""); setEmail(""); }}>
          Nouvel ordre
        </Button>
      </div>
    </AppShell>
  );
};

export default AppVendre;
