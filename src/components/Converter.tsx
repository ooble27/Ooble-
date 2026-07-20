import { useState } from "react";
import { ArrowRight, ArrowUpDown } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { DEMO_RATES, formatCad } from "@/lib/rates";
import TetherMark from "./TetherMark";

type Side = "buy" | "sell";

const Converter = () => {
  const [side, setSide] = useState<Side>("buy");
  const [amount, setAmount] = useState("500");

  const value = parseFloat(amount.replace(",", ".")) || 0;
  const rate = DEMO_RATES[side];
  const converted = side === "buy" ? value / rate : value * rate;
  const topUnit = side === "buy" ? "CAD" : "USDT";
  const bottomUnit = side === "buy" ? "USDT" : "CAD";

  return (
    <div className="w-full max-w-[420px] rounded-[28px] border bg-card p-2 shadow-lift">
      {/* Onglets */}
      <div className="grid grid-cols-2 gap-1 rounded-3xl bg-secondary p-1">
        {(["buy", "sell"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setSide(s)}
            className={cn(
              "rounded-[20px] py-2.5 text-sm font-semibold transition-all",
              side === s ? "bg-card text-foreground shadow-soft" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {s === "buy" ? "Acheter" : "Vendre"}
          </button>
        ))}
      </div>

      <div className="relative px-4 pb-4 pt-3">
        {/* Champ haut */}
        <div className="rounded-[20px] bg-secondary/60 p-4">
          <label className="text-xs font-medium text-muted-foreground">
            {side === "buy" ? "Vous payez" : "Vous vendez"}
          </label>
          <div className="mt-1 flex items-center justify-between gap-2">
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9.,]/g, ""))}
              inputMode="decimal"
              className="w-full bg-transparent font-display text-3xl font-bold tracking-tight outline-none"
              placeholder="0"
            />
            <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-card px-3 py-1.5 text-sm font-bold shadow-soft">
              {topUnit === "USDT" && <TetherMark className="h-4 w-4" />}
              {topUnit}
            </span>
          </div>
        </div>

        {/* Bascule */}
        <button
          onClick={() => setSide(side === "buy" ? "sell" : "buy")}
          className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-card bg-primary text-primary-foreground shadow-green transition-transform hover:rotate-180"
          aria-label="Inverser"
        >
          <ArrowUpDown className="h-4 w-4" />
        </button>

        {/* Champ bas */}
        <div className="mt-1.5 rounded-[20px] bg-secondary/60 p-4">
          <label className="text-xs font-medium text-muted-foreground">Vous recevez</label>
          <div className="mt-1 flex items-center justify-between gap-2">
            <span className="font-display text-3xl font-bold tracking-tight">
              {converted > 0
                ? converted.toLocaleString("fr-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                : "0"}
            </span>
            <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-card px-3 py-1.5 text-sm font-bold shadow-soft">
              {bottomUnit === "USDT" && <TetherMark className="h-4 w-4" />}
              {bottomUnit}
            </span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between px-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            1 USDT = {formatCad(rate)}
          </span>
          <span>Verrouillé 15 min</span>
        </div>

        <Link
          to={side === "buy" ? "/acheter" : "/vendre"}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 font-semibold text-primary-foreground shadow-green transition-transform hover:-translate-y-0.5"
        >
          {side === "buy" ? "Acheter des USDT" : "Vendre des USDT"}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

export default Converter;
