import { Check } from "lucide-react";
import Coin from "./Coin";
import { InteracLogo } from "./marks";

/** Carte de paiement du hero (style produit). */
const OrderCard = () => (
  <div className="relative w-full max-w-[380px]">
    {/* Carte USDT flottante */}
    <div className="relative z-10 ml-auto w-[74%] overflow-hidden rounded-[18px] bg-deep p-4 text-white shadow-lift">
      <div className="bg-diagonal-dark absolute inset-0" aria-hidden />
      <div className="relative flex items-start justify-between">
        <span className="text-[11px] uppercase tracking-[0.12em] text-white/60">Carte USDT</span>
        <Coin id="usdt" size={26} />
      </div>
      <p className="relative mt-4 font-display text-lg font-bold tracking-[0.12em]">
        351,00 USDT
      </p>
      <div className="relative mt-3 flex items-center justify-between text-[11px] text-white/70">
        <span>T••• ••• 92e</span>
        <span className="rounded bg-white/15 px-2 py-0.5 font-semibold">TRC20</span>
      </div>
    </div>

    {/* Carte blanche */}
    <div className="-mt-8 rounded-[22px] border bg-card p-5 pt-12 shadow-lift">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-tint">
          <Coin id="usdt" size={22} />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-bold leading-tight">Ordre d'achat</p>
          <p className="truncate text-xs text-muted-foreground">Référence O-52112</p>
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between border-b pb-4">
        <div>
          <p className="text-[11px] text-muted-foreground">Montant à payer</p>
          <p className="font-display text-2xl font-extrabold tracking-tight">500,00 $</p>
        </div>
        <span className="text-[11px] text-muted-foreground">20 juil.</span>
      </div>

      {/* Moyens de paiement */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between rounded-[12px] border border-primary bg-accent-tint/40 px-3.5 py-3">
          <span className="text-sm font-semibold">
            <InteracLogo /> e-Transfer
          </span>
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Check className="h-2.5 w-2.5" strokeWidth={4} />
          </span>
        </div>
        <div className="flex items-center justify-between rounded-[12px] border px-3.5 py-3">
          <span className="text-sm font-medium text-muted-foreground">Virement bancaire</span>
          <span className="h-4 w-4 rounded-full border-2 border-border" />
        </div>
      </div>

      <button className="mt-4 w-full rounded-[12px] bg-deep py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90">
        Payer 500,00 $
      </button>
    </div>
  </div>
);

export default OrderCard;
