import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Mail } from "lucide-react";
import AppShell from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { useUsdtRate } from "@/hooks/useUsdtRate";
import { cn } from "@/lib/utils";

type Unit = "USDT" | "CAD";
type Step = "amount" | "reception" | "done";

const MIN_USDT = 50;
const nfCad = new Intl.NumberFormat("fr-CA", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
const nfUsdt = new Intl.NumberFormat("fr-CA", { maximumFractionDigits: 2 });

const BackBtn = ({ onClick }: { onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label="Retour"
    className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-white text-foreground transition-colors hover:bg-secondary"
  >
    <ArrowLeft className="h-5 w-5" />
  </button>
);

const StepHead = ({ title, sub, onBack }: { title: string; sub: string; onBack?: () => void }) => (
  <div className="flex items-start gap-3">
    {onBack && <BackBtn onClick={onBack} />}
    <div>
      <h1 className="font-display text-[26px] font-extrabold tracking-tight">{title}</h1>
      <p className="mt-1 text-[15px] text-muted-foreground">{sub}</p>
    </div>
  </div>
);

const AppVendre = () => {
  const rate = useUsdtRate();
  const [step, setStep] = useState<Step>("amount");
  const [unit, setUnit] = useState<Unit>("USDT");
  const [amount, setAmount] = useState("");
  const [email, setEmail] = useState("");

  const value = parseFloat(amount.replace(",", ".")) || 0;
  const usdt = unit === "USDT" ? value : value / rate.sell;
  const cad = unit === "USDT" ? value * rate.sell : value;
  const belowMin = usdt > 0 && usdt < MIN_USDT;

  /* ---------- Montant ---------- */
  if (step === "amount") {
    return (
      <AppShell header={<StepHead title="Vendre USDT" sub="Entrez le montant à vendre" />}>
        <div className="rounded-[1.5rem] border border-border bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Montant</span>
            <div className="flex rounded-full border border-border bg-secondary/50 p-0.5">
              {(["USDT", "CAD"] as Unit[]).map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setUnit(u)}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-semibold transition-colors",
                    unit === u ? "bg-white text-foreground" : "text-muted-foreground",
                  )}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3 border-t border-border pt-5">
            <input
              inputMode="decimal"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^\d.,]/g, ""))}
              className="w-full bg-transparent font-display text-[40px] font-extrabold leading-none tracking-tight outline-none placeholder:text-muted-foreground/40"
            />
            <span className="flex shrink-0 items-center gap-1.5 text-lg font-semibold text-muted-foreground">
              {unit === "USDT" && <img src="/coins/usdt.svg" alt="" className="h-6 w-6" />}
              {unit}
            </span>
          </div>
          <p className={cn("mt-4 border-t border-border pt-3 text-sm", belowMin ? "text-destructive" : "text-muted-foreground")}>
            Minimum : {MIN_USDT} USDT
          </p>
        </div>

        <div className="mt-3 divide-y divide-border rounded-[1.5rem] border border-border bg-white px-5">
          <div className="flex items-center justify-between py-4">
            <span className="text-muted-foreground">Vous recevez</span>
            <span className="font-display text-lg font-bold">{nfCad.format(cad)} CAD</span>
          </div>
          <div className="flex items-center justify-between py-4 text-sm">
            <span className="text-muted-foreground">Taux</span>
            <span className="font-medium">1 USDT = {nfCad.format(rate.sell)} CAD</span>
          </div>
        </div>

        <Button variant="appPrimary" size="lg" shape="rounded" className="mt-6 w-full" disabled={value <= 0 || belowMin} onClick={() => setStep("reception")}>
          Continuer <ArrowRight className="h-4 w-4" />
        </Button>
      </AppShell>
    );
  }

  /* ---------- Réception Interac ---------- */
  if (step === "reception") {
    return (
      <AppShell header={<StepHead title="Réception" sub="Où envoyer vos dollars" onBack={() => setStep("amount")} />}>
        <div className="divide-y divide-border overflow-hidden rounded-[1.5rem] border border-border bg-white">
          <div className="px-4 py-3.5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              E-mail Interac e-Transfer
            </span>
          </div>
          <div className="flex items-center gap-3 px-4 py-4">
            <Mail className="h-5 w-5 shrink-0 text-muted-foreground" strokeWidth={1.9} />
            <input
              type="email"
              spellCheck={false}
              autoCapitalize="none"
              placeholder="vous@exemple.ca"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              className="w-full bg-transparent text-[15px] outline-none placeholder:text-muted-foreground/60"
            />
          </div>
        </div>
        <p className="mt-3 px-1 text-sm text-muted-foreground">
          Vous recevrez <span className="font-semibold text-foreground">{nfCad.format(cad)} CAD</span> par
          e-Transfer à cette adresse dès réception de vos USDT.
        </p>
        <Button variant="appPrimary" size="lg" shape="rounded" className="mt-6 w-full" disabled={!/^\S+@\S+\.\S+$/.test(email)} onClick={() => setStep("done")}>
          Continuer <ArrowRight className="h-4 w-4" />
        </Button>
      </AppShell>
    );
  }

  /* ---------- Confirmation ---------- */
  return (
    <AppShell header={<StepHead title="Ordre créé" sub="Envoyez vos USDT à Ooble" />}>
      <div className="rounded-[1.5rem] border border-border bg-white p-6">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Check className="h-7 w-7" strokeWidth={2.4} />
          </span>
          <p className="mt-4 font-display text-2xl font-extrabold">{nfCad.format(cad)} CAD</p>
          <p className="text-sm text-muted-foreground">à recevoir par Interac</p>
        </div>

        <dl className="mt-6 divide-y divide-border border-t border-border text-sm">
          <div className="flex justify-between py-3"><dt className="text-muted-foreground">Vous envoyez</dt><dd className="font-semibold">{nfUsdt.format(usdt)} USDT</dd></div>
          <div className="flex justify-between py-3"><dt className="text-muted-foreground">Taux</dt><dd className="font-medium">1 USDT = {nfCad.format(rate.sell)} CAD</dd></div>
          <div className="flex justify-between gap-4 py-3"><dt className="text-muted-foreground">Interac</dt><dd className="truncate font-medium">{email}</dd></div>
        </dl>
      </div>

      <p className="mt-3 rounded-2xl border border-border bg-secondary/40 px-4 py-3 text-sm leading-relaxed text-muted-foreground">
        Les instructions d'envoi on-chain s'affichent à l'étape suivante. Votre
        e-Transfer part dès réception de vos USDT.
      </p>

      <div className="mt-6 flex flex-col gap-2.5">
        <Button variant="appPrimary" size="lg" shape="rounded" className="w-full" asChild>
          <Link to="/app">Retour à l'accueil</Link>
        </Button>
        <Button variant="appOutline" size="lg" shape="rounded" className="w-full"
          onClick={() => { setStep("amount"); setAmount(""); setEmail(""); }}>
          Nouvel ordre
        </Button>
      </div>
    </AppShell>
  );
};

export default AppVendre;
