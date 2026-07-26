import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

/** Cryptomonnaies volontairement floutées : Ooble ne les propose pas. */
const OTHERS = ["btc", "usdc"];

/**
 * Rangée de pièces : l'USDT net et mis en avant au centre, les autres
 * cryptomonnaies floutées de part et d'autre — pour dire d'un coup d'œil
 * qu'Ooble ne propose que l'USDT, rien d'autre.
 */
const CoinStrip = ({ className }: Props) => (
  <div className={cn("flex items-end justify-center gap-2 sm:gap-4", className)}>
    {OTHERS.map((id) => (
      <div
        key={`l-${id}`}
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary sm:h-[72px] sm:w-[72px]"
      >
        <img
          src={`/coins/${id}.svg`}
          alt=""
          draggable={false}
          className="h-6 w-6 rounded-full opacity-40 blur-[2.5px] grayscale sm:h-9 sm:w-9"
        />
      </div>
    ))}

    <div className="relative flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-[24px] border border-border bg-card shadow-[0_24px_48px_-20px_rgba(38,161,123,0.45)] sm:h-28 sm:w-28 sm:rounded-[28px]">
      <img
        src="/coins/usdt.svg"
        alt="USDT"
        draggable={false}
        className="h-9 w-9 sm:h-14 sm:w-14"
      />
    </div>

    {[...OTHERS].reverse().map((id) => (
      <div
        key={`r-${id}`}
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary sm:h-[72px] sm:w-[72px]"
      >
        <img
          src={`/coins/${id}.svg`}
          alt=""
          draggable={false}
          className="h-6 w-6 rounded-full opacity-40 blur-[2.5px] grayscale sm:h-9 sm:w-9"
        />
      </div>
    ))}
  </div>
);

export default CoinStrip;
