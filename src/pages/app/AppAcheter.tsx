import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Coins } from "lucide-react";
import AppShell from "@/components/app/AppShell";
import NetworkChip from "@/components/app/NetworkChip";
import { NETWORKS, type NetId } from "@/components/app/networks";
import { Button } from "@/components/ui/button";
import { useUsdtRate } from "@/hooks/useUsdtRate";
import { cn } from "@/lib/utils";

type Unit = "CAD" | "USDT";
type Step = "amount" | "destination" | "done";

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

const AppAcheter = () => {
  const rate = useUsdtRate();
  const [step, setStep] = useState<Step>("amount");
  const [unit, setUnit] = useState<Unit>("CAD");
  const [amount, setAmount] = useState("");
  const [net, setNet] = useState<NetId | null>(null);

  const value = parseFloat(amount.replace(",", ".")) || 0;
  const usdt = unit === "CAD" ? value / rate.buy : value;
  const cad = unit === "CAD" ? value : value * rate.buy;
  const network = NETWORKS.find((n) => n.id === net) ?? null;

  const setPreset = (kind: "min" | "max") => {
    if (unit === "CAD") setAmount(kind === "min" ? "20" : "10000");
    else setAmount(kind === "min" ? "15" : "7000");
  };

  /* ---------- Étape montant ---------- */
  if (step === "amount") {
    return (
      <AppShell
        header={
          <div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight">Acheter USDT</h1>
            <p className="mt-1 text-[15px] text-muted-foreground">
              Entrez le montant que vous souhaitez dépenser
            </p>
          </div>
        }
      >
        <div className="rounded-[1.5rem] border border-border/70 bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Montant
            </span>
            <div className="flex items-center gap-3">
              <div className="flex rounded-full bg-secondary p-0.5">
                {(["CAD", "USDT"] as Unit[]).map((u) => (
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
              <div className="flex gap-2 text-xs font-semibold text-primary">
                <button type="button" onClick={() => setPreset("min")} className="hover:underline">
                  Min
                </button>
                <button type="button" onClick={() => setPreset("max")} className="hover:underline">
                  Max
                </button>
              </div>
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
        </div>

        {/* Récapitulatif */}
        <div className="mt-3.5 space-y-3 rounded-[1.5rem] border border-border/70 bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">
              {unit === "CAD" ? "Vous recevez" : "Vous payez"}
            </span>
            <span className="flex items-center gap-1.5 font-display text-lg font-bold">
              {unit === "CAD"
                ? `${nfUsdt.format(usdt)} USDT`
                : `${nfCad.format(cad)} CAD`}
              {unit === "CAD" && <img src="/coins/usdt.svg" alt="" className="h-5 w-5" />}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-border/60 pt-3 text-sm">
            <span className="text-muted-foreground">Taux</span>
            <span className="font-medium">1 USDT = {nfCad.format(rate.buy)} CAD</span>
          </div>
        </div>

        <Button
          size="lg"
          className="mt-6 w-full"
          disabled={value <= 0}
          onClick={() => setStep("destination")}
        >
          Continuer <ArrowRight className="h-4 w-4" />
        </Button>
      </AppShell>
    );
  }

  /* ---------- Étape destination ---------- */
  if (step === "destination") {
    return (
      <AppShell
        header={
          <div className="flex items-start gap-3">
            <BackBtn onClick={() => setStep("amount")} />
            <div>
              <h1 className="font-display text-3xl font-extrabold tracking-tight">Destination</h1>
              <p className="mt-1 text-[15px] text-muted-foreground">
                Choisissez où recevoir vos USDT
              </p>
            </div>
          </div>
        }
      >
        <div className="grid grid-cols-2 gap-3">
          {NETWORKS.map((n) => (
            <NetworkChip
              key={n.id}
              network={n}
              selected={net === n.id}
              onSelect={() => setNet(n.id)}
            />
          ))}
        </div>

        <Button
          size="lg"
          className="mt-6 w-full"
          disabled={!net}
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
          <p className="mt-1 text-[15px] text-muted-foreground">Payez par Interac e-Transfer</p>
        </div>
      }
    >
      <div className="rounded-[1.5rem] border border-border/70 bg-white p-6 shadow-soft">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-teal">
            <Check className="h-8 w-8" strokeWidth={2.4} />
          </span>
          <p className="mt-4 font-display text-2xl font-extrabold">
            {nfUsdt.format(usdt)} USDT
          </p>
          <p className="text-sm text-muted-foreground">
            sur {network?.name} · {network?.tag}
          </p>
        </div>

        <dl className="mt-6 space-y-3 border-t border-border/60 pt-5 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">À payer</dt>
            <dd className="font-semibold">{nfCad.format(cad)} CAD</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Taux</dt>
            <dd className="font-medium">1 USDT = {nfCad.format(rate.buy)} CAD</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Réseau</dt>
            <dd className="font-medium">{network?.name}</dd>
          </div>
        </dl>
      </div>

      <p className="mt-4 rounded-2xl bg-accent-tint px-4 py-3 text-sm leading-relaxed text-accent-ink">
        Envoyez le e-Transfer Interac depuis votre banque. Vos USDT partent
        on-chain vers votre adresse dès réception du paiement.
      </p>

      <div className="mt-6 flex flex-col gap-2.5">
        <Button size="lg" className="w-full" asChild>
          <Link to="/app">
            <Coins className="h-4 w-4" /> Retour à l'accueil
          </Link>
        </Button>
        <Button
          size="lg"
          variant="secondary"
          className="w-full"
          onClick={() => {
            setStep("amount");
            setAmount("");
            setNet(null);
          }}
        >
          Nouvel ordre
        </Button>
      </div>
    </AppShell>
  );
};

export default AppAcheter;
