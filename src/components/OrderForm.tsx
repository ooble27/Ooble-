import { useState } from "react";
import { ArrowRight, Info, Lock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DEMO_RATES, RATE_LOCK_MINUTES, formatCad, formatUsdt } from "@/lib/rates";
import type { OrderSide, UsdtNetwork } from "@/lib/types";

const networks: { id: UsdtNetwork; label: string; hint: string }[] = [
  { id: "trc20", label: "TRC20", hint: "Tron — frais très bas" },
  { id: "erc20", label: "ERC20", hint: "Ethereum — compatible partout" },
];

interface OrderFormProps {
  side: OrderSide;
}

const OrderForm = ({ side }: OrderFormProps) => {
  const [amount, setAmount] = useState("500");
  const [network, setNetwork] = useState<UsdtNetwork>("trc20");
  const [address, setAddress] = useState("");
  const [interacEmail, setInteracEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const isBuy = side === "buy";
  const rate = DEMO_RATES[side];
  const value = parseFloat(amount.replace(",", ".")) || 0;
  const cadAmount = isBuy ? value : value * rate;
  const usdtAmount = isBuy ? value / rate : value;

  return (
    <div className="rounded-[28px] border bg-card p-6 shadow-lift sm:p-7">
      <div className="flex items-center justify-between">
        <span className="font-display text-lg font-bold">
          {isBuy ? "Ordre d'achat" : "Ordre de vente"}
        </span>
        <span className="flex items-center gap-1.5 rounded-full bg-accent-tint px-3 py-1 text-[11px] font-semibold text-accent-ink">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Taux en direct
        </span>
      </div>

      {/* Montant */}
      <label className="mt-5 block text-sm font-medium text-muted-foreground">
        {isBuy ? "Montant à payer" : "Montant à vendre"}
      </label>
      <div className="mt-2 flex items-center gap-2 rounded-2xl bg-secondary/60 p-4 ring-1 ring-transparent transition-all focus-within:ring-primary">
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value.replace(/[^0-9.,]/g, ""))}
          inputMode="decimal"
          className="w-full bg-transparent font-display text-3xl font-bold tracking-tight outline-none"
          placeholder="0"
        />
        <span className="shrink-0 rounded-full bg-card px-3 py-1.5 text-sm font-bold shadow-soft">
          {isBuy ? "CAD" : "USDT"}
        </span>
      </div>

      {/* Réseau */}
      <label className="mt-6 block text-sm font-medium text-muted-foreground">Réseau USDT</label>
      <div className="mt-2 grid grid-cols-2 gap-3">
        {networks.map((n) => (
          <button
            key={n.id}
            type="button"
            onClick={() => setNetwork(n.id)}
            className={cn(
              "rounded-2xl border p-4 text-left transition-all",
              network === n.id
                ? "border-primary bg-accent-tint/60"
                : "bg-secondary/40 hover:border-muted-foreground/30",
            )}
          >
            <span className="font-semibold">{n.label}</span>
            <p className="mt-0.5 text-xs text-muted-foreground">{n.hint}</p>
          </button>
        ))}
      </div>

      {/* Destination */}
      {isBuy ? (
        <>
          <label className="mt-6 block text-sm font-medium text-muted-foreground">
            Votre adresse wallet ({network.toUpperCase()})
          </label>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value.trim())}
            placeholder={network === "trc20" ? "T..." : "0x..."}
            className="mt-2 w-full rounded-2xl bg-secondary/60 p-4 font-mono text-sm outline-none ring-1 ring-transparent transition-all focus:ring-primary"
          />
          <p className="mt-2 flex items-start gap-1.5 text-xs text-muted-foreground">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            Les USDT seront envoyés directement à cette adresse. Une
            transaction blockchain est irréversible.
          </p>
        </>
      ) : (
        <>
          <label className="mt-6 block text-sm font-medium text-muted-foreground">
            Votre courriel Interac
          </label>
          <input
            value={interacEmail}
            onChange={(e) => setInteracEmail(e.target.value.trim())}
            type="email"
            placeholder="vous@exemple.ca"
            className="mt-2 w-full rounded-2xl bg-secondary/60 p-4 text-sm outline-none ring-1 ring-transparent transition-all focus:ring-primary"
          />
          <p className="mt-2 flex items-start gap-1.5 text-xs text-muted-foreground">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            L'adresse de dépôt USDT vous sera fournie à la création de l'ordre.
          </p>
        </>
      )}

      {/* Résumé */}
      <div className="mt-6 space-y-3 rounded-2xl bg-secondary/60 p-4 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Taux verrouillé</span>
          <span className="font-medium">1 USDT = {formatCad(rate)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Vous recevez</span>
          <span className="font-display text-lg font-bold text-primary">
            {isBuy ? formatUsdt(usdtAmount) : formatCad(cadAmount)}
          </span>
        </div>
        <div className="flex items-center justify-between border-t border-dashed pt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5" /> Garanti {RATE_LOCK_MINUTES} min
          </span>
          <span>Frais inclus dans le taux</span>
        </div>
      </div>

      <Button
        type="button"
        onClick={() => setSubmitted(true)}
        variant="primary"
        shape="pill"
        className="mt-6 h-12 w-full"
      >
        {isBuy ? "Créer l'ordre d'achat" : "Créer l'ordre de vente"}
        <ArrowRight className="h-4 w-4" />
      </Button>

      {submitted && (
        <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-primary/30 bg-accent-tint p-4 text-sm leading-relaxed text-accent-ink">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.9} />
          <span>
            La création d'ordres ouvrira très bientôt. Il faudra un compte
            vérifié (KYC) — l'authentification est la prochaine étape.
          </span>
        </div>
      )}
    </div>
  );
};

export default OrderForm;
