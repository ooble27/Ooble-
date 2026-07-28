import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

const CoinStrip = ({ className }: Props) => (
  <div className={cn("flex justify-center", className)} style={{ perspective: "1200px" }}>
    <div
      className="relative w-full max-w-[380px] sm:max-w-[440px]"
      style={{ transform: "rotateY(-18deg) rotateX(8deg) rotateZ(2deg)", transformStyle: "preserve-3d" }}
    >
      {/* Subtle shadow underneath the tilted card */}
      <div className="absolute inset-x-4 bottom-0 top-8 rounded-[28px] bg-foreground/[0.04] blur-xl" aria-hidden />

      {/* Main card — buy interface mockup */}
      <div className="relative overflow-hidden rounded-[24px] border border-border/40 bg-card/90 shadow-[0_4px_40px_-12px_rgba(0,0,0,0.1),0_1px_3px_rgba(0,0,0,0.04)] backdrop-blur-sm">
        {/* Header */}
        <div className="px-5 pb-3 pt-5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <img src="/coins/usdt.svg" alt="" className="h-5 w-5" draggable={false} />
            </div>
            <span className="font-display text-[15px] tracking-tight">Acheter USDT</span>
          </div>
        </div>

        {/* Amount card */}
        <div className="mx-4 rounded-[16px] border border-border/40 bg-secondary/25 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/50">Montant</span>
            <div className="inline-flex gap-0.5 rounded-lg bg-background/60 p-[2px]">
              <span className="rounded-md bg-card px-2.5 py-1 text-[10px] font-semibold text-foreground shadow-sm">CAD</span>
              <span className="rounded-md px-2.5 py-1 text-[10px] text-muted-foreground/40">USDT</span>
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-display text-[32px] leading-none tracking-[-1.5px]">500</span>
            <span className="text-sm text-muted-foreground/40">CAD</span>
          </div>
        </div>

        {/* Summary rows */}
        <div className="mx-4 mt-2.5 divide-y divide-border/30 rounded-[14px] border border-border/40 bg-secondary/15">
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-[12px] text-muted-foreground/50">Vous recevez</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[13px] font-semibold">357,14 USDT</span>
              <img src="/coins/usdt.svg" alt="" className="h-4 w-4" draggable={false} />
            </div>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-[12px] text-muted-foreground/50">Taux</span>
            <span className="text-[12px] text-muted-foreground/50">1 USDT = 1,40 CAD</span>
          </div>
        </div>

        {/* Network chips */}
        <div className="mx-4 mt-3 flex gap-1.5 overflow-hidden">
          {[
            { id: "trx", name: "Tron", sel: true },
            { id: "eth", name: "Ethereum", sel: false },
            { id: "bnb", name: "BNB", sel: false },
            { id: "sol", name: "Solana", sel: false },
          ].map((n) => (
            <div
              key={n.id}
              className={cn(
                "flex items-center gap-1.5 rounded-lg border py-1.5 pl-1.5 pr-2.5",
                n.sel ? "border-foreground/15 bg-secondary/50" : "border-border/30 opacity-40",
              )}
            >
              <img src={`/coins/${n.id}.svg`} alt="" className="h-5 w-5 rounded-full" draggable={false} />
              <span className="text-[11px]">{n.name}</span>
            </div>
          ))}
        </div>

        {/* Bottom bar with CTA */}
        <div className="mt-3 flex items-center justify-end px-4 pb-4">
          <div className="rounded-xl bg-foreground px-4 py-2.5 text-[12px] font-semibold text-background">
            Continuer
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default CoinStrip;
