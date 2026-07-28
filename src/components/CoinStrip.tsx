import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

const UsdtIllustration = () => (
  <svg viewBox="0 0 80 80" fill="none" className="h-11 w-11 sm:h-[60px] sm:w-[60px]">
    <defs>
      <linearGradient id="ug1" x1="8" y1="12" x2="72" y2="68" gradientUnits="userSpaceOnUse">
        <stop stopColor="hsl(174 58% 55%)" />
        <stop offset="1" stopColor="hsl(174 62% 32%)" />
      </linearGradient>
      <linearGradient id="ug2" x1="24" y1="18" x2="68" y2="62" gradientUnits="userSpaceOnUse">
        <stop stopColor="hsl(174 45% 65%)" stopOpacity="0.7" />
        <stop offset="1" stopColor="hsl(174 55% 45%)" stopOpacity="0.6" />
      </linearGradient>
    </defs>
    <rect x="4" y="24" width="38" height="38" rx="10" fill="url(#ug2)" />
    <rect x="38" y="18" width="38" height="38" rx="10" fill="url(#ug2)" />
    <rect x="16" y="6" width="48" height="48" rx="13" fill="url(#ug1)" />
    <text
      x="40"
      y="35"
      textAnchor="middle"
      dominantBaseline="central"
      fill="white"
      fontSize="22"
      fontWeight="700"
      fontFamily="system-ui, sans-serif"
      letterSpacing="-0.5"
    >
      ₮
    </text>
  </svg>
);

const Slot = ({ children, active }: { children?: React.ReactNode; active?: boolean }) => (
  <div
    className={cn(
      "flex shrink-0 items-center justify-center transition-transform",
      "h-[58px] w-[58px] rounded-[16px] sm:h-[82px] sm:w-[82px] sm:rounded-[22px]",
      active
        ? "relative z-10 -translate-y-1 bg-gradient-to-b from-[hsl(174_58%_48%)] to-[hsl(174_62%_32%)] shadow-[0_6px_24px_-2px_hsl(174_58%_38%/0.5),0_2px_6px_hsl(174_58%_38%/0.25),inset_0_1px_0_hsl(0_0%_100%/0.15)]"
        : [
            "shadow-[inset_0_2px_5px_rgba(0,0,0,0.08),inset_0_0_0_1px_rgba(0,0,0,0.03),0_1px_0_rgba(255,255,255,0.7)]",
            "bg-white/70",
            "dark:bg-white/[0.05] dark:shadow-[inset_0_2px_5px_rgba(0,0,0,0.3),inset_0_0_0_1px_rgba(255,255,255,0.04),0_1px_0_rgba(255,255,255,0.02)]",
          ].join(" "),
    )}
  >
    {children}
  </div>
);

const SIDE_COINS = ["eth", "trx"];

const CoinStrip = ({ className }: Props) => (
  <div className={cn("flex justify-center", className)}>
    <div
      className={cn(
        "inline-flex items-end gap-2 rounded-[24px] px-2.5 pb-2.5 pt-3 sm:gap-3 sm:rounded-[30px] sm:px-3.5 sm:pb-3.5 sm:pt-4",
        "bg-gradient-to-b from-[hsl(0_0%_94%)] to-[hsl(0_0%_96.5%)]",
        "shadow-[inset_0_2px_8px_rgba(0,0,0,0.07),inset_0_0_0_1px_rgba(0,0,0,0.04),0_1px_2px_rgba(255,255,255,0.8)]",
        "dark:from-[hsl(0_0%_12%)] dark:to-[hsl(0_0%_15%)]",
        "dark:shadow-[inset_0_2px_8px_rgba(0,0,0,0.4),inset_0_0_0_1px_rgba(255,255,255,0.04),0_1px_2px_rgba(255,255,255,0.02)]",
      )}
    >
      {SIDE_COINS.map((id) => (
        <Slot key={`l-${id}`}>
          <img
            src={`/coins/${id}.svg`}
            alt=""
            draggable={false}
            className="h-6 w-6 opacity-25 grayscale sm:h-8 sm:w-8"
          />
        </Slot>
      ))}

      <Slot active>
        <UsdtIllustration />
      </Slot>

      {[...SIDE_COINS].reverse().map((id) => (
        <Slot key={`r-${id}`}>
          <img
            src={`/coins/${id}.svg`}
            alt=""
            draggable={false}
            className="h-6 w-6 opacity-25 grayscale sm:h-8 sm:w-8"
          />
        </Slot>
      ))}
    </div>
  </div>
);

export default CoinStrip;
