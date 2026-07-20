import { useState } from "react";
import { ArrowRight, Check, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { DEMO_RATES, formatCad } from "@/lib/rates";

type Side = "buy" | "sell";

const sparkline = "M0 26 L12 22 L24 24 L36 16 L48 18 L60 10 L72 13 L84 6 L96 9 L108 3";

const ExchangeWidget = () => {
  const [side, setSide] = useState<Side>("buy");
  const [amount, setAmount] = useState("500");

  const value = parseFloat(amount.replace(",", ".")) || 0;
  const rate = DEMO_RATES[side];
  const converted = side === "buy" ? value / rate : value * rate;
  const topUnit = side === "buy" ? "CAD" : "USDT";
  const bottomUnit = side === "buy" ? "USDT" : "CAD";

  return (
    <div className="relative">
      {/* Toast flottant */}
      <div className="absolute -right-4 -top-5 z-20 hidden animate-float-slow rounded-2xl border bg-card p-3 shadow-float sm:block">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <Check className="h-4 w-4" strokeWidth={3} />
          </span>
          <div>
            <p className="text-xs font-semibold leading-tight">Ordre réglé</p>
            <p className="text-[11px] leading-tight text-muted-foreground">
              351,00 USDT · 4 min
            </p>
          </div>
        </div>
      </div>

      {/* Badge non-custodial flottant */}
      <div className="absolute -bottom-5 -left-5 z-20 hidden animate-float-slower rounded-2xl border bg-card px-3.5 py-2.5 shadow-float sm:block">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-accent-ink" />
          <p className="text-xs font-semibold">Vos clés, vos fonds</p>
        </div>
      </div>

      {/* Carte principale */}
      <div className="relative w-full max-w-[400px] rounded-[28px] border bg-card p-5 shadow-lift">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-foreground">
            <span className="h-2 w-2 rounded-full bg-accent" />
          </span>
          <span className="text-sm font-semibold">Échanger</span>
        </div>

        {/* Onglets */}
        <div className="mt-4 grid grid-cols-2 gap-1 rounded-full bg-secondary p-1">
          {(["buy", "sell"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSide(s)}
              className={cn(
                "rounded-full py-2 text-sm font-semibold transition-all",
                side === s
                  ? "bg-card text-foreground shadow-soft"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {s === "buy" ? "Acheter" : "Vendre"}
            </button>
          ))}
        </div>

        {/* Champs */}
        <div className="relative mt-3 space-y-1.5">
          <div className="rounded-2xl border bg-background/60 p-4">
            <p className="text-xs font-medium text-muted-foreground">
              {side === "buy" ? "Vous payez" : "Vous vendez"}
            </p>
            <div className="mt-1 flex items-center justify-between gap-2">
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9.,]/g, ""))}
                inputMode="decimal"
                className="w-full bg-transparent font-display text-3xl font-semibold tracking-tight outline-none"
                placeholder="0"
              />
              <span className="shrink-0 rounded-full bg-secondary px-3 py-1.5 text-sm font-semibold">
                {topUnit}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border bg-background/60 p-4">
            <p className="text-xs font-medium text-muted-foreground">Vous recevez</p>
            <div className="mt-1 flex items-center justify-between gap-2">
              <span className="font-display text-3xl font-semibold tracking-tight">
                {converted > 0
                  ? converted.toLocaleString("fr-CA", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  : "0"}
              </span>
              <span className="shrink-0 rounded-full bg-accent px-3 py-1.5 text-sm font-semibold text-accent-foreground">
                {bottomUnit}
              </span>
            </div>
          </div>

          {/* Pastille de bascule */}
          <span className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-card bg-foreground">
            <ArrowRight className="h-4 w-4 rotate-90 text-background" />
          </span>
        </div>

        {/* Taux + mini graphe */}
        <div className="mt-3 flex items-center justify-between rounded-2xl bg-secondary/70 px-4 py-3">
          <div>
            <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              1 USDT · taux en direct
            </p>
            <p className="text-sm font-semibold">{formatCad(rate)}</p>
          </div>
          <svg
            viewBox="0 0 108 30"
            className="h-8 w-28"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d={sparkline}
              stroke="hsl(var(--accent))"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <Link
          to={side === "buy" ? "/acheter" : "/vendre"}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          {side === "buy" ? "Acheter des USDT" : "Vendre des USDT"}
          <ArrowRight className="h-4 w-4" />
        </Link>
        <p className="mt-2.5 text-center text-[11px] text-muted-foreground">
          Taux verrouillé 15 min · Frais inclus · Interac e-Transfer
        </p>
      </div>
    </div>
  );
};

export default ExchangeWidget;
