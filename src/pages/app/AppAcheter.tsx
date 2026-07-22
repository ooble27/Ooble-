import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Coins, Check } from "lucide-react";
import AppShell from "@/components/app/AppShell";
import CopyRow from "@/components/app/CopyRow";
import { NETWORKS, type NetId } from "@/components/app/networks";
import { Button } from "@/components/ui/button";
import { useUsdtRate } from "@/hooks/useUsdtRate";
import { cn } from "@/lib/utils";

type Unit = "CAD" | "USDT";
type Step = "amount" | "network" | "address" | "done";

const OOBLE_INTERAC = "paiement@ooble.ca";
const nfCad = new Intl.NumberFormat("fr-CA", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
const nfUsdt = new Intl.NumberFormat("fr-CA", { maximumFractionDigits: 2 });
const short = (a: string) => (a.length > 16 ? `${a.slice(0, 8)}…${a.slice(-6)}` : a);
const newRef = () => `OOB-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

/** En-tête d'étape (structure Terex : rond retour + titre + description). */
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
      <AppShell center>
        <div className="mb-5">
          <h1 className="font-display text-[22px] font-semibold tracking-tight">Acheter USDT</h1>
          <p className="mt-1 text-[13px] text-muted-foreground">Entrez le montant que vous souhaitez dépenser</p>
        </div>
        {/* Carte montant (radius 20, padding 20) */}
        <div className="rounded-[20px] border border-border bg-card p-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Montant</span>
            <div className="flex items-center gap-3">
              {/* Bascule devise (10px / 7px) */}
              <div className="inline-flex gap-0.5 rounded-[10px] bg-secondary/70 p-[3px]">
                {(["CAD", "USDT"] as Unit[]).map((u) => (
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
              <div className="flex gap-2">
                <button type="button" onClick={() => setPreset("min")} className="text-[11px] font-medium text-muted-foreground underline">Min</button>
                <button type="button" onClick={() => setPreset("max")} className="text-[11px] font-medium text-muted-foreground underline">Max</button>
              </div>
            </div>
          </div>

          {/* Champ nombre (box interne, radius 14) */}
          <div className="relative">
            <input
              inputMode="decimal"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^\d.,]/g, ""))}
              className="w-full rounded-[14px] border border-border bg-secondary/40 py-[18px] pl-5 pr-[84px] text-[34px] font-bold tracking-[-1px] outline-none placeholder:text-muted-foreground/40"
            />
            <span className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-1.5 text-sm font-medium text-muted-foreground">
              {unit === "USDT" && <img src="/coins/usdt.svg" alt="" className="h-5 w-5" />}
              {unit}
            </span>
          </div>
        </div>

        {/* Récapitulatif (radius 16) */}
        <div className="mt-3 flex flex-col gap-2.5 rounded-[16px] border border-border bg-card px-5 py-4">
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-muted-foreground">{unit === "CAD" ? "Vous recevez" : "Vous payez"}</span>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold">{unit === "CAD" ? `${nfUsdt.format(usdt)} USDT` : `${nfCad.format(cad)} CAD`}</span>
              {unit === "CAD" && <img src="/coins/usdt.svg" alt="" className="h-[18px] w-[18px]" />}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-muted-foreground">Taux</span>
            <span className="text-[13px] text-muted-foreground">1 USDT = {nfCad.format(rate.buy)} CAD</span>
          </div>
        </div>

        {/* Continuer — à DROITE (Acheter) */}
        <div className="mt-3 flex justify-end">
          <Button variant="appPrimary" shape="soft" className="h-auto gap-2 px-[22px] py-[13px] text-sm" disabled={value <= 0} onClick={() => setStep("network")}>
            <Coins className="h-[17px] w-[17px]" strokeWidth={2} /> Continuer
          </Button>
        </div>
      </AppShell>
    );
  }

  /* ---------- Réseau (pastilles en ligne, style Terex) ---------- */
  if (step === "network") {
    return (
      <AppShell center>
        <StepHeader title="Destination" sub="Choisissez où recevoir vos USDT" onBack={() => setStep("amount")} />
        <div className="flex flex-wrap gap-2">
          {NETWORKS.map((n) => {
            const sel = net === n.id;
            return (
              <button
                key={n.id}
                type="button"
                onClick={() => setNet(n.id)}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl border py-2 pl-2 pr-3.5 transition-colors active:scale-[0.98]",
                  sel ? "border-foreground bg-secondary" : "border-border bg-card",
                )}
              >
                <img src={`/coins/${n.id}.svg`} alt="" className="h-7 w-7 shrink-0 rounded-full" draggable={false} />
                <span className="whitespace-nowrap text-sm">{n.name}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex justify-end">
          <Button variant="appPrimary" shape="soft" className="h-auto gap-2 px-[22px] py-[13px] text-sm" disabled={!net} onClick={() => setStep("address")}>
            <Coins className="h-[17px] w-[17px]" strokeWidth={2} /> Continuer
          </Button>
        </div>
      </AppShell>
    );
  }

  /* ---------- Adresse (field-group, radius 14) ---------- */
  if (step === "address") {
    return (
      <AppShell center>
        <StepHeader title="Adresse de réception" sub={`Entrez votre adresse ${network?.tag}`} onBack={() => setStep("network")} />
        <div className="overflow-hidden rounded-[14px] border border-border bg-card">
          <div className="flex items-center gap-2.5 border-b border-border px-4 py-2.5">
            <img src={`/coins/${network?.id}.svg`} alt="" className="h-[26px] w-[26px] rounded-full" draggable={false} />
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">{network?.name}</span>
            <span className="ml-auto text-[11px] font-medium text-muted-foreground">{network?.tag}</span>
          </div>
          <input
            type="text"
            spellCheck={false}
            autoCapitalize="none"
            placeholder={`Votre adresse ${network?.tag}`}
            value={address}
            onChange={(e) => setAddress(e.target.value.trim())}
            className="w-full bg-transparent px-4 py-4 font-mono text-base leading-relaxed outline-none placeholder:text-muted-foreground/60"
          />
        </div>

        <div className="mt-6 flex justify-end">
          <Button variant="appPrimary" shape="soft" className="h-auto gap-2 px-[22px] py-[13px] text-sm" disabled={address.length < 12} onClick={() => setStep("done")}>
            <Coins className="h-[17px] w-[17px]" strokeWidth={2} /> Continuer
          </Button>
        </div>
      </AppShell>
    );
  }

  /* ---------- Confirmation ---------- */
  return (
    <AppShell header={<StepHeader title="Ordre créé" sub="Payez par Interac e-Transfer" />}>
      {/* Récapitulatif en lignes (radius 16, séparateurs) */}
      <div className="overflow-hidden rounded-[16px] border border-border bg-card">
        {[
          { label: "Vous recevez", value: `${nfUsdt.format(usdt)} USDT` },
          { label: "À payer", value: `${nfCad.format(cad)} CAD` },
          { label: "Réseau", value: `${network?.name} · ${network?.tag}` },
          { label: "Adresse", value: short(address), mono: true },
        ].map((r, i, arr) => (
          <div key={r.label} className={cn("flex items-center justify-between px-4 py-[14px]", i < arr.length - 1 && "border-b border-border")}>
            <span className="text-[13px] text-muted-foreground">{r.label}</span>
            <span className={cn("max-w-[60%] break-all text-right text-[13px] font-medium", r.mono && "font-mono text-[11px]")}>{r.value}</span>
          </div>
        ))}
      </div>

      {/* Instructions Interac */}
      <p className="mb-2 mt-5 px-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Envoyez votre e-Transfer</p>
      <div className="divide-y divide-border overflow-hidden rounded-[16px] border border-border bg-card">
        <CopyRow label="Destinataire (e-mail Interac)" value={OOBLE_INTERAC} mono />
        <CopyRow label="Montant exact" value={`${nfCad.format(cad)} CAD`} />
        <CopyRow label="Message / référence" value={orderRef} mono />
      </div>

      <div className="mt-6 flex justify-end gap-2.5">
        <Button variant="ghost" shape="soft" className="h-auto px-[22px] py-[13px] text-sm" onClick={() => { setStep("amount"); setAmount(""); setNet(null); setAddress(""); }}>
          Nouvel ordre
        </Button>
        <Button variant="appPrimary" shape="soft" className="h-auto gap-2 px-[22px] py-[13px] text-sm" asChild>
          <Link to="/app"><Check className="h-[17px] w-[17px]" strokeWidth={2} /> Terminé</Link>
        </Button>
      </div>
    </AppShell>
  );
};

export default AppAcheter;
