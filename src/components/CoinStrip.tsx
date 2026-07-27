import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

const OUTER = ["eth", "bnb"];
const INNER = ["btc", "usdc"];

const FadedCoin = ({ id, depth }: { id: string; depth: 1 | 2 }) => {
  const size = depth === 1
    ? "h-14 w-14 sm:h-[76px] sm:w-[76px]"
    : "h-10 w-10 sm:h-14 sm:w-14";
  const iconSize = depth === 1
    ? "h-7 w-7 sm:h-9 sm:w-9"
    : "h-5 w-5 sm:h-7 sm:w-7";
  const blur = depth === 1 ? "blur-[2px]" : "blur-[4px]";
  const opacity = depth === 1 ? "opacity-35" : "opacity-20";
  return (
    <div className={cn("flex shrink-0 items-center justify-center rounded-2xl bg-secondary sm:rounded-[22px]", size)}>
      <img
        src={`/coins/${id}.svg`}
        alt=""
        draggable={false}
        className={cn("rounded-full grayscale", iconSize, blur, opacity)}
      />
    </div>
  );
};

const CoinStrip = ({ className }: Props) => (
  <div className={cn("flex items-center justify-center gap-2 sm:gap-3", className)}>
    {OUTER.map((id) => (
      <FadedCoin key={`lo-${id}`} id={id} depth={2} />
    ))}
    {INNER.map((id) => (
      <FadedCoin key={`li-${id}`} id={id} depth={1} />
    ))}

    <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-[26px] border border-border bg-card shadow-lg shadow-foreground/8 sm:h-[120px] sm:w-[120px] sm:rounded-[32px]">
      <img src="/coins/usdt.svg" alt="USDT" draggable={false} className="h-11 w-11 sm:h-16 sm:w-16" />
    </div>

    {[...INNER].reverse().map((id) => (
      <FadedCoin key={`ri-${id}`} id={id} depth={1} />
    ))}
    {[...OUTER].reverse().map((id) => (
      <FadedCoin key={`ro-${id}`} id={id} depth={2} />
    ))}
  </div>
);

export default CoinStrip;
