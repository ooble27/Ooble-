import { ArrowRight, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Coin from "./Coin";
import { formatCad } from "@/lib/rates";

/** Panneau de prix USDT/CAD affiché dans le hero. */
const PriceCard = () => (
  <div className="relative w-full max-w-[404px]">
    <div className="rounded-[26px] border bg-card p-6 shadow-lift">
      {/* En-tête actif */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Coin id="usdt" size={44} />
          <div>
            <p className="font-display text-[15px] font-bold leading-tight">Tether</p>
            <p className="text-xs text-muted-foreground">USDT · Dollar canadien</p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-accent-tint px-2.5 py-1 text-[11px] font-semibold text-accent-ink">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          En direct
        </span>
      </div>

      {/* Prix */}
      <div className="mt-6 flex items-end justify-between">
        <div>
          <p className="font-display text-[2.6rem] font-extrabold leading-none tracking-tight">
            {formatCad(1.4245)}
          </p>
          <p className="mt-1.5 text-xs text-muted-foreground">Taux garanti 15 min par ordre</p>
        </div>
        <span className="mb-1 flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-accent-ink">
          <TrendingUp className="h-3.5 w-3.5" /> +0,3 %
        </span>
      </div>

      {/* Sparkline */}
      <svg viewBox="0 0 340 72" className="mt-4 w-full" fill="none" preserveAspectRatio="none">
        <path
          d="M0 58 L38 50 L76 54 L114 40 L152 44 L190 28 L228 32 L266 20 L304 24 L340 8"
          stroke="hsl(var(--primary))"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M0 58 L38 50 L76 54 L114 40 L152 44 L190 28 L228 32 L266 20 L304 24 L340 8 V72 H0 Z"
          fill="hsl(var(--primary) / 0.1)"
        />
      </svg>

      {/* Conversion express */}
      <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl bg-secondary/60 p-4">
        <div>
          <p className="text-[11px] text-muted-foreground">Vous payez</p>
          <p className="font-display text-base font-bold">500,00 $</p>
        </div>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-card text-primary shadow-soft">
          <ArrowRight className="h-4 w-4" />
        </span>
        <div className="text-right">
          <p className="text-[11px] text-muted-foreground">Vous recevez</p>
          <p className="flex items-center justify-end gap-1.5 font-display text-base font-bold">
            <Coin id="usdt" size={16} /> 351,00
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 grid grid-cols-2 gap-2.5">
        <Button asChild variant="primary" shape="rounded" className="h-12">
          <Link to="/acheter">Acheter</Link>
        </Button>
        <Button asChild variant="secondary" shape="rounded" className="h-12">
          <Link to="/vendre">Vendre</Link>
        </Button>
      </div>
    </div>

    <div
      className="pointer-events-none absolute -inset-x-6 -bottom-6 -z-10 h-32 rounded-full bg-primary/15 blur-3xl"
      aria-hidden
    />
  </div>
);

export default PriceCard;
