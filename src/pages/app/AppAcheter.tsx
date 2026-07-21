import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import AppShell from "@/components/app/AppShell";
import NetworkChip from "@/components/app/NetworkChip";
import CopyRow from "@/components/app/CopyRow";
import { NETWORKS, type NetId } from "@/components/app/networks";
import { Button } from "@/components/ui/button";
import { useUsdtRate } from "@/hooks/useUsdtRate";
import { cn } from "@/lib/utils";

type Unit = "CAD" | "USDT";
type Step = "amount" | "destination" | "address" | "done";

const OOBLE_INTERAC = "paiement@ooble.ca";
const nfCad = new Intl.NumberFormat("fr-CA", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
const nfUsdt = new Intl.NumberFormat("fr-CA", { maximumFractionDigits: 2 });

const short = (a: string) => (a.length > 16 ? `${a.slice(0, 8)}…${a.slice(-6)}` : a);
const newRef = () => `OOB-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

const BackBtn = ({ onClick }: { onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label="Retour"
    className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-white text-foreground transition-colors hover:bg-secondary"
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

const AppAcheter = () => {
  const rate = useUsdtRate();
  const [step, setStep] = useState<Step>("amount");
  const [unit, setUnit] = useState<Unit>("CAD");
  const [amount, setAmount] = useState("");
  const [net, setNet] = useState<NetId | null>(null);
  const [address, setAddress] = useState("");
  const orderRef = useMemo(() => newRef(), []);

  const value = parseFloat(amount.replace(",", ".")) || 0;
  const usdt = unit === "CAD" ? value / rate.buy : value;
  const cad = unit === "CAD" ? value : value * rate.buy;
  const network = NETWORKS.find((n) => n.id === net) ?? null;

  const setPreset = (kind: "min" | "max") => {
    if (unit === "CAD") setAmount(kind === "min" ? "20" : "10000");
    else setAmount(kind === "min" ? "15" : "7000");
  };

  /* ---------- Montant ---------- */
  if (step === "amount") {
    return (
      <AppShell header={<StepHead title="Acheter USDT" sub="Entrez le montant à dépenser" />}>
        <div className="rounded-2xl border border-border bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Montant
            </span>
            <div className="flex items-center gap-3">
              <div className="flex rounded-lg border border-border bg-secondary/50 p-0.5">
                {(["CAD", "USDT"] as Unit[]).map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setUnit(u)}
                    className={cn(
                      "rounded-md px-3 py-1 text-xs font-semibold transition-colors",
                      unit === u ? "bg-white text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {u}
                  </button>
                ))}
              </div>
              <div className="flex gap-2.5 text-xs font-semibold text-foreground">
                <button type="button" onClick={() => setPreset("min")} className="hover:underline">Min</button>
                <button type="button" onClick={() => setPreset("max")} className="hover:underline">Max</button>
              </div>
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
        </div>

        <div className="mt-3 divide-y divide-border rounded-2xl border border-border bg-white px-5">
          <div className="flex items-center justify-between py-4">
            <span className="text-muted-foreground">{unit === "CAD" ? "Vous recevez" : "Vous payez"}</span>
            <span className="flex items-center gap-1.5 font-display text-lg font-bold">
              {unit === "CAD" ? `${nfUsdt.format(usdt)} USDT` : `${nfCad.format(cad)} CAD`}
              {unit === "CAD" && <img src="/coins/usdt.svg" alt="" className="h-5 w-5" />}
            </span>
          </div>
          <div className="flex items-center justify-between py-4 text-sm">
            <span className="text-muted-foreground">Taux</span>
            <span className="font-medium">1 USDT = {nfCad.format(rate.buy)} CAD</span>
          </div>
        </div>

        <Button variant="appPrimary" size="lg" shape="soft" className="mt-6 w-full" disabled={value <= 0} onClick={() => setStep("destination")}>
          Continuer <ArrowRight className="h-4 w-4" />
        </Button>
      </AppShell>
    );
  }

  /* ---------- Destination (réseau) ---------- */
  if (step === "destination") {
    return (
      <AppShell header={<StepHead title="Réseau" sub="Où recevoir vos USDT" onBack={() => setStep("amount")} />}>
        <div className="grid grid-cols-2 gap-2.5">
          {NETWORKS.map((n) => (
            <NetworkChip key={n.id} network={n} selected={net === n.id} onSelect={() => setNet(n.id)} />
          ))}
        </div>
        <Button variant="appPrimary" size="lg" shape="soft" className="mt-6 w-full" disabled={!net} onClick={() => setStep("address")}>
          Continuer <ArrowRight className="h-4 w-4" />
        </Button>
      </AppShell>
    );
  }

  /* ---------- Adresse de réception (texture field-group) ---------- */
  if (step === "address") {
    return (
      <AppShell header={<StepHead title="Adresse de réception" sub={`Entrez votre adresse ${network?.tag}`} onBack={() => setStep("destination")} />}>
        <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-white">
          <div className="flex items-center gap-3 px-4 py-4">
            <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full">
              <img src={`/coins/${network?.id}.svg`} alt="" className="h-8 w-8" draggable={false} />
            </span>
            <span className="text-sm font-semibold">{network?.name}</span>
            <span className="ml-auto text-xs font-medium text-muted-foreground">{network?.tag}</span>
          </div>
          <div className="px-4 py-4">
            <input
              type="text"
              spellCheck={false}
              autoCapitalize="none"
              placeholder={`Votre adresse ${network?.tag}`}
              value={address}
              onChange={(e) => setAddress(e.target.value.trim())}
              className="w-full bg-transparent font-mono text-base outline-none placeholder:text-muted-foreground/60"
            />
          </div>
        </div>
        <p className="mt-3 px-1 text-sm text-muted-foreground">
          Vos USDT sont envoyés on-chain directement à cette adresse. Vérifiez-la bien.
        </p>
        <Button variant="appPrimary" size="lg" shape="soft" className="mt-6 w-full" disabled={address.length < 12} onClick={() => setStep("done")}>
          Continuer <ArrowRight className="h-4 w-4" />
        </Button>
      </AppShell>
    );
  }

  /* ---------- Confirmation ---------- */
  return (
    <AppShell header={<StepHead title="Ordre créé" sub="Payez par Interac e-Transfer" />}>
      <div className="rounded-2xl border border-border bg-white p-6">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1a1a1a] text-white">
            <Check className="h-7 w-7" strokeWidth={2.4} />
          </span>
          <p className="mt-4 font-display text-2xl font-extrabold">{nfUsdt.format(usdt)} USDT</p>
          <p className="text-sm text-muted-foreground">sur {network?.name} · {network?.tag}</p>
        </div>

        <dl className="mt-6 divide-y divide-border border-t border-border text-sm">
          <div className="flex justify-between py-3"><dt className="text-muted-foreground">Taux</dt><dd className="font-medium">1 USDT = {nfCad.format(rate.buy)} CAD</dd></div>
          <div className="flex justify-between gap-4 py-3"><dt className="text-muted-foreground">Adresse de réception</dt><dd className="truncate font-mono text-xs">{short(address)}</dd></div>
        </dl>
      </div>

      {/* Instructions Interac e-Transfer */}
      <p className="mb-2 mt-6 px-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        Envoyez votre e-Transfer
      </p>
      <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-white">
        <CopyRow label="Destinataire (e-mail Interac)" value={OOBLE_INTERAC} mono />
        <CopyRow label="Montant exact" value={`${nfCad.format(cad)} CAD`} />
        <CopyRow label="Message / référence" value={orderRef} mono />
      </div>
      <p className="mt-3 px-1 text-sm leading-relaxed text-muted-foreground">
        Depuis votre banque, envoyez un e-Transfer Interac à cette adresse avec la
        référence en message. Vos USDT partent on-chain dès réception — le dépôt
        automatique est recommandé.
      </p>

      <div className="mt-6 flex flex-col gap-2.5">
        <Button variant="appPrimary" size="lg" shape="soft" className="w-full" asChild>
          <Link to="/app">Retour à l'accueil</Link>
        </Button>
        <Button variant="appOutline" size="lg" shape="soft" className="w-full"
          onClick={() => { setStep("amount"); setAmount(""); setNet(null); setAddress(""); }}>
          Nouvel ordre
        </Button>
      </div>
    </AppShell>
  );
};

export default AppAcheter;
