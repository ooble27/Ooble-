import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { DEMO_RATES, formatCad } from "@/lib/rates";

type Side = "buy" | "sell";

const RateCalculator = () => {
  const [side, setSide] = useState<Side>("buy");
  const [amount, setAmount] = useState("500");

  const value = parseFloat(amount.replace(",", ".")) || 0;
  const rate = DEMO_RATES[side];
  const converted = side === "buy" ? value / rate : value * rate;

  const topLabel = side === "buy" ? "Vous payez" : "Vous vendez";
  const topUnit = side === "buy" ? "CAD" : "USDT";
  const bottomLabel = "Vous recevez";
  const bottomUnit = side === "buy" ? "USDT" : "CAD";

  return (
    <div className="w-full max-w-md rounded-2xl border border-border/80 bg-card/90 p-6 shadow-2xl backdrop-blur glow-primary">
      <div className="grid grid-cols-2 gap-1 rounded-full bg-secondary p-1">
        {(["buy", "sell"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setSide(s)}
            className={cn(
              "rounded-full py-2 text-sm font-semibold transition-all",
              side === s
                ? "bg-primary text-primary-foreground shadow"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {s === "buy" ? "Acheter" : "Vendre"}
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-2">
        <div className="rounded-xl border border-input bg-background/60 p-4">
          <label className="text-xs font-medium text-muted-foreground">{topLabel}</label>
          <div className="mt-1 flex items-baseline justify-between gap-2">
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9.,]/g, ""))}
              inputMode="decimal"
              className="w-full bg-transparent font-display text-3xl font-semibold outline-none placeholder:text-muted-foreground/50"
              placeholder="0"
            />
            <span className="font-display text-lg font-semibold text-muted-foreground">
              {topUnit}
            </span>
          </div>
        </div>

        <div className="relative flex justify-center">
          <span className="absolute -top-4 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-secondary">
            <ArrowDown className="h-4 w-4 text-primary" />
          </span>
        </div>

        <div className="rounded-xl border border-input bg-background/60 p-4">
          <label className="text-xs font-medium text-muted-foreground">{bottomLabel}</label>
          <div className="mt-1 flex items-baseline justify-between gap-2">
            <span className="font-display text-3xl font-semibold">
              {converted > 0
                ? converted.toLocaleString("fr-CA", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : "0"}
            </span>
            <span className="font-display text-lg font-semibold text-muted-foreground">
              {bottomUnit}
            </span>
          </div>
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        Taux indicatif : 1 USDT ≈ {formatCad(rate)} — verrouillé 15 min à la
        création de l'ordre
      </p>

      <Link
        to={side === "buy" ? "/acheter" : "/vendre"}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 font-semibold text-primary-foreground transition-all hover:brightness-110"
      >
        {side === "buy" ? "Acheter des USDT" : "Vendre des USDT"}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
};

export default RateCalculator;
