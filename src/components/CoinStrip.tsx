import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

const WireLine = ({ w = "70%" }: { w?: string }) => (
  <div className="h-[10px] rounded-full bg-foreground/[0.06]" style={{ width: w }} />
);

const WireBox = ({ children }: { children?: React.ReactNode }) => (
  <div className="rounded-xl border border-foreground/[0.06] px-4 py-3">
    {children}
  </div>
);

const CoinStrip = ({ className }: Props) => (
  <div className={cn("flex justify-center", className)} style={{ perspective: "1600px" }}>
    <div
      className="relative h-[260px] w-[440px] sm:h-[320px] sm:w-[560px]"
      style={{
        transform: "rotateY(-28deg) rotateX(12deg) rotateZ(2deg)",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Card 1 — Acheter USDT (front-left) */}
      <div
        className="absolute left-0 top-0 h-[220px] w-[200px] rounded-2xl border border-foreground/[0.07] bg-white/80 p-5 shadow-[0_2px_20px_rgba(0,0,0,0.04)] backdrop-blur-sm dark:bg-card/80 sm:h-[280px] sm:w-[250px]"
        style={{ transform: "translateZ(60px)", transformStyle: "preserve-3d" }}
      >
        <p className="font-display text-[15px] tracking-tight sm:text-[18px]">Acheter USDT</p>
        <div className="mt-4 space-y-[10px] font-mono text-[11px] text-foreground/30 sm:mt-5 sm:space-y-[12px] sm:text-[13px]">
          <p>montant</p>
          <p>méthode</p>
          <p>réseau</p>
          <p>frais</p>
          <p>disponible</p>
          <p>confirmer</p>
        </div>
      </div>

      {/* Dashed connector from card 1 to card 2 */}
      <svg
        className="absolute left-[170px] top-[30px] h-[180px] w-[80px] sm:left-[210px] sm:top-[40px] sm:h-[220px] sm:w-[100px]"
        style={{ transform: "translateZ(30px)" }}
        viewBox="0 0 80 180"
        fill="none"
      >
        <path
          d="M10 10 L10 80 Q10 95 25 95 L55 95 Q70 95 70 110 L70 170"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="6 6"
          className="text-foreground/10"
          fill="none"
        />
        <path
          d="M64 162 L70 174 L76 162"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-foreground/10"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Card 2 — Vendre USDT (middle) */}
      <div
        className="absolute left-[120px] top-[10px] h-[220px] w-[200px] rounded-2xl border border-foreground/[0.07] bg-white/80 p-5 shadow-[0_2px_20px_rgba(0,0,0,0.04)] backdrop-blur-sm dark:bg-card/80 sm:left-[150px] sm:h-[280px] sm:w-[250px]"
        style={{ transform: "translateZ(0px)", transformStyle: "preserve-3d" }}
      >
        <p className="font-display text-[15px] tracking-tight sm:text-[18px]">Vendre USDT</p>
        <div className="mt-5 space-y-3 sm:mt-6">
          <WireBox>
            <div className="space-y-2">
              <WireLine w="50%" />
              <WireLine w="35%" />
            </div>
          </WireBox>
          <WireBox>
            <div className="space-y-2">
              <WireLine w="65%" />
              <WireLine w="40%" />
            </div>
          </WireBox>
        </div>
      </div>

      {/* Card 3 — Transactions (back-right) */}
      <div
        className="absolute left-[240px] top-[20px] h-[220px] w-[200px] rounded-2xl border border-foreground/[0.07] bg-white/80 p-5 shadow-[0_2px_20px_rgba(0,0,0,0.04)] backdrop-blur-sm dark:bg-card/80 sm:left-[300px] sm:h-[280px] sm:w-[250px]"
        style={{ transform: "translateZ(-60px)", transformStyle: "preserve-3d" }}
      >
        <p className="font-display text-[15px] tracking-tight sm:text-[18px]">Transactions</p>
        <div className="mt-5 space-y-3 sm:mt-6">
          <WireBox>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <WireLine w="80px" />
                <WireLine w="50px" />
              </div>
              <WireLine w="40px" />
            </div>
          </WireBox>
          <WireBox>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <WireLine w="70px" />
                <WireLine w="55px" />
              </div>
              <WireLine w="35px" />
            </div>
          </WireBox>
          <WireBox>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <WireLine w="60px" />
                <WireLine w="45px" />
              </div>
              <WireLine w="45px" />
            </div>
          </WireBox>
        </div>
      </div>
    </div>
  </div>
);

export default CoinStrip;
