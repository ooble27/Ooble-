import { useState } from "react";
import { Info, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { DEMO_RATES, RATE_LOCK_MINUTES, formatCad, formatUsdt } from "@/lib/rates";
import type { OrderSide, UsdtNetwork } from "@/lib/types";

const networks: { id: UsdtNetwork; label: string; hint: string }[] = [
  { id: "trc20", label: "TRC20", hint: "Réseau Tron — frais très bas, rapide" },
  { id: "erc20", label: "ERC20", hint: "Réseau Ethereum — compatible partout" },
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
    <div className="rounded-2xl border border-border/80 bg-card/80 p-6 sm:p-8">
      {/* Montant */}
      <label className="text-sm font-medium">
        {isBuy ? "Montant à payer (CAD)" : "Montant à vendre (USDT)"}
      </label>
      <div className="mt-2 flex items-baseline gap-2 rounded-xl border border-input bg-background/60 p-4 focus-within:border-primary">
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value.replace(/[^0-9.,]/g, ""))}
          inputMode="decimal"
          className="w-full bg-transparent font-display text-2xl font-semibold outline-none"
          placeholder="0"
        />
        <span className="font-display font-semibold text-muted-foreground">
          {isBuy ? "CAD" : "USDT"}
        </span>
      </div>

      {/* Réseau */}
      <label className="mt-6 block text-sm font-medium">Réseau USDT</label>
      <div className="mt-2 grid grid-cols-2 gap-3">
        {networks.map((n) => (
          <button
            key={n.id}
            type="button"
            onClick={() => setNetwork(n.id)}
            className={cn(
              "rounded-xl border p-4 text-left transition-colors",
              network === n.id
                ? "border-primary bg-primary/10"
                : "border-input bg-background/60 hover:border-border",
            )}
          >
            <span className="font-display font-semibold">{n.label}</span>
            <p className="mt-1 text-xs text-muted-foreground">{n.hint}</p>
          </button>
        ))}
      </div>

      {/* Destination */}
      {isBuy ? (
        <>
          <label className="mt-6 block text-sm font-medium">
            Votre adresse wallet ({network.toUpperCase()})
          </label>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value.trim())}
            placeholder={network === "trc20" ? "T..." : "0x..."}
            className="mt-2 w-full rounded-xl border border-input bg-background/60 p-4 font-mono text-sm outline-none focus:border-primary"
          />
          <p className="mt-2 flex items-start gap-1.5 text-xs text-muted-foreground">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            Les USDT seront envoyés directement à cette adresse. Vérifiez-la
            attentivement : une transaction blockchain est irréversible.
          </p>
        </>
      ) : (
        <>
          <label className="mt-6 block text-sm font-medium">
            Votre courriel Interac (pour recevoir le paiement CAD)
          </label>
          <input
            value={interacEmail}
            onChange={(e) => setInteracEmail(e.target.value.trim())}
            type="email"
            placeholder="vous@exemple.ca"
            className="mt-2 w-full rounded-xl border border-input bg-background/60 p-4 text-sm outline-none focus:border-primary"
          />
          <p className="mt-2 flex items-start gap-1.5 text-xs text-muted-foreground">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            L'adresse de dépôt USDT vous sera fournie à la création de
            l'ordre. Le e-Transfer part dès la confirmation on-chain.
          </p>
        </>
      )}

      {/* Résumé */}
      <div className="mt-6 space-y-2.5 rounded-xl bg-secondary/60 p-4 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Taux verrouillé</span>
          <span className="font-medium">1 USDT = {formatCad(rate)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            {isBuy ? "Vous recevez" : "Vous recevez"}
          </span>
          <span className="font-display font-semibold text-primary">
            {isBuy ? formatUsdt(usdtAmount) : formatCad(cadAmount)}
          </span>
        </div>
        <div className="flex items-center justify-between border-t border-border/60 pt-2.5 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5" /> Taux garanti {RATE_LOCK_MINUTES} minutes
          </span>
          <span>Frais inclus dans le taux</span>
        </div>
      </div>

      {/* CTA */}
      <button
        type="button"
        onClick={() => setSubmitted(true)}
        className="mt-6 w-full rounded-full bg-primary py-3.5 font-semibold text-primary-foreground transition-all hover:brightness-110"
      >
        {isBuy ? "Créer l'ordre d'achat" : "Créer l'ordre de vente"}
      </button>

      {submitted && (
        <div className="mt-4 rounded-xl border border-primary/40 bg-primary/10 p-4 text-sm leading-relaxed text-emerald-200">
          🚧 La création d'ordres ouvrira très bientôt. Il faudra un compte
          vérifié (KYC) — l'authentification est la prochaine étape de la
          plateforme.
        </div>
      )}
    </div>
  );
};

export default OrderForm;
