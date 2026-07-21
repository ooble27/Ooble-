import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Mail, Home } from "lucide-react";
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
    className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border/70 bg-white text-foreground shadow-soft transition-colors hover:bg-secondary"
  >
    <ArrowLeft className="h-5 w-5" />
  </button>
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

  /* ---------- Étape montant ---------- */
  if (step === "amount") {
    return (
      <AppShell
        header={
          <div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight">Vendre USDT</h1>
            <p className="mt-1 text-[15px] text-muted-foreground">
              Entrez le montant que vous souhaitez vendre
            </p>
          </div>
        }
      >
        <div className="rounded-[1.5rem] border border-border/70 bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Montant
            </span>
            <div className="flex rounded-full bg-secondary p-0.5">
              {(["USDT", "CAD"] as Unit[]).map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setUnit(u)}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-semibold transition-colors",
                    unit === u ? "bg-white text-foreground shadow-soft" : "text-muted-foreground",
                  )}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3 rounded-2xl bg-secondary/70 px-4 py-5">
            <input
              inputMode="decimal"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^\d.,]/g, ""))}
              className="w-full bg-transparent font-display text-4xl font-extrabold tracking-tight outline-none placeholder:text-muted-foreground/50"
            />
            <span className="flex shrink-0 items-center gap-1.5 text-lg font-semibold text-muted-foreground">
              {unit === "USDT" && <img src="/coins/usdt.svg" alt="" className="h-6 w-6" />}
              {unit}
            </span>
          </div>
          <p className={cn("mt-3 text-sm", belowMin ? "text-destructive" : "text-muted-foreground")}>
            Minimum : {MIN_USDT} USDT
          </p>
        </div>

        {/* Récapitulatif */}
        <div className="mt-3.5 space-y-3 rounded-[1.5rem] border border-border/70 bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Vous recevez</span>
            <span className="font-display text-lg font-bold">{nfCad.format(cad)} CAD</span>
          </div>
          <div className="flex items-center justify-between border-t border-border/60 pt-3 text-sm">
            <span className="text-muted-foreground">Taux</span>
            <span className="font-medium">1 USDT = {nfCad.format(rate.sell)} CAD</span>
          </div>
        </div>

        <Button
          size="lg"
          className="mt-6 w-full"
          disabled={value <= 0 || belowMin}
          onClick={() => setStep("reception")}
        >
          Continuer <ArrowRight className="h-4 w-4" />
        </Button>
      </AppShell>
    );
  }

  /* ---------- Étape réception Interac ---------- */
  if (step === "reception") {
    return (
      <AppShell
        header={
          <div className="flex items-start gap-3">
            <BackBtn onClick={() => setStep("amount")} />
            <div>
              <h1 className="font-display text-3xl font-extrabold tracking-tight">Réception</h1>
              <p className="mt-1 text-[15px] text-muted-foreground">
                Où envoyer vos dollars canadiens
              </p>
            </div>
          </div>
        }
      >
        <div className="rounded-[1.5rem] border border-border/70 bg-white p-5 shadow-soft">
          <label className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            E-mail Interac e-Transfer
          </label>
          <div className="mt-3 flex items-center gap-3 rounded-2xl border border-input bg-white px-4 py-3.5 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10">
            <Mail className="h-5 w-5 shrink-0 text-muted-foreground" strokeWidth={1.9} />
            <input
              type="email"
              placeholder="vous@exemple.ca"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent text-[15px] outline-none placeholder:text-muted-foreground"
            />
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Vous recevrez <span className="font-semibold text-foreground">{nfCad.format(cad)} CAD</span> par
            e-Transfer à cette adresse dès réception de vos USDT.
          </p>
        </div>

        <Button
          size="lg"
          className="mt-6 w-full"
          disabled={!/^\S+@\S+\.\S+$/.test(email)}
          onClick={() => setStep("done")}
        >
          Continuer <ArrowRight className="h-4 w-4" />
        </Button>
      </AppShell>
    );
  }

  /* ---------- Étape confirmation ---------- */
  return (
    <AppShell
      header={
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight">Ordre créé</h1>
          <p className="mt-1 text-[15px] text-muted-foreground">Envoyez vos USDT à Ooble</p>
        </div>
      }
    >
      <div className="rounded-[1.5rem] border border-border/70 bg-white p-6 shadow-soft">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-teal">
            <Check className="h-8 w-8" strokeWidth={2.4} />
          </span>
          <p className="mt-4 font-display text-2xl font-extrabold">{nfCad.format(cad)} CAD</p>
          <p className="text-sm text-muted-foreground">à recevoir par Interac</p>
        </div>

        <dl className="mt-6 space-y-3 border-t border-border/60 pt-5 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Vous envoyez</dt>
            <dd className="font-semibold">{nfUsdt.format(usdt)} USDT</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Taux</dt>
            <dd className="font-medium">1 USDT = {nfCad.format(rate.sell)} CAD</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Interac</dt>
            <dd className="truncate font-medium">{email}</dd>
          </div>
        </dl>
      </div>

      <p className="mt-4 rounded-2xl bg-accent-tint px-4 py-3 text-sm leading-relaxed text-accent-ink">
        Les instructions d'envoi on-chain s'affichent à l'étape suivante. Votre
        e-Transfer part dès réception de vos USDT.
      </p>

      <div className="mt-6 flex flex-col gap-2.5">
        <Button size="lg" className="w-full" asChild>
          <Link to="/app">
            <Home className="h-4 w-4" /> Retour à l'accueil
          </Link>
        </Button>
        <Button
          size="lg"
          variant="secondary"
          className="w-full"
          onClick={() => {
            setStep("amount");
            setAmount("");
            setEmail("");
          }}
        >
          Nouvel ordre
        </Button>
      </div>
    </AppShell>
  );
};

export default AppVendre;
