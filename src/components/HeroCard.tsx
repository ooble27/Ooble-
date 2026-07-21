import { BadgeCheck, Check, Landmark, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import TetherMark from "./TetherMark";
import { TransferMark } from "./marks";

/** Maquette d'ordre Ooble affichée dans le hero (style produit). */
const HeroCard = () => (
  <div className="relative w-full max-w-[400px]">
    <div className="rounded-[26px] border bg-card p-5 shadow-lift">
      {/* Carte USDT (façon carte bancaire) */}
      <div className="relative overflow-hidden rounded-[20px] bg-deep p-5 text-white">
        <div
          className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/25 blur-2xl"
          aria-hidden
        />
        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.12em] text-white/60">Ordre d'achat</p>
            <p className="mt-1 font-display text-2xl font-bold">351,00 USDT</p>
          </div>
          <TetherMark className="h-9 w-9" />
        </div>
        <div className="relative mt-6 flex items-center justify-between">
          <span className="text-sm tracking-[0.18em] text-white/85">T••• ••• 92e</span>
          <span className="rounded-md bg-white/15 px-2.5 py-1 text-[11px] font-semibold">TRC20</span>
        </div>
      </div>

      {/* Résumé de l'ordre */}
      <div className="mt-4 flex items-center justify-between rounded-2xl border bg-card px-4 py-3.5 shadow-soft">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-tint text-accent-ink">
            <Wallet className="h-[18px] w-[18px]" strokeWidth={1.9} />
          </span>
          <div>
            <p className="text-[11px] text-muted-foreground">Montant à payer</p>
            <p className="font-display text-base font-bold">500,00 $ CAD</p>
          </div>
        </div>
        <span className="text-[11px] text-muted-foreground">20 juil.</span>
      </div>

      {/* Méthode de paiement */}
      <div className="mt-3 space-y-2">
        <div className="flex items-center justify-between rounded-xl border border-primary bg-accent-tint/50 px-4 py-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <TransferMark className="h-4 w-4" />
            </span>
            <span className="text-sm font-semibold">Interac e-Transfer</span>
          </div>
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Check className="h-2.5 w-2.5" strokeWidth={4} />
          </span>
        </div>
        <div className="flex items-center justify-between rounded-xl border px-4 py-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
              <Landmark className="h-4 w-4" strokeWidth={1.9} />
            </span>
            <span className="text-sm font-medium text-muted-foreground">Virement bancaire</span>
          </div>
          <span className="h-4 w-4 rounded-full border-2 border-border" />
        </div>
      </div>

      <Button variant="deep" shape="rounded" className="mt-4 h-12 w-full">
        Payer 500,00 $
      </Button>
    </div>

    {/* Badge flottant */}
    <div className="absolute -bottom-4 -left-4 hidden items-center gap-2 rounded-2xl border bg-card px-3.5 py-2.5 shadow-lift sm:flex">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <BadgeCheck className="h-4 w-4" strokeWidth={2.2} />
      </span>
      <p className="text-xs font-semibold">Réglé en 4 min</p>
    </div>
  </div>
);

export default HeroCard;
